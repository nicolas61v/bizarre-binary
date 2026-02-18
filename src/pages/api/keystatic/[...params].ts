import { makeHandler } from '@keystatic/astro/api';
import keystaticConfig from '../../../../keystatic.config';

export const prerender = false;

const innerHandler = makeHandler({
  config: keystaticConfig,
  clientId: process.env.KEYSTATIC_GITHUB_CLIENT_ID,
  clientSecret: process.env.KEYSTATIC_GITHUB_CLIENT_SECRET,
  secret: process.env.KEYSTATIC_SECRET,
});

export const ALL: typeof innerHandler = async (context) => {
  const forwardedHost = context.request.headers.get('x-forwarded-host');
  const forwardedProto = context.request.headers.get('x-forwarded-proto') || 'https';
  const url = new URL(context.request.url);

  // Handle the OAuth callback ourselves since the GitHub App
  // doesn't return refresh tokens and Keystatic expects them
  if (url.pathname.includes('oauth/callback')) {
    const code = url.searchParams.get('code');
    if (!code) {
      return new Response('Bad Request', { status: 400 });
    }

    const tokenUrl = new URL('https://github.com/login/oauth/access_token');
    tokenUrl.searchParams.set('client_id', process.env.KEYSTATIC_GITHUB_CLIENT_ID || '');
    tokenUrl.searchParams.set('client_secret', process.env.KEYSTATIC_GITHUB_CLIENT_SECRET || '');
    tokenUrl.searchParams.set('code', code);

    const tokenRes = await fetch(tokenUrl, {
      method: 'POST',
      headers: { Accept: 'application/json' },
    });

    if (!tokenRes.ok) {
      return new Response('Authorization failed', { status: 401 });
    }

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      return new Response('Authorization failed - no access token', { status: 401 });
    }

    const isProduction = process.env.NODE_ENV === 'production';
    const maxAge = tokenData.expires_in || 60 * 60 * 24 * 365; // 1 year if no expiry

    const headers = new Headers();
    headers.set('Location', '/keystatic');
    headers.append(
      'Set-Cookie',
      `keystatic-gh-access-token=${tokenData.access_token}; Path=/; SameSite=Lax; Max-Age=${maxAge}${isProduction ? '; Secure' : ''}`
    );

    return new Response(null, { status: 307, headers });
  }

  // Fix the host for all other keystatic API requests
  if (forwardedHost) {
    const originalUrl = new URL(context.request.url);
    const newUrl = `${forwardedProto}://${forwardedHost}${originalUrl.pathname}${originalUrl.search}`;
    const newRequest = new Request(newUrl, context.request);
    return innerHandler({ ...context, request: newRequest });
  }

  return innerHandler(context);
};
