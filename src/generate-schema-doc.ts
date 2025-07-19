import { generateHumanSchemaDocumentation, generateMachineSchemaDocumentation } from '.';
import * as fs from 'fs';
import * as path from 'path';

export function run() {
  console.log('Generating dual schema documentation from JSON source...');

  try {
    // Ensure the output directories exist
    const srcDir = path.join(__dirname, 'generated-schema-docs');
    const docsDir = path.join(__dirname, '..', 'docs');
    if (!fs.existsSync(srcDir)) {
      fs.mkdirSync(srcDir, { recursive: true });
      console.log(`📁 Created output directory: ${srcDir}`);
    }
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
      console.log(`📁 Created output directory: ${docsDir}`);
    }

    // Generate human-readable documentation
    console.log('📖 Generating human-readable version...');
    const humanDocumentation = generateHumanSchemaDocumentation();
    const humanSrcPath = path.join(srcDir, 'ddd-2-schema.human.md');
    const humanDocsPath = path.join(docsDir, 'ddd-2-schema.human.md');
    fs.writeFileSync(humanSrcPath, humanDocumentation, 'utf8');
    fs.writeFileSync(humanDocsPath, humanDocumentation, 'utf8');
    console.log(`✅ Human version generated at: ${humanSrcPath} and ${humanDocsPath}`);

    // Generate machine/LLM-focused documentation
    console.log('🤖 Generating machine/LLM version...');
    const machineDocumentation = generateMachineSchemaDocumentation();
    const machineSrcPath = path.join(srcDir, 'ddd-2-schema.machine.md');
    const machineDocsPath = path.join(docsDir, 'ddd-2-schema.machine.md');
    fs.writeFileSync(machineSrcPath, machineDocumentation, 'utf8');
    fs.writeFileSync(machineDocsPath, machineDocumentation, 'utf8');
    console.log(`✅ Machine version generated at: ${machineSrcPath} and ${machineDocsPath}`);

    console.log('\n🎉 Both documentation versions generated successfully!');
    console.log('📖 Human version: Optimized for human readability with visible examples');
    console.log('🤖 Machine version: Optimized for LLM consumption with code block examples');
  } catch (error) {
    console.error('❌ Failed to generate documentation:', error);
    throw error;
  }
}

if (require.main === module) {
  try {
    run();
  } catch (error) {
    process.exit(1);
  }
}
