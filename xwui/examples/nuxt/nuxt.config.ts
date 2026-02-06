export default defineNuxtConfig({
  devServer: { port: 3003 },
  app: {
    head: {
      link: [
      { rel: 'stylesheet', href: '/xwui-theme-examples.css' },
      { rel: 'stylesheet', href: '/xwui/XWUIButton/XWUIButton.css' },
    ],
      script: [{ type: 'module', src: '/xwui-button.mjs' }],
    },
  },
});
