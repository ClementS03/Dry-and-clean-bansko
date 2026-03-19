'use client'

import { useEffect, useRef, RefObject } from 'react'

export function useScrollReveal(): RefObject<HTMLDivElement> {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    )

    const elements = container.querySelectorAll('.reveal')
    elements.forEach(el => observer.observe(el))

    // Also observe the container itself if it has reveal class
    if (container.classList.contains('reveal')) {
      observer.observe(container)
    }

    return () => observer.disconnect()
  }, [])

  return ref
}
