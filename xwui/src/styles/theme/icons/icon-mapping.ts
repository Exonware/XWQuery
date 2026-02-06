/**
 * Icon Mapping Utility
 * Loads and provides access to the master icon mapping CSV
 */

export interface IconMapping {
  master_name: string;
  icon_desc: string;
  ant_design_icons?: string;
  bootstrap_icons?: string;
  feather?: string;
  heroicons?: string;
  primeicons?: string;
  radix_icons?: string;
  tabler_icons?: string;
  react_icons?: string;
}

export type IconLibrary = 
  | 'ant-design' 
  | 'bootstrap' 
  | 'feather' 
  | 'heroicons' 
  | 'primeicons' 
  | 'radix' 
  | 'tabler' 
  | 'auto';

// Cache for loaded mappings
let iconMappingsCache: Map<string, IconMapping> | null = null;

/**
 * Load icon mappings from JSON (preferred) or CSV
 */
export async function loadIconMappings(): Promise<Map<string, IconMapping>> {
  if (iconMappingsCache) {
    return iconMappingsCache;
  }

  try {
    // Try JSON first (faster and easier to parse)
    try {
      const jsonPath = new URL('./icons.json', import.meta.url);
      const response = await fetch(jsonPath);
      if (response.ok) {
        const jsonData = await response.json();
        const mappings = new Map<string, IconMapping>();
        
        if (jsonData.mappings && Array.isArray(jsonData.mappings)) {
          for (const mapping of jsonData.mappings) {
            if (mapping.master_name) {
              mappings.set(mapping.master_name, mapping);
            }
          }
        }
        
        iconMappingsCache = mappings;
        return mappings;
      }
    } catch (jsonError) {
      console.warn('Failed to load JSON, trying CSV:', jsonError);
    }

    // Fallback to CSV
    const csvPath = new URL('./icons.csv', import.meta.url);
    const response = await fetch(csvPath);
    const csvText = await response.text();
    
    const mappings = new Map<string, IconMapping>();
    const lines = csvText.split('\n');
    
    // Skip header row
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Parse CSV line (handle quoted values)
      const values: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current);
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current);
      
      if (values.length >= 2) {
        const mapping: IconMapping = {
          master_name: values[0] || '',
          icon_desc: values[1]?.replace(/^"|"$/g, '') || '',
          ant_design_icons: values[2] || undefined,
          bootstrap_icons: values[3] || undefined,
          feather: values[4] || undefined,
          heroicons: values[5] || undefined,
          primeicons: values[6] || undefined,
          radix_icons: values[7] || undefined,
          tabler_icons: values[8] || undefined,
          react_icons: values[9] || undefined,
        };
        
        if (mapping.master_name) {
          mappings.set(mapping.master_name, mapping);
        }
      }
    }
    
    iconMappingsCache = mappings;
    return mappings;
  } catch (error) {
    console.error('Failed to load icon mappings:', error);
    return new Map();
  }
}

/**
 * Get icon mapping by master name
 */
export async function getIconMapping(masterName: string): Promise<IconMapping | null> {
  const mappings = await loadIconMappings();
  return mappings.get(masterName) || null;
}

/**
 * Get icon name for a specific library
 */
export async function getIconNameForLibrary(
  masterName: string,
  library: IconLibrary
): Promise<string | null> {
  const mapping = await getIconMapping(masterName);
  if (!mapping) return null;
  
  // Handle 'auto' by finding first available library
  if (library === 'auto') {
    const fallbackOrder: IconLibrary[] = [
      'bootstrap',
      'heroicons',
      'feather',
      'radix',
      'primeicons',
      'ant-design',
      'tabler',
    ];
    
    for (const lib of fallbackOrder) {
      const iconName = getIconNameFromMapping(mapping, lib);
      if (iconName) return iconName;
    }
    return null;
  }
  
  return getIconNameFromMapping(mapping, library);
}

/**
 * Get icon name from mapping for specific library
 */
function getIconNameFromMapping(mapping: IconMapping, library: IconLibrary): string | null {
  switch (library) {
    case 'ant-design':
      return mapping.ant_design_icons || null;
    case 'bootstrap':
      return mapping.bootstrap_icons || null;
    case 'feather':
      return mapping.feather || null;
    case 'heroicons':
      return mapping.heroicons || null;
    case 'primeicons':
      return mapping.primeicons || null;
    case 'radix':
      return mapping.radix_icons || null;
    case 'tabler':
      return mapping.tabler_icons || null;
    default:
      return null;
  }
}

/**
 * Get icon path for a specific library and icon name
 * Returns relative path that can be resolved based on project structure
 */
export function getIconPath(library: IconLibrary, iconName: string, variant?: 'outline' | 'solid' | 'filled' | 'none'): string {
  // Use relative path from project root
  const basePath = 'src/styles/theme/icons';
  
  switch (library) {
    case 'ant-design': {
      // Ant Design uses variant folders: outlined/, filled/, twotone/
      const variantFolder = variant === 'filled' ? 'filled' : variant === 'solid' ? 'filled' : 'outlined';
      const parts = iconName.split('/');
      if (parts.length > 1) {
        // Already has variant in path
        return `${basePath}/ant-design-icons/packages/icons-svg/svg/${iconName}.svg`;
      }
      return `${basePath}/ant-design-icons/packages/icons-svg/svg/${variantFolder}/${iconName}.svg`;
    }
    case 'bootstrap':
      return `${basePath}/bootstrap-icons/${iconName}.svg`;
    case 'feather':
      return `${basePath}/feather/${iconName}.svg`;
    case 'heroicons': {
      const variantFolder = variant === 'solid' ? 'solid' : 'outline';
      return `${basePath}/heroicons/optimized/24/${variantFolder}/${iconName}.svg`;
    }
    case 'primeicons':
      return `${basePath}/primeicons/raw-svg/${iconName}.svg`;
    case 'radix':
      return `${basePath}/radix-icons/${iconName}.svg`;
    case 'tabler': {
      const variantFolder = variant === 'filled' ? 'filled' : 'outline';
      return `${basePath}/tabler-icons/icons/${variantFolder}/${iconName}.svg`;
    }
    default:
      return '';
  }
}

/**
 * Resolve icon path to absolute URL
 * Handles different deployment scenarios
 */
export function resolveIconPath(relativePath: string): string {
  // Try to determine base path from script location
  const scripts = document.getElementsByTagName('script');
  let basePath = '';
  
  for (let i = 0; i < scripts.length; i++) {
    const src = scripts[i].src;
    if (src.includes('/dist/') || src.includes('/src/')) {
      const match = src.match(/(.*?)(?:dist|src)\//);
      if (match) {
        basePath = match[1];
        break;
      }
    }
  }
  
  // Try multiple possible paths
  const possiblePaths = [
    `${basePath}${relativePath}`,
    `/${relativePath}`,
    `./${relativePath}`,
    relativePath,
  ];
  
  // Return the first path (can be enhanced to test which one works)
  return possiblePaths[0];
}

/**
 * Check if an icon exists in a library
 */
export async function iconExists(masterName: string, library?: IconLibrary): Promise<boolean> {
  const mapping = await getIconMapping(masterName);
  if (!mapping) return false;
  
  if (library && library !== 'auto') {
    return getIconNameFromMapping(mapping, library) !== null;
  }
  
  // Check if exists in any library
  return !!(
    mapping.ant_design_icons ||
    mapping.bootstrap_icons ||
    mapping.feather ||
    mapping.heroicons ||
    mapping.primeicons ||
    mapping.radix_icons ||
    mapping.tabler_icons
  );
}

