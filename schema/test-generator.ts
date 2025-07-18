import { document } from './document';
import { generateMarkdown } from './markdown-generator';
import * as fs from 'fs';
import * as path from 'path';

// Generate markdown from our structured document
const markdown = generateMarkdown(document);

// Write to a test file
const outputPath = path.join(__dirname, 'generated-schema.md');
fs.writeFileSync(outputPath, markdown, 'utf-8');

console.log('Generated markdown written to:', outputPath);
console.log('\n--- Generated Markdown Preview ---\n');
console.log(markdown.substring(0, 500) + '...');
