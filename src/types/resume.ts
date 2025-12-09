export interface ResumeJob {
  company: string
  title: string
  period: string
  summary: string | null
  details: string[]
  ycBatch?: string
  ycSlug?: string
}

export interface ResumeEducationItem {
  school: string
  degree: string
  period: string
}

export interface ResumeSection {
  id: string
  title: string
  jobs?: ResumeJob[]
  items?: ResumeEducationItem[]
}

export interface ResumeData {
  name: string
  contact: {
    phone: string
    email: string
    linkedin: string
    x: string
  }
  summary: string
  sections: ResumeSection[]
}

