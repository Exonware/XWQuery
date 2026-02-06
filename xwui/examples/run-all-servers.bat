@echo off
setlocal
set "ROOT=%~dp0.."
set "EX=%ROOT%\examples"
cd /d "%ROOT%"

echo.
echo ========================================
echo  XWUI Examples - Starting all servers
echo ========================================
echo.
echo Sync assets first (if not done): node examples/sync-common.js
echo.

:: ----- HTML-only (npx serve) -----
start "Vanilla"     cmd /k "cd /d %EX%\vanilla     && npx -y serve -l 3000"
start "Alpine"      cmd /k "cd /d %EX%\alpine      && npx -y serve -l 3001"
start "htmx"        cmd /k "cd /d %EX%\htmx        && npx -y serve -l 3010"
start "Stimulus"    cmd /k "cd /d %EX%\stimulus    && npx -y serve -l 3011"
start "Petite-Vue"  cmd /k "cd /d %EX%\petite-vue  && npx -y serve -l 3012"
start "jQuery"      cmd /k "cd /d %EX%\jquery      && npx -y serve -l 3013"
start "Backbone"    cmd /k "cd /d %EX%\backbone    && npx -y serve -l 3014"
start "Riot"        cmd /k "cd /d %EX%\riot        && npx -y serve -l 3015"
start "Marko"       cmd /k "cd /d %EX%\marko       && npx -y serve -l 3016"
start "Knockout"    cmd /k "cd /d %EX%\knockout    && npx -y serve -l 3017"
start "Hyperapp"    cmd /k "cd /d %EX%\hyperapp    && npx -y serve -l 3018"
start "Dojo"        cmd /k "cd /d %EX%\dojo        && npx -y serve -l 3019"
start "Ember"       cmd /k "cd /d %EX%\ember       && npx -y serve -l 3020"
start "Aurelia"     cmd /k "cd /d %EX%\aurelia     && npx -y serve -l 3021"
start "Fresh"       cmd /k "cd /d %EX%\fresh       && npx -y serve -l 3022"
start "Stencil"     cmd /k "cd /d %EX%\stencil     && npx -y serve -l 3023"

:: ----- Vite (fixed port) -----
start "React"       cmd /k "cd /d %EX%\react       && npx vite --port 5173"
start "Vue"         cmd /k "cd /d %EX%\vue         && npx vite --port 5174"
start "Svelte"      cmd /k "cd /d %EX%\svelte      && npx vite --port 5175"
start "Solid"       cmd /k "cd /d %EX%\solid       && npx vite --port 5176"
start "Qwik"        cmd /k "cd /d %EX%\qwik        && npx vite --port 5177"
start "Preact"      cmd /k "cd /d %EX%\preact      && npx vite --port 5178"
start "Lit"         cmd /k "cd /d %EX%\lit         && npx vite --port 5179"
start "Astro"       cmd /k "cd /d %EX%\astro       && npx astro dev --port 5180"
start "Mithril"     cmd /k "cd /d %EX%\mithril     && npx vite --port 5181"

:: ----- Meta / other -----
start "Next"        cmd /k "cd /d %EX%\next        && npx next dev --port 3002"
start "Nuxt"        cmd /k "cd /d %EX%\nuxt        && npx nuxi dev -p 3003"
start "SvelteKit"   cmd /k "cd /d %EX%\sveltekit   && npm run dev -- --port 5182"
start "Remix"       cmd /k "cd /d %EX%\remix       && npm run dev -- --port 5183"
start "Gatsby"      cmd /k "cd /d %EX%\gatsby      && npx gatsby develop --port 8000"
start "Eleventy"    cmd /k "cd /d %EX%\eleventy    && npx eleventy --serve --port 8080"
start "Angular"     cmd /k "cd /d %EX%\angular-xwui && npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo  Clickable links (open in browser)
echo ========================================
echo.
echo  Button demo (index):
echo  http://localhost:3000     - Vanilla
echo  http://localhost:3001     - Alpine
echo  http://localhost:3010     - htmx
echo  http://localhost:3011     - Stimulus
echo  http://localhost:3012     - Petite-Vue
echo  http://localhost:3013     - jQuery
echo  http://localhost:3014     - Backbone
echo  http://localhost:3015     - Riot
echo  http://localhost:3016     - Marko
echo  http://localhost:3017     - Knockout
echo  http://localhost:3018     - Hyperapp
echo  http://localhost:3019     - Dojo
echo  http://localhost:3020     - Ember
echo  http://localhost:3021     - Aurelia
echo  http://localhost:3022     - Fresh
echo  http://localhost:3023     - Stencil
echo  http://localhost:5173     - React
echo  http://localhost:5174     - Vue
echo  http://localhost:5175     - Svelte
echo  http://localhost:5176     - Solid
echo  http://localhost:5177     - Qwik
echo  http://localhost:5178     - Preact
echo  http://localhost:5179     - Lit
echo  http://localhost:5180     - Astro
echo  http://localhost:5181     - Mithril
echo  http://localhost:3002     - Next
echo  http://localhost:3003     - Nuxt
echo  http://localhost:5182     - SvelteKit
echo  http://localhost:5183     - Remix
echo  http://localhost:8000     - Gatsby
echo  http://localhost:8080     - Eleventy
echo  http://localhost:4201     - Angular
echo.
echo  Uber-like page: add /uber/uber.html to any base URL above
echo  e.g. http://localhost:3000/uber/uber.html
echo.
echo ========================================
echo  All server windows opened. Close each window to stop that server.
echo ========================================
if not defined NO_PAUSE pause
