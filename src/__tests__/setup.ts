import { vol } from 'memfs';
import * as path from 'path';

const schemaFiles = [
  '1-meta.json',
  '2-business-scope.json',
  '3-planning-decomposition.json',
  '4-high-level-design.json',
  '5-maintenance-monitoring.json',
  '6-implementation-guidance.json',
  '7-quality-operations.json',
  '8-reference.json',
];

const projectRoot = process.cwd();
schemaFiles.forEach((file) => {
  const source = path.join(projectRoot, 'src', 'schema', 'ddd-schema-json', file);
  if (!vol.existsSync(path.dirname(source))) {
    vol.mkdirSync(path.dirname(source), { recursive: true });
  }
  vol.writeFileSync(source, JSON.stringify({ applicability: { plan: 'required', task: 'required' }, sections: [] }));
});

const contextExamples = path.join(projectRoot, 'src', 'schema', 'ddd-schema-json', 'context-examples.json');
if (!vol.existsSync(path.dirname(contextExamples))) {
  vol.mkdirSync(path.dirname(contextExamples), { recursive: true });
}
vol.writeFileSync(
  contextExamples,
  JSON.stringify({
    legend: { statusExamples: { content: [] } },
    contextInheritanceProtocol: { traversalProcess: { content: [] }, examples: [] },
  })
);

const packageJson = path.join(projectRoot, 'package.json');
if (!vol.existsSync(path.dirname(packageJson))) {
  vol.mkdirSync(path.dirname(packageJson), { recursive: true });
}
vol.writeFileSync(packageJson, JSON.stringify({ version: '0.1.0' }));
