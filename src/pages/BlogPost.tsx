import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ArrowLeft } from 'lucide-react'
import { getPostBySlug } from '../blog/posts'
import PageLayout from '../components/PageLayout'

function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? getPostBySlug(slug) : undefined

  if (!post) {
    return (
      <PageLayout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-display font-bold text-[var(--color-text)] mb-4">
            Post not found
          </h1>
          <p className="text-[var(--color-text-muted)] font-body mb-8">
            The post you're looking for doesn't exist.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-[var(--color-accent)] hover:underline font-body"
          >
            <ArrowLeft size={16} />
            Back to blog
          </Link>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <article>
        {/* Back link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors font-body mb-8"
        >
          <ArrowLeft size={14} />
          Back to blog
        </Link>

        {/* Post header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-[var(--color-text)] font-display leading-[1.1] mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-[var(--color-text-muted)] font-body">
            <span>{post.author}</span>
            <span>•</span>
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2 mt-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 bg-[var(--color-bg-alt)] text-[var(--color-text-muted)] rounded font-body"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Divider */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent opacity-60 mb-8" />

        {/* Post content */}
        <div className="prose prose-sm md:prose-base font-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>
      </article>
    </PageLayout>
  )
}

export default BlogPost
