// Google Analytics & Conversion Tracking Utility

export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  // Google Analytics 4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, eventParams);
  }
  
  // Facebook Pixel
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, eventParams);
  }
  
  console.log('Analytics Event:', eventName, eventParams);
};

// Conversion tracking untuk Google Ads
export const trackConversion = (conversionLabel: string, value?: number) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'conversion', {
      'send_to': `AW-CONVERSION_ID/${conversionLabel}`,
      'value': value || 0,
      'currency': 'IDR'
    });
  }
};

// Track WhatsApp CTA clicks
export const trackWhatsAppClick = (
  service: string,
  packageName: string,
  buttonLocation: string
) => {
  trackEvent('whatsapp_click', {
    service_type: service,
    package_name: packageName,
    button_location: buttonLocation,
    event_category: 'engagement',
    event_label: `WhatsApp - ${service} - ${packageName}`
  });
  
  // Google Ads conversion
  trackConversion('whatsapp_click', 0);
};

// Track form submissions
export const trackFormSubmit = (
  formName: string,
  formData?: Record<string, any>
) => {
  trackEvent('form_submit', {
    form_name: formName,
    ...formData,
    event_category: 'lead_generation'
  });
  
  // Google Ads conversion
  trackConversion('form_submit', 0);
};

// Track page views
export const trackPageView = (pageName: string, pageTitle: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
      page_title: pageTitle,
      page_path: window.location.pathname,
    });
  }
  
  trackEvent('page_view', {
    page_name: pageName,
    page_title: pageTitle,
    page_location: window.location.href
  });
};

// Track booking intent
export const trackBookingIntent = (
  service: string,
  packageName: string,
  estimatedValue?: number
) => {
  trackEvent('begin_checkout', {
    service_type: service,
    package_name: packageName,
    value: estimatedValue || 0,
    currency: 'IDR',
    event_category: 'ecommerce'
  });
};

// Track gallery interactions
export const trackGalleryInteraction = (
  action: 'view' | 'like' | 'share' | 'download',
  photoId: string
) => {
  trackEvent('gallery_interaction', {
    action,
    photo_id: photoId,
    event_category: 'engagement'
  });
};
