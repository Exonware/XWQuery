/**
 * Script to check and fix component name mismatches in JSON files
 * Ensures JSON file names and id fields match the actual component class names
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentsDir = path.join(__dirname, '..', 'src', 'components');

interface ComponentInfo {
  dirName: string;
  className: string;
  jsonFileName: string | null;
  jsonId: string | null;
  jsonPath: string | null;
  needsRename: boolean;
  needsIdUpdate: boolean;
}

function findComponentClass(componentDir: string, dirName: string): string | null {
  // Try to find the main component file
  const mainFile = path.join(componentDir, `${dirName}.ts`);
  
  if (!fs.existsSync(mainFile)) {
    // Try index.ts
    const indexFile = path.join(componentDir, 'index.ts');
    if (fs.existsSync(indexFile)) {
      const content = fs.readFileSync(indexFile, 'utf-8');
      const classMatch = content.match(/export class (\w+)/);
      if (classMatch) return classMatch[1];
    }
    return null;
  }
  
  const content = fs.readFileSync(mainFile, 'utf-8');
  const classMatch = content.match(/export class (\w+)/);
  
  return classMatch ? classMatch[1] : null;
}

function findJsonFile(componentDir: string, dirName: string): { fileName: string; id: string } | null {
  // Look for JSON files in the component directory
  const files = fs.readdirSync(componentDir);
  const jsonFiles = files.filter(f => f.endsWith('.json') && !f.includes('schema'));
  
  if (jsonFiles.length === 0) return null;
  
  // Get the first JSON file (usually there's only one)
  const jsonFile = jsonFiles[0];
  const jsonPath = path.join(componentDir, jsonFile);
  
  try {
    const content = fs.readFileSync(jsonPath, 'utf-8');
    const json = JSON.parse(content);
    const id = json.id || null;
    
    return {
      fileName: jsonFile,
      id: id
    };
  } catch (error) {
    console.error(`Error reading ${jsonPath}:`, error);
    return null;
  }
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
    
    const dirName = entry.name;
    
    // Skip non-XWUI components and special directories
    if (!dirName.startsWith('XWUI') && !dirName.startsWith('XWI') && 
        dirName !== 'Menu' && dirName !== 'Console' && dirName !== 'Viewer' &&
        dirName !== 'DocumentViewer' && dirName !== 'Assistant' && dirName !== 'Header' &&
        dirName !== 'ScriptEditor' && dirName !== 'ScriptStudio' && dirName !== 'Monaco') {
      continue;
    }
    
    // Skip testers directory
    if (dirName === 'testers') continue;
    
    const componentDir = path.join(componentsDir, dirName);
    const className = findComponentClass(componentDir, dirName);
    
    if (!className) {
      // Component without a class - might be a legacy or special component
      continue;
    }
    
    const jsonInfo = findJsonFile(componentDir, dirName);
    
    const expectedJsonName = `${className}.json`;
    const actualJsonName = jsonInfo?.fileName || null;
    const needsRename = actualJsonName && actualJsonName !== expectedJsonName;
    const needsIdUpdate = jsonInfo && jsonInfo.id !== className;
    
    components.push({
      dirName,
      className,
      jsonFileName: actualJsonName || null,
      jsonId: jsonInfo?.id || null,
      jsonPath: jsonInfo ? path.join(componentDir, actualJsonName!) : null,
      needsRename,
      needsIdUpdate
    });
  }
  
  return components;
}

function fixJsonFile(component: ComponentInfo): void {
  if (!component.jsonPath || !fs.existsSync(component.jsonPath)) {
    return;
  }
  
  try {
    const content = fs.readFileSync(component.jsonPath, 'utf-8');
    const json = JSON.parse(content);
    
    // Update id field
    if (component.needsIdUpdate) {
      json.id = component.className;
      console.log(`  ✓ Updated id: "${component.jsonId}" → "${component.className}"`);
    }
    
    // Update name field if it references the old id
    if (json.name && component.jsonId && json.name.includes(component.jsonId)) {
      const oldNamePattern = new RegExp(component.jsonId.replace(/XWUI/g, 'XWUI '), 'gi');
      json.name = json.name.replace(oldNamePattern, component.className.replace(/XWUI/g, 'XWUI '));
      console.log(`  ✓ Updated name field`);
    }
    
    // Write updated JSON
    fs.writeFileSync(component.jsonPath, JSON.stringify(json, null, 2) + '\n', 'utf-8');
    
    // Rename file if needed
    if (component.needsRename) {
      const newPath = path.join(path.dirname(component.jsonPath), `${component.className}.json`);
      fs.renameSync(component.jsonPath, newPath);
      console.log(`  ✓ Renamed file: "${component.jsonFileName}" → "${component.className}.json"`);
    }
    
  } catch (error) {
    console.error(`  ✗ Error fixing ${component.jsonPath}:`, error);
  }
}

// Main execution
function main() {
  console.log('Checking component name mismatches...\n');
  
  const components = getAllComponents();
  
  const mismatches = components.filter(c => c.needsRename || c.needsIdUpdate);
  
  if (mismatches.length === 0) {
    console.log('✓ No mismatches found! All JSON files match component class names.');
    return;
  }
  
  console.log(`Found ${mismatches.length} components with mismatches:\n`);
  
  for (const component of mismatches) {
    console.log(`${component.className}:`);
    if (component.needsRename) {
      console.log(`  - JSON file name mismatch: "${component.jsonFileName}" should be "${component.className}.json"`);
    }
    if (component.needsIdUpdate) {
      console.log(`  - JSON id mismatch: "${component.jsonId}" should be "${component.className}"`);
    }
    console.log();
  }
  
  console.log('Fixing mismatches...\n');
  
  for (const component of mismatches) {
    console.log(`Fixing ${component.className}...`);
    fixJsonFile(component);
    console.log();
  }
  
  console.log('✓ All fixes complete!');
}

main();

