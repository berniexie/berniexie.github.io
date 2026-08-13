interface PageLayoutProps {
  children: React.ReactNode
  navigationRail?: boolean
  /** Retained for HomePage compatibility; no floating download control is rendered. */
  showDownloadButton?: boolean
}

function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <div className="site-page">
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>

        <footer className="site-footer">
          <div>
            <p>© {new Date().getFullYear()} Bernard Xie</p>
            <p>San Francisco, California</p>
          </div>
          <a className="site-footer__mascot" href="#main-content" aria-label="Back to the top">
            <img src="/round-cat.png" alt="" />
            <span>Back to top</span>
          </a>
        </footer>
      </div>
    </div>
  )
}

export default PageLayout
