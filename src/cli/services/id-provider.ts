import path from 'path';
import { FileManager } from './file-manager';
import { NamingValidator } from './naming-validator';

export class IdProvider {
  private fileManager: FileManager;
  private namingValidator: NamingValidator;

  constructor(fileManager: FileManager, namingValidator: NamingValidator) {
    this.fileManager = fileManager;
    this.namingValidator = namingValidator;
  }

  public async getNextAvailableIds(searchDirectory: string): Promise<{ nextPlanId: number; nextTaskId: number }> {
    const planIds = new Set<number>();
    const taskIds = new Set<number>();

    try {
      const files = await this.fileManager.getAllFiles(searchDirectory);

      for (const file of files) {
        const fileName = path.basename(file);
        const parsed = this.namingValidator.parseFileName(fileName);

        if (parsed) {
          const selfIdNum = parseInt(parsed.id.substring(1), 10);
          if (!isNaN(selfIdNum)) {
            if (parsed.type === 'plan') {
              planIds.add(selfIdNum);
            } else {
              taskIds.add(selfIdNum);
            }
          }

          if (parsed.parentChain) {
            const parentParts = parsed.parentChain.split('-');
            for (const part of parentParts) {
              if (part.startsWith('p')) {
                const parentIdNum = parseInt(part.substring(1), 10);
                if (!isNaN(parentIdNum)) {
                  planIds.add(parentIdNum);
                }
              }
            }
          }
        }
      }

      const maxPlanId = planIds.size > 0 ? Math.max(...Array.from(planIds)) : 0;
      const maxTaskId = taskIds.size > 0 ? Math.max(...Array.from(taskIds)) : 0;

      return {
        nextPlanId: maxPlanId + 1,
        nextTaskId: maxTaskId + 1,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      console.warn(`Warning: Could not process directory ${searchDirectory}, defaulting to IDs 1. Error: ${message}`);
      return { nextPlanId: 1, nextTaskId: 1 };
    }
  }
}
