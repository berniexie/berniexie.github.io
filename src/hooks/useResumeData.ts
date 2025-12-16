import { useEffect, useState } from 'react'
import type { ResumeData } from '../types/resume'

export function useResumeData() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/resume.json')
      .then((res) => res.json())
      .then((data: ResumeData) => {
        setResumeData(data)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load resume:', err)
        setIsLoading(false)
      })
  }, [])

  return { resumeData, isLoading }
}
