import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Download, Mail, Phone, Linkedin, Globe } from 'lucide-react'
import './App.css'

function App() {
  const [markdown, setMarkdown] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/resume.md')
      .then((res) => res.text())
      .then((text) => {
        setMarkdown(text)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load resume:', err)
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[var(--color-text-muted)]">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Fixed download button */}
      <a
        href="/resume.md"
        download="Bernard_Xie_Resume.md"
        className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 
                   bg-[var(--color-text)] text-[var(--color-bg)] 
                   rounded-full font-medium text-sm
                   hover:scale-105 active:scale-95
                   transition-all duration-200 ease-out
                   shadow-lg hover:shadow-xl"
      >
        <Download size={16} strokeWidth={2.5} />
        <span>Download</span>
      </a>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <article className="prose prose-lg max-w-none
                          prose-headings:font-semibold prose-headings:tracking-tight
                          prose-h1:text-4xl prose-h1:mb-4
                          prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-[var(--color-border)]
                          prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-2 prose-h3:text-[var(--color-text)]
                          prose-p:text-[var(--color-text-muted)] prose-p:leading-relaxed
                          prose-li:text-[var(--color-text-muted)] prose-li:leading-relaxed
                          prose-strong:text-[var(--color-text)] prose-strong:font-semibold
                          prose-a:text-[var(--color-accent)] prose-a:no-underline hover:prose-a:underline
                          prose-hr:border-[var(--color-border)] prose-hr:my-8
                          dark:prose-invert">
          <ReactMarkdown
            components={{
              // Custom renderer for the header section with contact info
              h1: ({ children }) => (
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--color-text)] mb-2">
                  {children}
                </h1>
              ),
              // Custom renderer for paragraphs - detect contact info
              p: ({ children, ...props }) => {
                const text = String(children)
                // Check if this is the contact info line
                if (text.includes('📞') || text.includes('✉️')) {
                  return (
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--color-text-muted)] mb-8">
                      <span className="flex items-center gap-1.5">
                        <Phone size={14} />
                        <span>(213) 268-4742</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Mail size={14} />
                        <a href="mailto:bxie94@gmail.com" className="hover:text-[var(--color-accent)] transition-colors">
                          bxie94@gmail.com
                        </a>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Linkedin size={14} />
                        <a href="http://www.linkedin.com/in/xiebernard" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-accent)] transition-colors">
                          LinkedIn
                        </a>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Globe size={14} />
                        <a href="https://berniexie.github.io" className="hover:text-[var(--color-accent)] transition-colors">
                          berniexie.github.io
                        </a>
                      </span>
                    </div>
                  )
                }
                return <p {...props}>{children}</p>
              },
            }}
          >
            {markdown}
          </ReactMarkdown>
        </article>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] py-8">
        <div className="max-w-3xl mx-auto px-6 text-center text-sm text-[var(--color-text-muted)]">
          © {new Date().getFullYear()} Bernard Xie
        </div>
      </footer>
    </div>
  )
}

export default App
