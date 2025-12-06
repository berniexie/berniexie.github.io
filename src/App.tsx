import { useEffect, useState } from "react";
import { Download, ArrowUpRight, Expand, Minimize } from "lucide-react";
import "./App.css";
import AsciiBackground from "./AsciiBackground";

interface ResumeData {
  name: string;
  contact: {
    phone: string;
    email: string;
    linkedin: string;
    website: string;
  };
  summary: string;
  sections: Array<{
    id: string;
    title: string;
    jobs?: Array<{
      company: string;
      title: string;
      period: string;
      summary: string | null;
      details: string[];
    }>;
    items?: Array<{
      school: string;
      degree: string;
      period: string;
    }>;
  }>;
}

function App() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>("");
  const [showDetails, setShowDetails] = useState(false);
  const [stickyStates, setStickyStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("/resume.json")
      .then((res) => res.json())
      .then((data: ResumeData) => {
        setResumeData(data);
        if (data.sections.length > 0) {
          setActiveSection(data.sections[0].id);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load resume:", err);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!resumeData) return;

    const handleScroll = () => {
      let currentSection = resumeData.sections[0]?.id || "";
      const newStickyStates: Record<string, boolean> = {};

      for (const section of resumeData.sections) {
        const element = document.getElementById(section.id);
        if (element) {
          // Check if element is stuck (at top of viewport)
          const rect = element.getBoundingClientRect();
          newStickyStates[section.id] = rect.top <= 0;

          if (window.scrollY >= element.offsetTop - 200) {
            currentSection = section.id;
          }
        }
      }

      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
        if (resumeData.sections.length > 0) {
          currentSection = resumeData.sections[resumeData.sections.length - 1].id;
        }
      }

      setStickyStates(newStickyStates);
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial call
    return () => window.removeEventListener("scroll", handleScroll);
  }, [resumeData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] text-[var(--color-text)]">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!resumeData) return null;

  return (
    <div className="min-h-screen relative selection:bg-[var(--color-text)] selection:text-[var(--color-bg)]">
      <AsciiBackground />

      {/* Floating Download Button - Minimalist */}
      <a
        href="/resume.md"
        download="Bernard_Xie_Resume.md"
        className="fixed bottom-8 right-8 z-50 group hidden md:flex items-center gap-3 bg-[var(--color-bg)] pl-4 pr-3 py-2 rounded-full border border-[var(--color-border)] hover:border-[var(--color-text)] transition-all hover:shadow-lg"
      >
        <span className="text-xs font-medium uppercase tracking-wider">
          Download Resume
        </span>
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

      {/* Main Layout */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 py-8 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar - Minimalist Info */}
        <aside className="lg:col-span-3 lg:sticky lg:top-24 h-fit flex flex-col gap-8">
          <div>
            <div className="font-display font-bold text-lg tracking-tight mb-2">
              berniexie
            </div>
            <div className="font-body text-xs text-[var(--color-text-muted)]">
              Software Engineer
              <br />
              San Francisco, CA
            </div>
          </div>

          {/* Table of Contents */}
          {resumeData.sections.length > 0 && (
            <nav className="hidden lg:block">
              <ul className="flex flex-col gap-2">
                {resumeData.sections.map((section) => {
                  const isActive = activeSection === section.id;
                  return (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          const element = document.getElementById(section.id);
                          if (element) {
                            const offset = 100;
                            const bodyRect = document.body.getBoundingClientRect().top;
                            const elementRect = element.getBoundingClientRect().top;
                            const elementPosition = elementRect - bodyRect;
                            const offsetPosition = elementPosition - offset;

                            window.scrollTo({
                              top: offsetPosition,
                              behavior: "smooth",
                            });
                          }
                        }}
                        className={`text-xs uppercase tracking-widest transition-colors duration-200 flex items-center gap-2 ${
                          isActive
                            ? "text-[var(--color-text)] font-semibold"
                            : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                        }`}
                      >
                        {isActive && (
                          <span className="w-1 h-1 rounded-full bg-[var(--color-text)]" />
                        )}
                        {section.title}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-9 lg:pl-12">
          <article className="max-w-none">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-[var(--color-text)] font-display leading-[0.95] break-words">
                {resumeData.name}
              </h1>
            </div>

            {/* Contact Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs text-[var(--color-text-muted)] font-body mb-4">
              <div className="flex flex-col gap-3">
                <span className="text-[10px] uppercase tracking-widest opacity-40 font-semibold">
                  Contact
                </span>
                <div className="flex flex-col gap-2">
                  <a
                    href={`mailto:${resumeData.contact.email}`}
                    className="hover-link inline-flex items-center gap-1 w-fit text-[var(--color-text)]"
                  >
                    {resumeData.contact.email} <ArrowUpRight size={10} />
                  </a>
                  <span className="text-[var(--color-text)]">
                    {resumeData.contact.phone}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-[10px] uppercase tracking-widest opacity-40 font-semibold">
                  Social
                </span>
                <div className="flex flex-col gap-2">
                  <a
                    href={resumeData.contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover-link inline-flex items-center gap-1 w-fit text-[var(--color-text)]"
                  >
                    LinkedIn <ArrowUpRight size={10} />
                  </a>
                  <a
                    href={resumeData.contact.website}
                    className="hover-link inline-flex items-center gap-1 w-fit text-[var(--color-text)]"
                  >
                    berniexie.github.io <ArrowUpRight size={10} />
                  </a>
                </div>
              </div>
            </div>

            <hr className="border-[var(--color-border)] my-0" />

            {/* Summary */}
            <p className="text-[var(--color-text-muted)] leading-relaxed py-4 font-body text-xs md:text-sm max-w-2xl">
              {resumeData.summary}
            </p>

            <hr className="border-[var(--color-border)] my-0" />

            {/* Sections */}
            {resumeData.sections.map((section) => {
              const isStuck = stickyStates[section.id];
              return (
                <div
                  key={section.id}
                  className={section.id === "work-experience" ? "mb-12" : ""}
                >
                  <hr className="border-[var(--color-border)] my-0" />
                  <div
                    id={section.id}
                    className={`scroll-mt-24 sticky top-0 py-4 border-b border-[var(--color-border)] mb-6 z-10 transition-all duration-300 flex justify-between items-center ${
                      isStuck
                        ? "bg-[var(--color-bg)]/80 backdrop-blur-md shadow-sm"
                        : "bg-transparent"
                    }`}
                  >
                    <h2 className="mt-0 text-base md:text-lg font-semibold tracking-tight text-[var(--color-text)] font-display uppercase flex items-center gap-3">
                      {section.title}
                    </h2>

                    {section.id === "work-experience" && (
                      <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="text-[10px] uppercase tracking-widest font-semibold flex items-center gap-2 text-[var(--color-accent)] hover:text-[var(--color-text)] transition-colors px-3 py-1.5 rounded-full border border-[var(--color-accent)]/30 hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/10"
                      >
                        {showDetails ? (
                          <>
                            <Minimize size={12} /> Collapse Details
                          </>
                        ) : (
                          <>
                            <Expand size={12} /> Expand Details
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Work Experience Jobs */}
                  {section.jobs &&
                    section.jobs.map((job, index) => (
                      <div key={index}>
                        <h3 className="text-base md:text-lg font-semibold mt-6 mb-2 text-[var(--color-text)] font-display">
                          {job.company}
                        </h3>
                        <p className="text-[var(--color-text-muted)] leading-relaxed py-4 font-body text-xs md:text-sm max-w-2xl">
                          <strong className="text-[var(--color-text)] font-medium">
                            {job.title}
                          </strong>{" "}
                          | {job.period}
                        </p>

                        {job.summary && (
                          <p className="text-[var(--color-text-muted)] leading-relaxed py-4 font-body text-xs md:text-sm max-w-2xl">
                            {job.summary}
                          </p>
                        )}

                        {/* Details List */}
                        <div
                          className={`overflow-hidden transition-all duration-500 ease-in-out ${
                            showDetails
                              ? "max-h-[2000px] opacity-100 mb-6"
                              : "max-h-0 opacity-0 mb-0"
                          }`}
                        >
                          <ul className="space-y-2 pl-0 border-l border-[var(--color-border)] ml-1 pl-6">
                            {job.details.map((detail, detailIndex) => (
                              <li
                                key={detailIndex}
                                className="flex gap-4 text-[var(--color-text-muted)] font-body text-xs leading-relaxed group"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-text)] opacity-20 group-hover:opacity-100 transition-opacity mt-2.5 flex-shrink-0"></span>
                                <div className="flex-1">{detail}</div>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {index < (section.jobs?.length ?? 0) - 1 && (
                          <hr className="border-[var(--color-border)] my-0" />
                        )}
                      </div>
                    ))}

                  {/* Education Items */}
                  {section.items &&
                    section.items.map((item, index) => (
                      <div key={index}>
                        <h3 className="text-base md:text-lg font-semibold mt-6 mb-2 text-[var(--color-text)] font-display">
                          {item.school}
                        </h3>
                        <p className="text-[var(--color-text-muted)] leading-relaxed py-4 font-body text-xs md:text-sm max-w-2xl">
                          <strong className="text-[var(--color-text)] font-medium">
                            {item.degree}
                          </strong>{" "}
                          | {item.period}
                        </p>
                      </div>
                    ))}
                </div>
              );
            })}
          </article>

          <footer className="mt-16 pt-8 border-t border-[var(--color-border)] flex justify-between items-end text-xs text-[var(--color-text-muted)]">
            <div>
              <p>&copy; {new Date().getFullYear()}</p>
            </div>
            <div className="text-right">
              <p>Designed & Engineered</p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
