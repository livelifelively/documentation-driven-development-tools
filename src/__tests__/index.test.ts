import {
  fullSchema,
  generateHumanSchemaDocumentation,
  generateMachineSchemaDocumentation,
  generatePlanTemplate,
  generateTaskTemplate,
} from '../index';

describe('DDD Schema Generation System', () => {
  // Test 1: Verify that the full schema loads correctly
  test('should load all 8 schema families', () => {
    expect(fullSchema).toBeInstanceOf(Array);
    expect(fullSchema.length).toBe(8);
    // Check for a key property in each family to ensure they are loaded
    fullSchema.forEach((family, index) => {
      expect(family).toHaveProperty('id', index + 1);
      expect(family).toHaveProperty('name');
      expect(family).toHaveProperty('sections');
    });
  });

  // Test 2: Snapshot test for human-readable documentation
  test('should generate consistent human-readable documentation', () => {
    const humanReadableDoc = generateHumanSchemaDocumentation();
    expect(humanReadableDoc).toMatchSnapshot();
  });

  // Test 3: Snapshot test for machine-readable documentation
  test('should generate consistent machine-readable documentation', () => {
    const machineReadableDoc = generateMachineSchemaDocumentation();
    expect(machineReadableDoc).toMatchSnapshot();
  });

  // Test 4: Validate the structure of the generated Plan template
  test('should generate a valid Plan template', () => {
    const planTemplate = generatePlanTemplate();
    expect(planTemplate).toContain('# [Plan Name]');
    // Check for a required section from a family applicable to plans
    expect(planTemplate).toContain('## 2 Business & Scope');
    expect(planTemplate).toContain('### 2.1 Overview');
    // Check that an omitted section is not present
    expect(planTemplate).not.toContain('A section omitted for plans');
  });

  // Test 5: Validate the structure of the generated Task template
  test('should generate a valid Task template', () => {
    const taskTemplate = generateTaskTemplate();
    expect(taskTemplate).toContain('# [Task Name]');
    // Check for a required section from a family applicable to tasks
    expect(taskTemplate).toContain('## 6 Implementation Guidance');
    expect(taskTemplate).toContain('### 6.1 Implementation Plan');
    // Check that an omitted section is not present
    expect(taskTemplate).not.toContain('A section omitted for tasks');
  });
});

import { getApplicabilitySymbol, renderContentElement, renderContent } from '../index';

describe('DDD Schema Rendering', () => {
  test('getApplicabilitySymbol should return "?" for unknown values', () => {
    // @ts-ignore
    expect(getApplicabilitySymbol('unknown')).toBe('❓');
  });

  test('renderContentElement should handle unknown types', () => {
    // @ts-ignore
    const result = renderContentElement({ type: 'unknown', rendering: {} }, 'human');
    expect(result).toEqual({ type: 'text', text: '' });
  });

  test('renderContentElement should handle default case in switch', () => {
    // @ts-ignore
    const result = renderContentElement({ type: 'default', rendering: { renderAsCodeBlockForHuman: true } }, 'human');
    expect(result.content).toBe('');
  });

  test('renderContent should handle unknown content types', () => {
    const result = renderContent({ type: 'unknown' });
    expect(result).toBe('');
  });

  test('renderContent should handle content without title or content', () => {
    const result = renderContent({ type: 'section' });
    expect(result).toBe('');
  });
});
