export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/xwui-theme-examples.css" />
        <link rel="stylesheet" href="/xwui/XWUIButton/XWUIButton.css" />
      </head>
      <body>
        {children}
        <script type="module" src="/xwui-button.mjs" />
      </body>
    </html>
  );
}
