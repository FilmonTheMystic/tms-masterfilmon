// Domain-based routing utilities

export const DOMAINS = {
  MAIN: 'tms.masterfilmon.com',
  ADMIN: 'admintms.masterfilmon.com',
} as const;

export const DOMAIN_URLS = {
  MAIN: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ADMIN: process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3000/admin',
} as const;

export function getCurrentDomain(): string {
  if (typeof window === 'undefined') return '';
  return window.location.hostname;
}

export function isAdminDomain(): boolean {
  const domain = getCurrentDomain();
  return domain === DOMAINS.ADMIN || domain.includes('admin');
}

export function isMainDomain(): boolean {
  const domain = getCurrentDomain();
  return domain === DOMAINS.MAIN || (!domain.includes('admin') && domain !== '');
}

export function getMainAppUrl(path: string = ''): string {
  return `${DOMAIN_URLS.MAIN}${path}`;
}

export function getAdminAppUrl(path: string = ''): string {
  return `${DOMAIN_URLS.ADMIN}${path}`;
}

export function redirectToMainApp(path: string = '') {
  if (typeof window !== 'undefined') {
    window.location.href = getMainAppUrl(path);
  }
}

export function redirectToAdminApp(path: string = '') {
  if (typeof window !== 'undefined') {
    window.location.href = getAdminAppUrl(path);
  }
}
