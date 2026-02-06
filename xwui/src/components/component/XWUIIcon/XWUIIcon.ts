/**
 * XWUIIcon Component
 * Dynamic icon component that can use icons from multiple icon libraries
 * Uses the master icon mapping to resolve icons across different libraries
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import {
  type IconLibrary,
  getIconNameForLibrary,
  getIconPath,
  resolveIconPath,
  iconExists,
} from '../../../styles/theme/icons/icon-mapping';

export interface XWUIIconConfig {
  library?: IconLibrary;
  variant?: 'outline' | 'solid' | 'filled' | 'none';
  size?: number | string;
  color?: string;
  className?: string;
  fallbackLibrary?: IconLibrary; // Fallback library if icon not found in primary library
  shape?: 'square' | 'circle' | 'rounded' | 'none'; // Icon shape/style wrapper
  fill?: 'none' | 'currentColor' | string; // SVG fill control - 'none' for zero fill
  stroke?: 'none' | 'currentColor' | string; // SVG stroke control
}

export interface XWUIIconData {
  name: string; // Master icon name from CSV
}

export class XWUIIcon extends XWUIComponent<XWUIIconData, XWUIIconConfig> {
  private iconElement: HTMLElement | null = null;
  private svgContent: string | null = null;
  private isLoading = false;

  constructor(
    container: HTMLElement,
    data: XWUIIconData | string = { name: '' },
    conf_comp: XWUIIconConfig = {},
    conf_sys?: XWUISystemConfig,
    conf_usr?: XWUIUserConfig
  ) {
    // Handle string shorthand: convert "icon-name" to { name: "icon-name" }
    const normalizedData: XWUIIconData = typeof data === 'string'
      ? { name: data }
      : (data && typeof data === 'object' ? data : { name: '' });

    super(container, normalizedData, conf_comp, conf_sys, conf_usr);

    this.setupDOM();
    this.loadIcon();
  }

  /**
   * Create component-specific config
   * Reads icon styles from conf_sys (XWUIStyle configuration)
   */
  protected createConfig(
    conf_comp?: XWUIIconConfig,
    conf_usr?: XWUIUserConfig,
    conf_sys?: XWUISystemConfig
  ): XWUIIconConfig {
    // Get icon library from system config (data-icons attribute)
    const sysIconLibrary = this.getIconLibraryFromSystemConfig(conf_sys);
    
    // Get icon variant/style from system config
    const sysIconVariant = this.getIconVariantFromSystemConfig(conf_sys);
    
    // Get icon color from system config (data-icons-colors attribute)
    const sysIconColor = this.getIconColorFromSystemConfig(conf_sys);

    return {
      library: conf_comp?.library ?? sysIconLibrary ?? 'auto',
      variant: conf_comp?.variant ?? sysIconVariant ?? 'none',
      size: conf_comp?.size ?? 32,
      color: conf_comp?.color ?? sysIconColor,
      className: conf_comp?.className,
      fallbackLibrary: conf_comp?.fallbackLibrary,
      shape: conf_comp?.shape,
      fill: conf_comp?.fill,
      stroke: conf_comp?.stroke,
    };
  }

  /**
   * Get icon library from system config (reads data-icons attribute)
   */
  private getIconLibraryFromSystemConfig(conf_sys?: XWUISystemConfig): IconLibrary | undefined {
    if (!conf_sys) return undefined;
    
    // Check if system config has theme configuration
    const theme = (conf_sys as any)?.theme;
    if (theme?.icons) {
      // Map icon library names to IconLibrary type
      const iconLib = String(theme.icons).toLowerCase();
      if (['ant-design', 'bootstrap', 'feather', 'heroicons', 'primeicons', 'radix', 'tabler'].includes(iconLib)) {
        return iconLib as IconLibrary;
      }
    }
    
    // Fallback: try to read from document attribute
    const dataIcons = document.documentElement.getAttribute('data-icons');
    if (dataIcons && ['ant-design', 'bootstrap', 'feather', 'heroicons', 'primeicons', 'radix', 'tabler'].includes(dataIcons)) {
      return dataIcons as IconLibrary;
    }
    
    return undefined;
  }

  /**
   * Get icon variant from system config
   */
  private getIconVariantFromSystemConfig(conf_sys?: XWUISystemConfig): 'outline' | 'solid' | 'filled' | 'none' | undefined {
    if (!conf_sys) return undefined;
    
    const theme = (conf_sys as any)?.theme;
    // Icon variant might be determined by the icon library's default style
    // For now, return undefined to use component default
    return undefined;
  }

  /**
   * Get icon color from system config (reads data-icons-colors attribute)
   */
  private getIconColorFromSystemConfig(conf_sys?: XWUISystemConfig): string | undefined {
    if (!conf_sys) return undefined;
    
    const theme = (conf_sys as any)?.theme;
    if (theme?.icons_colors) {
      return String(theme.icons_colors);
    }
    
    // Fallback: try to read from document attribute
    const dataIconColors = document.documentElement.getAttribute('data-icons-colors');
    if (dataIconColors) {
      return dataIconColors;
    }
    
    return undefined;
  }

  /**
   * Setup DOM structure with shape support
   */
  private setupDOM(): void {
    this.container.innerHTML = '';
    this.container.className = 'xwui-icon';
    
    if (this.config.className) {
      this.container.classList.add(...this.config.className.split(' '));
    }

    // Apply size
    const size = typeof this.config.size === 'number' 
      ? `${this.config.size}px` 
      : (this.config.size || '24px');
    
    this.container.style.width = size;
    this.container.style.height = size;
    this.container.style.display = 'inline-flex';
    this.container.style.alignItems = 'center';
    this.container.style.justifyContent = 'center';
    this.container.style.flexShrink = '0';

    // Apply shape styling
    if (this.config.shape && this.config.shape !== 'none') {
      this.container.classList.add(`xwui-icon-shape-${this.config.shape}`);
      
      switch (this.config.shape) {
        case 'circle':
          this.container.style.borderRadius = '50%';
          break;
        case 'rounded':
          this.container.style.borderRadius = '4px';
          break;
        case 'square':
          this.container.style.borderRadius = '0';
          break;
      }
    }

    // Apply color if specified - set on container so SVG inherits via currentColor
    if (this.config.color) {
      this.container.style.color = this.config.color;
    }

    // Create placeholder for icon
    this.iconElement = document.createElement('div');
    this.iconElement.className = 'xwui-icon-content';
    this.iconElement.style.width = '100%';
    this.iconElement.style.height = '100%';
    this.iconElement.style.display = 'flex';
    this.iconElement.style.alignItems = 'center';
    this.iconElement.style.justifyContent = 'center';
    this.container.appendChild(this.iconElement);
  }

  /**
   * Load icon from library with improved fallback logic
   * Tries all libraries if not found in primary library
   */
  private async loadIcon(): Promise<void> {
    if (!this.data.name) {
      this.renderEmpty();
      return;
    }

    if (this.isLoading) return;
    this.isLoading = true;

    try {
      const primaryLibrary = this.config.library || 'auto';
      let iconName: string | null = null;
      let library: IconLibrary = primaryLibrary;

      // Try primary library first
      if (primaryLibrary !== 'auto') {
        iconName = await getIconNameForLibrary(this.data.name, primaryLibrary);
      }

      // If not found and library is 'auto', or if primary library didn't have it, try all libraries
      if (!iconName) {
        const allLibraries: IconLibrary[] = [
          'bootstrap',
          'heroicons',
          'feather',
          'radix',
          'primeicons',
          'ant-design',
          'tabler'
        ];
        
        // If we have a fallback library preference, try it first
        if (this.config.fallbackLibrary && this.config.fallbackLibrary !== 'auto') {
          const fallbackIndex = allLibraries.indexOf(this.config.fallbackLibrary);
          if (fallbackIndex > -1) {
            // Move fallback library to front
            allLibraries.splice(fallbackIndex, 1);
            allLibraries.unshift(this.config.fallbackLibrary);
          }
        }
        
        // Try each library until we find the icon
        for (const lib of allLibraries) {
          iconName = await getIconNameForLibrary(this.data.name, lib);
          if (iconName) {
            library = lib;
            break;
          }
        }
      }

      if (!iconName) {
        console.warn(`Icon "${this.data.name}" not found in any library`);
        this.renderEmpty();
        return;
      }

      // Get icon path and resolve it
      // If variant is 'none', pass undefined to use default path
      const variantForPath = this.config.variant === 'none' ? undefined : this.config.variant;
      const relativePath = getIconPath(library, iconName, variantForPath);
      const iconPath = resolveIconPath(relativePath);

      // Load SVG
      await this.loadSVG(iconPath);
    } catch (error) {
      console.error('Error loading icon:', error);
      this.renderEmpty();
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Load SVG from path
   */
  private async loadSVG(path: string): Promise<void> {
    try {
      // Handle different path formats
      let fullPath: string;
      
      if (path.startsWith('http://') || path.startsWith('https://')) {
        fullPath = path;
      } else if (path.startsWith('/')) {
        fullPath = `${window.location.origin}${path}`;
      } else if (path.startsWith('./') || path.startsWith('../')) {
        // Relative path - try to resolve from current page location
        const baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
        fullPath = new URL(path, baseUrl).href;
      } else {
        // Assume relative to root
        fullPath = `${window.location.origin}/${path}`;
      }

      const response = await fetch(fullPath);
      if (!response.ok) {
        throw new Error(`Failed to load icon: ${response.statusText}`);
      }

      const svgText = await response.text();
      this.svgContent = svgText;

      // Parse and inject SVG
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
      const svgElement = svgDoc.querySelector('svg');

      if (!svgElement) {
        throw new Error('Invalid SVG content');
      }

      // Apply size
      if (this.config.size) {
        const size = typeof this.config.size === 'number' 
          ? `${this.config.size}px` 
          : (this.config.size || '24px');
        svgElement.setAttribute('width', size);
        svgElement.setAttribute('height', size);
      }

      // Apply color using helper method
      this.applyColorToSVG(svgElement);

      // Remove any existing content and inject SVG
      if (this.iconElement) {
        this.iconElement.innerHTML = '';
        this.iconElement.appendChild(svgElement);
      }
    } catch (error) {
      console.error('Error loading SVG:', error);
      this.renderEmpty();
    }
  }

  /**
   * Render empty state
   */
  private renderEmpty(): void {
    if (this.iconElement) {
      this.iconElement.innerHTML = '';
      this.iconElement.style.opacity = '0.3';
    }
  }

  /**
   * Update icon name
   */
  public setIcon(name: string): void {
    this.data.name = name;
    this.loadIcon();
  }

  /**
   * Update library
   */
  public setLibrary(library: IconLibrary): void {
    this.config.library = library;
    this.loadIcon();
  }

  /**
   * Update variant
   */
  public setVariant(variant: 'outline' | 'solid' | 'filled' | 'none'): void {
    this.config.variant = variant;
    this.loadIcon();
  }

  /**
   * Update size
   */
  public setSize(size: number | string): void {
    this.config.size = size;
    const sizeStr = typeof size === 'number' ? `${size}px` : size;
    if (this.container) {
      this.container.style.width = sizeStr;
      this.container.style.height = sizeStr;
    }
    this.loadIcon();
  }

  /**
   * Update color
   */
  public setColor(color: string): void {
    this.config.color = color;
    if (this.container) {
      this.container.style.color = color;
    }
    // Reload to reapply color to SVG
    if (this.iconElement && this.iconElement.firstChild) {
      this.applyColorToSVG(this.iconElement.firstChild as SVGElement);
    }
  }

  /**
   * Apply color to SVG element
   * Ensures all paths use currentColor so they inherit from container's color style
   * Respects fill and stroke config from conf_comp
   */
  private applyColorToSVG(svgElement: SVGElement): void {
    // Check if this is a rotating button icon - skip fill for these
    const isRotatingButton = this.data.name === 'rotate-ccw' || this.data.name === 'rotate-cw';
    
    // Get fill and stroke from config (if specified)
    const configFill = this.config.fill;
    const configStroke = this.config.stroke;
    
    // Apply currentColor to all SVG elements
    const paths = svgElement.querySelectorAll('path, circle, rect, polygon, line, polyline, ellipse, g');
    paths.forEach((path) => {
      const fill = path.getAttribute('fill');
      const stroke = path.getAttribute('stroke');
      
      // Apply fill based on config
      if (configFill === 'none') {
        // Zero fill - set all fills to none
        path.setAttribute('fill', 'none');
      } else if (configFill) {
        // Custom fill from config
        path.setAttribute('fill', configFill);
      } else if (!isRotatingButton) {
        // Default behavior: Set fill to currentColor if not explicitly 'none' or transparent
        if (fill && fill !== 'none' && fill !== 'transparent' && !fill.startsWith('url(')) {
          path.setAttribute('fill', 'currentColor');
        } else if (!fill && path.tagName.toLowerCase() !== 'g') {
          // For most elements, default to currentColor if no fill specified
          path.setAttribute('fill', 'currentColor');
        }
      }
      
      // Apply stroke based on config
      if (configStroke === 'none') {
        path.setAttribute('stroke', 'none');
      } else if (configStroke) {
        path.setAttribute('stroke', configStroke);
      } else {
        // Default behavior: Set stroke to currentColor if not explicitly 'none'
        if (stroke && stroke !== 'none' && stroke !== 'transparent' && !stroke.startsWith('url(')) {
          path.setAttribute('stroke', 'currentColor');
        } else if (!stroke && ['circle', 'rect', 'line', 'polyline', 'polygon', 'ellipse'].includes(path.tagName.toLowerCase())) {
          // For shapes that typically have stroke, set if not present
          path.setAttribute('stroke', 'currentColor');
        }
      }
    });
    
    // Also set on root SVG element for inheritance
    if (configFill === 'none') {
      svgElement.setAttribute('fill', 'none');
    } else if (configFill) {
      svgElement.setAttribute('fill', configFill);
    } else if (!isRotatingButton) {
      const svgFill = svgElement.getAttribute('fill');
      if (!svgFill || (svgFill !== 'none' && svgFill !== 'transparent')) {
        svgElement.setAttribute('fill', 'currentColor');
      }
    }
    
    if (configStroke === 'none') {
      svgElement.setAttribute('stroke', 'none');
    } else if (configStroke) {
      svgElement.setAttribute('stroke', configStroke);
    }
    
    // Ensure container has color set so currentColor works
    if (this.config.color && this.container) {
      this.container.style.color = this.config.color;
    }
  }

  /**
   * Set shape style
   */
  public setShape(shape: 'square' | 'circle' | 'rounded' | 'none'): void {
    this.config.shape = shape;
    this.setupDOM();
    // Reload icon if already loaded
    if (this.data.name) {
      this.loadIcon();
    }
  }

  /**
   * Get current icon name
   */
  public getIconName(): string {
    return this.data.name;
  }

  /**
   * Get current library
   */
  public getLibrary(): IconLibrary {
    return this.config.library || 'auto';
  }

  /**
   * Check if icon exists
   */
  public async checkExists(library?: IconLibrary): Promise<boolean> {
    return await iconExists(this.data.name, library);
  }

  /**
   * Clean up resources
   */
  public destroy(): void {
    // Clear DOM references
    if (this.iconElement) {
      this.iconElement.innerHTML = '';
      this.iconElement = null;
    }

    // Clear SVG content
    this.svgContent = null;

    // Reset loading state
    this.isLoading = false;

    // Clear container
    if (this.container) {
      this.container.innerHTML = '';
    }

    // Call parent cleanup
    super.destroy();
  }
}

// Set component name at class definition (before minification) - survives build tools
(XWUIIcon as any).componentName = 'XWUIIcon';