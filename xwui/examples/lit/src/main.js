import { render } from 'lit';
import { html } from 'lit';
render(
  html`
    <div style="font-family: system-ui, sans-serif; padding: 2rem;">
      <h1>XWUI + Lit</h1>
      <p>XWUIButton (Custom Element) below.</p>
      <p><a href="/uber/uber.html">Uber-like mobile demo →</a></p>
      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 1rem;">
        <xwui-button text="Primary" variant="primary" size="medium"></xwui-button>
        <xwui-button text="Success" variant="success" size="medium"></xwui-button>
        <xwui-button text="Secondary" variant="secondary" size="medium"></xwui-button>
      </div>
    </div>
  `,
  document.getElementById('app')
);
