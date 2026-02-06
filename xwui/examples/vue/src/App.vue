<template>
  <div class="app">
    <h1>XWUI + Vue</h1>
    <p>XWUIButton (Custom Element) below.</p>
    <p><a href="/uber/uber.html">Uber-like mobile demo →</a></p>
    <div class="buttons">
      <xwui-button text="Primary" variant="primary" size="medium" />
      <xwui-button text="Success" variant="success" size="medium" />
      <xwui-button text="Secondary" variant="secondary" size="medium" />
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.app { font-family: system-ui, sans-serif; padding: 2rem; }
.buttons { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 1rem; }
xwui-button { display: inline-block; }
</style>
