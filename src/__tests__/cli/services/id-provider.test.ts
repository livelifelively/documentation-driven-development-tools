import { vol } from 'memfs';
import { FileManager } from '../../../cli/services/file-manager';
import { NamingValidator } from '../../../cli/services/naming-validator';
import { IdProvider } from '../../../cli/services/id-provider';

jest.mock('fs', () => require('memfs').fs);
jest.mock('fs/promises', () => require('memfs').fs.promises);

const TEST_DIR = '/test-id-provider';

describe('IdProvider', () => {
  let fileManager: FileManager;
  let namingValidator: NamingValidator;
  let idProvider: IdProvider;

  beforeEach(() => {
    vol.reset();
    fileManager = new FileManager();
    namingValidator = new NamingValidator();
    idProvider = new IdProvider(fileManager, namingValidator);
  });

  it('should return 1 for both IDs if the directory is empty', async () => {
    vol.fromJSON({}, TEST_DIR);
    const { nextPlanId, nextTaskId } = await idProvider.getNextAvailableIds(TEST_DIR);
    expect(nextPlanId).toBe(1);
    expect(nextTaskId).toBe(1);
  });

  it('should return 1 for both IDs if the directory does not exist', async () => {
    const { nextPlanId, nextTaskId } = await idProvider.getNextAvailableIds('/non-existent-dir');
    expect(nextPlanId).toBe(1);
    expect(nextTaskId).toBe(1);
  });

  it('should correctly determine the next available IDs from existing files', async () => {
    vol.fromJSON(
      {
        'p1-first-plan.plan.md': '',
        'p1.t1-first-task.task.md': '',
        'p2-second-plan.plan.md': '',
      },
      TEST_DIR
    );

    const { nextPlanId, nextTaskId } = await idProvider.getNextAvailableIds(TEST_DIR);
    expect(nextPlanId).toBe(3);
    expect(nextTaskId).toBe(2);
  });

  it('should correctly parse IDs from parent chains', async () => {
    vol.fromJSON(
      {
        'p1-first-plan.plan.md': '',
        'p1.p2-second-plan.plan.md': '',
        'p1-p2.p5-third-plan.plan.md': '', // Highest plan ID is 5
        'p1-p2-p5.t3-some-task.task.md': '', // Highest task ID is 3
      },
      TEST_DIR
    );

    const { nextPlanId, nextTaskId } = await idProvider.getNextAvailableIds(TEST_DIR);
    expect(nextPlanId).toBe(6);
    expect(nextTaskId).toBe(4);
  });

  it('should handle a mix of simple and complex file names', async () => {
    vol.fromJSON(
      {
        'p1-plan.plan.md': '',
        'p1.t1-task.task.md': '',
        'p2-plan.plan.md': '',
        'p1.p3-nested-plan.plan.md': '',
        'p1-p3.t2-nested-task.task.md': '',
      },
      TEST_DIR
    );

    const { nextPlanId, nextTaskId } = await idProvider.getNextAvailableIds(TEST_DIR);
    expect(nextPlanId).toBe(4); // p1, p2, p3
    expect(nextTaskId).toBe(3); // t1, t2
  });

  it('should find the next plan and task IDs from a complex structure with gaps', async () => {
    vol.fromJSON(
      {
        'p1-plan.plan.md': '',
        'p1.t1-task.task.md': '',
        'p2-another.plan.md': '',
        'p1-p2.p3-nested.plan.md': '', // Contains p1, p2, p3
        'p1-p2.t2-another-task.task.md': '', // Contains p1, p2, t2
        'p5-gapped-plan.plan.md': '', // Highest plan ID is p5
        'p1.t4-highest-task.task.md': '', // Highest task ID is t4
      },
      TEST_DIR
    );

    const { nextPlanId, nextTaskId } = await idProvider.getNextAvailableIds(TEST_DIR);

    // Highest plan ID is 5 (from p5), so next is 6.
    // IDs found: p1, p2, p3, p5.
    expect(nextPlanId).toBe(6);

    // Highest task ID is 4 (from t4), so next is 5.
    // IDs found: t1, t2, t4.
    expect(nextTaskId).toBe(5);
  });

  it('should ensure plan IDs are globally unique across parent chains and self names', async () => {
    vol.fromJSON(
      {
        'p1-plan.plan.md': '',
        'p1.p2-child.plan.md': '',
      },
      TEST_DIR
    );
    const { nextPlanId } = await idProvider.getNextAvailableIds(TEST_DIR);
    expect(nextPlanId).toBe(3); // p1 and p2 are used
  });
});
