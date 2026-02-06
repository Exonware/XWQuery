export default function App() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      <h1>XWUI + Solid</h1>
      <p>XWUIButton (Custom Element) below.</p>
      <p><a href="/uber/uber.html">Uber-like mobile demo →</a></p>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
        <xwui-button text="Primary" variant="primary" size="medium" />
        <xwui-button text="Success" variant="success" size="medium" />
        <xwui-button text="Secondary" variant="secondary" size="medium" />
      </div>
    </div>
  );
}
