import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatPostDate } from '../blog/formatPostDate'
import { getAllPostMeta } from '../blog/posts'
import PageLayout from '../components/PageLayout'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

function BlogIndex() {
  const posts = getAllPostMeta()

  useDocumentMeta({
    title: 'Writing — Bernard Xie',
    description:
      'Essays by Bernard Xie on building with AI, startup life, engineering, and other interests.',
  })

  return (
    <PageLayout>
      <div className="simple-blog-index">
        <Link to="/" className="simple-back-link">
          <ArrowLeft size={13} aria-hidden="true" />
          Home
        </Link>

        <header className="simple-blog-header">
          <h1>Writing</h1>
          <p>Notes on software, startups, and whatever else is on my mind.</p>
        </header>

        {posts.length === 0 ? (
          <p className="simple-empty-state">Nothing here yet.</p>
        ) : (
          <section aria-label="All writing" className="writing-list writing-list--all">
            {posts.map((post) => (
              <article key={post.slug}>
                <Link to={`/blog/${post.slug}`} className="writing-item">
                  <div className="writing-item__date">
                    <time dateTime={post.date}>{formatPostDate(post.date, 'short')}</time>
                  </div>

                  <div>
                    <h2>{post.title}</h2>
                    <p>{post.description}</p>
                  </div>

                  <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
              </article>
            ))}
          </section>
        )}
      </div>
    </PageLayout>
  )
}

export default BlogIndex
