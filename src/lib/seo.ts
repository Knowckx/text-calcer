type MetaSelector = {
  attribute: 'name' | 'property';
  key: string;
};

function upsertMeta(selector: MetaSelector, content: string) {
  const query = `meta[${selector.attribute}="${selector.key}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(query);

  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(selector.attribute, selector.key);
    document.head.appendChild(el);
  }

  el.setAttribute('content', content);
}

function upsertLink(selector: { rel: string; hreflang?: string }, href: string) {
  const query = selector.hreflang
    ? `link[rel="${selector.rel}"][hreflang="${selector.hreflang}"]`
    : `link[rel="${selector.rel}"]`;

  let el = document.head.querySelector<HTMLLinkElement>(query);

  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', selector.rel);
    document.head.appendChild(el);
  }

  if (selector.hreflang) {
    el.setAttribute('hreflang', selector.hreflang);
  } else {
    el.removeAttribute('hreflang');
  }

  el.setAttribute('href', href);
}

function upsertJsonLd(id: string, data: unknown) {
  let script = document.head.querySelector<HTMLScriptElement>(`script[data-seo-id="${id}"]`);

  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-seo-id', id);
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(data);
}

function toOgLocale(locale: string): string {
  return locale.replace('-', '_');
}

export function syncSeoHead(params: {
  title: string;
  description: string;
  siteName: string;
  canonicalUrl: string;
  locale: string;
  alternateUrls: Array<{ locale: string; url: string }>;
}) {
  document.title = params.title;

  upsertMeta({ attribute: 'name', key: 'description' }, params.description);
  upsertMeta({ attribute: 'name', key: 'robots' }, 'index,follow');
  upsertMeta({ attribute: 'property', key: 'og:type' }, 'website');
  upsertMeta({ attribute: 'property', key: 'og:title' }, params.title);
  upsertMeta({ attribute: 'property', key: 'og:description' }, params.description);
  upsertMeta({ attribute: 'property', key: 'og:site_name' }, params.siteName);
  upsertMeta({ attribute: 'property', key: 'og:url' }, params.canonicalUrl);
  upsertMeta({ attribute: 'property', key: 'og:locale' }, toOgLocale(params.locale));
  upsertMeta({ attribute: 'name', key: 'twitter:card' }, 'summary');
  upsertMeta({ attribute: 'name', key: 'twitter:title' }, params.title);
  upsertMeta({ attribute: 'name', key: 'twitter:description' }, params.description);
  upsertMeta({ attribute: 'name', key: 'twitter:url' }, params.canonicalUrl);

  upsertLink({ rel: 'canonical' }, params.canonicalUrl);
  for (const alternate of params.alternateUrls) {
    upsertLink({ rel: 'alternate', hreflang: alternate.locale }, alternate.url);
  }
  upsertLink({ rel: 'alternate', hreflang: 'x-default' }, params.alternateUrls[0]?.url ?? params.canonicalUrl);

  upsertJsonLd('web-app', {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: params.siteName,
    url: params.canonicalUrl,
    description: params.description,
    inLanguage: params.locale,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  });
}
