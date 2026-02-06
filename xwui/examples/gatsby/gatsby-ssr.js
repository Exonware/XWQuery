const React = require('react');

exports.onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <link key="xwui-theme" rel="stylesheet" href="/xwui-theme-examples.css" />,
    <link key="xwui-css" rel="stylesheet" href="/xwui/XWUIButton/XWUIButton.css" />,
    <script key="xwui-js" type="module" src="/xwui-button.mjs" />,
  ]);
};
