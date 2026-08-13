import { useEffect } from 'react'

interface DocumentMetaOptions {
  title: string
  description: string
}

interface MetaTarget {
  selector: string
  attribute: 'name' | 'property'
  key: string
  content: string
}

export function useDocumentMeta({ title, description }: DocumentMetaOptions) {
  useEffect(() => {
    const previousTitle = document.title
    const targets: MetaTarget[] = [
      {
        selector: 'meta[name="description"]',
        attribute: 'name',
        key: 'description',
        content: description,
      },
      {
        selector: 'meta[property="og:title"]',
        attribute: 'property',
        key: 'og:title',
        content: title,
      },
      {
        selector: 'meta[property="og:description"]',
        attribute: 'property',
        key: 'og:description',
        content: description,
      },
    ]

    const previousMeta = targets.map((target) => {
      let element = document.head.querySelector<HTMLMetaElement>(target.selector)
      const wasCreated = !element

      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(target.attribute, target.key)
        document.head.appendChild(element)
      }

      const previousContent = element.getAttribute('content')
      element.setAttribute('content', target.content)

      return { element, previousContent, wasCreated }
    })

    document.title = title

    return () => {
      document.title = previousTitle
      previousMeta.forEach(({ element, previousContent, wasCreated }) => {
        if (wasCreated) {
          element.remove()
        } else if (previousContent === null) {
          element.removeAttribute('content')
        } else {
          element.setAttribute('content', previousContent)
        }
      })
    }
  }, [description, title])
}
