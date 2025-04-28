import * as Sentry from '@sentry/nextjs';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  } else if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
  // Remove the client-side import from here completely
  // Client-side initialization will be handled by Next.js automatically
  // via the instrumentation-client.ts file
}

export const onRequestError = Sentry.captureRequestError;
