import { createCookieSessionStorage } from '@remix-run/node';

import { isTheme } from './theme-provider';
import type { Theme } from './theme-provider';

const sessionSecret = process.env.SESSION_SECRET ?? 'DEFAULT_SESSION_SECRET';

const themeStorage = createCookieSessionStorage({
  cookie: {
    name: 'remix-budget-theme',
    secure: true,
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
  },
});

async function getThemeSession(request: Request) {
  const session = await themeStorage.getSession(request.headers.get('Cookie'));
  return {
    getTheme: () => {
      const themeValue = session.get('theme');
      return isTheme(themeValue) ? themeValue : 'null';
    },
    setTheme: (theme: Theme) => session.set('theme', theme),
    commit: () => themeStorage.commitSession(session),
  };
}

export { getThemeSession };
