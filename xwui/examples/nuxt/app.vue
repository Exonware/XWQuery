<template>
  <div style="font-family: system-ui, sans-serif; padding: 2rem">
    <h1>XWUI + Nuxt</h1>
    <p>XWUIButton (Custom Element) – Nuxt 3.</p>
    <p><a href="/uber/uber.html">Uber-like mobile demo →</a></p>
    <div class="buttons">
      <xwui-button text="Primary" variant="primary" size="medium" />
      <xwui-button text="Success" variant="success" size="medium" />
      <xwui-button text="Secondary" variant="secondary" size="medium" />
    </div>
  </div>
</template>

<style scoped>
.buttons {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}
</style>
