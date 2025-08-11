import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { createHighLevelDesignSchema } from '../../4-high-level-design.schema.js';

const getDesc = (schema: z.ZodTypeAny | undefined): string | undefined => (schema as any)?.description;

const unwrapOptional = (schema: z.ZodTypeAny): z.ZodTypeAny =>
  schema instanceof z.ZodOptional ? (schema as any)._def.innerType : schema;

const getObjectShape = (schema: z.ZodTypeAny): Record<string, z.ZodTypeAny> => {
  const obj = unwrapOptional(schema);
  return ((obj as any)?._def?.shape as Record<string, z.ZodTypeAny>) ?? {};
};

describe('High-Level Design schema – section IDs and accessibility', () => {
  describe('plan schema', () => {
    const planSchema = createHighLevelDesignSchema('plan');
    const planShape = getObjectShape(planSchema);

    it('exposes top-level sections with correct IDs', () => {
      expect(getDesc(planShape.guidingPrinciples)).toBe('4.0');
      expect(getDesc(planShape.currentArchitecture)).toBe('4.1');
      expect(getDesc(planShape.targetArchitecture)).toBe('4.2');
      expect(getDesc(planShape.techStackDeployment)).toBe('4.3');
      expect(getDesc(planShape.nonFunctionalRequirements)).toBe('4.4');
    });

    it('validates using top-level subschemas directly', () => {
      // 4.0 Guiding Principles
      const guiding = planShape.guidingPrinciples as z.ZodTypeAny;
      expect(guiding.safeParse(['rule']).success).toBe(true);
      expect(guiding.safeParse(['']).success).toBe(false);

      // 4.3 Tech Stack & Deployment
      const tech = planShape.techStackDeployment as z.ZodTypeAny;
      expect(tech.safeParse([{ category: 'Language', technology: 'TypeScript' }]).success).toBe(true);
      expect(tech.safeParse([]).success).toBe(false);

      // 4.4 Non-Functional Requirements (container)
      const nfr = planShape.nonFunctionalRequirements as z.ZodTypeAny;
      expect(nfr.safeParse({ performance: [{ id: 'PERF-1', requirement: 'Fast', priority: 'High' }] }).success).toBe(
        true
      );
      // Unknown fields are allowed by default (no .strict() on this object)
      expect(nfr.safeParse({ unknown: true }).success).toBe(true);
    });

    it('exposes 4.1.x nested sections with correct IDs and validates them', () => {
      const currentArch = planShape.currentArchitecture as z.ZodTypeAny;
      const currentArchInner = unwrapOptional(currentArch);
      const currentShape = getObjectShape(currentArchInner);

      expect(getDesc(unwrapOptional(currentShape.dataModels))).toBe('4.1.1');
      expect(getDesc(unwrapOptional(currentShape.components))).toBe('4.1.2');
      expect(getDesc(unwrapOptional(currentShape.dataFlow))).toBe('4.1.3');
      expect(getDesc(unwrapOptional(currentShape.controlFlow))).toBe('4.1.4');
      expect(getDesc(unwrapOptional(currentShape.integrationPoints))).toBe('4.1.5');

      // Minimal valid examples
      expect((currentShape.dataModels as z.ZodTypeAny).safeParse({ diagram: 'erDiagram A' }).success).toBe(true);
      expect((currentShape.components as z.ZodTypeAny).safeParse({ diagram: 'classDiagram A' }).success).toBe(true);
      expect((currentShape.dataFlow as z.ZodTypeAny).safeParse({ diagram: 'graph TD A-->B' }).success).toBe(true);
      expect(
        (currentShape.controlFlow as z.ZodTypeAny).safeParse({ diagram: 'sequenceDiagram A->>B: hi' }).success
      ).toBe(true);
      expect(
        (currentShape.integrationPoints as z.ZodTypeAny).safeParse({ upstream: [{ trigger: 'X', inputData: 'Y' }] })
          .success
      ).toBe(true);

      // Invalid examples
      expect((currentShape.dataModels as z.ZodTypeAny).safeParse({ diagram: 'classDiagram A' }).success).toBe(false);
      // integrationPoints allows both fields optional, so empty object is valid
      expect((currentShape.integrationPoints as z.ZodTypeAny).safeParse({}).success).toBe(true);
    });

    it('exposes 4.2.x nested sections (union) with correct IDs and validates them', () => {
      const targetArch = planShape.targetArchitecture as z.ZodTypeAny;
      expect(getDesc(targetArch)).toBe('4.2');

      const unwrapped = unwrapOptional(targetArch);
      const options: z.ZodTypeAny[] = (unwrapped as any)?._def?.options ?? [];

      // Identify the subsections-only object (has exposedAPI key)
      const subsectionObj = options.find((o: any) => {
        const shape = getObjectShape(o);
        return o instanceof z.ZodObject && shape && Object.prototype.hasOwnProperty.call(shape, 'exposedAPI');
      });
      expect(subsectionObj).toBeDefined();
      const subsectionShape = getObjectShape(subsectionObj as z.ZodTypeAny);

      expect(getDesc(subsectionShape.dataModels)).toBe('4.2.1');
      expect(getDesc(subsectionShape.components)).toBe('4.2.2');
      expect(getDesc(subsectionShape.dataFlow)).toBe('4.2.3');
      expect(getDesc(subsectionShape.controlFlow)).toBe('4.2.4');
      expect(getDesc(subsectionShape.integrationPoints)).toBe('4.2.5');
      expect(getDesc(subsectionShape.exposedAPI)).toBe('4.2.6');

      // Validate minimal valid values against the nested subschemas directly
      expect((subsectionShape.dataModels as z.ZodTypeAny).safeParse({ diagram: 'erDiagram A' }).success).toBe(true);
      expect((subsectionShape.components as z.ZodTypeAny).safeParse({ diagram: 'classDiagram A' }).success).toBe(true);
      expect((subsectionShape.dataFlow as z.ZodTypeAny).safeParse({ diagram: 'graph TD A-->B' }).success).toBe(true);
      expect(
        (subsectionShape.controlFlow as z.ZodTypeAny).safeParse({ diagram: 'sequenceDiagram A->>B: hi' }).success
      ).toBe(true);
      expect(
        (subsectionShape.integrationPoints as z.ZodTypeAny).safeParse({
          downstream: [{ trigger: 't', inputData: 'd' }],
        }).success
      ).toBe(true);
      expect((subsectionShape.exposedAPI as z.ZodTypeAny).safeParse('GET /users').success).toBe(true);

      // Invalid
      expect((subsectionShape.dataModels as z.ZodTypeAny).safeParse({ diagram: 'classDiagram A' }).success).toBe(false);
    });

    it('id→schema index (__byId) exposes section schemas by ID (plan)', () => {
      const index = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      expect(index['4.0']?.description).toBe('4.0');
      expect(index['4.1']?.description).toBe('4.1');
      expect(index['4.2']?.description).toBe('4.2');
      expect(index['4.3']?.description).toBe('4.3');
      expect(index['4.4']?.description).toBe('4.4');
    });
  });

  describe('task schema', () => {
    const taskSchema = createHighLevelDesignSchema('task');
    const taskShape = getObjectShape(taskSchema);

    it('omits sections marked omitted and exposes required/optional with correct IDs', () => {
      // Omitted for task
      expect(taskShape.guidingPrinciples).toBeUndefined(); // 4.0 omitted
      expect(taskShape.currentArchitecture).toBeUndefined(); // 4.1 omitted

      // Present for task
      expect(getDesc(taskShape.targetArchitecture)).toBe('4.2');
      expect(getDesc(taskShape.techStackDeployment)).toBe('4.3');
      expect(getDesc(taskShape.nonFunctionalRequirements)).toBe('4.4');
    });

    it('allows validating section payloads via the extracted subschemas', () => {
      // 4.2 required for task
      const target = taskShape.targetArchitecture as z.ZodTypeAny;
      expect(target.safeParse({ text: ['ok'] }).success).toBe(true);

      // 4.3 optional for task
      const tech = taskShape.techStackDeployment as z.ZodTypeAny;
      expect(tech.safeParse([{ category: 'Runtime', technology: 'Node.js' }]).success).toBe(true);
      expect(tech.safeParse([]).success).toBe(false);

      // 4.4 required for task
      const nfr = taskShape.nonFunctionalRequirements as z.ZodTypeAny;
      expect(nfr.safeParse({ security: [{ id: 'SEC-1', requirement: 'Encrypt', priority: 'High' }] }).success).toBe(
        true
      );
    });

    it('id→schema index (__byId) exposes section schemas by ID (task)', () => {
      const index = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
      expect(index['4.0']).toBeUndefined();
      expect(index['4.1']).toBeUndefined();
      expect(index['4.2']?.description).toBe('4.2');
      expect(index['4.3']?.description).toBe('4.3');
      expect(index['4.4']?.description).toBe('4.4');
    });
  });
});
