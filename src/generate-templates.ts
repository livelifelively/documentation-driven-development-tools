import { generatePlanTemplate, generateTaskTemplate } from './index';
import * as fs from 'fs';
import * as path from 'path';

export function run() {
  console.log('Generating plan and task templates from JSON source...');

  try {
    // Ensure the output directories exist
    const srcDir = path.join(__dirname, 'templates');
    const docsDir = path.join(__dirname, '..', 'docs', 'templates');
    if (!fs.existsSync(srcDir)) {
      fs.mkdirSync(srcDir, { recursive: true });
      console.log(`📁 Created output directory: ${srcDir}`);
    }
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
      console.log(`📁 Created output directory: ${docsDir}`);
    }

    // Generate plan template
    console.log('📋 Generating plan template...');
    const planTemplate = generatePlanTemplate();
    const planSrcPath = path.join(srcDir, 'plan.template.md');
    const planDocsPath = path.join(docsDir, 'plan.template.md');
    fs.writeFileSync(planSrcPath, planTemplate, 'utf8');
    fs.writeFileSync(planDocsPath, planTemplate, 'utf8');
    console.log(`✅ Plan template generated at: ${planSrcPath} and ${planDocsPath}`);

    // Generate task template
    console.log('📝 Generating task template...');
    const taskTemplate = generateTaskTemplate();
    const taskSrcPath = path.join(srcDir, 'task.template.md');
    const taskDocsPath = path.join(docsDir, 'task.template.md');
    fs.writeFileSync(taskSrcPath, taskTemplate, 'utf8');
    fs.writeFileSync(taskDocsPath, taskTemplate, 'utf8');
    console.log(`✅ Task template generated at: ${taskSrcPath} and ${taskDocsPath}`);

    console.log('\n🎉 Both templates generated successfully!');
    console.log('📋 Plan template: For creating new plan documents');
    console.log('📝 Task template: For creating new task documents');
  } catch (error) {
    console.error('❌ Failed to generate templates:', error);
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
