import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { getAllPostMeta } from '../blog/posts'
import PageLayout from '../components/PageLayout'

function BlogIndex() {
  const posts = getAllPostMeta()

  return (
    <PageLayout>
      {/* Back to home */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors font-body mb-8"
      >
        <ArrowLeft size={14} />
        Back to home
      </Link>

      <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-[var(--color-text)] font-display leading-[0.95] mb-8">
        Blog
      </h1>

      {posts.length === 0 ? (
        <p className="text-[var(--color-text-muted)] font-body">No posts yet. Check back soon!</p>
      ) : (
        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="group block">
              <article className="glass-card rounded-lg p-5 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-lg md:text-xl font-display font-semibold text-[var(--color-text)] mb-2 group-hover:text-[var(--color-accent)] transition-colors inline-flex items-center gap-2">
                      {post.title}
                      <ArrowUpRight
                        size={16}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </h2>
                    <p className="text-[var(--color-text-muted)] font-body text-sm mb-3">
                      {post.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)] font-body">
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
                      <div className="flex gap-2 mt-3">
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
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </PageLayout>
  )
}

export default BlogIndex
