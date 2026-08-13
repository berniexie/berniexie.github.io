import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatPostDate } from '../blog/formatPostDate'
import { getAllPostMeta } from '../blog/posts'

function RecentPosts() {
  const recentPosts = getAllPostMeta().slice(0, 3)

  if (recentPosts.length === 0) return null

  return (
    <section id="blog" aria-labelledby="writing-heading" className="content-section">
      <header className="simple-section-heading">
        <div>
          <h2 id="writing-heading">Writing</h2>
          <p>Recent posts about software, startups, and whatever else is on my mind.</p>
        </div>

        <Link to="/blog" className="simple-text-link">
          All writing <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </header>

      <div className="writing-list">
        {recentPosts.map((post) => (
          <article key={post.slug}>
            <Link to={`/blog/${post.slug}`} className="writing-item">
              <div className="writing-item__date">
                <time dateTime={post.date}>{formatPostDate(post.date, 'short')}</time>
              </div>

              <div>
                <h3>{post.title}</h3>
                <p>{post.description}</p>
              </div>

              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}

export default RecentPosts
