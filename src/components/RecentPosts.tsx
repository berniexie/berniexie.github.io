import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { getAllPostMeta } from '../blog/posts'

function RecentPosts() {
  const allPosts = getAllPostMeta()
  const recentPosts = allPosts.slice(0, 3)

  if (recentPosts.length === 0) {
    return null
  }

  return (
    <div className="my-12">
      {/* Gradient separator */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent opacity-60 mb-6" />

      <div id="blog" className="scroll-mt-24 py-4 flex justify-between items-center">
        <h2 className="mt-0 text-base md:text-lg font-semibold tracking-tight text-[var(--color-text)] font-display uppercase flex items-center gap-3">
          Recent Blog Posts
        </h2>
        <Link
          to="/blog"
          className="text-[10px] uppercase tracking-widest font-semibold flex items-center gap-2 text-[var(--color-accent)] hover:text-[var(--color-text)] transition-colors px-3 py-1.5 rounded-full border border-[var(--color-accent)]/30 hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/10"
        >
          See All <ArrowUpRight size={12} />
        </Link>
      </div>

      <div className="flex flex-col gap-6">
        {recentPosts.map((post) => (
          <Link key={post.slug} to={`/blog/${post.slug}`} className="group block">
            <article className="glass-card rounded-lg p-4 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm md:text-base font-display font-semibold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors flex items-center gap-2">
                    {post.title}
                    <ArrowUpRight
                      size={14}
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    />
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)] font-body mt-1 line-clamp-2">
                    {post.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-[var(--color-text-muted)] font-body">
                    <span>{post.author}</span>
                    <span>•</span>
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </time>
                  </div>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default RecentPosts
