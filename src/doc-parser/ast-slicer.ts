import { Root } from 'mdast';
import { visit } from 'unist-util-visit';

/**
 * Finds a section in a document AST based on its heading.
 * @param documentAst The full document AST.
 * @param sectionHeading The heading text to search for (e.g., "1.2 Status").
 * @returns The AST for the found section, or null if not found.
 */
export function findSection(documentAst: Root, sectionHeading: string): Root | null {
  let sectionNode: Root | null = null;
  let inSection = false;
  const sectionChildren = [];

  const headingParts = sectionHeading.split(' ');
  const sectionId = headingParts[0]; // e.g., "1.2"

  for (const node of documentAst.children) {
    if (node.type === 'heading') {
      if (inSection) {
        // We've reached the next heading, so the section ends here.
        break;
      }
      // A bit lenient: check if the heading starts with the section ID
      if ('children' in node && node.children[0]?.type === 'text' && node.children[0].value.startsWith(sectionId)) {
        inSection = true;
      }
    }
    if (inSection) {
      sectionChildren.push(node);
    }
  }

  if (sectionChildren.length > 0) {
    sectionNode = {
      type: 'root',
      children: sectionChildren,
    };
  }

  return sectionNode;
}
