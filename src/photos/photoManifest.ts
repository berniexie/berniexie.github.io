export const PHOTO_WIDTHS = [480, 960, 1600] as const

export type PhotoWidth = (typeof PHOTO_WIDTHS)[number]
export type FeaturedPhotoLayout = 'wide' | 'tall' | 'standard'

export interface PhotoMeta {
  cameraMake?: string
  cameraModel?: string
  lensModel?: string
  iso?: number
  aperture?: number
  exposureTime?: number
  capturedAt?: string
}

export interface ResponsivePhotoSources {
  avif: Record<PhotoWidth, string>
  webp: Record<PhotoWidth, string>
}

export interface PortfolioPhoto {
  id: string
  sourceFilename: string
  alt: string
  width: number
  height: number
  featuredLayout?: FeaturedPhotoLayout
  sources: ResponsivePhotoSources
  meta?: PhotoMeta
}

const PHOTO_METADATA: Readonly<Record<string, PhotoMeta>> = {
  'DSCF6980.JPG': {
    cameraMake: 'FUJIFILM',
    cameraModel: 'X100V',
    iso: 640,
    aperture: 3.6,
    exposureTime: 0.005,
    capturedAt: '2024-05-14T22:56:00.000Z',
  },
  'DSCF7088.JPG': {
    cameraMake: 'FUJIFILM',
    cameraModel: 'X100V',
    iso: 640,
    aperture: 2.2,
    exposureTime: 0.0125,
    capturedAt: '2024-05-16T14:00:48.000Z',
  },
  'DSCF7159.JPG': {
    cameraMake: 'FUJIFILM',
    cameraModel: 'X100V',
    iso: 640,
    aperture: 4.5,
    exposureTime: 0.004,
    capturedAt: '2024-05-19T00:05:34.000Z',
  },
  'DSCF7310.JPG': {
    cameraMake: 'FUJIFILM',
    cameraModel: 'X100V',
    iso: 640,
    aperture: 5.6,
    exposureTime: 0.0022222222222222222,
    capturedAt: '2024-05-20T20:00:31.000Z',
  },
  'DSCF7346.JPG': {
    cameraMake: 'FUJIFILM',
    cameraModel: 'X100V',
    iso: 640,
    aperture: 3.2,
    exposureTime: 0.005,
    capturedAt: '2024-05-20T23:37:52.000Z',
  },
  'DSCF7487.JPG': {
    cameraMake: 'FUJIFILM',
    cameraModel: 'X100V',
    iso: 640,
    aperture: 2.8,
    exposureTime: 0.00909090909090909,
    capturedAt: '2024-05-22T14:05:21.000Z',
  },
  'DSCF7568.JPG': {
    cameraMake: 'FUJIFILM',
    cameraModel: 'X100V',
    iso: 640,
    aperture: 2.5,
    exposureTime: 0.011111111111111112,
    capturedAt: '2024-05-24T02:19:59.000Z',
  },
  'DSCF7622.JPG': {
    cameraMake: 'FUJIFILM',
    cameraModel: 'X100V',
    iso: 640,
    aperture: 2,
    exposureTime: 0.002380952380952381,
    capturedAt: '2024-05-27T21:23:02.000Z',
  },
  'DSCF7650.JPG': {
    cameraMake: 'FUJIFILM',
    cameraModel: 'X100V',
    iso: 640,
    aperture: 3.2,
    exposureTime: 0.004166666666666667,
    capturedAt: '2024-05-28T18:45:32.000Z',
  },
  'DSCF8358.JPG': {
    cameraMake: 'FUJIFILM',
    cameraModel: 'X100V',
    iso: 640,
    aperture: 4,
    exposureTime: 0.004166666666666667,
    capturedAt: '2024-11-29T08:54:34.000Z',
  },
  'DSCF8416.JPG': {
    cameraMake: 'FUJIFILM',
    cameraModel: 'X100V',
    iso: 3200,
    aperture: 2,
    exposureTime: 0.037037037037037035,
    capturedAt: '2025-03-15T09:01:00.000Z',
  },
  'DSCF8427.JPG': {
    cameraMake: 'FUJIFILM',
    cameraModel: 'X100V',
    iso: 640,
    aperture: 3.6,
    exposureTime: 0.004545454545454545,
    capturedAt: '2025-03-15T12:06:04.000Z',
  },
  'DSCF8437.JPG': {
    cameraMake: 'FUJIFILM',
    cameraModel: 'X100V',
    iso: 640,
    aperture: 3.6,
    exposureTime: 0.005555555555555556,
    capturedAt: '2025-03-15T13:41:52.000Z',
  },
  'DSCF8448.JPG': {
    cameraMake: 'FUJIFILM',
    cameraModel: 'X100V',
    iso: 640,
    aperture: 2,
    exposureTime: 0.014285714285714285,
    capturedAt: '2025-03-16T09:07:28.000Z',
  },
  'DSCF8516.JPG': {
    cameraMake: 'FUJIFILM',
    cameraModel: 'X100V',
    iso: 1000,
    aperture: 2,
    exposureTime: 0.016666666666666666,
    capturedAt: '2025-03-19T15:47:37.000Z',
  },
  'DSCF8542.JPG': {
    cameraMake: 'FUJIFILM',
    cameraModel: 'X100V',
    iso: 640,
    aperture: 4,
    exposureTime: 0.004166666666666667,
    capturedAt: '2025-03-23T13:31:59.000Z',
  },
  'DSCF8572.JPG': {
    cameraMake: 'FUJIFILM',
    cameraModel: 'X100V',
    iso: 3200,
    aperture: 2,
    exposureTime: 0.029411764705882353,
    capturedAt: '2025-03-24T18:34:19.000Z',
  },
  'DSCF8585.JPG': {
    cameraMake: 'FUJIFILM',
    cameraModel: 'X100V',
    iso: 640,
    aperture: 5,
    exposureTime: 0.0029411764705882353,
    capturedAt: '2025-03-26T10:01:01.000Z',
  },
  'DSCF8589.JPG': {
    cameraMake: 'FUJIFILM',
    cameraModel: 'X100V',
    iso: 640,
    aperture: 3.2,
    exposureTime: 0.0058823529411764705,
    capturedAt: '2025-03-26T11:25:20.000Z',
  },
  'DSCF8666.JPG': {
    cameraMake: 'FUJIFILM',
    cameraModel: 'X100V',
    iso: 640,
    aperture: 3.6,
    exposureTime: 0.004545454545454545,
    capturedAt: '2025-09-14T14:31:26.000Z',
  },
  'DSCF8668.JPG': {
    cameraMake: 'FUJIFILM',
    cameraModel: 'X100V',
    iso: 640,
    aperture: 2.8,
    exposureTime: 0.009523809523809525,
    capturedAt: '2025-09-14T14:33:51.000Z',
  },
  'DSCF8690.JPG': {
    cameraMake: 'FUJIFILM',
    cameraModel: 'X100V',
    iso: 640,
    aperture: 4,
    exposureTime: 0.004166666666666667,
    capturedAt: '2025-09-16T20:55:53.000Z',
  },
  'DSCF8721.JPG': {
    cameraMake: 'FUJIFILM',
    cameraModel: 'X100V',
    iso: 640,
    aperture: 4,
    exposureTime: 0.005,
    capturedAt: '2025-09-18T22:19:48.000Z',
  },
  'DSCF8726.JPG': {
    cameraMake: 'FUJIFILM',
    cameraModel: 'X100V',
    iso: 640,
    aperture: 4,
    exposureTime: 0.004,
    capturedAt: '2025-09-21T19:19:25.000Z',
  },
  'DSCF8740.JPG': {
    cameraMake: 'FUJIFILM',
    cameraModel: 'X100V',
    iso: 640,
    aperture: 2,
    exposureTime: 0.016666666666666666,
    capturedAt: '2025-11-09T06:14:51.000Z',
  },
  'DSCF8809.JPG': {
    cameraMake: 'FUJIFILM',
    cameraModel: 'X100V',
    iso: 640,
    aperture: 3.2,
    exposureTime: 0.005555555555555556,
    capturedAt: '2025-11-11T06:09:34.000Z',
  },
  'DSCF8831.JPG': {
    cameraMake: 'FUJIFILM',
    cameraModel: 'X100V',
    iso: 640,
    aperture: 2.5,
    exposureTime: 0.011764705882352941,
    capturedAt: '2025-11-11T08:28:03.000Z',
  },
  'DSCF8888.JPG': {
    cameraMake: 'FUJIFILM',
    cameraModel: 'X100V',
    iso: 640,
    aperture: 4.5,
    exposureTime: 0.0029411764705882353,
    capturedAt: '2026-01-24T12:32:07.000Z',
  },
  'DSCF8906.JPG': {
    cameraMake: 'FUJIFILM',
    cameraModel: 'X100V',
    iso: 640,
    aperture: 4,
    exposureTime: 0.0033333333333333335,
    capturedAt: '2026-01-24T14:02:39.000Z',
  },
  'DSCF8987.JPG': {
    cameraMake: 'FUJIFILM',
    cameraModel: 'X100V',
    iso: 3200,
    aperture: 2,
    exposureTime: 0.06666666666666667,
    capturedAt: '2026-01-24T19:22:43.000Z',
  },
  'DSCF9076.JPG': {
    cameraMake: 'FUJIFILM',
    cameraModel: 'X100V',
    iso: 640,
    aperture: 3.6,
    exposureTime: 0.005,
    capturedAt: '2026-01-27T11:22:17.000Z',
  },
  'DSCF9115.JPG': {
    cameraMake: 'FUJIFILM',
    cameraModel: 'X100V',
    iso: 640,
    aperture: 3.6,
    exposureTime: 0.005555555555555556,
    capturedAt: '2026-01-27T18:07:24.000Z',
  },
  'DSCF9241.JPG': {
    cameraMake: 'FUJIFILM',
    cameraModel: 'X100V',
    iso: 1250,
    aperture: 2,
    exposureTime: 0.016666666666666666,
    capturedAt: '2026-01-28T23:11:27.000Z',
  },
}

