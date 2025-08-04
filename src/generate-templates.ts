import { generatePlanTemplate, generateTaskTemplate } from './index.js';

import { getConfig } from './config.js';
import { writeToMultipleLocations } from './path-utils.js';
import * as path from 'path';

export function run() {
  console.log('Generating plan and task templates from JSON source...');

  try {
    const config = getConfig();

    // Generate plan template
    console.log('📋 Generating plan template...');
    const planTemplate = generatePlanTemplate();
    const planPaths = [
      path.join(config.templates.outputDirs.src, 'plan.template.md'),
      path.join(config.templates.outputDirs.docs, 'plan.template.md'),
    ];
    writeToMultipleLocations(planTemplate, planPaths, 'Plan template');

    // Generate task template
    console.log('📝 Generating task template...');
    const taskTemplate = generateTaskTemplate();
    const taskPaths = [
      path.join(config.templates.outputDirs.src, 'task.template.md'),
      path.join(config.templates.outputDirs.docs, 'task.template.md'),
    ];
    writeToMultipleLocations(taskTemplate, taskPaths, 'Task template');

    console.log('\n🎉 Both templates generated successfully!');
    console.log('📋 Plan template: For creating new plan documents');
    console.log('📝 Task template: For creating new task documents');
  } catch (_error) {
    console.error('❌ Failed to generate templates:', _error);
    throw _error;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    run();
  } catch (_error) {
    process.exit(1);
  }
}
