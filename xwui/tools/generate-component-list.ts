/**
 * Script to generate a markdown file listing all XWUI components with descriptions
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentsDir = path.join(__dirname, '..', 'src', 'components');
const outputFile = path.join(__dirname, '..', 'docs', 'USAGE_Components.md');

interface ComponentInfo {
  name: string;
  description: string;
  filePath: string;
}

function extractComponentDescription(filePath: string): string {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Look for JSDoc comment at the start of the file
    const jsdocMatch = content.match(/^\/\*\*\s*\n\s*\*\s*(.+?)\s*\n(?:\s*\*\s*(.+?)\s*\n)*\s*\*\//);
    
    if (jsdocMatch) {
      // Extract all lines from JSDoc comment
      const lines = jsdocMatch[0]
        .split('\n')
        .map(line => line.replace(/^\s*\*\s?/, '').trim())
        .filter(line => line && !line.startsWith('/'))
        .join(' ')
        .trim();
      
      return lines || 'No description available';
    }
    
    // Try to find a single-line comment
    const singleLineMatch = content.match(/^\/\/\/\s*(.+)/);
    if (singleLineMatch) {
      return singleLineMatch[1].trim();
    }
    
    return 'No description available';
  } catch (error) {
    return 'Error reading file';
  }
}

function findMainComponentFile(dirPath: string, componentName: string): string | null {
  // Look for the main component file (usually ComponentName.ts)
  const mainFile = path.join(dirPath, `${componentName}.ts`);
  if (fs.existsSync(mainFile)) {
    return mainFile;
  }
  
  // Sometimes the file might be in an index.ts
  const indexFile = path.join(dirPath, 'index.ts');
  if (fs.existsSync(indexFile)) {
    return indexFile;
  }
  
  return null;
}

function getAllComponents(): ComponentInfo[] {
  const components: ComponentInfo[] = [];
  
  if (!fs.existsSync(componentsDir)) {
    console.error(`Components directory not found: ${componentsDir}`);
    return components;
  }
  
  const entries = fs.readdirSync(componentsDir, { withFileTypes: true });
  
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    
    const componentName = entry.name;
    
    // Skip non-XWUI components and special directories
    if (!componentName.startsWith('XWUI') || 
        componentName === 'testers' || 
        componentName === 'components_list.txt') {
      continue;
    }
    
    const componentDir = path.join(componentsDir, componentName);
    const mainFile = findMainComponentFile(componentDir, componentName);
    
    if (mainFile) {
      const description = extractComponentDescription(mainFile);
      components.push({
        name: componentName,
        description: description,
        filePath: mainFile
      });
    }
  }
  
  // Sort alphabetically
  components.sort((a, b) => a.name.localeCompare(b.name));
  
  return components;
}

function generateMarkdown(components: ComponentInfo[]): string {
  let md = '# XWUI Components Reference\n\n';
  md += `This document lists all available XWUI components with their descriptions.\n\n`;
  md += `**Total Components:** ${components.length}\n\n`;
  md += '---\n\n';
  
  // Group by category (rough grouping based on component name patterns)
  const categories: Record<string, ComponentInfo[]> = {
    'Base Components': [],
    'Layout Components': [],
    'Form Components': [],
    'Navigation Components': [],
    'Data Display Components': [],
    'Feedback Components': [],
    'Editor Components': [],
    'Advanced Components': [],
    'Other Components': []
  };
  
  // Categorize components
  for (const component of components) {
    const name = component.name.toLowerCase();
    
    if (name.includes('item') || name.includes('component')) {
      categories['Base Components'].push(component);
    } else if (name.includes('grid') || name.includes('box') || name.includes('container') || 
               name.includes('flex') || name.includes('stack') || name.includes('space') ||
               name.includes('center') || name.includes('aspect') || name.includes('masonry') ||
               name.includes('sidebar') || name.includes('shell') || name.includes('appbar')) {
      categories['Layout Components'].push(component);
    } else if (name.includes('input') || name.includes('form') || name.includes('field') ||
               name.includes('select') || name.includes('checkbox') || name.includes('radio') ||
               name.includes('switch') || name.includes('slider') || name.includes('picker') ||
               name.includes('date') || name.includes('time') || name.includes('color') ||
               name.includes('textarea') || name.includes('upload') || name.includes('rating') ||
               name.includes('autocomplete') || name.includes('cascader') || name.includes('mentions') ||
               name.includes('tree') || name.includes('otp') || name.includes('password') ||
               name.includes('native') || name.includes('multi') || name.includes('segmented')) {
      categories['Form Components'].push(component);
    } else if (name.includes('menu') || name.includes('tabs') || name.includes('breadcrumb') ||
               name.includes('steps') || name.includes('pagination') || name.includes('navigation') ||
               name.includes('anchor') || name.includes('backtotop') || name.includes('scrollto')) {
      categories['Navigation Components'].push(component);
    } else if (name.includes('table') || name.includes('list') || name.includes('card') ||
               name.includes('avatar') || name.includes('badge') || name.includes('chip') ||
               name.includes('tooltip') || name.includes('popover') || name.includes('hover') ||
               name.includes('empty') || name.includes('statistic') || name.includes('description') ||
               name.includes('spoiler') || name.includes('qrcode') || name.includes('image')) {
      categories['Data Display Components'].push(component);
    } else if (name.includes('alert') || name.includes('dialog') || name.includes('drawer') ||
               name.includes('toast') || name.includes('progress') || name.includes('spinner') ||
               name.includes('skeleton') || name.includes('backdrop') || name.includes('popconfirm') ||
               name.includes('watermark') || name.includes('tour') || name.includes('result')) {
      categories['Feedback Components'].push(component);
    } else if (name.includes('editor') || name.includes('script') || name.includes('code') ||
               name.includes('monaco') || name.includes('rich') || name.includes('recorder') ||
               name.includes('player') || name.includes('gallery') || name.includes('photo') ||
               name.includes('audio') || name.includes('video')) {
      categories['Editor Components'].push(component);
    } else if (name.includes('chart') || name.includes('diagram') || name.includes('gantt') ||
               name.includes('kanban') || name.includes('spreadsheet') || name.includes('pivot') ||
               name.includes('timeline') || name.includes('workflow') || name.includes('map') ||
               name.includes('dashboard') || name.includes('visualizer') || name.includes('calendar')) {
      categories['Advanced Components'].push(component);
    } else {
      categories['Other Components'].push(component);
    }
  }
  
  // Generate markdown for each category
  for (const [category, categoryComponents] of Object.entries(categories)) {
    if (categoryComponents.length === 0) continue;
    
    md += `## ${category}\n\n`;
    
    for (const component of categoryComponents) {
      md += `### ${component.name}\n\n`;
      md += `${component.description}\n\n`;
    }
    
    md += '---\n\n';
  }
  
  // Add alphabetical index
  md += '## Alphabetical Index\n\n';
  md += '| Component | Description |\n';
  md += '|-----------|-------------|\n';
  
  for (const component of components) {
    const shortDesc = component.description.split('.')[0].substring(0, 100);
    md += `| ${component.name} | ${shortDesc} |\n`;
  }
  
  md += '\n---\n\n';
  md += `*Generated on ${new Date().toISOString()}*\n`;
  
  return md;
}

// Main execution
function main() {
  console.log('Generating component list...');
  
  const components = getAllComponents();
  console.log(`Found ${components.length} components`);
  
  const markdown = generateMarkdown(components);
  
  // Ensure docs directory exists
  const docsDir = path.dirname(outputFile);
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }
  
  fs.writeFileSync(outputFile, markdown, 'utf-8');
  console.log(`Generated: ${outputFile}`);
}

main();

