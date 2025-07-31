import { main } from '../../../cli/index.js';
import { vol } from 'memfs';
import * as path from 'path';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('fs', () => require('memfs').fs);
vi.mock('fs/promises', () => require('memfs').fs.promises);

describe('CLI init command (E2E)', () => {
  const baseDir = 'test-project-e2e';

  beforeEach(() => {
    vol.reset();
    // Set up the virtual file system CWD
    const CWD = process.cwd();
    vol.mkdirSync(CWD, { recursive: true });
    vol.mkdirSync(path.join(CWD, baseDir), { recursive: true });

    // Mock core docs and templates in the virtual file system
    const coreDocs = [
      'ddd-2.md',
      'generated-schema-docs/ddd-2-schema.human.md',
      'generated-schema-docs/ddd-2-schema.machine.md',
    ];
    const templates = ['plan.template.md', 'task.template.md'];

    const projectRoot = path.resolve(__dirname, '..', '..', '..', '..');

    coreDocs.forEach((doc) => {
      const source = path.join(projectRoot, 'src', doc);
      if (!vol.existsSync(path.dirname(source))) {
        vol.mkdirSync(path.dirname(source), { recursive: true });
      }
      vol.writeFileSync(source, `content of ${doc}`);
    });

    templates.forEach((template) => {
      const source = path.join(projectRoot, 'src', 'templates', template);
      if (!vol.existsSync(path.dirname(source))) {
        vol.mkdirSync(path.dirname(source), { recursive: true });
      }
      vol.writeFileSync(source, `content of ${template}`);
    });
  });

  it('should create a docs directory with the correct structure', async () => {
    const targetDir = path.join(process.cwd(), baseDir);
    await main(['init', '--output-dir', targetDir]);

    const docsPath = path.join(targetDir, 'docs');
    expect(vol.existsSync(docsPath)).toBe(true);
    expect(vol.existsSync(path.join(docsPath, 'requirements'))).toBe(true);
    expect(vol.existsSync(path.join(docsPath, 'templates'))).toBe(true);
    expect(vol.existsSync(path.join(docsPath, 'ddd-2.md'))).toBe(true);
    expect(vol.existsSync(path.join(docsPath, 'templates', 'plan.template.md'))).toBe(true);
    expect(vol.existsSync(path.join(docsPath, 'requirements', 'p1-example.plan.md'))).toBe(true);
  });

  it('should not overwrite an existing docs directory without --force', async () => {
    const targetDir = path.join(process.cwd(), baseDir);
    const docsPath = path.join(targetDir, 'docs');
    vol.mkdirSync(docsPath, { recursive: true });
    vol.writeFileSync(path.join(docsPath, 'test.txt'), 'test');

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(main(['init', '--output-dir', targetDir])).rejects.toThrow(
      `'docs/' directory already exists. Use --force to overwrite.`
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining(`'docs/' directory already exists.`));

    consoleErrorSpy.mockRestore();
  });

  it('should overwrite an existing docs directory with --force', async () => {
    const targetDir = path.join(process.cwd(), baseDir);
    const docsPath = path.join(targetDir, 'docs');
    vol.mkdirSync(docsPath, { recursive: true });
    vol.writeFileSync(path.join(docsPath, 'test.txt'), 'test');

    await main(['init', '--output-dir', targetDir, '--force']);

    expect(vol.existsSync(path.join(docsPath, 'ddd-2.md'))).toBe(true);
    expect(vol.existsSync(path.join(docsPath, 'test.txt'))).toBe(false);
  });
});
