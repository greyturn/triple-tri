export const IS_DEV = process.env.NEXT_PUBLIC_VERCEL_ENV === 'development'
export const DOMAIN = IS_DEV ? 'localhost:3000' : process.env.NEXT_PUBLIC_VERCEL_URL;
export const PROTOCOL = IS_DEV ? 'http://' : 'https://';

export function apiFetch(url: string) {
    return fetch(`${PROTOCOL}${DOMAIN}${url}`)
}