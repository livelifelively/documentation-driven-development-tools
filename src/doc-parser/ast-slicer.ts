import { Root, Content } from 'mdast';

/**
 * Slices a remark AST into sections based on Level 2 headings.
 */
export class AstSlicer {
  /**
   * Slices the AST into a map of section IDs to their corresponding AST nodes.
   * @param ast The root of the markdown AST.
   * @returns A map where keys are section IDs (e.g., "1.2") and values are new ASTs for that section.
   */
  slice(ast: Root): Map<string, Root> {
    const sections = new Map<string, Root>();
    let currentSectionId: string | null = null;
    let currentChildren: Content[] = [];

    for (const node of ast.children) {
      if (node.type === 'heading' && node.depth === 2) {
        // If we are in a section, save it before starting a new one.
        if (currentSectionId) {
          sections.set(currentSectionId, { type: 'root', children: currentChildren });
        }

        // Start a new section
        const headingText = this.extractHeadingText(node);
        currentSectionId = this.extractSectionId(headingText);
        currentChildren = [node];
      } else if (currentSectionId) {
        // Add node to the current section
        currentChildren.push(node);
      }
    }

    // Save the last section
    if (currentSectionId) {
      sections.set(currentSectionId, { type: 'root', children: currentChildren });
    }

    return sections;
  }

  /**
   * Extracts the text content from a heading node.
   * @param headingNode The heading AST node.
   * @returns The text content of the heading.
   */
  private extractHeadingText(headingNode: Content): string {
    if (headingNode.type !== 'heading' || !headingNode.children) {
      return '';
    }
    return headingNode.children.map((child: any) => child.value || '').join('');
  }

  /**
   * Extracts a section ID from a heading string (e.g., "1.2 Status" -> "1.2").
   * @param headingText The text of the heading.
   * @returns The section ID, or null if not found.
   */
  private extractSectionId(headingText: string): string | null {
    const match = headingText.match(/^(\d+\.\d+)/);
    return match ? match[1] : null;
  }
}
