export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export interface ParsedFileName {
  parentChain: string | null;
  id: string;
  name: string;
  type: 'plan' | 'task';
}

// This class is now stateless and performs pure string operations.
// It has no knowledge of the file system or configuration.
export class NamingValidator {
  private static readonly NAME_PATTERN = /^[a-z][a-z0-9-]*$/;
  private static readonly PLAN_SUFFIX = '.plan.md';
  private static readonly TASK_SUFFIX = '.task.md';

  public validateName(name: string): ValidationResult {
    if (!NamingValidator.NAME_PATTERN.test(name)) {
      return {
        isValid: false,
        message: `Invalid name format. Expected: [a-z-]+ (e.g., 'user-management'), but got '${name}'.`,
      };
    }
    return { isValid: true };
  }

  // Receives all necessary data to generate the name. No I/O.
  public generateFileName(type: 'plan' | 'task', name: string, nextId: number, parentChain?: string): string {
    const prefix = parentChain ? `${parentChain}.` : '';
    const typePrefix = type === 'plan' ? 'p' : 't';
    const suffix = type === 'plan' ? NamingValidator.PLAN_SUFFIX : NamingValidator.TASK_SUFFIX;

    return `${prefix}${typePrefix}${nextId}-${name}${suffix}`;
  }

  public parseFileName(fileName: string): ParsedFileName | null {
    const type = this._getArtefactType(fileName);
    if (!type) {
      return null;
    }

    const baseName = this._extractBaseName(fileName, type);
    const { parentChain, idAndName } = this._separateParentChain(baseName);

    const idAndNameParts = this._separateIdAndName(idAndName);
    if (!idAndNameParts) {
      return null;
    }
    const { id, name } = idAndNameParts;

    if (!this._validateId(id, type)) {
      return null;
    }

    return { parentChain, id, name, type };
  }

  public extractIdChainFromParent(parentFileName: string): string {
    const parsed = this.parseFileName(parentFileName);
    if (!parsed) {
      throw new Error(`Invalid parent file name format: '${parentFileName}'.`);
    }

    if (parsed.type === 'task') {
      throw new Error('Invalid parent: Tasks cannot be parents.');
    }

    return parsed.parentChain ? `${parsed.parentChain}-${parsed.id}` : parsed.id;
  }

  private _getArtefactType(fileName: string): 'plan' | 'task' | null {
    if (fileName.endsWith(NamingValidator.PLAN_SUFFIX)) {
      return 'plan';
    }
    if (fileName.endsWith(NamingValidator.TASK_SUFFIX)) {
      return 'task';
    }
    return null;
  }

  private _extractBaseName(fileName: string, type: 'plan' | 'task'): string {
    const suffix = type === 'plan' ? NamingValidator.PLAN_SUFFIX : NamingValidator.TASK_SUFFIX;
    return fileName.substring(0, fileName.length - suffix.length);
  }

  private _separateParentChain(baseName: string): { parentChain: string | null; idAndName: string } {
    const lastDotIndex = baseName.lastIndexOf('.');
    if (lastDotIndex !== -1) {
      const parentChain = baseName.substring(0, lastDotIndex);
      const idAndName = baseName.substring(lastDotIndex + 1);
      return { parentChain, idAndName };
    }
    return { parentChain: null, idAndName: baseName };
  }

  private _separateIdAndName(idAndName: string): { id: string; name: string } | null {
    const firstDashIndex = idAndName.indexOf('-');
    if (firstDashIndex === -1 || firstDashIndex === 0 || firstDashIndex === idAndName.length - 1) {
      return null; // No dash, or dash is at the start/end
    }
    const id = idAndName.substring(0, firstDashIndex);
    const name = idAndName.substring(firstDashIndex + 1);
    return { id, name };
  }

  private _validateId(id: string, expectedType: 'plan' | 'task'): boolean {
    const idPrefix = id.charAt(0);
    const idNumber = parseInt(id.substring(1), 10);

    const isPrefixValid =
      (expectedType === 'plan' && idPrefix === 'p') || (expectedType === 'task' && idPrefix === 't');
    return isPrefixValid && !isNaN(idNumber) && id.substring(1) === String(idNumber);
  }
}
