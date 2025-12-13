import type { BlogPost, BlogPostMeta } from './types'

// Import all markdown files from the posts directory at build time
const postFiles = import.meta.glob('./posts/*.md', { eager: true, query: '?raw', import: 'default' })

/**
 * Simple browser-compatible frontmatter parser
 * Parses YAML frontmatter between --- delimiters
 */
function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const match = raw.match(frontmatterRegex)
  
  if (!match) {
    return { data: {}, content: raw }
  }
  
  const [, frontmatter, content] = match
  const data: Record<string, unknown> = {}
  
  // Parse simple YAML (key: value pairs and arrays)
  const lines = frontmatter.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    
    const colonIndex = trimmed.indexOf(':')
    if (colonIndex === -1) continue
    
    const key = trimmed.slice(0, colonIndex).trim()
    let value: unknown = trimmed.slice(colonIndex + 1).trim()
    
    // Remove quotes if present
    if ((value as string).startsWith('"') && (value as string).endsWith('"')) {
      value = (value as string).slice(1, -1)
    } else if ((value as string).startsWith("'") && (value as string).endsWith("'")) {
      value = (value as string).slice(1, -1)
    }
    // Parse arrays like ["tag1", "tag2"]
    else if ((value as string).startsWith('[') && (value as string).endsWith(']')) {
      try {
        value = JSON.parse((value as string).replace(/'/g, '"'))
      } catch {
        // Keep as string if parsing fails
      }
    }
    // Parse booleans
    else if (value === 'true') {
      value = true
    } else if (value === 'false') {
      value = false
    }
    
    data[key] = value
  }
  
  return { data, content }
}

function parsePost(filename: string, raw: string): BlogPost | null {
  const { data, content } = parseFrontmatter(raw)
  
  // Derive slug from frontmatter or filename
  const filenameSlug = filename
    .replace('./posts/', '')
    .replace('.md', '')
  
  const slug = (data.slug as string) || filenameSlug
  
  // Skip drafts in production
  if (data.draft && import.meta.env.PROD) {
    return null
  }
  
  return {
    title: (data.title as string) || 'Untitled',
    slug,
    author: (data.author as string) || 'Anonymous',
    date: (data.date as string) || new Date().toISOString().split('T')[0],
    description: (data.description as string) || '',
    tags: (data.tags as string[]) || [],
    draft: (data.draft as boolean) || false,
    content,
  }
}

// Parse all posts and sort by date (newest first)
const allPosts: BlogPost[] = Object.entries(postFiles)
  .map(([filename, raw]) => parsePost(filename, raw as string))
  .filter((post): post is BlogPost => post !== null)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

/**
 * Get all published blog posts (sorted by date, newest first)
 */
export function getAllPosts(): BlogPost[] {
  return allPosts
}

/**
 * Get all post metadata (without content) for the blog index
 */
export function getAllPostMeta(): BlogPostMeta[] {
  return allPosts.map(({ content: _, ...meta }) => meta)
}

/**
 * Get a single post by slug
 */
export function getPostBySlug(slug: string): BlogPost | undefined {
  return allPosts.find((post) => post.slug === slug)
}
