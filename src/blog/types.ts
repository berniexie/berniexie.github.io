export interface BlogPostMeta {
  title: string
  slug: string
  author: string
  date: string
  description: string
  tags?: string[]
  draft?: boolean
}

export interface BlogPost extends BlogPostMeta {
  content: string
}
