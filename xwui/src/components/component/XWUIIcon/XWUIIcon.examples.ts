/**
 * XWUIIcon Shape Style Examples
 * Demonstrates different shape styles for icons
 */

import { XWUIIcon } from './XWUIIcon';
import type { XWUIIconConfig } from './XWUIIcon';

/**
 * Example: Creating icons with different shapes
 */
export function createIconWithShapes(container: HTMLElement): void {
  // Square shape icon
  const squareIcon = new XWUIIcon(container, 'star', {
    size: 24,
    shape: 'square',
    color: '#333'
  } as XWUIIconConfig);

  // Circle shape icon (rounded background)
  const circleIcon = new XWUIIcon(container, 'star', {
    size: 24,
    shape: 'circle',
    color: '#333'
  } as XWUIIconConfig);

  // Rounded corners icon
  const roundedIcon = new XWUIIcon(container, 'star', {
    size: 24,
    shape: 'rounded',
    color: '#333'
  } as XWUIIconConfig);

  // No shape wrapper (default)
  const noShapeIcon = new XWUIIcon(container, 'star', {
    size: 24,
    shape: 'none',
    color: '#333'
  } as XWUIIconConfig);
}

/**
 * Example: Using icon shapes with system configuration
 */
export function createIconWithSystemConfig(
  container: HTMLElement,
  conf_sys?: any
): void {
  // Icon will automatically use icon library from conf_sys (data-icons attribute)
  const icon = new XWUIIcon(
    container,
    'close', // Master icon name from CSV
    {
      size: 20,
      shape: 'circle', // Optional shape styling
      fallbackLibrary: 'bootstrap' // Fallback to bootstrap if not found in primary library
    } as XWUIIconConfig,
    conf_sys
  );
}

/**
 * Example: Dynamic icon name resolution from CSV
 */
export async function demonstrateDynamicIconResolution(): Promise<void> {
  const container = document.createElement('div');
  
  // Icon name is resolved dynamically from CSV mapping
  // System will try to find 'heart' in all libraries if not found in primary
  const icon = new XWUIIcon(container, 'heart', {
    library: 'auto', // Will try all libraries automatically
    variant: 'solid',
    size: 32,
    color: '#e91e63',
    shape: 'circle',
    fallbackLibrary: 'heroicons' // Prefer heroicons as fallback
  } as XWUIIconConfig);

  // Icon will automatically:
  // 1. Look up 'heart' in CSV mapping
  // 2. Try primary library (auto = tries all)
  // 3. If not found, try fallbackLibrary preference
  // 4. Apply color and shape styling
  // 5. Read icon styles from conf_sys if provided
}

/**
 * Example: Changing icon shape dynamically
 */
export function demonstrateShapeChanges(icon: XWUIIcon): void {
  // Change shape at runtime
  icon.setShape('circle');
  
  // Change to rounded
  icon.setShape('rounded');
  
  // Remove shape
  icon.setShape('none');
}

/**
 * Example: Icon with system config icon styles
 */
export function createIconWithIconStyles(
  container: HTMLElement,
  conf_sys: any
): void {
  // conf_sys should contain:
  // {
  //   theme: {
  //     icons: 'bootstrap', // Icon library from XWUIStyle
  //     icons_colors: '#007bff' // Icon color from XWUIStyle
  //   }
  // }
  
  const icon = new XWUIIcon(container, 'star', {
    size: 24,
    shape: 'circle'
    // library and color will be read from conf_sys automatically
  } as XWUIIconConfig, conf_sys);
}

