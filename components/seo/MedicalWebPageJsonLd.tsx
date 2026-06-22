interface Props {
  name: string;
  url: string;
  description: string;
  medicalAudience?: string;
  keywords?: string[];
  dateModified?: string;
}

export function MedicalWebPageJsonLd({
  name,
  url,
  description,
  medicalAudience = "MedicalAudience",
  keywords = [],
  dateModified,
}: Props) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name,
    url,
    description,
    inLanguage: "en",
    dateModified: dateModified ?? new Date().toISOString().slice(0, 10),
    audience: {
      "@type": medicalAudience,
      audienceType: "Healthcare Professionals",
    },
    about: {
      "@type": "MedicalEntity",
      name,
    },
    publisher: {
      "@type": "Organization",
      name: "Hayya Med Pro",
      url: "https://hayyamed.pro",
      logo: {
        "@type": "ImageObject",
        url: "https://hayyamed.pro/icons/icon-192x192.png",
      },
    },
    keywords: keywords.join(", "),
    medicalAudience: {
      "@type": "MedicalAudience",
      audienceType: "Healthcare Professional",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
    />
  );
}
