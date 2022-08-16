import { AnshinOptions } from '@anshin/types';

/**
 * Resolve config using the default values and user-specified options.
 */
export function resolveConfig(
  options: Partial<AnshinOptions>,
  defaults: AnshinOptions
): AnshinOptions {
  const services = [...defaults.services, ...(options.services || [])];

  return {
    ...defaults,
    ...options,
    domains: normalizeDomains(options.domains || resolveDefaultDomains()),
    cookieAttributes: {
      ...defaults.cookieAttributes,
      ...(options.cookieAttributes || {}),
    },
    cookies: {
      ...defaults.cookies,
      ...(options.cookies || {}),
    },
    services: [...new Map(services.map(item => [item.name, item])).values()],
  };
}

/**
 * Normalize domains: they should start with a `.` symbol.
 */
function normalizeDomains(domains: string[]): string[] {
  return domains.map((domain) => (domain.startsWith('.') ? domain : `.${domain}`));
}

/**
 * Resolve the base domain (without subdomains). This solution will only work for ~80-90% of use cases,
 * in other cases the users will have to manually specify the domain.
 */
function resolveDefaultDomains(): string[] {
  const domains = [];
  const host = window.location.hostname;
  const simple = host.match(
    /(?:[A-Za-z0-9-]+\.)*([A-Za-z0-9-]+\.co.uk|\.com.br|\.co.jp|\.com.au)\b/
  );
  if (simple !== null) {
    domains.push(simple[1]);
  }
  const matches = host.match(/(?:[A-Za-z0-9-]+\.)*([A-Za-z0-9-]+\.(?:[A-za-z]{2}|[A-Za-z]{3,}))\b/);
  if (matches !== null) {
    domains.push(matches[1]);
  }
  domains.push(host);

  return domains;
}
