import { NamingValidator } from '../../../cli/services/naming-validator';

describe('NamingValidator', () => {
  let validator: NamingValidator;

  beforeEach(() => {
    validator = new NamingValidator();
  });

  describe('validateName', () => {
    it('should return valid for correct names', () => {
      const result = validator.validateName('my-plan');
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for names with uppercase letters', () => {
      const result = validator.validateName('My-Plan');
      expect(result.isValid).toBe(false);
    });
  });

  describe('generateFileName', () => {
    it('should generate a correct plan file name with no parent', () => {
      const fileName = validator.generateFileName('plan', 'api', 2);
      expect(fileName).toBe('p2-api.plan.md');
    });

    it('should generate a correct plan file name with a parent chain', () => {
      const fileName = validator.generateFileName('plan', 'foo', 3, 'p1-p2');
      expect(fileName).toBe('p1-p2.p3-foo.plan.md');
    });

    it('should generate a correct task file name with a parent chain', () => {
      const fileName = validator.generateFileName('task', 'bar', 5, 'p1-p2-p3');
      expect(fileName).toBe('p1-p2-p3.t5-bar.task.md');
    });

    it('should generate a correct task file name with dashes in the name', () => {
      const fileName = validator.generateFileName('task', 'foo-bar', 2, 'p1');
      expect(fileName).toBe('p1.t2-foo-bar.task.md');
    });
  });

  describe('extractIdChainFromParent', () => {
    it('should correctly extract the chain from a top-level parent', () => {
      const chain = validator.extractIdChainFromParent('p1-my-plan.plan.md');
      expect(chain).toBe('p1');
    });

    it('should correctly extract the chain from a nested parent', () => {
      const chain = validator.extractIdChainFromParent('p1.p2-my-plan.plan.md');
      expect(chain).toBe('p1-p2');
    });

    it('should correctly extract the chain from a deeply nested parent', () => {
      const chain = validator.extractIdChainFromParent('p1-p2-p3.p4-my-plan.plan.md');
      expect(chain).toBe('p1-p2-p3-p4');
    });

    it('should throw an error for an invalid parent file format', () => {
      expect(() => validator.extractIdChainFromParent('invalid-name.md')).toThrow(
        "Invalid parent file name format: 'invalid-name.md'."
      );
    });

    it('should throw an error if a task is provided as a parent', () => {
      expect(() => validator.extractIdChainFromParent('p1.t1-a-task.task.md')).toThrow(
        'Invalid parent: Tasks cannot be parents.'
      );
    });
  });

  describe('parseFileName', () => {
    it('should correctly parse a top-level plan file name', () => {
      const result = validator.parseFileName('p1-my-plan.plan.md');
      expect(result).toEqual({
        parentChain: null,
        id: 'p1',
        name: 'my-plan',
        type: 'plan',
      });
    });

    it('should correctly parse a sub-plan file name', () => {
      const result = validator.parseFileName('p1.p2-my-sub-plan.plan.md');
      expect(result).toEqual({
        parentChain: 'p1',
        id: 'p2',
        name: 'my-sub-plan',
        type: 'plan',
      });
    });

    it('should correctly parse a deeply nested plan file name', () => {
      const result = validator.parseFileName('p1-p2-p3.p4-deep-plan.plan.md');
      expect(result).toEqual({
        parentChain: 'p1-p2-p3',
        id: 'p4',
        name: 'deep-plan',
        type: 'plan',
      });
    });

    it('should correctly parse a task file name', () => {
      const result = validator.parseFileName('p1.t1-my-task.task.md');
      expect(result).toEqual({
        parentChain: 'p1',
        id: 't1',
        name: 'my-task',
        type: 'task',
      });
    });

    it('should correctly parse a task with a multi-level parent', () => {
      const result = validator.parseFileName('p1-p2.t3-another-task.task.md');
      expect(result).toEqual({
        parentChain: 'p1-p2',
        id: 't3',
        name: 'another-task',
        type: 'task',
      });
    });

    it('should correctly parse a name with multiple dashes', () => {
      const result = validator.parseFileName('p1.p2-a-very-long-name-with-dashes.plan.md');
      expect(result).toEqual({
        parentChain: 'p1',
        id: 'p2',
        name: 'a-very-long-name-with-dashes',
        type: 'plan',
      });
    });

    it('should return null for an invalid file name without a type', () => {
      const result = validator.parseFileName('p1-invalid-name');
      expect(result).toBeNull();
    });

    it('should return null for a file name with an incorrect extension', () => {
      const result = validator.parseFileName('p1-my-plan.md');
      expect(result).toBeNull();
    });

    it('should return null for a file name without an ID prefix', () => {
      const result = validator.parseFileName('my-plan.plan.md');
      expect(result).toBeNull();
    });
  });
});
