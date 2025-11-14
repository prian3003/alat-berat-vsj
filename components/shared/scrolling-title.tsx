'use client'

import { useEffect } from 'react'

export function ScrollingTitle() {
  useEffect(() => {
    const baseTitle = 'VSJ - Sewa Alat Berat Bali'
    const separator = ' • '
    let position = 0

    const scrollTitle = () => {
      const scrollText = baseTitle + separator
      const newTitle = scrollText.substring(position) + scrollText.substring(0, position)
      document.title = newTitle
      position = (position + 1) % scrollText.length
    }

    const interval = setInterval(scrollTitle, 100)

    return () => {
      clearInterval(interval)
      document.title = baseTitle
    }
  }, [])

  return null
}
