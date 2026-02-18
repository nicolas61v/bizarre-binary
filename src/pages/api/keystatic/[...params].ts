import { makeHandler } from '@keystatic/astro/api';
import keystaticConfig from '../../../../keystatic.config';

export const prerender = false;

const handler = makeHandler({
  config: keystaticConfig,
});

export const ALL: typeof handler = async (context) => {
  const forwardedHost = context.request.headers.get('x-forwarded-host');
  const forwardedProto = context.request.headers.get('x-forwarded-proto') || 'https';

  if (forwardedHost) {
    const originalUrl = new URL(context.request.url);
    const newUrl = `${forwardedProto}://${forwardedHost}${originalUrl.pathname}${originalUrl.search}`;
    const newRequest = new Request(newUrl, context.request);
    return handler({ ...context, request: newRequest });
  }

  return handler(context);
};
