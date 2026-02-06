export default function Index() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      <h1>XWUI + Remix</h1>
      <p>XWUIButton (Custom Element) – Remix.</p>
      <p><a href="/uber/uber.html">Uber-like mobile demo →</a></p>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
        <xwui-button text="Primary" variant="primary" size="medium" />
        <xwui-button text="Success" variant="success" size="medium" />
        <xwui-button text="Secondary" variant="secondary" size="medium" />
      </div>
    </div>
  );
}
