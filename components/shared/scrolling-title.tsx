'use client'

import { useEffect } from 'react'

export function ScrollingTitle() {
  useEffect(() => {
    const baseTitle = 'VSJ - Sewa Alat Berat Bali'

    // Set static title for better SEO (scrolling title causes performance issues)
    document.title = baseTitle

    return () => {
      document.title = baseTitle
    }
  }, [])

  return null
}
