/**
 * Icon Mapping Generator
 * Extracts icon names from all icon libraries and creates a master CSV mapping
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface IconMapping {
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

// Normalize icon names to create master names
function normalizeIconName(name: string, library: string): string {
  // Remove file extension
  name = name.replace(/\.svg$/, '');
  
  // Remove variant suffixes
  name = name
    .replace(/-fill$/, '')
    .replace(/-outline$/, '')
    .replace(/-solid$/, '')
    .replace(/-filled$/, '')
    .replace(/-outlined$/, '')
    .replace(/-twotone$/, '');
  
  // Library-specific normalizations
  if (library === 'ant-design') {
    // Ant Design uses PascalCase with suffixes like Outlined, Filled, TwoTone
    name = name
      .replace(/Outlined$/, '')
      .replace(/Filled$/, '')
      .replace(/TwoTone$/, '')
      .toLowerCase()
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase();
  }
  
  // Convert to lowercase with dashes
  name = name.toLowerCase().replace(/_/g, '-');
  
  return name;
}

// Extract icon names from a directory
function extractIconsFromDirectory(dirPath: string, library: string): string[] {
  const icons: string[] = [];
  
  if (!fs.existsSync(dirPath)) {
    console.warn(`Directory not found: ${dirPath}`);
    return icons;
  }
  
  try {
    const files = fs.readdirSync(dirPath, { recursive: true });
    
    for (const file of files) {
      if (typeof file === 'string' && file.endsWith('.svg')) {
        // Handle nested directories (like ant-design's outlined/, filled/, twotone/)
        const fullPath = path.join(dirPath, file);
        const fileName = path.basename(file);
        
        // For ant-design, include the variant in the name
        if (library === 'ant-design' && file.includes('/')) {
          const parts = file.split('/');
          const variant = parts[0]; // outlined, filled, twotone
          const iconName = parts[1]?.replace('.svg', '') || '';
          if (iconName) {
            icons.push(`${variant}/${iconName}`);
          }
        } else {
          icons.push(fileName);
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
  }
  
  return icons;
}

// Extract from Bootstrap JSON
function extractBootstrapIcons(jsonPath: string): string[] {
  const icons: string[] = [];
  
  if (!fs.existsSync(jsonPath)) {
    console.warn(`Bootstrap icons JSON not found: ${jsonPath}`);
    return icons;
  }
  
  try {
    const content = fs.readFileSync(jsonPath, 'utf-8');
    const iconMap = JSON.parse(content);
    icons.push(...Object.keys(iconMap));
  } catch (error) {
    console.error(`Error reading Bootstrap icons JSON:`, error);
  }
  
  return icons;
}

// Icons to exclude from the mapping
const EXCLUDED_ICONS = new Set([
  'bible',
  'building-church',
  'menorah',
  'om',
]);

// Main function
function generateIconMapping() {
  const iconsDir = path.join(__dirname, '../src/styles/theme/icons');
  const outputPath = path.join(iconsDir, 'icons.csv');
  
  console.log('Starting icon extraction...');
  
  // Extract icons from each library
  const bootstrapIcons = extractBootstrapIcons(
    path.join(iconsDir, 'bootstrap-icons/bootstrap-icons.json')
  );
  console.log(`Bootstrap: ${bootstrapIcons.length} icons`);
  
  const antDesignIcons = extractIconsFromDirectory(
    path.join(iconsDir, 'ant-design-icons/packages/icons-svg/svg'),
    'ant-design'
  );
  console.log(`Ant Design: ${antDesignIcons.length} icons`);
  
  const featherIcons = extractIconsFromDirectory(
    path.join(iconsDir, 'feather'),
    'feather'
  );
  console.log(`Feather: ${featherIcons.length} icons`);
  
  const heroiconsOutline = extractIconsFromDirectory(
    path.join(iconsDir, 'heroicons/optimized/24/outline'),
    'heroicons'
  );
  const heroiconsSolid = extractIconsFromDirectory(
    path.join(iconsDir, 'heroicons/optimized/24/solid'),
    'heroicons'
  );
  const heroicons = [...new Set([...heroiconsOutline, ...heroiconsSolid])];
  console.log(`Heroicons: ${heroicons.length} icons`);
  
  const primeicons = extractIconsFromDirectory(
    path.join(iconsDir, 'primeicons/raw-svg'),
    'primeicons'
  );
  console.log(`PrimeIcons: ${primeicons.length} icons`);
  
  const radixIcons = extractIconsFromDirectory(
    path.join(iconsDir, 'radix-icons'),
    'radix'
  );
  console.log(`Radix Icons: ${radixIcons.length} icons`);
  
  // Tabler has outline and filled variants
  const tablerOutline = extractIconsFromDirectory(
    path.join(iconsDir, 'tabler-icons/icons/outline'),
    'tabler'
  );
  const tablerFilled = extractIconsFromDirectory(
    path.join(iconsDir, 'tabler-icons/icons/filled'),
    'tabler'
  );
  const tablerIcons = [...new Set([...tablerOutline, ...tablerFilled])];
  console.log(`Tabler Icons: ${tablerIcons.length} icons`);
  
  // Create master mapping
  const masterMap = new Map<string, IconMapping>();
  
  // Process each library
  const libraries = [
    { name: 'bootstrap_icons', icons: bootstrapIcons },
    { name: 'ant_design_icons', icons: antDesignIcons },
    { name: 'feather', icons: featherIcons },
    { name: 'heroicons', icons: heroicons },
    { name: 'primeicons', icons: primeicons },
    { name: 'radix_icons', icons: radixIcons },
    { name: 'tabler_icons', icons: tablerIcons },
  ];
  
  for (const lib of libraries) {
    for (const iconName of lib.icons) {
      const normalized = normalizeIconName(iconName, lib.name);
      
      // Skip excluded icons
      if (EXCLUDED_ICONS.has(normalized)) {
        continue;
      }
      
      if (!masterMap.has(normalized)) {
        masterMap.set(normalized, {
          master_name: normalized,
          icon_desc: iconName.replace(/\.svg$/, '').replace(/\//g, ' '),
        });
      }
      
      const mapping = masterMap.get(normalized)!;
      (mapping as any)[lib.name] = iconName.replace(/\.svg$/, '');
    }
  }
  
  // Generate CSV
  const csvRows: string[] = [];
  csvRows.push('master_name,icon_desc,ant_design_icons,bootstrap_icons,feather,heroicons,primeicons,radix_icons,tabler_icons,react_icons');
  
  const sortedMappings = Array.from(masterMap.values()).sort((a, b) => 
    a.master_name.localeCompare(b.master_name)
  );
  
  for (const mapping of sortedMappings) {
    const row = [
      mapping.master_name,
      `"${mapping.icon_desc}"`,
      mapping.ant_design_icons || '',
      mapping.bootstrap_icons || '',
      mapping.feather || '',
      mapping.heroicons || '',
      mapping.primeicons || '',
      mapping.radix_icons || '',
      mapping.tabler_icons || '',
      '', // react-icons will be mapped separately
    ];
    csvRows.push(row.join(','));
  }
  
  // Write CSV
  fs.writeFileSync(outputPath, csvRows.join('\n'), 'utf-8');
  
  // Also write JSON for easier loading
  const jsonPath = path.join(iconsDir, 'icons.json');
  const jsonData = {
    mappings: sortedMappings,
    metadata: {
      totalIcons: masterMap.size,
      generatedAt: new Date().toISOString(),
      libraries: libraries.map(lib => ({
        name: lib.name,
        iconCount: sortedMappings.filter(m => (m as any)[lib.name]).length
      }))
    }
  };
  fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2), 'utf-8');
  
  console.log(`\n✅ Generated ${masterMap.size} master icon mappings`);
  console.log(`📄 CSV Output: ${outputPath}`);
  console.log(`📄 JSON Output: ${jsonPath}`);
  
  // Print statistics
  console.log('\n📊 Statistics:');
  for (const lib of libraries) {
    const count = sortedMappings.filter(m => (m as any)[lib.name]).length;
    console.log(`  ${lib.name}: ${count} icons mapped`);
  }
}

// Run if executed directly
generateIconMapping();

export { generateIconMapping };

