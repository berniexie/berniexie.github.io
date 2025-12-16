import AsciiBackground from '../AsciiBackground'
import { DownloadButton } from './DownloadButton'

interface PageLayoutProps {
  children: React.ReactNode
  showDownloadButton?: boolean
}

function PageLayout({ children, showDownloadButton = false }: PageLayoutProps) {
  return (
    <div className="min-h-screen relative selection:bg-[var(--color-text)] selection:text-[var(--color-bg)]">
      <AsciiBackground />
      {showDownloadButton && <DownloadButton />}

      {/* Main Layout - Centered */}
      <div className="max-w-4xl mx-auto px-6 py-8 md:py-16">
        {/* Content Area */}
        <main>{children}</main>

        <footer className="mt-16 pt-8 border-t border-[var(--color-border)] flex justify-between items-end text-xs text-[var(--color-text-muted)]">
          <div>
            <p>&copy; {new Date().getFullYear()}</p>
          </div>
          <div className="flex-col justify-items-end items-end gap-3">
            <img
              src="/round-cat.png"
              alt="Cat"
              className="w-16 h-16 animate-spin"
              style={{ animationDuration: '3s' }}
            />
            <p>Got the goods.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default PageLayout
