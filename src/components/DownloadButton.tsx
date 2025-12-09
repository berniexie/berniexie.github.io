import { Download } from 'lucide-react'

export function DownloadButton() {
  return (
    <>
      {/* Desktop Floating Download Button */}
      <a
        href="/resume.md"
        download="Bernard_Xie_Resume.md"
        className="glass-card fixed bottom-8 right-8 z-50 group hidden md:flex items-center gap-3 pl-4 pr-3 py-2 rounded-full"
      >
        <span className="text-xs font-medium uppercase tracking-wider">Download Resume</span>
        <div className="bg-[var(--color-text)] text-[var(--color-bg)] p-1.5 rounded-full flex items-center justify-center">
          <Download size={14} strokeWidth={3} />
        </div>
      </a>

      {/* Mobile Floating Button */}
      <a
        href="/resume.md"
        download="Bernard_Xie_Resume.md"
        className="fixed bottom-6 right-6 z-50 md:hidden bg-[var(--color-text)] text-[var(--color-bg)] p-4 rounded-full shadow-xl flex items-center justify-center"
      >
        <Download size={20} />
      </a>
    </>
  )
}
