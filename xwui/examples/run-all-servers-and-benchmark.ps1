# 1) End all node processes to free ports
# 2) Start all example servers in new windows
# 3) Wait for servers to be ready
# 4) Run benchmark
# Run from repo root: .\examples\run-all-servers-and-benchmark.ps1

$ErrorActionPreference = "Continue"
$EX = $PSScriptRoot

Write-Host "========================================"
Write-Host " 1) Ending all node processes..."
Write-Host "========================================"
taskkill /F /IM node.exe 2>$null
Start-Sleep -Seconds 2
Write-Host "Done."
Write-Host ""

Write-Host "========================================"
Write-Host " 2) Starting all servers (31 windows)..."
Write-Host "========================================"
$servers = @(
  @("Vanilla",     "$EX\vanilla",      "npx -y serve -l 3000"),
  @("Alpine",      "$EX\alpine",       "npx -y serve -l 3001"),
  @("htmx",        "$EX\htmx",         "npx -y serve -l 3010"),
  @("Stimulus",    "$EX\stimulus",     "npx -y serve -l 3011"),
  @("Petite-Vue",  "$EX\petite-vue",   "npx -y serve -l 3012"),
  @("jQuery",      "$EX\jquery",       "npx -y serve -l 3013"),
  @("Backbone",    "$EX\backbone",     "npx -y serve -l 3014"),
  @("Riot",        "$EX\riot",         "npx -y serve -l 3015"),
  @("Marko",       "$EX\marko",        "npx -y serve -l 3016"),
  @("Knockout",    "$EX\knockout",     "npx -y serve -l 3017"),
  @("Hyperapp",    "$EX\hyperapp",     "npx -y serve -l 3018"),
  @("Dojo",        "$EX\dojo",         "npx -y serve -l 3019"),
  @("Ember",       "$EX\ember",        "npx -y serve -l 3020"),
  @("Aurelia",     "$EX\aurelia",      "npx -y serve -l 3021"),
  @("Fresh",       "$EX\fresh",        "npx -y serve -l 3022"),
  @("Stencil",     "$EX\stencil",       "npx -y serve -l 3023"),
  @("Next",        "$EX\next",         "npx next dev --port 3002"),
  @("Nuxt",        "$EX\nuxt",         "npx nuxi dev -p 3003"),
  @("React",       "$EX\react",       "npx vite --port 5173"),
  @("Vue",         "$EX\vue",          "npx vite --port 5174"),
  @("Svelte",      "$EX\svelte",       "npx vite --port 5175"),
  @("Solid",       "$EX\solid",        "npx vite --port 5176"),
  @("Qwik",        "$EX\qwik",         "npx vite --port 5177"),
  @("Preact",      "$EX\preact",       "npx vite --port 5178"),
  @("Lit",         "$EX\lit",           "npx vite --port 5179"),
  @("Astro",       "$EX\astro",        "npx astro dev --port 5180"),
  @("Mithril",     "$EX\mithril",      "npx vite --port 5181"),
  @("SvelteKit",   "$EX\sveltekit",    "npm run dev -- --port 5182"),
  @("Remix",       "$EX\remix",        "npm run dev -- --port 5183"),
  @("Gatsby",      "$EX\gatsby",       "npx gatsby develop --port 8000"),
  @("Eleventy",    "$EX\eleventy",     "npx eleventy --serve --port 8080"),
  @("Angular",     "$EX\angular-xwui", "npm run dev")
)
foreach ($s in $servers) {
  Start-Process -FilePath "cmd.exe" -ArgumentList "/k", "cd /d `"$($s[1])`" && $($s[2])" -WindowStyle Minimized
}
Write-Host "All server windows started."
Write-Host ""

Write-Host "========================================"
Write-Host " 3) Waiting 120s for servers (incl. Vite) to be ready..."
Write-Host "========================================"
Start-Sleep -Seconds 120
Write-Host "Done."
Write-Host ""

Write-Host "========================================"
Write-Host " 4) Running benchmark..."
Write-Host "========================================"
Set-Location $EX
node benchmark-load.js
Write-Host ""
Write-Host "Benchmark complete. See BENCHMARK-LOAD.md"
