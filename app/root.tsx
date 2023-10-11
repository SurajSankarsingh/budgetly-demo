import type {
  LinksFunction,
  LoaderFunction,
  V2_MetaFunction,
} from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';

import { rootAuthLoader } from '@clerk/remix/ssr.server';
import { ClerkApp, V2_ClerkErrorBoundary } from '@clerk/remix';

import {
  ThemeProvider,
  useTheme,
  ThemeBody,
  ThemeHead,
} from '~/utils/theme-provider';
import { getThemeSession } from '~/utils/theme.server';

import styles from '~/tailwind.css';

import { Provider } from 'jotai';
import { dateAtom } from './lib/store';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }];

export const meta: V2_MetaFunction = () => {
  return [{ title: 'Remix Budget App' }];
};

export const loader: LoaderFunction = (args) => {
  return rootAuthLoader(args, async ({ request }) => {
    const { sessionId, userId, getToken } = request.auth;

    const themeSession = await getThemeSession(request);

    return json({
      theme: themeSession.getTheme(),
    });
  });
};

// export const CatchBoundary = ClerkCatchBoundary();
export const ErrorBoundary = V2_ClerkErrorBoundary();

function App() {
  const data = useLoaderData<typeof loader>();
  const [theme] = useTheme();

  return (
    <html lang='en' className={theme ?? ''}>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />

        <link
          href='https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&family=Raleway:wght@400;500;600&display=swap'
          rel='stylesheet'
        />
        <Meta />
        <Links />
        <ThemeHead ssrTheme={Boolean(data.theme)} />
      </head>
      <body className='font-sans'>
        <Outlet />
        <ThemeBody ssrTheme={Boolean(data.theme)} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

function AppWithProviders() {
  const data = useLoaderData<typeof loader>();

  return (
    <Provider>
      <ThemeProvider specifiedTheme={data.theme}>
        <App />
      </ThemeProvider>
    </Provider>
  );
}

export default ClerkApp(AppWithProviders);
