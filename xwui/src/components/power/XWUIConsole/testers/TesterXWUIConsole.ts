import { XWUITester } from '../../../component/XWUITester/index.ts';
        import { XWUIComponent } from '../../../component/XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIConsole/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../../';
        
        import { XWUIConsole } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIConsole Component Tester',
            desc: 'This tester demonstrates XWUIConsole component loading JSON data following the XWUIConsole schema. The component accepts an array of console events with id, type, color, label, and msg properties. Configuration system: conf_sys (system/admin), conf_usr (user preferences), and conf_comp (component instance, hardcoded in tester).',
            componentName: 'XWUIConsole'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuiconsole-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
      
      // Verify import worked
      if (!XWUIConsole) {
        console.error('XWUIConsole import failed');
      } else {
        console.log('XWUIConsole imported successfully');
        console.log('XWUIConsole class:', XWUIConsole);
        console.log('Static methods:', {
          loadSystemConfig: typeof XWUIConsole.loadSystemConfig,
          loadUserConfig: typeof XWUIConsole.loadUserConfig
        });
      }
      
      /**
       * Console events JSON data following XWUIConsole schema
       * - id: unique identifier
       * - type: log | info | warn | error | debug | trace | group | groupCollapsed | groupEnd | table | success | system
       * - timestamp: Unix timestamp (milliseconds) or ISO string - REQUIRED
       * - color: CSS color used with console %c styling
       * - label: short label for the badge
       * - msg: human-readable message
       * - source: (optional) Source/operation/module name
       * - level: (optional) Explicit log level (overrides type mapping)
       * - data: (optional) Additional structured data
       */
      // Generate timestamps with slight offsets to show progression
      const baseTime = Date.now() - (30 * 1000); // 30 seconds ago
      const consoleEvents = [
        { id: 1, type: "system", timestamp: baseTime + 0, color: "#888", label: "SYSTEM", msg: "Boot sequence started", source: "xwsystem.boot" },
        { id: 2, type: "log", timestamp: baseTime + 1000, color: "#ffffff", label: "LOG", msg: "App initialized", source: "app.init" },
        { id: 3, type: "info", timestamp: baseTime + 2000, color: "#4aa3ff", label: "INFO", msg: "User profile loaded", source: "auth.profile" },
        { id: 4, type: "warn", timestamp: baseTime + 3000, color: "#ffb020", label: "WARN", msg: "Cache miss on /settings", source: "cache.lru" },
        { id: 5, type: "error", timestamp: baseTime + 4000, color: "#ff4d4f", label: "ERROR", msg: "Failed to fetch /api/orders", source: "api.client" },
        { id: 6, type: "debug", timestamp: baseTime + 5000, color: "#b38cff", label: "DEBUG", msg: "Rendering dashboard widgets", source: "ui.render" },
        { id: 7, type: "success", timestamp: baseTime + 6000, color: "#2ecc71", label: "OK", msg: "Payment authorized", source: "payment.processor" },
        { id: 8, type: "trace", timestamp: baseTime + 7000, color: "#ff85c0", label: "TRACE", msg: "Deep link navigation trace", source: "router.nav" },
        { id: 9, type: "group", timestamp: baseTime + 8000, color: "#ffd666", label: "GROUP", msg: "Analytics batch", source: "analytics.collector" },
        { id: 10, type: "log", timestamp: baseTime + 9000, color: "#ffffff", label: "LOG", msg: "queued: /metrics/pageview", source: "analytics.collector" },
        { id: 11, type: "log", timestamp: baseTime + 10000, color: "#ffffff", label: "LOG", msg: "queued: /metrics/interaction", source: "analytics.collector" },
        { id: 12, type: "groupEnd", timestamp: baseTime + 11000, color: "#ffd666", label: "END", msg: "End analytics batch", source: "analytics.collector" },
        { id: 13, type: "info", timestamp: baseTime + 12000, color: "#4aa3ff", label: "INFO", msg: "WebSocket connected", source: "ws.client" },
        { id: 14, type: "warn", timestamp: baseTime + 13000, color: "#ffb020", label: "WARN", msg: "High CPU usage detected", source: "monitor.performance" },
        { id: 15, type: "error", timestamp: baseTime + 14000, color: "#ff4d4f", label: "ERROR", msg: "Unhandled rejection in worker", source: "worker.main" },
        { id: 16, type: "debug", timestamp: baseTime + 15000, color: "#b38cff", label: "DEBUG", msg: "Feature flag: newNavbar=true", source: "config.flags" },
        { id: 17, type: "table", timestamp: baseTime + 16000, color: "#40a9ff", label: "TABLE", msg: "Render user table", source: "ui.table" },
        { id: 18, type: "log", timestamp: baseTime + 17000, color: "#ffffff", label: "LOG", msg: "User clicked CTA", source: "ui.interaction" },
        { id: 19, type: "success", timestamp: baseTime + 18000, color: "#52c41a", label: "OK", msg: "Email verification sent", source: "email.service" },
        { id: 20, type: "trace", timestamp: baseTime + 19000, color: "#ff85c0", label: "TRACE", msg: "Onboarding step trace", source: "onboarding.flow" },
        { id: 21, type: "log", timestamp: baseTime + 20000, color: "#ffffff", label: "LOG", msg: "Theme switched to dark", source: "ui.theme" },
        { id: 22, type: "info", timestamp: baseTime + 21000, color: "#4aa3ff", label: "INFO", msg: "Locale changed to ar-SA", source: "i18n.locale" },
        { id: 23, type: "warn", timestamp: baseTime + 22000, color: "#ffb020", label: "WARN", msg: "Deprecated API usage detected", source: "api.validator" },
        { id: 24, type: "error", timestamp: baseTime + 23000, color: "#ff4d4f", label: "ERROR", msg: "Rate limit exceeded", source: "api.rateLimiter" },
        { id: 25, type: "debug", timestamp: baseTime + 24000, color: "#b38cff", label: "DEBUG", msg: "Lazy-loaded module: reports", source: "module.loader" },
        { id: 26, type: "success", timestamp: baseTime + 25000, color: "#52c41a", label: "OK", msg: "Background sync completed", source: "sync.background" },
        { id: 27, type: "system", timestamp: baseTime + 26000, color: "#888", label: "SYSTEM", msg: "App going to background", source: "app.lifecycle" },
        { id: 28, type: "system", timestamp: baseTime + 27000, color: "#888", label: "SYSTEM", msg: "App resumed from background", source: "app.lifecycle" },
        { id: 29, type: "info", timestamp: baseTime + 28000, color: "#4aa3ff", label: "INFO", msg: "Session refreshed", source: "auth.session" },
        { id: 30, type: "log", timestamp: baseTime + 29000, color: "#ffffff", label: "LOG", msg: "Shutdown requested", source: "app.lifecycle" }
      ];

      const container = document.getElementById('consoleContainer');
      if (!container) {
        console.error('Console container not found');
      } else if (!XWUIConsole) {
        console.error('XWUIConsole not imported');
      } else if (typeof XWUIConsole.loadSystemConfig !== 'function') {
        console.error('XWUIConsole.loadSystemConfig is not a function. XWUIConsole:', XWUIConsole);
        console.error('Available properties:', Object.getOwnPropertyNames(XWUIConsole));
        console.error('Prototype:', Object.getOwnPropertyNames(XWUIConsole.prototype));
      } else {
        try {
          // Load system and user configs (optional)
          // Path from tester: src/testers/ -> dist/data/ = ../../dist/data/
          const conf_sys = await XWUIConsole.loadSystemConfig('../../dist/data/conf_sys.json');
          const conf_usr = await XWUIConsole.loadUserConfig('../../dist/data/conf_usr.json');
          
          // Component-level configuration (conf_comp) - hardcoded in tester
          const conf_comp = {
            theme: 'light',
            maxEntries: 1000,
            showTimestamp,
            showSource,
            autoScroll,
            formats: {
              datetime: 'YYYY-MM-DD HH:mm:ss.SSS'
            }
          };
          
          console.log('System config:', conf_sys);
          console.log('User config:', conf_usr);
          console.log('Component config:', conf_comp);
          
          const xwConsole = new XWUIConsole(container, conf_comp, conf_sys, conf_usr);

          console.log('XWUIConsole initialized');
          console.log('Schema:', xwConsole.schema);
          console.log('Config:', xwConsole.config);
          
          // New API: Direct data assignment
          xwConsole.data = consoleEvents;
          console.log('Events loaded via data property:', xwConsole.data.length);
          
          // Demonstrate data access
          console.log('First event:', xwConsole.data[0]);
          console.log('Last event:', xwConsole.data[xwConsole.data.length - 1]);
          
          // Demonstrate append
          setTimeout(() => {
            xwConsole.data.append({ 
              id: 31, 
              type: "info", 
              timestamp: Date.now(),
              color: "#4aa3ff", 
              label: "INFO", 
              msg: "New event appended",
              source: "test.append"
            });
            console.log('Event appended, total:', xwConsole.data.length);
          }, 2000);
          
          // Demonstrate index assignment
          setTimeout(() => {
            xwConsole.data[0] = { 
              id: 1, 
              type: "system", 
              timestamp: Date.now() - 60000, // 1 minute ago
              color: "#888", 
              label: "SYSTEM", 
              msg: "First event replaced",
              source: "test.replace"
            };
            console.log('First event replaced');
          }, 4000);
        } catch (error) {
          console.error('Error initializing XWUIConsole:', error);
        }
      }
