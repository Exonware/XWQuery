/**
 * Summarize Audit Results
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const reportPath = path.join(__dirname, '../XWUI_COMPONENTS_AUDIT_REPORT.json');
const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));

const issueCounts: Record<string, number> = {};
const componentsByIssue: Record<string, string[]> = {};

report.forEach((result: any) => {
    result.issues.forEach((issue: string) => {
        issueCounts[issue] = (issueCounts[issue] || 0) + 1;
        if (!componentsByIssue[issue]) {
            componentsByIssue[issue] = [];
        }
        componentsByIssue[issue].push(result.name);
    });
});

console.log('='.repeat(80));
console.log('AUDIT SUMMARY - ALL XWUI COMPONENTS');
console.log('='.repeat(80));
console.log();
console.log(`Total Components: ${report.length}`);
console.log(`Components with issues: ${report.filter((r: any) => r.issues.length > 0).length}`);
console.log(`Components without issues: ${report.filter((r: any) => r.issues.length === 0).length}`);
console.log();
console.log('ISSUE BREAKDOWN:');
console.log('-'.repeat(80));

Object.entries(issueCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([issue, count]) => {
        console.log(`  ${issue}: ${count} components`);
    });

console.log();
console.log('COMPONENTS BY ISSUE TYPE:');
console.log('-'.repeat(80));

Object.entries(componentsByIssue)
    .sort((a, b) => b[1].length - a[1].length)
    .forEach(([issue, components]) => {
        console.log(`\n${issue} (${components.length} components):`);
        components.slice(0, 10).forEach(comp => console.log(`  - ${comp}`));
        if (components.length > 10) {
            console.log(`  ... and ${components.length - 10} more`);
        }
    });

