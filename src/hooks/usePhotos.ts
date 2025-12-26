import { useState, useEffect } from 'react'

export interface PhotoMeta {
  Make?: string
  Model?: string
  ISO?: number
  FNumber?: number
  ExposureTime?: number
  LensModel?: string
  DateTimeOriginal?: Date
}

export interface Photo {
  src: string
  filename: string
  meta?: PhotoMeta
}

export interface Album {
  id: string
  title: string
  intro?: string
  photos: Photo[]
  coverPhoto?: string
}

export function usePhotos() {
  const [albums, setAlbums] = useState<Album[]>([])

  useEffect(() => {
    async function loadPhotos() {
      // Load images as URLs
      // Note: We're using a glob that includes both root photos and subdirectories
      const imageModules = import.meta.glob(['../photos/*.{png,jpg,jpeg,webp,JPG}', '../photos/*/*.{png,jpg,jpeg,webp,JPG}'], {
        eager: true,
        query: '?url',
        import: 'default',
      })

      // Load intros
      const introModules = import.meta.glob('../photos/*/intro.md', {
        eager: true,
        query: '?raw',
        import: 'default',
      })

      const albumMap = new Map<string, Album>()
      const rootPhotos: Photo[] = []

      // Process images
      for (const path in imageModules) {
        const src = imageModules[path] as string
        const filename = path.split('/').pop() || ''
        
        // Extract metadata
        let meta: PhotoMeta | undefined
        try {
          // We can't easily read file content in browser from path, 
          // but we can fetch the blob since we're in dev/build environment
          // For now, let's load metadata on demand in the component to avoid blocking initial render
          // or we could try to fetch here if performance allows
        } catch (e) {
          console.warn('Failed to parse metadata for', filename)
        }

        const photo: Photo = { src, filename, meta }

        // Check if it's in a subdirectory
        const match = path.match(/\.\.\/photos\/([^/]+)\/.+/)
        
        if (match) {
          // It's in an album
          const albumId = match[1]
          if (!albumMap.has(albumId)) {
            albumMap.set(albumId, {
              id: albumId,
              title: albumId.charAt(0).toUpperCase() + albumId.slice(1).replace(/-/g, ' '),
              photos: [],
            })
          }
          albumMap.get(albumId)!.photos.push(photo)
        } else {
          // It's in the root
          rootPhotos.push(photo)
        }
      }

      // Randomize photos using Fisher-Yates shuffle
      const shuffleArray = (array: Photo[]) => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      };

      // If we have root photos, create a "General" or "Portfolio" album
      if (rootPhotos.length > 0) {
        albumMap.set('portfolio', {
          id: 'portfolio',
          title: 'Portfolio',
          photos: shuffleArray(rootPhotos),
        })
      }

      // Process intros for existing albums
      for (const path in introModules) {
        const match = path.match(/\.\.\/photos\/([^/]+)\/intro\.md/)
        if (!match) continue

        const [, albumId] = match
        const content = introModules[path] as string
        
        if (albumMap.has(albumId)) {
          const album = albumMap.get(albumId)!
          album.intro = content
        }
      }

      const processedAlbums = Array.from(albumMap.values()).map(album => ({
        ...album,
        coverPhoto: album.photos[0]?.src
      }))

      setAlbums(processedAlbums)
    }

    loadPhotos()
  }, [])

  return { albums }
}
