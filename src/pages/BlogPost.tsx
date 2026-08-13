import { ArrowLeft } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Link, useParams } from 'react-router-dom'
import remarkGfm from 'remark-gfm'
import { formatPostDate } from '../blog/formatPostDate'
import { getPostBySlug } from '../blog/posts'
import PageLayout from '../components/PageLayout'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? getPostBySlug(slug) : undefined

  useDocumentMeta({
    title: post ? `${post.title} — Bernard Xie` : 'Note not found — Bernard Xie',
    description: post?.description || 'The requested article could not be found.',
  })

  if (!post) {
    return (
      <PageLayout>
        <div className="article-not-found">
          <h1>Article not found.</h1>
          <p>The page you’re looking for doesn’t exist.</p>
          <Link to="/blog" className="simple-back-link">
            <ArrowLeft size={13} aria-hidden="true" />
            All writing
          </Link>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <article className="article-page">
        <Link to="/blog" className="simple-back-link">
          <ArrowLeft size={13} aria-hidden="true" />
          All writing
        </Link>

        <header className="article-header">
          <div className="article-header__meta">
            <span>{post.author}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
          </div>

          <h1>{post.title}</h1>

          {post.description && <p>{post.description}</p>}
        </header>

        <div className="prose article-prose prose-headings:scroll-mt-24 prose-headings:tracking-[-0.035em] prose-h2:mt-14 prose-h2:border-t prose-h2:border-[var(--color-border)] prose-h2:pt-7 prose-h3:mt-10 prose-blockquote:border-[var(--color-accent)] prose-blockquote:not-italic">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>

        <footer className="article-page__footer">
          <Link to="/blog" className="simple-back-link">
            <ArrowLeft size={13} aria-hidden="true" />
            All writing
          </Link>
        </footer>
      </article>
    </PageLayout>
  )
}

export default BlogPost
