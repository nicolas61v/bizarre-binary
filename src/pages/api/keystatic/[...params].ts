import { makeHandler } from '@keystatic/astro/api';
import keystaticConfig from '../../../../keystatic.config';

export const prerender = false;

const handler = makeHandler({
  config: keystaticConfig,
  clientId: process.env.KEYSTATIC_GITHUB_CLIENT_ID,
  clientSecret: process.env.KEYSTATIC_GITHUB_CLIENT_SECRET,
  secret: process.env.KEYSTATIC_SECRET,
});

export const ALL: typeof handler = async (context) => {
  const forwardedHost = context.request.headers.get('x-forwarded-host');
  const forwardedProto = context.request.headers.get('x-forwarded-proto') || 'https';
  const url = new URL(context.request.url);

  // Debug: log env vars presence and request info
  if (url.pathname.includes('oauth/callback')) {
    console.log('=== KEYSTATIC DEBUG ===');
    console.log('CLIENT_ID exists:', !!process.env.KEYSTATIC_GITHUB_CLIENT_ID);
    console.log('CLIENT_SECRET exists:', !!process.env.KEYSTATIC_GITHUB_CLIENT_SECRET);
    console.log('SECRET exists:', !!process.env.KEYSTATIC_SECRET);
    console.log('CLIENT_ID value:', process.env.KEYSTATIC_GITHUB_CLIENT_ID);
    console.log('Original URL:', context.request.url);
    console.log('Forwarded host:', forwardedHost);

    // Try the token exchange manually to see the actual error
    const code = url.searchParams.get('code');
    const tokenUrl = new URL('https://github.com/login/oauth/access_token');
    tokenUrl.searchParams.set('client_id', process.env.KEYSTATIC_GITHUB_CLIENT_ID || '');
    tokenUrl.searchParams.set('client_secret', process.env.KEYSTATIC_GITHUB_CLIENT_SECRET || '');
    tokenUrl.searchParams.set('code', code || '');
    const testRes = await fetch(tokenUrl, {
      method: 'POST',
      headers: { Accept: 'application/json' },
    });
    const testData = await testRes.json();
    console.log('GitHub token response status:', testRes.status);
    console.log('GitHub token response:', JSON.stringify(testData));
    console.log('=== END DEBUG ===');
  }

  if (forwardedHost) {
    const originalUrl = new URL(context.request.url);
    const newUrl = `${forwardedProto}://${forwardedHost}${originalUrl.pathname}${originalUrl.search}`;
    const newRequest = new Request(newUrl, context.request);
    return handler({ ...context, request: newRequest });
  }

  return handler(context);
};
