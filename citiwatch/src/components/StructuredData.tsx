import Script from 'next/script';

interface StructuredDataProps {
  type?: 'website' | 'organization' | 'service' | 'application';
  pageUrl?: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
}

export default function StructuredData({ 
  type = 'website', 
  breadcrumbs = []
}: StructuredDataProps) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "CitiWatch",
    "description": "Digital Citizen Reporting Platform for Municipal Services",
    "url": "https://citiwatch.com",
    "logo": "https://citiwatch.com/primarylogo.png",
    "sameAs": [
      "https://twitter.com/citiwatch",
      "https://facebook.com/citiwatch"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-800-CITIWATCH",
      "contactType": "Customer Service",
      "availableLanguage": "English"
    },
    "areaServed": "Global",
    "serviceType": "Municipal Service Platform"
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "CitiWatch",
    "description": "Digital platform empowering citizens to report municipal issues and track complaint resolution",
    "url": "https://citiwatch.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://citiwatch.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "author": {
      "@type": "Organization",
      "name": "CitiWatch Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "CitiWatch",
      "logo": {
        "@type": "ImageObject",
        "url": "https://citiwatch.com/primarylogo.png",
        "width": 512,
        "height": 512
      }
    }
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "CitiWatch Digital Reporting",
    "description": "Comprehensive digital platform for citizen reporting and municipal service management",
    "provider": {
      "@type": "Organization",
      "name": "CitiWatch"
    },
    "areaServed": "Global",
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": "https://citiwatch.com",
      "serviceSmsNumber": "+1-800-CITIWATCH"
    },
    "category": "Municipal Services",
    "serviceType": "Digital Civic Platform"
  };

  const applicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "CitiWatch",
    "description": "Digital citizen reporting platform for municipal services",
    "url": "https://citiwatch.com",
    "applicationCategory": "GovernmentApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Submit complaints",
      "Track resolution progress", 
      "Category management",
      "User dashboard",
      "Admin management"
    ]
  };

  const breadcrumbSchema = breadcrumbs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  } : null;

  const schemas: Array<Record<string, unknown>> = [organizationSchema];
  
  switch (type) {
    case 'website':
      schemas.push(websiteSchema);
      break;
    case 'service':
      schemas.push(serviceSchema);
      break;
    case 'application':
      schemas.push(applicationSchema);
      break;
  }

  if (breadcrumbSchema) {
    schemas.push(breadcrumbSchema);
  }

  return (
    <>
      {schemas.map((schema, index) => (
        <Script
          key={index}
          id={`structured-data-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema)
          }}
        />
      ))}
    </>
  );
}
