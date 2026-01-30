export function getApiBase(): string {
  const publicBase = (process.env.NEXT_PUBLIC_API_URL ?? '').trim();

  // Browser: prefer same-origin when NEXT_PUBLIC_API_URL is unset.
  if (typeof window !== 'undefined') {
    return publicBase === '' ? '' : publicBase;
  }

  // Server: prefer container/internal address.
  const internalBase = (process.env.INTERNAL_API_URL ?? '').trim();
  if (internalBase !== '') return internalBase;

  if (publicBase !== '') return publicBase;
  return 'http://localhost:8080';
}
