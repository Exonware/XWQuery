<div class="app">
  <h1>XWUI + Svelte</h1>
  <p>XWUIButton (Custom Element) below.</p>
  <p><a href="/uber/uber.html">Uber-like mobile demo →</a></p>
  <div class="buttons">
    <xwui-button text="Primary" variant="primary" size="medium"></xwui-button>
    <xwui-button text="Success" variant="success" size="medium"></xwui-button>
    <xwui-button text="Secondary" variant="secondary" size="medium"></xwui-button>
  </div>
</div>

<style>
  .app { font-family: system-ui, sans-serif; padding: 2rem; }
  .buttons { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 1rem; }
  :global(xwui-button) { display: inline-block; }
</style>
