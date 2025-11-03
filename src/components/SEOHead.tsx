import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
  schema?: Record<string, any>;
}

const SEOHead = ({
  title,
  description,
  keywords,
  ogImage = "https://storage.googleapis.com/gpt-engineer-file-uploads/qzHB704AhTYN2UH42LNxe4DaiIr2/social-images/social-1759760945717-Desain tanpa judul (15).png",
  canonicalUrl,
  schema
}: SEOHeadProps) => {
  const location = useLocation();
  const fullUrl = `https://athastudio.lovable.app${location.pathname}`;
  const canonical = canonicalUrl || fullUrl;

  useEffect(() => {
    // Update title
    document.title = title;

    // Update meta tags
    updateMetaTag('name', 'description', description);
    if (keywords) {
      updateMetaTag('name', 'keywords', keywords);
    }

    // Open Graph tags
    updateMetaTag('property', 'og:title', title);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:url', fullUrl);
    updateMetaTag('property', 'og:image', ogImage);
    updateMetaTag('property', 'og:type', 'website');

    // Twitter Card tags
    updateMetaTag('name', 'twitter:title', title);
    updateMetaTag('name', 'twitter:description', description);
    updateMetaTag('name', 'twitter:image', ogImage);
    updateMetaTag('name', 'twitter:card', 'summary_large_image');

    // Canonical URL
    updateCanonicalLink(canonical);

    // Structured Data (JSON-LD)
    if (schema) {
      updateStructuredData(schema);
    }
  }, [title, description, keywords, ogImage, fullUrl, canonical, schema]);

  return null;
};

const updateMetaTag = (attr: string, key: string, content: string) => {
  let element = document.querySelector(`meta[${attr}="${key}"]`);
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  
  element.setAttribute('content', content);
};

const updateCanonicalLink = (url: string) => {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  
  link.href = url;
};

const updateStructuredData = (schema: Record<string, any>) => {
  const scriptId = 'structured-data';
  let script = document.getElementById(scriptId) as HTMLScriptElement | null;
  
  if (!script) {
    script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  
  script.textContent = JSON.stringify(schema);
};

// Schema.org templates
export const photographyBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Atha Studio",
  "description": "Jasa fotografi profesional untuk wedding, portrait, dan acara spesial di Yogyakarta",
  "url": "https://athastudio.lovable.app",
  "telephone": "+6282241590417",
  "email": "athadiary21@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Yogyakarta",
    "addressCountry": "ID"
  },
  "priceRange": "Rp 250.000 - Rp 3.000.000",
  "image": "https://storage.googleapis.com/gpt-engineer-file-uploads/qzHB704AhTYN2UH42LNxe4DaiIr2/social-images/social-1759760945717-Desain tanpa judul (15).png",
  "sameAs": [
    "https://www.instagram.com/atha_diary21/",
    "https://web.facebook.com/AthaDiary21/"
  ]
};

export const serviceSchema = (serviceName: string, price: string) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": serviceName,
  "provider": {
    "@type": "ProfessionalService",
    "name": "Atha Studio"
  },
  "offers": {
    "@type": "Offer",
    "price": price,
    "priceCurrency": "IDR"
  }
});

export default SEOHead;
