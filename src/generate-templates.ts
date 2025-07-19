import { generatePlanTemplate, generateTaskTemplate } from './index';
import * as fs from 'fs';
import * as path from 'path';

function main() {
  console.log('Generating plan and task templates from JSON source...');

  try {
    // Ensure the output directory exists
    const outputDir = path.join(__dirname, '..', '..', '..', 'docs', 'templates');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log(`📁 Created output directory: ${outputDir}`);
    }

    // Generate plan template
    console.log('📋 Generating plan template...');
    const planTemplate = generatePlanTemplate();
    const planOutputPath = path.join(outputDir, 'plan.template.md');
    fs.writeFileSync(planOutputPath, planTemplate, 'utf8');
    console.log(`✅ Plan template generated at: ${planOutputPath}`);

    // Generate task template
    console.log('📝 Generating task template...');
    const taskTemplate = generateTaskTemplate();
    const taskOutputPath = path.join(outputDir, 'task.template.md');
    fs.writeFileSync(taskOutputPath, taskTemplate, 'utf8');
    console.log(`✅ Task template generated at: ${taskOutputPath}`);

    console.log('\n🎉 Both templates generated successfully!');
    console.log('📋 Plan template: For creating new plan documents');
    console.log('📝 Task template: For creating new task documents');
  } catch (error) {
    console.error('❌ Failed to generate templates:', error);
    process.exit(1);
  }
}

main();