function sourcesFor(id: string): ResponsivePhotoSources {
  const path = `/photos/portfolio/${id}`

  return {
    avif: {
      480: `${path}-480.avif`,
      960: `${path}-960.avif`,
      1600: `${path}-1600.avif`,
    },
    webp: {
      480: `${path}-480.webp`,
      960: `${path}-960.webp`,
      1600: `${path}-1600.webp`,
    },
  }
}

function photo(
  sourceFilename: string,
  alt: string,
  orientation: 'landscape' | 'portrait',
  featuredLayout?: FeaturedPhotoLayout,
): PortfolioPhoto {
  const id = sourceFilename.replace(/\.[^.]+$/, '').toLowerCase()
  const [width, height] = orientation === 'portrait' ? [4160, 6240] : [6240, 4160]

  return {
    id,
    sourceFilename,
    alt,
    width,
    height,
    featuredLayout,
    sources: sourcesFor(id),
    meta: PHOTO_METADATA[sourceFilename],
  }
}

/**
 * Deliberately curated rather than shuffled. The first six form the collapsed
 * editorial mosaic; the remaining photographs retain a stable narrative order.
 */
export const PHOTO_MANIFEST: readonly PortfolioPhoto[] = [
  photo(
    'DSCF9241.JPG',
    'Racehorses sprint past the finish line under stadium lights.',
    'landscape',
    'wide',
  ),
  photo(
    'DSCF8906.JPG',
    'A tea table is silhouetted against floor-to-ceiling windows high above a hazy city.',
    'portrait',
    'tall',
  ),
  photo(
    'DSCF7310.JPG',
    'Snow-dusted mountain peaks rise beyond a dark alpine lake under broken clouds.',
    'landscape',
    'standard',
  ),
  photo(
    'DSCF8437.JPG',
    'A hand holds a croissant topped with sliced steak in warm afternoon light.',
    'landscape',
    'standard',
  ),
  photo(
    'DSCF8987.JPG',
    'Colored searchlights cut across a nighttime skyline from a high-rise rooftop.',
    'portrait',
    'tall',
  ),
  photo(
    'DSCF8516.JPG',
    'Two orange cats sit beneath a citrus tree in a quiet courtyard.',
    'landscape',
    'standard',
  ),
  photo('DSCF6980.JPG', 'A coastal city and broad blue bay seen from a hillside.', 'landscape'),
  photo(
    'DSCF7088.JPG',
    'A steep stone stairway descends between colorful apartment buildings.',
    'portrait',
  ),
  photo(
    'DSCF7159.JPG',
    'Historic facades and boats line a sunlit Venetian waterfront.',
    'landscape',
  ),
  photo('DSCF7346.JPG', 'Jagged mountain ridges tower above a green alpine village.', 'landscape'),
  photo(
    'DSCF7487.JPG',
    'Terraced vineyards sweep through a green valley toward distant snowy peaks.',
    'landscape',
  ),
  photo(
    'DSCF7568.JPG',
    'A church tower and waterfront buildings sit beneath a softly clouded sky.',
    'landscape',
  ),
  photo(
    'DSCF7622.JPG',
    'A turquoise fountain stands below a stone castle on a steep green hill.',
    'portrait',
  ),
  photo(
    'DSCF7650.JPG',
    'A shaggy Highland cow faces the camera on a windswept green hillside.',
    'landscape',
  ),
  photo(
    'DSCF8358.JPG',
    'A rocky coastline curves past palm trees beneath a streaked blue sky.',
    'landscape',
  ),
  photo(
    'DSCF8416.JPG',
    'A barista prepares coffee at a sunlit counter beneath a painted mural.',
    'landscape',
  ),
  photo('DSCF8427.JPG', 'Rows of chickens roast inside a street-side rotisserie oven.', 'portrait'),
  photo(
    'DSCF8448.JPG',
    'Diners and vendors fill a busy covered food market beneath an arched roof.',
    'landscape',
  ),
  photo(
    'DSCF8542.JPG',
    'Pedestrians cross a broad city street beside a rounded brick apartment building.',
    'landscape',
  ),
  photo(
    'DSCF8572.JPG',
    'Angular illuminated architecture frames a transit plaza at night.',
    'portrait',
  ),
  photo(
    'DSCF8585.JPG',
    'Scooters and taxis travel along a boulevard toward a distant skyscraper.',
    'portrait',
  ),
  photo(
    'DSCF8589.JPG',
    'Sunlight casts repeating geometric shadows through a covered passage.',
    'portrait',
  ),
  photo(
    'DSCF8666.JPG',
    'Barcelona rooftops stretch toward the distant spires of the Sagrada Familia.',
    'landscape',
  ),
  photo(
    'DSCF8668.JPG',
    'Sculptural stone chimneys rise above the curved rooftop of Casa Mila.',
    'portrait',
  ),
  photo(
    'DSCF8690.JPG',
    'Formal gardens and cypress trees overlook a historic hilltop complex.',
    'landscape',
  ),
  photo(
    'DSCF8721.JPG',
    'A macaque sits on a weathered rocky ledge beneath an overcast sky.',
    'landscape',
  ),
  photo(
    'DSCF8726.JPG',
    'A rugged green coastline falls away into calm turquoise water.',
    'landscape',
  ),
  photo(
    'DSCF8740.JPG',
    'Visitors cross a narrow suspension bridge through a dense evergreen forest.',
    'portrait',
  ),
  photo(
    'DSCF8809.JPG',
    'A suspension bridge spans gray water beneath dramatic storm clouds.',
    'landscape',
  ),
  photo(
    'DSCF8831.JPG',
    'Stacked glass and concrete volumes form a sharply geometric high-rise.',
    'portrait',
  ),
  photo(
    'DSCF8888.JPG',
    'A modern skyline rises behind an arched bridge across a wide river.',
    'landscape',
  ),
  photo(
    'DSCF9076.JPG',
    'Dense residential towers rise symmetrically around a narrow strip of sky.',
    'portrait',
  ),
  photo(
    'DSCF9115.JPG',
    'A shaft of sunset breaks through haze over a harbor skyline from a wooded overlook.',
    'portrait',
  ),
]
