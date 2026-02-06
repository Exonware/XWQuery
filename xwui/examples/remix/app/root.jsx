import { Links, Meta, Outlet, Scripts } from '@remix-run/react';

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/xwui-theme-examples.css" />
        <link rel="stylesheet" href="/xwui/XWUIButton/XWUIButton.css" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <script type="module" src="/xwui-button.mjs" />
        <Scripts />
      </body>
    </html>
  );
}
