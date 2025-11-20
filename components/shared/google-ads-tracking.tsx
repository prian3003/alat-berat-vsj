'use client'

/**
 * Google Ads Conversion Tracking Component
 *
 * This component handles Google Ads (Google Ads) conversion tracking
 * Conversion ID: AW-17745920508
 *
 * Features:
 * - Automatic page view tracking
 * - Conversion event tracking
 * - User behavior tracking
 * - Robust error handling
 * - Type-safe implementation
 * - Development mode support
 */

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

// Google Ads Conversion ID
const GOOGLE_ADS_CONVERSION_ID = 'AW-17745920508'

/**
 * Initialize Google Ads tracking
 * This function loads the gtag script and initializes Google Ads
 */
function initializeGoogleAds() {
  // Check if gtag is already loaded
  if (typeof window !== 'undefined' && !(window as any).gtag) {
    // Create script element for gtag
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_CONVERSION_ID}`
    document.head.appendChild(script)

    // Initialize dataLayer
    ;(window as any).dataLayer = (window as any).dataLayer || []

    // Define gtag function
    function gtag(...args: any[]) {
      ;(window as any).dataLayer.push(arguments)
    }

    ;(window as any).gtag = gtag

    // Configure Google Ads
    gtag('js', new Date())
    gtag('config', GOOGLE_ADS_CONVERSION_ID, {
      'allow_google_signals': true,
      'allow_ad_personalization_signals': true,
    })
  }
}

/**
 * Track page view in Google Ads
 * Called automatically on route changes
 */
export function trackPageView(pagePath: string, pageTitle: string) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    try {
      ;(window as any).gtag('event', 'page_view', {
        page_path: pagePath,
        page_title: pageTitle,
      })
    } catch (error) {
      console.error('Error tracking page view in Google Ads:', error)
    }
  }
}

/**
 * Track conversion event in Google Ads
 * Used when user completes a desired action (contact form, phone call, etc)
 *
 * @param conversionId - Google Ads conversion ID (optional, uses default)
 * @param value - Conversion value in IDR (optional)
 * @param currency - Currency code (default: IDR)
 * @param conversionLabel - Conversion label from Google Ads
 * @param customData - Additional custom data to track
 */
export function trackConversion(
  conversionLabel: string,
  value?: number,
  currency: string = 'IDR',
  customData?: Record<string, any>
) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    try {
      ;(window as any).gtag('event', 'conversion', {
        'allow_custom_event_values': true,
        'currency': currency,
        'value': value || 0,
        'conversion_id': GOOGLE_ADS_CONVERSION_ID,
        'conversion_label': conversionLabel,
        ...customData,
      })
    } catch (error) {
      console.error('Error tracking conversion in Google Ads:', error)
    }
  }
}

/**
 * Track contact form submission
 * @param formType - Type of form (contact, inquiry, etc)
 * @param formData - Form data submitted
 */
export function trackFormSubmission(
  formType: string,
  formData: Record<string, any> = {}
) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    try {
      ;(window as any).gtag('event', 'form_submit', {
        'form_type': formType,
        'form_name': `${formType}_submission`,
        ...formData,
      })
    } catch (error) {
      console.error('Error tracking form submission:', error)
    }
  }
}

/**
 * Track WhatsApp click
 * @param phoneNumber - WhatsApp number clicked
 * @param source - Where the WhatsApp button was clicked from (sitelink, ad, page, etc)
 */
export function trackWhatsAppClick(phoneNumber: string, source: string = 'unknown') {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    try {
      ;(window as any).gtag('event', 'whatsapp_click', {
        'phone_number': phoneNumber,
        'source': source,
        'timestamp': new Date().toISOString(),
      })
    } catch (error) {
      console.error('Error tracking WhatsApp click:', error)
    }
  }
}

/**
 * Track phone call
 * @param phoneNumber - Phone number called
 * @param source - Where the call button was clicked from
 */
export function trackPhoneCall(phoneNumber: string, source: string = 'unknown') {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    try {
      ;(window as any).gtag('event', 'phone_call', {
        'phone_number': phoneNumber,
        'source': source,
        'timestamp': new Date().toISOString(),
      })
    } catch (error) {
      console.error('Error tracking phone call:', error)
    }
  }
}

/**
 * Track email inquiry
 * @param emailAddress - Email address clicked
 * @param source - Where the email link was clicked from
 */
export function trackEmailInquiry(emailAddress: string, source: string = 'unknown') {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    try {
      ;(window as any).gtag('event', 'email_inquiry', {
        'email': emailAddress,
        'source': source,
        'timestamp': new Date().toISOString(),
      })
    } catch (error) {
      console.error('Error tracking email inquiry:', error)
    }
  }
}

/**
 * Track sitelink click (from Google Ads)
 * @param sitelinkName - Name of sitelink clicked
 * @param url - URL of sitelink
 */
export function trackSitelinkClick(sitelinkName: string, url: string) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    try {
      ;(window as any).gtag('event', 'sitelink_click', {
        'sitelink_name': sitelinkName,
        'sitelink_url': url,
        'timestamp': new Date().toISOString(),
      })
    } catch (error) {
      console.error('Error tracking sitelink click:', error)
    }
  }
}

/**
 * Track equipment view/interest
 * @param equipmentType - Type of equipment viewed
 * @param equipmentName - Name of specific equipment
 */
export function trackEquipmentInterest(equipmentType: string, equipmentName: string) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    try {
      ;(window as any).gtag('event', 'equipment_view', {
        'equipment_type': equipmentType,
        'equipment_name': equipmentName,
        'timestamp': new Date().toISOString(),
      })
    } catch (error) {
      console.error('Error tracking equipment interest:', error)
    }
  }
}

/**
 * Track blog article view
 * @param articleTitle - Title of article
 * @param articleCategory - Category of article
 * @param articleSlug - Slug of article
 */
export function trackArticleView(articleTitle: string, articleCategory: string, articleSlug: string) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    try {
      ;(window as any).gtag('event', 'article_view', {
        'article_title': articleTitle,
        'article_category': articleCategory,
        'article_slug': articleSlug,
        'timestamp': new Date().toISOString(),
      })
    } catch (error) {
      console.error('Error tracking article view:', error)
    }
  }
}

/**
 * Track gallery view
 */
export function trackGalleryView() {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    try {
      ;(window as any).gtag('event', 'gallery_view', {
        'timestamp': new Date().toISOString(),
      })
    } catch (error) {
      console.error('Error tracking gallery view:', error)
    }
  }
}

/**
 * Google Ads Tracking Component
 * This component initializes Google Ads tracking and tracks page views
 * Place this component in your root layout
 */
export function GoogleAdsTracking() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Initialize Google Ads on component mount
    initializeGoogleAds()
  }, [])

  useEffect(() => {
    // Track page view on route change
    if (typeof window !== 'undefined') {
      const url = pathname + (searchParams?.toString() ? `?${searchParams}` : '')
      const pageTitle = document.title || pathname

      trackPageView(url, pageTitle)

      // Log for debugging in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Google Ads] Page view tracked:`, {
          path: url,
          title: pageTitle,
          timestamp: new Date().toISOString(),
        })
      }
    }
  }, [pathname, searchParams])

  // This component doesn't render anything
  return null
}

/**
 * Get Google Ads conversion ID for manual implementation
 */
export function getGoogleAdsConversionId(): string {
  return GOOGLE_ADS_CONVERSION_ID
}

/**
 * Check if Google Ads is initialized
 */
export function isGoogleAdsInitialized(): boolean {
  if (typeof window === 'undefined') return false
  return !!(window as any).gtag && !!(window as any).dataLayer
}
