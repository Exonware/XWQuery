const _XWUIComponent = class _XWUIComponent {
  constructor(container, data, conf_comp, conf_sys, conf_usr) {
    this.childComponents = /* @__PURE__ */ new Set();
    this.loadedCSSLinks = [];
    this.cookiesEnabled = false;
    this.storageKey = "";
    this.isLoadingFromStorage = false;
    this.container = container;
    this.conf_sys = conf_sys;
    this.conf_usr = conf_usr;
    const componentName = this.constructor.componentName || this.constructor.name;
    this.schema = `./${componentName}.schema.json`;
    const { data: dataWithUID, uid } = _XWUIComponent.ensureUID(data);
    this.data = dataWithUID;
    this.uid = uid;
    this.effectiveConfig = this.mergeConfigs(conf_comp, conf_usr, conf_sys);
    this.config = this.createConfig(conf_comp, conf_usr, conf_sys);
    const confCompCookies = conf_comp?.cookies;
    this.cookiesEnabled = confCompCookies ?? conf_usr?.cookies ?? conf_sys?.cookies ?? false;
    const dataId = this.data?.id;
    if (this.cookiesEnabled && dataId && typeof dataId === "string") {
      this.storageKey = dataId;
    } else {
      this.storageKey = `xwui-${componentName.toLowerCase()}-${this.uid}`;
    }
    if (this.cookiesEnabled) {
      this.loadDataFromCookies();
      this.setupCrossTabSync();
    }
    this.loadComponentCSS();
  }
  /**
   * Generate a unique identifier
   */
  static generateUID() {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }
  /**
   * Ensure data has a uid property (auto-generate if missing)
   */
  static ensureUID(data, existingUID) {
    if (data && typeof data === "object") {
      if (data.uid && typeof data.uid === "string") {
        return { data, uid: data.uid };
      }
      if (existingUID && typeof existingUID === "string") {
        return { data: { ...data, uid: existingUID }, uid: existingUID };
      }
      const uid2 = _XWUIComponent.generateUID();
      return { data: { ...data, uid: uid2 }, uid: uid2 };
    }
    const uid = existingUID || _XWUIComponent.generateUID();
    return { data, uid };
  }
  /**
   * Cookie utility functions (protected so subclasses can use them)
   */
  static setCookie(name, value, days = 365) {
    const expires = /* @__PURE__ */ new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1e3);
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
  }
  static getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }
    return null;
  }
  /**
   * Load data from cookies/localStorage
   * Subclasses can override to load additional state
   */
  loadDataFromCookies() {
    if (!this.cookiesEnabled || !this.storageKey) return;
    this.isLoadingFromStorage = true;
    try {
      let savedData = null;
      try {
        savedData = localStorage.getItem(this.storageKey);
      } catch (e) {
      }
      if (!savedData) {
        savedData = _XWUIComponent.getCookie(this.storageKey);
      }
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          this.data = { ...this.data, ...parsedData };
        } catch (e) {
          console.warn(`Failed to parse saved data for ${this.storageKey}:`, e);
        }
      }
    } finally {
      this.isLoadingFromStorage = false;
    }
  }
  /**
   * Save data to cookies/localStorage
   * Automatically triggers sync events - all components with matching ID will update
   */
  saveDataToCookies() {
    if (!this.cookiesEnabled || !this.storageKey || this.isLoadingFromStorage) return;
    try {
      const dataStr = JSON.stringify(this.data);
      _XWUIComponent.setCookie(this.storageKey, dataStr);
      localStorage.setItem(this.storageKey, dataStr);
      localStorage.setItem(`${this.storageKey}-updated`, Date.now().toString());
      const eventName = `xwui-sync-${this.storageKey}`;
      window.dispatchEvent(new Event(eventName));
    } catch (e) {
      console.warn(`Failed to save data for ${this.storageKey}:`, e);
    }
  }
  /**
   * Get storage key for this component (useful for subclasses)
   */
  getStorageKey() {
    return this.storageKey;
  }
  /**
   * Setup automatic synchronization for components with matching IDs
   * Uses event-based sync (both same-page and cross-tab)
   */
  setupCrossTabSync() {
    if (!this.cookiesEnabled || !this.storageKey) return;
    const storageKey = this.storageKey;
    const component = this;
    const handleUpdate = () => {
      if (component.isLoadingFromStorage) return;
      component.loadDataFromCookies();
      component.onDataReloaded();
    };
    const storageHandler = (event) => {
      if (event.key === `${storageKey}-updated` && event.newValue) {
        handleUpdate();
      }
    };
    window.addEventListener("storage", storageHandler);
    const eventName = `xwui-sync-${storageKey}`;
    const customEventHandler = () => {
      handleUpdate();
    };
    window.addEventListener(eventName, customEventHandler);
    this._storageHandler = storageHandler;
    this._customEventHandler = customEventHandler;
    this._syncEventName = eventName;
  }
  /**
   * Called when data is reloaded from storage (cross-tab sync)
   * Subclasses can override this to react to data changes
   */
  onDataReloaded() {
  }
  /**
   * Update component data and save to cookies if enabled
   * Use this method instead of directly modifying this.data to ensure cookies are saved
   */
  updateData(updates) {
    this.data = { ...this.data, ...updates };
    if (this.cookiesEnabled) {
      this.saveDataToCookies();
    }
  }
  /**
   * Merge configurations with priority: conf_comp > conf_usr > conf_sys
   */
  mergeConfigs(conf_comp, conf_usr, conf_sys) {
    const merged = {
      locale: conf_comp?.locale || conf_usr?.locale || conf_sys?.locale || "en-US",
      timezone: conf_comp?.timezone || conf_usr?.timezone || conf_sys?.timezone || "UTC",
      direction: conf_comp?.direction || conf_usr?.direction || conf_sys?.direction || "ltr",
      formats: {
        date: conf_comp?.formats?.date || conf_usr?.formats?.date || conf_sys?.formats?.date || "YYYY-MM-DD",
        time: conf_comp?.formats?.time || conf_usr?.formats?.time || conf_sys?.formats?.time || "HH:mm:ss",
        datetime: conf_comp?.formats?.datetime || conf_usr?.formats?.datetime || conf_sys?.formats?.datetime || "YYYY-MM-DD HH:mm:ss",
        currency: {
          defaultSymbol: conf_comp?.formats?.currency?.defaultSymbol || conf_usr?.formats?.currency?.defaultSymbol || conf_sys?.formats?.currency?.defaultSymbol || "$",
          defaultDecimals: conf_comp?.formats?.currency?.defaultDecimals ?? conf_usr?.formats?.currency?.defaultDecimals ?? conf_sys?.formats?.currency?.defaultDecimals ?? 2
        },
        number: {
          defaultDecimals: conf_comp?.formats?.number?.defaultDecimals ?? conf_usr?.formats?.number?.defaultDecimals ?? conf_sys?.formats?.number?.defaultDecimals ?? 2,
          useGrouping: conf_comp?.formats?.number?.useGrouping ?? conf_usr?.formats?.number?.useGrouping ?? conf_sys?.formats?.number?.useGrouping ?? true
        },
        percentage: {
          defaultDecimals: conf_comp?.formats?.percentage?.defaultDecimals ?? conf_usr?.formats?.percentage?.defaultDecimals ?? conf_sys?.formats?.percentage?.defaultDecimals ?? 1
        },
        fileSize: {
          defaultUnit: conf_comp?.formats?.fileSize?.defaultUnit || conf_usr?.formats?.fileSize?.defaultUnit || conf_sys?.formats?.fileSize?.defaultUnit || "auto",
          defaultDecimals: conf_comp?.formats?.fileSize?.defaultDecimals ?? conf_usr?.formats?.fileSize?.defaultDecimals ?? conf_sys?.formats?.fileSize?.defaultDecimals ?? 2
        },
        duration: {
          defaultUnit: conf_comp?.formats?.duration?.defaultUnit || conf_usr?.formats?.duration?.defaultUnit || conf_sys?.formats?.duration?.defaultUnit || "auto",
          defaultFormat: conf_comp?.formats?.duration?.defaultFormat || conf_usr?.formats?.duration?.defaultFormat || conf_sys?.formats?.duration?.defaultFormat || "short"
        }
      }
    };
    return merged;
  }
  /**
   * Load system configuration from JSON file
   */
  static async loadSystemConfig(path = "./data/conf_sys.json") {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        return void 0;
      }
      return await response.json();
    } catch {
      return void 0;
    }
  }
  /**
   * Load user configuration from JSON file
   */
  static async loadUserConfig(path = "./data/conf_usr.json") {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        return void 0;
      }
      return await response.json();
    } catch {
      return void 0;
    }
  }
  /**
   * Get effective configuration (merged)
   */
  getEffectiveConfig() {
    return this.effectiveConfig;
  }
  /**
   * Get effective direction
   */
  getDirection() {
    return this.effectiveConfig.direction || "ltr";
  }
  /**
   * Get effective locale
   */
  getLocale() {
    return this.effectiveConfig.locale || "en-US";
  }
  /**
   * Get effective timezone
   */
  getTimezone() {
    return this.effectiveConfig.timezone || "UTC";
  }
  /**
   * Convert PascalCase class name to kebab-case custom element name
   * e.g., "XWUIScriptEditor" -> "xwui-script-editor"
   */
  static toKebabCase(str) {
    return str.replace(/([A-Z])([A-Z])([a-z])/g, "$1-$2$3").replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  }
  /**
   * Detect base path for CSS files
   * Tries to determine the correct path based on current page location
   * Prioritizes current page location over script URLs to work correctly with Vite
   */
  static detectCSSBasePath() {
    if (_XWUIComponent.cssBasePath) {
      return _XWUIComponent.cssBasePath;
    }
    const currentPath = window.location.pathname;
    if (currentPath.includes("/dist/")) {
      const distIndex = currentPath.indexOf("/dist/");
      const pathAfterDist = currentPath.substring(distIndex + "/dist/".length);
      const depth = (pathAfterDist.match(/\//g) || []).length;
      return "../".repeat(depth) + "src/components";
    }
    if (currentPath.includes("/src/")) {
      const lastSlash = currentPath.lastIndexOf("/");
      const currentDir = lastSlash > 0 ? currentPath.substring(0, lastSlash) : currentPath;
      if (currentDir.includes("/src/components/")) {
        const componentsIndex = currentDir.indexOf("/src/components/");
        const pathAfterComponents = currentDir.substring(componentsIndex + "/src/components/".length);
        const depth = pathAfterComponents ? (pathAfterComponents.match(/\//g) || []).length + 1 : 0;
        return "../".repeat(depth);
      } else {
        const srcIndex = currentDir.indexOf("/src/");
        const pathAfterSrc = currentDir.substring(srcIndex + "/src/".length);
        const depth = pathAfterSrc ? (pathAfterSrc.match(/\//g) || []).length + 1 : 0;
        return "../".repeat(depth) + "components";
      }
    }
    const scripts = document.getElementsByTagName("script");
    for (let i = 0; i < scripts.length; i++) {
      const src = scripts[i].src;
      if (!src) continue;
      if (src.includes("@vite") || src.includes("@fs") || src.includes("?html-proxy")) {
        continue;
      }
      try {
        const scriptUrl = new URL(src, window.location.href);
        const scriptPath = scriptUrl.pathname;
        if (scriptPath.includes("/src/components/")) {
          const componentsIndex = scriptPath.indexOf("/src/components/");
          const pathAfterComponents = scriptPath.substring(componentsIndex + "/src/components/".length);
          const lastSlash = pathAfterComponents.lastIndexOf("/");
          const dirPath = lastSlash > 0 ? pathAfterComponents.substring(0, lastSlash) : "";
          const depth = dirPath ? (dirPath.match(/\//g) || []).length + 1 : 0;
          return "../".repeat(depth);
        }
        if (scriptPath.includes("/dist/")) {
          const distIndex = scriptPath.indexOf("/dist/");
          const pathAfterDist = scriptPath.substring(distIndex + "/dist/".length);
          const depth = (pathAfterDist.match(/\//g) || []).length;
          return "../".repeat(depth) + "src/components";
        }
      } catch (e) {
        continue;
      }
    }
    return "../components";
  }
  /**
   * Load component CSS file automatically
   * CSS file is expected to be at: {basePath}/{ComponentName}/{ComponentName}.css
   * e.g., "src/components/XWUIButton/XWUIButton.css"
   */
  loadComponentCSS() {
    const componentName = this.constructor.componentName || this.constructor.name;
    if (!componentName || componentName.length === 0) {
      console.warn("XWUIComponent: Cannot load CSS - component name is empty");
      return;
    }
    if (componentName.length <= 1) {
      console.warn("XWUIComponent: Component name appears to be minified:", componentName);
      console.warn("XWUIComponent: Component class should set static componentName property to survive minification");
      return;
    }
    const cssFileName = `${componentName}.css`;
    const cssId = `xwui-css-${componentName.toLowerCase()}`;
    const existingLinkById = document.getElementById(cssId);
    if (existingLinkById) {
      return;
    }
    const allLinks = document.querySelectorAll('link[rel="stylesheet"]');
    for (let i = 0; i < allLinks.length; i++) {
      const href = allLinks[i].href;
      if (href && href.includes(cssFileName)) {
        return;
      }
    }
    const basePath = _XWUIComponent.detectCSSBasePath();
    const normalizedBasePath = basePath.replace(/\/+$/, "");
    const separator = normalizedBasePath && !normalizedBasePath.endsWith("/") ? "/" : "";
    const cssPath = normalizedBasePath + separator + componentName + "/" + cssFileName;
    let resolvedPath;
    try {
      if (cssPath.startsWith("/")) {
        resolvedPath = new URL(cssPath, window.location.origin).href;
      } else if (cssPath.startsWith("../") || cssPath.startsWith("./")) {
        resolvedPath = new URL(cssPath, window.location.href).href;
      } else {
        resolvedPath = new URL("./" + cssPath, window.location.href).href;
      }
    } catch (e) {
      console.warn(`XWUIComponent: Failed to resolve CSS path for ${componentName}:`, cssPath, e);
      resolvedPath = cssPath;
    }
    if (typeof window !== "undefined" && window.__XWUI_DEBUG__) {
      console.log(`XWUIComponent: Loading CSS for ${componentName}`, {
        basePath,
        normalizedBasePath,
        cssPath,
        resolvedPath,
        currentPage: window.location.pathname
      });
    }
    const link = document.createElement("link");
    link.id = cssId;
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = resolvedPath;
    link.onerror = () => {
      console.warn(`XWUIComponent: Failed to load CSS for ${componentName} from ${resolvedPath}`);
    };
    this.loadedCSSLinks.push(link);
    document.head.appendChild(link);
  }
  /**
   * Unload component CSS files
   * Removes CSS links that were loaded by this component instance
   */
  unloadComponentCSS() {
    this.loadedCSSLinks.forEach((link) => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    });
    this.loadedCSSLinks = [];
  }
  /**
   * Register a child XWUI component for automatic cleanup
   * When this component is destroyed, all registered child components
   * will be automatically destroyed as well.
   * 
   * @param component - The child XWUI component to register
   * 
   * Example:
   * ```typescript
   * const button = new XWUIButton(container, { label: 'Click me' });
   * this.registerChildComponent(button);
   * // Now button will be automatically destroyed when this component is destroyed
   * ```
   */
  registerChildComponent(component) {
    if (component) {
      this.childComponents.add(component);
    }
  }
  /**
   * Unregister a child component from automatic cleanup
   * Use this if you manually destroy a child component before destroying the parent.
   * 
   * @param component - The child component to unregister
   */
  unregisterChildComponent(component) {
    if (component) {
      this.childComponents.delete(component);
    }
  }
  /**
   * Automatically destroy all registered child components
   * This is called automatically by destroy() before component-specific cleanup.
   * Subclasses can also call this manually if needed.
   */
  destroyChildComponents() {
    for (const child of this.childComponents) {
      if (child) {
        try {
          child.destroy();
        } catch (error) {
          console.warn(`Error destroying child component:`, error);
        }
      }
    }
    this.childComponents.clear();
  }
  /**
   * Destroy component and clean up resources
   * 
   * This method MUST be implemented by all subclasses to:
   * - Clean up event listeners
   * - Clear DOM references
   * - Clear timers/intervals
   * - Set references to null
   * 
   * NOTE: Child components registered via registerChildComponent() are
   * automatically destroyed before this method is called. You don't need
   * to manually destroy them unless you want custom cleanup order.
   * 
   * Base implementation automatically destroys all registered child components.
   * Subclasses should override to add component-specific cleanup logic.
   * 
   * Example (using automatic child cleanup):
   * ```typescript
   * constructor(...) {
   *     super(...);
   *     this.button = new XWUIButton(container, { label: 'Click' });
   *     this.registerChildComponent(this.button); // Register for auto-cleanup
   *     this.dialog = new XWUIDialog(container, { title: 'Dialog' });
   *     this.registerChildComponent(this.dialog); // Register for auto-cleanup
   * }
   * 
   * public destroy(): void {
   *     // Child components (button, dialog) are automatically destroyed
   *     // Just clean up other resources:
   *     this.eventListeners.forEach(listener => {
   *         listener.element.removeEventListener(listener.event, listener.handler);
   *     });
   *     this.eventListeners = [];
   *     // Clear references
   *     this.button = null;
   *     this.dialog = null;
   * }
   * ```
   * 
   * Example (manual child cleanup - if you need custom order):
   * ```typescript
   * public destroy(): void {
   *     // Destroy child components manually (in specific order if needed)
   *     if (this.dialog) {
   *         this.dialog.destroy();
   *         this.unregisterChildComponent(this.dialog);
   *     }
   *     if (this.button) {
   *         this.button.destroy();
   *         this.unregisterChildComponent(this.button);
   *     }
   *     // Then call parent to clean up any remaining registered children
   *     super.destroy();
   * }
   * ```
   */
  destroy() {
    this.destroyChildComponents();
    this.unloadComponentCSS();
  }
  /**
   * Register this component as a Custom Element
   * Automatically called when component class is defined
   * Uses the generic createXWUIElement factory
   * 
   * Usage: Components should call this in their class definition:
   * ```typescript
   * export class MyComponent extends XWUIComponent {
   *     // ... class implementation
   * }
   * XWUIComponent.registerCustomElement(MyComponent);
   * ```
   * 
   * Note: For new components, prefer using createXWUIElement() directly in index.ts
   */
  static registerCustomElement(ComponentClass, elementName) {
    const className = ComponentClass.name;
    const kebabName = elementName || this.toKebabCase(className);
    Promise.resolve().then(() => XWUIComponent_element).then(({ createXWUIElement: createXWUIElement2 }) => {
      createXWUIElement2(ComponentClass, kebabName);
    });
  }
};
_XWUIComponent.cssBasePath = null;
let XWUIComponent = _XWUIComponent;
const ICON_SVGS = {
  user: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/></svg>',
  mail: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
  star: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  logout: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
  shield: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  folder: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
  file: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
  settings: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6m9-9h-6m-6 0H3m15.364 6.364L16.95 16.95m-9.9-9.9L7.05 7.05M18.364 5.636l-1.414 1.414M7.05 16.95l-1.414 1.414"/></svg>',
  edit: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  add: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',
  trash: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  archive: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>',
  more: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>',
  search: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>',
  chevronRight: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>',
  default: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>'
};
function getIconSVG(iconName) {
  if (!iconName) return ICON_SVGS.default;
  return ICON_SVGS[iconName.toLowerCase()] || ICON_SVGS.default;
}
function renderContentPart(part, language, canSelectText, partIndex) {
  const textSelectionClass = canSelectText ? "xwui-item-select-text" : "";
  switch (part.type) {
    case "text":
      let value = typeof part.value === "string" ? part.value : JSON.stringify(part.value);
      if (language && language[value]) {
        value = language[value];
      }
      const styleClasses = [
        part.style === "bold" ? "xwui-item-text-bold" : "",
        part.style === "subdued" ? "xwui-item-text-subdued" : "",
        part.style === "timestamp" ? "xwui-item-text-timestamp" : ""
      ].filter(Boolean).join(" ");
      const colorStyle = part.color ? `color: ${part.color};` : "";
      const overflow = part.textOverflow;
      if (overflow && overflow.mode) {
        const uniqueId = `text-overflow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${partIndex || 0}`;
        const maxLines = overflow.maxLines || (overflow.mode === "ellipsis" ? 1 : 3);
        const isExpanded = overflow.expanded === true;
        if (overflow.mode === "ellipsis") {
          return `<span class="xwui-item-text ${textSelectionClass} ${styleClasses} xwui-item-text-ellipsis" style="${colorStyle}; --max-lines: ${maxLines}" dir="auto">${escapeHtml(value)}</span>`;
        } else if (overflow.mode === "expandable") {
          const expandButton = `<button class="xwui-item-text-expand-btn" data-text-id="${uniqueId}" aria-label="${isExpanded ? "Show less" : "Show more"}">${isExpanded ? "−" : "+"}</button>`;
          return `<div class="xwui-item-text-expandable-wrapper" data-text-id="${uniqueId}">
                        <span class="xwui-item-text ${textSelectionClass} ${styleClasses} xwui-item-text-expandable ${isExpanded ? "xwui-item-text-expanded" : ""}" style="${colorStyle}; --max-lines: ${maxLines}" dir="auto">${escapeHtml(value)}</span>
                        ${expandButton}
                    </div>`;
        }
      }
      return `<span class="xwui-item-text ${textSelectionClass} ${styleClasses}" style="${colorStyle}" dir="auto">${escapeHtml(value)}</span>`;
    case "icon":
      const iconSVG = getIconSVG(part.value);
      const iconColor = part.color ? `color: ${part.color};` : "";
      return `<span class="xwui-item-icon" style="${iconColor}">${iconSVG}</span>`;
    case "image":
      const shapeClass = part.shape === "circle" ? "xwui-item-image-circle" : "xwui-item-image-square";
      return `<img src="${escapeHtml(part.value)}" class="xwui-item-image ${shapeClass} ${textSelectionClass}" alt="" />`;
    case "progress_bar":
      const progress = typeof part.value === "number" ? part.value : 0;
      return `<div class="xwui-item-progress-bar"><div class="xwui-item-progress-fill" style="width: ${progress}%"></div></div>`;
    case "user_stack":
      const users = Array.isArray(part.value) ? part.value : [];
      const userAvatars = users.slice(0, 3).map((user, idx) => {
        const src = typeof user === "string" ? user : user.avatar || user;
        return `<img src="${escapeHtml(src)}" class="xwui-item-user-avatar" data-user-index="${idx}" style="z-index: ${10 - idx};" alt="" />`;
      }).join("");
      return `<div class="xwui-item-user-stack">${userAvatars}</div>`;
    default:
      return `<div class="${textSelectionClass}">${escapeHtml(JSON.stringify(part.value))}</div>`;
  }
}
function renderContentBlock(content, language, canSelectText, direction = "ltr") {
  if (!content || content.length === 0) return "";
  const parts = content.map((part, index2) => renderContentPart(part, language, canSelectText, index2)).join("");
  return `<div class="xwui-item-content-block" dir="${direction}">${parts}</div>`;
}
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
function getSizeClasses(size) {
  const sizeMap = {
    xs: "xwui-item-size-xs",
    s: "xwui-item-size-s",
    m: "xwui-item-size-m",
    l: "xwui-item-size-l",
    xl: "xwui-item-size-xl"
  };
  return sizeMap[size || "s"] || sizeMap.s;
}
class XWUIItem extends XWUIComponent {
  /**
   * Creates an XWUIItem instance for a SINGLE item
   * @param container - HTML element to render the item into
   * @param data - Item data configuration
   * @param conf_comp - Component-level configuration
   * @param conf_sys - System-level configuration
   * @param conf_usr - User-level configuration
   */
  constructor(container, data, conf_comp, conf_sys, conf_usr) {
    super(container, data, conf_comp, conf_sys, conf_usr);
    this.itemElement = null;
    if (!this.data.uid) {
      this.data.uid = this.uid;
    }
    this.validateItem(this.data);
    this.render();
  }
  /**
   * Create component-specific config
   */
  createConfig(conf_comp, conf_usr, conf_sys) {
    return {
      visibility: {
        dragHandle: conf_comp?.visibility?.dragHandle ?? "auto",
        expandIcon: conf_comp?.visibility?.expandIcon ?? "auto",
        avatarContent: conf_comp?.visibility?.avatarContent ?? true,
        primaryContent: conf_comp?.visibility?.primaryContent ?? true,
        primaryContent_other: conf_comp?.visibility?.primaryContent_other ?? true,
        secondaryContent: conf_comp?.visibility?.secondaryContent ?? true,
        secondaryContent_other: conf_comp?.visibility?.secondaryContent_other ?? true,
        tertiaryContent: conf_comp?.visibility?.tertiaryContent ?? true,
        tertiaryContent_other: conf_comp?.visibility?.tertiaryContent_other ?? true,
        checkbox: conf_comp?.visibility?.checkbox ?? "auto",
        actions: conf_comp?.visibility?.actions ?? "auto",
        addButton: conf_comp?.visibility?.addButton ?? "auto"
      },
      isCollapsed: conf_comp?.isCollapsed ?? false,
      highlightedItem: conf_comp?.highlightedItem ?? null,
      language: conf_comp?.language,
      onItemClick: conf_comp?.onItemClick,
      onItemRightClick: conf_comp?.onItemRightClick,
      onItemAction: conf_comp?.onItemAction,
      console: conf_comp?.console
    };
  }
  /**
   * Validates that the item follows the schema requirements
   * Ensures required fields are present: uid (auto-generated if missing), id, primaryContent
   */
  validateItem(item) {
    try {
      if (!item.uid || typeof item.uid !== "string") {
        item.uid = this.uid;
      }
      if (!item.id || typeof item.id !== "string") {
        const error = new Error("XWUIItem: item.id is required and must be a string");
        this.logError(error, item);
        throw error;
      }
      if (!item.primaryContent || !Array.isArray(item.primaryContent) || item.primaryContent.length === 0) {
        const error = new Error("XWUIItem: item.primaryContent is required and must be a non-empty array");
        this.logError(error, item);
        throw error;
      }
      item.primaryContent.forEach((part, index2) => {
        if (!part.type || !part.hasOwnProperty("value")) {
          const error = new Error(`XWUIItem: item.primaryContent[${index2}] must have 'type' and 'value' properties`);
          this.logError(error, item, { part, index: index2 });
          throw error;
        }
      });
    } catch (error) {
      throw error;
    }
  }
  /**
   * Logs errors to the console if available
   */
  logError(error, item, context) {
    if (this.config.console && typeof this.config.console.error === "function") {
      const source = `XWUIItem[${item.id || item.uid || "unknown"}]`;
      const message = error.message;
      const stack = error.stack;
      const data = {
        item: {
          uid: item.uid,
          id: item.id,
          item_type: item.item_type,
          item_size: item.item_size
        },
        ...context ? { context } : {}
      };
      this.config.console.error(message, source, data, stack);
    }
  }
  /**
   * Check if a content section should be visible
   */
  shouldShowContent(section, item) {
    const itemVisibility = item.contentVisibility?.[section];
    if (itemVisibility !== void 0) {
      if (itemVisibility === "auto") {
        return !!item[section];
      }
      return itemVisibility;
    }
    const compVisibility = this.config.visibility?.[section];
    if (compVisibility !== void 0) {
      if (typeof compVisibility === "string" && compVisibility === "auto") {
        return !!item[section];
      }
      if (typeof compVisibility === "boolean") {
        return compVisibility;
      }
    }
    return !!item[section];
  }
  /**
   * Check if an action should be visible
   */
  shouldShowAction(action, item) {
    const itemVisibility = item.actionVisibility?.[action];
    if (itemVisibility !== void 0) {
      if (itemVisibility === "auto") {
        switch (action) {
          case "checkbox":
            return item.itemActionsSettings?.canSelect === true;
          case "dragHandle":
            return item.itemActionsSettings?.canDrag === true;
          case "expandIcon":
            return !!item.group_list;
          case "addButton":
            return item.itemActionsSettings?.canAdd === true;
          case "actions":
            return Object.keys(item.itemActionsSettings || {}).some(
              (key) => key.startsWith("can") && !["canClick", "canRightClick", "canSelectText", "canSelect"].includes(key) && item.itemActionsSettings[key]
            );
          default:
            const canKey = `can${action.charAt(0).toUpperCase() + action.slice(1)}`;
            return item.itemActionsSettings?.[canKey] === true;
        }
      }
      return itemVisibility;
    }
    const compVisibility = action === "checkbox" || action === "dragHandle" || action === "expandIcon" || action === "actions" || action === "addButton" ? this.config.visibility?.[action] : void 0;
    if (compVisibility !== void 0) {
      if (compVisibility === "auto") {
        switch (action) {
          case "checkbox":
            return item.itemActionsSettings?.canSelect === true;
          case "dragHandle":
            return item.itemActionsSettings?.canDrag === true;
          case "expandIcon":
            return !!item.group_list;
          case "addButton":
            return item.itemActionsSettings?.canAdd === true;
          case "actions":
            return Object.keys(item.itemActionsSettings || {}).some(
              (key) => key.startsWith("can") && !["canClick", "canRightClick", "canSelectText", "canSelect"].includes(key) && item.itemActionsSettings[key]
            );
          default:
            const canKey = `can${action.charAt(0).toUpperCase() + action.slice(1)}`;
            return item.itemActionsSettings?.[canKey] === true;
        }
      }
      return compVisibility;
    }
    switch (action) {
      case "checkbox":
        return item.itemActionsSettings?.canSelect === true;
      case "dragHandle":
        return item.itemActionsSettings?.canDrag === true;
      case "expandIcon":
        return !!item.group_list;
      case "addButton":
        return item.itemActionsSettings?.canAdd === true;
      case "actions":
        return Object.keys(item.itemActionsSettings || {}).some(
          (key) => key.startsWith("can") && !["canClick", "canRightClick", "canSelectText", "canSelect"].includes(key) && item.itemActionsSettings[key]
        );
      default:
        const canKey = `can${action.charAt(0).toUpperCase() + action.slice(1)}`;
        return item.itemActionsSettings?.[canKey] === true;
    }
  }
  render() {
    const { language, isCollapsed = false, highlightedItem, onItemClick, onItemRightClick, onItemAction } = this.config;
    const item = this.data;
    const direction = this.getDirection();
    this.container.innerHTML = "";
    this.itemElement = document.createElement("div");
    this.itemElement.className = `xwui-item ${getSizeClasses(item.item_size)} ${item.item_type || "row"}`;
    this.itemElement.setAttribute("data-uid", item.uid);
    this.itemElement.setAttribute("data-id", item.id);
    this.itemElement.setAttribute("dir", direction);
    if (item.status) {
      this.itemElement.classList.add(`xwui-item-status-${item.status}`);
    } else if (item.background_color) {
      this.itemElement.style.backgroundColor = item.background_color;
    }
    if (highlightedItem === item.uid) {
      this.itemElement.classList.add("xwui-item-highlighted");
    }
    const canClick = item.itemActionsSettings?.canClick !== false;
    if (canClick) {
      this.itemElement.classList.add("xwui-item-clickable");
      if (onItemClick) {
        this.itemElement.addEventListener("click", (e) => {
          if (item.group_list && onItemAction) {
            onItemAction("toggle_expand", item, e);
          } else {
            onItemClick(item, e);
          }
        });
      }
    }
    if (item.itemActionsSettings?.canRightClick && onItemRightClick) {
      this.itemElement.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        e.stopPropagation();
        onItemRightClick(item, e);
      });
    }
    if (item.item_type === "search") {
      this.renderSearchItem(item, language, direction);
    } else if (isCollapsed) {
      this.renderCollapsedItem(item, language);
    } else {
      this.renderFullItem(item, language, direction);
    }
    this.container.appendChild(this.itemElement);
    this.attachTextExpandHandlers();
  }
  /**
   * Attach event handlers for expandable text overflow buttons
   */
  attachTextExpandHandlers() {
    if (!this.itemElement) return;
    const expandButtons = this.itemElement.querySelectorAll(".xwui-item-text-expand-btn");
    expandButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.stopPropagation();
        const textId = button.getAttribute("data-text-id");
        if (!textId) return;
        const wrapper = this.itemElement?.querySelector(`[data-text-id="${textId}"]`)?.closest(".xwui-item-text-expandable-wrapper");
        if (!wrapper) return;
        const textElement = wrapper.querySelector(".xwui-item-text-expandable");
        if (!textElement) return;
        const isExpanded = textElement.classList.contains("xwui-item-text-expanded");
        if (isExpanded) {
          textElement.classList.remove("xwui-item-text-expanded");
          button.textContent = "+";
          button.setAttribute("aria-label", "Show more");
        } else {
          textElement.classList.add("xwui-item-text-expanded");
          button.textContent = "−";
          button.setAttribute("aria-label", "Show less");
        }
      });
    });
  }
  renderSearchItem(item, language, direction = "ltr") {
    if (!this.itemElement) return;
    const placeholder = item.primaryContent[0]?.value || "Search...";
    const translatedPlaceholder = language && language[placeholder] ? language[placeholder] : placeholder;
    const searchIcon = getIconSVG("search");
    const inputClass = direction === "ltr" ? "xwui-item-search-input-ltr" : "xwui-item-search-input-rtl";
    const iconClass = direction === "ltr" ? "xwui-item-search-icon-ltr" : "xwui-item-search-icon-rtl";
    this.itemElement.innerHTML = `
            <div class="xwui-item-search-container">
                <div class="xwui-item-search-icon ${iconClass}">${searchIcon}</div>
                <input type="text" class="xwui-item-search-input ${inputClass}" placeholder="${escapeHtml(translatedPlaceholder)}" />
            </div>
        `;
  }
  renderCollapsedItem(item, language) {
    if (!this.itemElement) return;
    const canSelectText = item.itemActionsSettings?.canSelectText;
    const avatarContent = this.shouldShowContent("avatarContent", item) ? renderContentBlock(item.avatarContent, language, canSelectText) : "";
    this.itemElement.innerHTML = `
            <div class="xwui-item-collapsed">
                ${avatarContent}
            </div>
        `;
  }
  renderFullItem(item, language, direction = "ltr") {
    if (!this.itemElement) return;
    const canSelectText = item.itemActionsSettings?.canSelectText;
    const size = item.item_size || "s";
    if (size === "xl") {
      this.renderXLargeItem(item, language, canSelectText, direction);
    } else {
      this.renderStandardItem(item, language, canSelectText, direction);
    }
  }
  renderXLargeItem(item, language, canSelectText, direction = "ltr") {
    if (!this.itemElement) return;
    const checkbox = this.shouldShowAction("checkbox", item) && item.itemActionsSettings?.canSelect ? `<input type="checkbox" class="xwui-item-checkbox" ${item.itemStates?.isSelected ? "checked" : ""} readonly />` : "";
    const avatarContent = this.shouldShowContent("avatarContent", item) ? renderContentBlock(item.avatarContent, language, canSelectText, direction) : "";
    const primaryContent = this.shouldShowContent("primaryContent", item) ? renderContentBlock(item.primaryContent, language, canSelectText, direction) : "";
    const primaryContentOther = this.shouldShowContent("primaryContent_other", item) ? renderContentBlock(item.primaryContent_other, language, canSelectText, direction) : "";
    const secondaryContent = this.shouldShowContent("secondaryContent", item) ? renderContentBlock(item.secondaryContent, language, canSelectText, direction) : "";
    const tertiaryContent = this.shouldShowContent("tertiaryContent", item) ? renderContentBlock(item.tertiaryContent, language, canSelectText, direction) : "";
    const tertiaryContentOther = this.shouldShowContent("tertiaryContent_other", item) ? renderContentBlock(item.tertiaryContent_other, language, canSelectText, direction) : "";
    const secondaryContentOther = this.shouldShowContent("secondaryContent_other", item) ? renderContentBlock(item.secondaryContent_other, language, canSelectText, direction) : "";
    const actions = this.shouldShowAction("actions", item) ? this.renderActionButtons(item) : "";
    const xlLayoutDiv = document.createElement("div");
    xlLayoutDiv.className = "xwui-item-xl-layout";
    xlLayoutDiv.setAttribute("dir", direction);
    const avatarWrapper = avatarContent ? document.createElement("div") : null;
    if (avatarWrapper) {
      avatarWrapper.className = "xwui-item-xl-avatar-wrapper";
      avatarWrapper.setAttribute("dir", direction);
      avatarWrapper.innerHTML = avatarContent;
    }
    const xlContentDiv = document.createElement("div");
    xlContentDiv.className = "xwui-item-xl-content";
    xlContentDiv.setAttribute("dir", direction);
    const xlHeaderDiv = document.createElement("div");
    xlHeaderDiv.className = "xwui-item-xl-header";
    xlHeaderDiv.setAttribute("dir", direction);
    const xlHeaderOtherDiv = document.createElement("div");
    xlHeaderOtherDiv.className = "xwui-item-xl-header-other";
    xlHeaderOtherDiv.setAttribute("dir", direction);
    if (direction === "rtl") {
      if (actions) xlHeaderOtherDiv.insertAdjacentHTML("beforeend", actions);
      if (primaryContentOther) xlHeaderOtherDiv.insertAdjacentHTML("beforeend", primaryContentOther);
      xlHeaderDiv.appendChild(xlHeaderOtherDiv);
      if (primaryContent) xlHeaderDiv.insertAdjacentHTML("afterbegin", primaryContent);
    } else {
      if (primaryContent) xlHeaderDiv.insertAdjacentHTML("beforeend", primaryContent);
      if (primaryContentOther) xlHeaderOtherDiv.insertAdjacentHTML("beforeend", primaryContentOther);
      if (actions) xlHeaderOtherDiv.insertAdjacentHTML("beforeend", actions);
      xlHeaderDiv.appendChild(xlHeaderOtherDiv);
    }
    xlContentDiv.appendChild(xlHeaderDiv);
    if (secondaryContent) xlContentDiv.insertAdjacentHTML("beforeend", secondaryContent);
    if (tertiaryContent) xlContentDiv.insertAdjacentHTML("beforeend", tertiaryContent);
    if (tertiaryContentOther) xlContentDiv.insertAdjacentHTML("beforeend", tertiaryContentOther);
    const reactionWrapper = secondaryContentOther ? document.createElement("div") : null;
    if (reactionWrapper) {
      reactionWrapper.className = "xwui-item-xl-reaction-wrapper";
      reactionWrapper.setAttribute("dir", direction);
      reactionWrapper.innerHTML = secondaryContentOther;
    }
    const contentWrapper = document.createElement("div");
    contentWrapper.className = "xwui-item-xl-content-wrapper";
    contentWrapper.setAttribute("dir", direction);
    contentWrapper.appendChild(xlContentDiv);
    if (reactionWrapper) contentWrapper.appendChild(reactionWrapper);
    if (checkbox) xlLayoutDiv.insertAdjacentHTML("beforeend", checkbox);
    if (direction === "rtl") {
      xlLayoutDiv.appendChild(contentWrapper);
      if (avatarWrapper) xlLayoutDiv.appendChild(avatarWrapper);
    } else {
      if (avatarWrapper) xlLayoutDiv.appendChild(avatarWrapper);
      xlLayoutDiv.appendChild(contentWrapper);
    }
    this.itemElement.innerHTML = "";
    this.itemElement.appendChild(xlLayoutDiv);
  }
  renderStandardItem(item, language, canSelectText, direction = "ltr") {
    if (!this.itemElement) return;
    const dragHandle = this.shouldShowAction("dragHandle", item) && item.itemActionsSettings?.canDrag ? '<div class="xwui-item-drag-handle">' + getIconSVG("more") + "</div>" : "";
    const expandIcon = this.shouldShowAction("expandIcon", item) && item.group_list ? `<div class="xwui-item-expand-icon ${item.itemStates?.isExpanded ? "xwui-item-expanded" : ""}">${getIconSVG("chevronRight")}</div>` : "";
    const avatarContent = this.shouldShowContent("avatarContent", item) ? renderContentBlock(item.avatarContent, language, canSelectText, direction) : "";
    const primaryContent = this.shouldShowContent("primaryContent", item) ? renderContentBlock(item.primaryContent, language, canSelectText, direction) : "";
    const addButton = this.shouldShowAction("addButton", item) && item.itemActionsSettings?.canAdd && this.config.onItemAction ? `<button class="xwui-item-add-button" data-action="add_child_item">${getIconSVG("add")}</button>` : "";
    const layoutDiv = document.createElement("div");
    layoutDiv.className = "xwui-item-standard-layout";
    layoutDiv.setAttribute("dir", direction);
    if (direction === "rtl") {
      if (addButton) layoutDiv.insertAdjacentHTML("beforeend", addButton);
      const primaryDiv = document.createElement("div");
      primaryDiv.className = "xwui-item-primary-content";
      primaryDiv.setAttribute("dir", direction);
      primaryDiv.innerHTML = primaryContent;
      layoutDiv.appendChild(primaryDiv);
      if (avatarContent) layoutDiv.insertAdjacentHTML("beforeend", avatarContent);
      if (expandIcon) layoutDiv.insertAdjacentHTML("beforeend", expandIcon);
      if (dragHandle) layoutDiv.insertAdjacentHTML("beforeend", dragHandle);
    } else {
      if (dragHandle) layoutDiv.insertAdjacentHTML("beforeend", dragHandle);
      if (expandIcon) layoutDiv.insertAdjacentHTML("beforeend", expandIcon);
      if (avatarContent) layoutDiv.insertAdjacentHTML("beforeend", avatarContent);
      const primaryDiv = document.createElement("div");
      primaryDiv.className = "xwui-item-primary-content";
      primaryDiv.setAttribute("dir", direction);
      primaryDiv.innerHTML = primaryContent;
      layoutDiv.appendChild(primaryDiv);
      if (addButton) layoutDiv.insertAdjacentHTML("beforeend", addButton);
    }
    this.itemElement.innerHTML = "";
    this.itemElement.appendChild(layoutDiv);
    if (addButton && this.config.onItemAction) {
      const addBtn = this.itemElement.querySelector(".xwui-item-add-button");
      if (addBtn) {
        addBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.config.onItemAction("add_child_item", item, e);
        });
      }
    }
  }
  renderActionButtons(item) {
    if (!item.itemActionsSettings) return "";
    const actions = Object.keys(item.itemActionsSettings).filter((key) => {
      if (!key.startsWith("can")) return false;
      if (["canClick", "canRightClick", "canSelectText", "canSelect"].includes(key)) return false;
      const actionName = key.substring(3).toLowerCase();
      if (!this.shouldShowAction(actionName, item)) return false;
      return item.itemActionsSettings[key];
    }).slice(0, 3);
    if (actions.length === 0) return "";
    const buttons = actions.map((actionKey) => {
      const iconName = actionKey.substring(3).toLowerCase();
      const icon = getIconSVG(iconName);
      return `<button class="xwui-item-action-button" data-action="${actionKey}">${icon}</button>`;
    }).join("");
    const moreButton = Object.keys(item.itemActionsSettings).filter(
      (key) => key.startsWith("can") && !["canClick", "canRightClick", "canSelectText", "canSelect"].includes(key) && item.itemActionsSettings[key]
    ).length > 3 ? `<button class="xwui-item-action-button xwui-item-more-button" data-action="more">${getIconSVG("more")}</button>` : "";
    return `<div class="xwui-item-actions">${buttons}${moreButton}</div>`;
  }
  updateConfig(newConfig) {
    Object.assign(this.config, newConfig);
    this.render();
  }
  /**
   * Update item data and re-render
   */
  updateData(newData) {
    this.data = { ...this.data, ...newData };
    if (!this.data.uid) {
      this.data.uid = this.uid;
    }
    this.validateItem(this.data);
    this.render();
  }
  getElement() {
    return this.itemElement;
  }
  destroy() {
    if (this.itemElement) {
      this.itemElement.remove();
      this.itemElement = null;
    }
  }
}
XWUIItem.componentName = "XWUIItem";
class XWUIButton extends XWUIComponent {
  constructor(container, data = {}, conf_comp = {}, conf_sys, conf_usr) {
    const normalizedData = typeof data === "string" ? { text: data } : data && typeof data === "object" ? data : {};
    super(container, normalizedData, conf_comp, conf_sys, conf_usr);
    this.xwuiItem = null;
    this.buttonElement = null;
    this.clickHandlers = [];
    this.setupDOM();
  }
  /**
   * Create component-specific config
   * Merges conf_comp with defaults
   */
  createConfig(conf_comp, conf_usr, conf_sys) {
    return {
      variant: conf_comp?.variant ?? "primary",
      size: conf_comp?.size ?? "medium",
      disabled: conf_comp?.disabled ?? false,
      loading: conf_comp?.loading ?? false,
      icon: conf_comp?.icon,
      iconPosition: conf_comp?.iconPosition ?? "left",
      fullWidth: conf_comp?.fullWidth ?? false,
      type: conf_comp?.type ?? "button",
      padding: conf_comp?.padding,
      gap: conf_comp?.gap,
      minHeight: conf_comp?.minHeight,
      className: conf_comp?.className,
      border: conf_comp?.border,
      title: conf_comp?.title ?? conf_comp?.tooltip
    };
  }
  /**
   * Get button text from data (supports both 'text' and 'label' properties)
   */
  getButtonText() {
    return this.data.text !== void 0 && this.data.text !== null ? this.data.text : this.data.label !== void 0 && this.data.label !== null ? this.data.label : void 0;
  }
  /**
   * Convert XWUIButtonConfig to ItemConfig for XWUIItem
   */
  createItemConfig() {
    const contentParts = [];
    if (this.config.icon && this.config.iconPosition === "left") {
      const isCustomSVG = this.config.icon.trim().startsWith("<svg");
      if (isCustomSVG) {
        contentParts.push({ type: "text", value: "ICON_PLACEHOLDER_LEFT" });
      } else {
        contentParts.push({ type: "icon", value: this.config.icon });
      }
    }
    const buttonText = this.getButtonText();
    if (buttonText !== void 0) {
      contentParts.push({ type: "text", value: buttonText, style: "bold" });
    }
    if (this.config.icon && this.config.iconPosition === "right") {
      const isCustomSVG = this.config.icon.trim().startsWith("<svg");
      if (isCustomSVG) {
        contentParts.push({ type: "text", value: "ICON_PLACEHOLDER_RIGHT" });
      } else {
        contentParts.push({ type: "icon", value: this.config.icon });
      }
    }
    if (this.config.loading) {
      contentParts.push({ type: "text", value: "⟳" });
    }
    if (contentParts.length === 0) {
      contentParts.push({ type: "text", value: "" });
    }
    const sizeMap = {
      "small": "s",
      "medium": "m",
      "large": "l"
    };
    const variantMap = {
      "primary": "processing",
      // Blue
      "secondary": "pass",
      // No background
      "success": "pass",
      // No background (will use custom color)
      "danger": "error",
      // Red
      "warning": "before_start",
      // Yellow
      "info": "processing",
      // Blue
      "outline": "pass",
      // No background
      "ghost": "pass"
      // No background
    };
    const itemConfig = {
      // uid is optional - will be auto-generated by XWUIComponent if not provided
      id: `xwui-button-${Date.now()}-${Math.random()}`,
      item_type: "row",
      item_size: sizeMap[this.config.size || "medium"] || "m",
      status: variantMap[this.config.variant || "primary"],
      primaryContent: contentParts,
      itemActionsSettings: {
        canClick: !this.config.disabled && !this.config.loading
      },
      itemStates: {
        isSelected: false
      }
    };
    if (this.config.variant === "success") {
      itemConfig.background_color = "#10b981";
    } else if (this.config.variant === "outline") {
      itemConfig.background_color = "transparent";
    } else if (this.config.variant === "ghost") {
      itemConfig.background_color = "transparent";
    }
    return itemConfig;
  }
  /**
   * Format padding value to CSS string
   */
  formatPadding(padding) {
    if (!padding) return void 0;
    if (typeof padding === "string") {
      return padding;
    }
    const top = padding.vertical ?? padding.top ?? "0";
    const right = padding.horizontal ?? padding.right ?? "0";
    const bottom = padding.vertical ?? padding.bottom ?? "0";
    const left = padding.horizontal ?? padding.left ?? "0";
    const formatValue = (val) => {
      if (typeof val === "number") return `${val}px`;
      return val;
    };
    if (formatValue(top) === formatValue(right) && formatValue(right) === formatValue(bottom) && formatValue(bottom) === formatValue(left)) {
      return formatValue(top);
    }
    if (padding.vertical !== void 0 && padding.horizontal !== void 0 && formatValue(padding.vertical) === formatValue(padding.horizontal)) {
      return `${formatValue(padding.vertical)} ${formatValue(padding.horizontal)}`;
    }
    return `${formatValue(top)} ${formatValue(right)} ${formatValue(bottom)} ${formatValue(left)}`;
  }
  /**
   * Format gap value to CSS string
   */
  formatGap(gap) {
    if (gap === void 0) return void 0;
    if (typeof gap === "number") return `${gap}px`;
    return gap;
  }
  /**
   * Format minHeight value to CSS string
   */
  formatMinHeight(minHeight) {
    if (minHeight === void 0) return void 0;
    if (typeof minHeight === "number") return `${minHeight}px`;
    return minHeight;
  }
  /**
   * Setup DOM structure using XWUIItem
   */
  setupDOM() {
    this.container.innerHTML = "";
    this.container.className = "xwui-button-container";
    if (this.config.fullWidth) {
      this.container.style.width = "100%";
    }
    this.itemConfig = this.createItemConfig();
    const itemWrapper = document.createElement("div");
    itemWrapper.className = "xwui-button-item-wrapper";
    this.container.appendChild(itemWrapper);
    this.xwuiItem = new XWUIItem(itemWrapper, this.itemConfig);
    this.registerChildComponent(this.xwuiItem);
    const itemElement = itemWrapper.querySelector(".xwui-item");
    if (itemElement) {
      this.buttonElement = document.createElement("button");
      this.buttonElement.type = this.config.type || "button";
      this.buttonElement.className = "xwui-button";
      this.buttonElement.classList.add(`xwui-button-${this.config.variant || "primary"}`);
      this.buttonElement.classList.add(`xwui-button-${this.config.size || "medium"}`);
      this.buttonElement.disabled = (this.config.disabled || this.config.loading) ?? false;
      const padding = this.formatPadding(this.config.padding);
      if (padding) {
        this.buttonElement.style.padding = padding;
      }
      const gap = this.formatGap(this.config.gap);
      if (gap !== void 0) {
        this.buttonElement.style.gap = gap;
      }
      const minHeight = this.formatMinHeight(this.config.minHeight);
      if (minHeight) {
        this.buttonElement.style.minHeight = minHeight;
      }
      if (this.config.className) {
        this.buttonElement.classList.add(...this.config.className.split(" "));
      }
      if (this.config.border === "none") {
        this.buttonElement.style.border = "none";
      } else if (this.config.border === "transparent") {
        this.buttonElement.style.borderColor = "transparent";
      } else if (this.config.border === "lightest") {
        this.buttonElement.style.borderWidth = "1px";
        this.buttonElement.style.borderStyle = "solid";
        this.buttonElement.style.borderColor = "var(--border-color-lightest, rgba(0, 0, 0, 0.05))";
      }
      if (this.config.fullWidth) {
        this.buttonElement.classList.add("xwui-button-full-width");
        this.buttonElement.style.width = "100%";
      }
      if (this.config.loading) {
        this.buttonElement.classList.add("xwui-button-loading");
      }
      if (this.config.disabled) {
        this.buttonElement.classList.add("xwui-button-disabled");
      }
      let itemHTML = itemElement.innerHTML;
      if (this.config.icon) {
        const isCustomSVG = this.config.icon.trim().startsWith("<svg");
        if (isCustomSVG) {
          const iconHTML = `<span class="xwui-button-icon" style="display: inline-flex; align-items: center; justify-content: center;">${this.config.icon}</span>`;
          itemHTML = itemHTML.replace(/ICON_PLACEHOLDER_LEFT/g, iconHTML);
          itemHTML = itemHTML.replace(/ICON_PLACEHOLDER_RIGHT/g, iconHTML);
        }
      }
      const buttonText = this.getButtonText();
      if (!buttonText || buttonText.trim() === "") {
        itemHTML = itemHTML.replace(/<span[^>]*class="[^"]*xwui-item-text[^"]*"[^>]*>[\s\S]*?<\/span>/gi, "");
        itemHTML = itemHTML.replace(/<span[^>]*class="[^"]*xwui-button-text[^"]*"[^>]*>[\s\S]*?<\/span>/gi, "");
      }
      if (this.buttonElement) {
        this.buttonElement.innerHTML = itemHTML;
        if (itemElement instanceof HTMLElement) {
          this.buttonElement.style.cssText = itemElement.style.cssText;
        }
        const btnEl = this.buttonElement;
        Array.from(itemElement.classList).forEach((cls) => {
          if (cls.startsWith("xwui-item-status-") || cls.startsWith("xwui-item-size-")) {
            btnEl.classList.add(cls);
          }
        });
      }
      if (this.buttonElement) {
        const hasText = this.buttonElement.textContent?.trim();
        const hasIcon = this.config.icon || this.buttonElement.querySelector(".xwui-button-icon, .xwui-item-icon");
        if (!hasText && hasIcon) {
          this.buttonElement.classList.add("xwui-button-icon-only");
          if (!this.buttonElement.getAttribute("aria-label")) {
            const buttonText2 = this.getButtonText();
            const ariaLabel = buttonText2 || this.config.icon?.replace(/<[^>]*>/g, "").trim() || "Button";
            this.buttonElement.setAttribute("aria-label", ariaLabel);
          }
        } else {
          this.buttonElement.classList.remove("xwui-button-icon-only");
        }
      }
      itemWrapper.replaceWith(this.buttonElement);
    } else {
      this.buttonElement = document.createElement("button");
      this.buttonElement.type = this.config.type || "button";
      this.buttonElement.className = this.getButtonClasses();
      this.buttonElement.disabled = (this.config.disabled || this.config.loading) ?? false;
      if (this.config.icon) {
        const iconSpan = document.createElement("span");
        iconSpan.className = "xwui-button-icon";
        iconSpan.innerHTML = this.config.icon;
        this.buttonElement.appendChild(iconSpan);
      }
      const buttonText = this.getButtonText();
      if (buttonText) {
        this.buttonElement.textContent = buttonText;
      }
      if (!this.buttonElement.textContent?.trim() && this.config.icon) {
        this.buttonElement.classList.add("xwui-button-icon-only");
        const ariaLabel = buttonText || "Button";
        this.buttonElement.setAttribute("aria-label", ariaLabel);
      }
      this.container.appendChild(this.buttonElement);
    }
    this.setupTooltip();
  }
  /**
   * Setup tooltip for icon-only buttons
   */
  setupTooltip() {
    if (!this.buttonElement) return;
    const title = this.config.title || this.config.tooltip;
    if (!title) return;
    const hasText = this.buttonElement.textContent?.trim();
    const isIconOnly = !hasText && (this.config.icon || this.buttonElement.querySelector(".xwui-button-icon, .xwui-item-icon, .xwui-icon"));
    if (isIconOnly || !hasText) {
      (async () => {
        try {
          const { XWUITooltip: XWUITooltip2 } = await Promise.resolve().then(() => index);
          const tooltipContainer = document.createElement("div");
          tooltipContainer.style.display = "contents";
          this.container.appendChild(tooltipContainer);
          if (this.buttonElement) {
            const tooltip = new XWUITooltip2(
              tooltipContainer,
              {
                content: title,
                target: this.buttonElement
              },
              {
                placement: "top",
                trigger: "hover",
                delay: 200
              },
              this.conf_sys,
              this.conf_usr
            );
            this.registerChildComponent(tooltip);
          }
        } catch (error) {
          console.warn("Failed to load XWUITooltip, using native title attribute:", error);
          if (this.buttonElement) {
            this.buttonElement.setAttribute("title", title);
          }
        }
      })();
    } else {
      this.buttonElement.setAttribute("title", title);
    }
  }
  /**
   * Get button CSS classes based on config (fallback)
   */
  getButtonClasses() {
    const classes = ["xwui-button"];
    classes.push(`xwui-button-${this.config.variant}`);
    classes.push(`xwui-button-${this.config.size}`);
    if (this.config.fullWidth) {
      classes.push("xwui-button-full-width");
    }
    if (this.config.loading) {
      classes.push("xwui-button-loading");
    }
    if (this.config.disabled) {
      classes.push("xwui-button-disabled");
    }
    return classes.join(" ");
  }
  /**
   * Set button text
   */
  setText(text) {
    this.data.text = text;
    this.itemConfig = this.createItemConfig();
    this.setupDOM();
    this.reattachListeners();
  }
  /**
   * Set button variant
   */
  setVariant(variant) {
    if (!variant) return;
    this.config.variant = variant;
    this.setupDOM();
    this.reattachListeners();
  }
  /**
   * Set button size
   */
  setSize(size) {
    if (!size) return;
    this.config.size = size;
    this.setupDOM();
    this.reattachListeners();
  }
  /**
   * Set disabled state
   */
  setDisabled(disabled) {
    this.config.disabled = disabled;
    if (this.buttonElement) {
      this.buttonElement.disabled = (disabled || this.config.loading) ?? false;
      if (disabled) {
        this.buttonElement.classList.add("xwui-button-disabled");
      } else {
        this.buttonElement.classList.remove("xwui-button-disabled");
      }
    }
    this.itemConfig = this.createItemConfig();
    if (this.xwuiItem) {
      this.xwuiItem.updateData(this.itemConfig);
    }
  }
  /**
   * Set loading state
   */
  setLoading(loading) {
    this.config.loading = loading;
    this.itemConfig = this.createItemConfig();
    if (this.xwuiItem) {
      this.xwuiItem.updateData(this.itemConfig);
      const itemElement = this.container.querySelector(".xwui-item");
      if (itemElement && this.buttonElement) {
        this.buttonElement.innerHTML = itemElement.innerHTML;
      }
    }
    if (this.buttonElement) {
      this.buttonElement.disabled = this.config.disabled || loading;
      if (loading) {
        this.buttonElement.classList.add("xwui-button-loading");
      } else {
        this.buttonElement.classList.remove("xwui-button-loading");
      }
    }
  }
  /**
   * Add click event listener
   */
  onClick(handler) {
    this.clickHandlers.push(handler);
    if (this.buttonElement) {
      this.buttonElement.addEventListener("click", handler);
    }
  }
  /**
   * Remove click event listener
   */
  offClick(handler) {
    this.clickHandlers = this.clickHandlers.filter((h) => h !== handler);
    if (this.buttonElement) {
      this.buttonElement.removeEventListener("click", handler);
    }
  }
  /**
   * Re-attach event listeners after DOM update
   */
  reattachListeners() {
    this.clickHandlers.forEach((handler) => {
      if (this.buttonElement) {
        this.buttonElement.addEventListener("click", handler);
      }
    });
  }
  /**
   * Update button configuration from JSON (ItemConfig)
   * Helper method for backward compatibility
   */
  updateFromItemConfig(itemConfig) {
    this.itemConfig = itemConfig;
    if (itemConfig.primaryContent && itemConfig.primaryContent.length > 0) {
      const textPart = itemConfig.primaryContent.find((part) => part.type === "text");
      this.data.text = textPart ? String(textPart.value) : "";
    }
    const sizeMap = {
      "xs": "small",
      "s": "small",
      "m": "medium",
      "l": "large",
      "xl": "large"
    };
    const variantMap = {
      "before_start": "warning",
      "processing": "primary",
      "error": "danger",
      "pass": "secondary"
    };
    this.config = {
      ...this.config,
      variant: variantMap[itemConfig.status || "pass"] || "primary",
      size: sizeMap[itemConfig.item_size || "m"] || "medium",
      disabled: !itemConfig.itemActionsSettings?.canClick || false
    };
    this.setupDOM();
    this.reattachListeners();
  }
  /**
   * Get the native button element
   */
  getButtonElement() {
    return this.buttonElement;
  }
  destroy() {
    if (this.buttonElement) {
      this.buttonElement.replaceWith(this.buttonElement.cloneNode(true));
    }
    this.xwuiItem = null;
    this.buttonElement = null;
    this.clickHandlers = [];
    super.destroy();
  }
}
XWUIButton.componentName = "XWUIButton";
function normalizeAttributes(element, flatAttrsToConfig = [], flatAttrsToData = []) {
  const confComp = parseJSONAttribute(element.getAttribute("conf-comp") || "{}");
  const data = parseJSONAttribute(element.getAttribute("data") || "{}");
  const confSys = parseJSONAttribute(element.getAttribute("conf-sys") || "{}");
  const confUsr = parseJSONAttribute(element.getAttribute("conf-usr") || "{}");
  const mergedConfComp = { ...confComp };
  flatAttrsToConfig.forEach((attr) => {
    const kebabAttr = attr.replace(/([A-Z])/g, "-$1").toLowerCase();
    const value = element.getAttribute(kebabAttr);
    if (value !== null) {
      try {
        mergedConfComp[attr] = JSON.parse(value);
      } catch {
        mergedConfComp[attr] = value;
      }
    }
  });
  const mergedData = { ...data };
  flatAttrsToData.forEach((attr) => {
    const kebabAttr = attr.replace(/([A-Z])/g, "-$1").toLowerCase();
    const value = element.getAttribute(kebabAttr);
    if (value !== null) {
      try {
        mergedData[attr] = JSON.parse(value);
      } catch {
        mergedData[attr] = value;
      }
    }
  });
  return {
    conf_comp: mergedConfComp,
    data: mergedData,
    conf_sys: Object.keys(confSys).length > 0 ? confSys : void 0,
    conf_usr: Object.keys(confUsr).length > 0 ? confUsr : void 0
  };
}
function parseJSONAttribute(str) {
  try {
    return JSON.parse(str);
  } catch (error) {
    try {
      let fixed = str;
      fixed = fixed.replace(/"([^"\\]|\\.)*"/g, (match) => {
        return match.replace(/(?<!\\)\n/g, "\\n").replace(/(?<!\\)\r/g, "\\r").replace(/(?<!\\)\t/g, "\\t").replace(/(?<!\\)"/g, '\\"');
      });
      return JSON.parse(fixed);
    } catch (secondError) {
      try {
        const manuallyFixed = str.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t");
        return JSON.parse(manuallyFixed);
      } catch (thirdError) {
        return {};
      }
    }
  }
}
function createXWUIElement(ComponentClass, elementName, options) {
  const existingElement = customElements.get(elementName);
  if (existingElement) {
    return existingElement;
  }
  const flatAttrsToConfig = options?.flatAttrsToConfig || [];
  const flatAttrsToData = options?.flatAttrsToData || [];
  class ComponentElement extends HTMLElement {
    connectedCallback() {
      const normalized = normalizeAttributes(this, flatAttrsToConfig, flatAttrsToData);
      this.instance = new ComponentClass(
        this,
        normalized.data,
        normalized.conf_comp,
        normalized.conf_sys,
        normalized.conf_usr
      );
    }
    disconnectedCallback() {
      if (this.instance && typeof this.instance.destroy === "function") {
        this.instance.destroy();
      }
      this.instance = void 0;
    }
    /**
     * Get component instance (for advanced usage)
     */
    getInstance() {
      return this.instance;
    }
    /**
     * Update data - generic update, components can override for specific logic
     */
    setData(data) {
      if (this.instance && this.instance.data) {
        Object.assign(this.instance.data, data);
      }
    }
    /**
     * Update conf_comp - generic update, components can override for specific logic
     */
    setConfComp(confComp) {
      if (this.instance && this.instance.config) {
        Object.assign(this.instance.config, confComp);
      }
    }
  }
  try {
    customElements.define(elementName, ComponentElement);
  } catch (error) {
    const alreadyRegistered = customElements.get(elementName);
    if (alreadyRegistered) {
      return alreadyRegistered;
    }
    console.error(`Failed to register custom element '${elementName}':`, error);
    throw error;
  }
  return ComponentElement;
}
const XWUIComponent_element = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createXWUIElement
}, Symbol.toStringTag, { value: "Module" }));
createXWUIElement(XWUIButton, "xwui-button", {
  flatAttrsToConfig: ["variant", "size", "disabled", "loading", "icon", "iconPosition", "fullWidth", "type"],
  flatAttrsToData: ["text"]
});
XWUIComponent.cssBasePath = "/assets/xwui/";
class XWUITooltip extends XWUIComponent {
  constructor(container, data, conf_comp = {}, conf_sys, conf_usr) {
    super(container, data, conf_comp, conf_sys, conf_usr);
    this.tooltipElement = null;
    this.isVisible = false;
    this.showTimeout = null;
    this.hideTimeout = null;
    this.setupTrigger();
    this.createTooltipElement();
  }
  createConfig(conf_comp, conf_usr, conf_sys) {
    return {
      placement: conf_comp?.placement ?? "top",
      trigger: conf_comp?.trigger ?? "hover",
      delay: conf_comp?.delay ?? 200,
      offset: conf_comp?.offset ?? 8,
      arrow: conf_comp?.arrow ?? true,
      className: conf_comp?.className
    };
  }
  createTooltipElement() {
    this.tooltipElement = document.createElement("div");
    this.tooltipElement.className = "xwui-tooltip";
    this.tooltipElement.classList.add(`xwui-tooltip-${this.config.placement}`);
    if (this.config.arrow) {
      this.tooltipElement.classList.add("xwui-tooltip-arrow");
    }
    if (this.config.className) {
      this.tooltipElement.classList.add(this.config.className);
    }
    this.tooltipElement.setAttribute("role", "tooltip");
    if (typeof this.data.content === "string") {
      this.tooltipElement.textContent = this.data.content;
    } else {
      this.tooltipElement.appendChild(this.data.content);
    }
  }
  setupTrigger() {
    const target = this.data.target || this.container;
    if (this.config.trigger === "hover") {
      target.addEventListener("mouseenter", () => this.scheduleShow());
      target.addEventListener("mouseleave", () => this.scheduleHide());
    } else if (this.config.trigger === "click") {
      target.addEventListener("click", () => this.toggle());
      document.addEventListener("click", (e) => {
        if (this.isVisible && !target.contains(e.target) && !this.tooltipElement?.contains(e.target)) {
          this.hide();
        }
      });
    } else if (this.config.trigger === "focus") {
      target.addEventListener("focus", () => this.show());
      target.addEventListener("blur", () => this.hide());
    }
  }
  scheduleShow() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
    this.showTimeout = setTimeout(() => this.show(), this.config.delay);
  }
  scheduleHide() {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
    this.hideTimeout = setTimeout(() => this.hide(), this.config.delay);
  }
  calculatePosition() {
    const target = this.data.target || this.container;
    const targetRect = target.getBoundingClientRect();
    const tooltipRect = this.tooltipElement.getBoundingClientRect();
    const offset = this.config.offset || 8;
    let top = 0;
    let left = 0;
    switch (this.config.placement) {
      case "top":
        top = targetRect.top - tooltipRect.height - offset;
        left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
        break;
      case "bottom":
        top = targetRect.bottom + offset;
        left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
        break;
      case "left":
        top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
        left = targetRect.left - tooltipRect.width - offset;
        break;
      case "right":
        top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
        left = targetRect.right + offset;
        break;
    }
    top = Math.max(8, Math.min(top, window.innerHeight - tooltipRect.height - 8));
    left = Math.max(8, Math.min(left, window.innerWidth - tooltipRect.width - 8));
    return { top: top + window.scrollY, left: left + window.scrollX };
  }
  show() {
    if (this.isVisible || !this.tooltipElement) return;
    document.body.appendChild(this.tooltipElement);
    this.tooltipElement.style.visibility = "hidden";
    this.tooltipElement.style.display = "block";
    const { top, left } = this.calculatePosition();
    this.tooltipElement.style.top = `${top}px`;
    this.tooltipElement.style.left = `${left}px`;
    this.tooltipElement.style.visibility = "visible";
    requestAnimationFrame(() => {
      this.tooltipElement?.classList.add("xwui-tooltip-visible");
    });
    this.isVisible = true;
  }
  hide() {
    if (!this.isVisible || !this.tooltipElement) return;
    this.tooltipElement.classList.remove("xwui-tooltip-visible");
    setTimeout(() => {
      if (this.tooltipElement && this.tooltipElement.parentNode) {
        this.tooltipElement.parentNode.removeChild(this.tooltipElement);
      }
    }, 150);
    this.isVisible = false;
  }
  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }
  setContent(content) {
    this.data.content = content;
    if (this.tooltipElement) {
      this.tooltipElement.innerHTML = "";
      if (typeof content === "string") {
        this.tooltipElement.textContent = content;
      } else {
        this.tooltipElement.appendChild(content);
      }
    }
  }
  getElement() {
    return this.tooltipElement;
  }
  destroy() {
    if (this.showTimeout) clearTimeout(this.showTimeout);
    if (this.hideTimeout) clearTimeout(this.hideTimeout);
    this.hide();
    this.tooltipElement = null;
  }
}
XWUITooltip.componentName = "XWUITooltip";
createXWUIElement(XWUITooltip, "xwui-tooltip", {
  flatAttrsToConfig: ["placement", "trigger", "delay", "offset", "arrow", "className"],
  flatAttrsToData: ["content"]
});
const index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  XWUITooltip
}, Symbol.toStringTag, { value: "Module" }));
//# sourceMappingURL=xwui-button.js.map
