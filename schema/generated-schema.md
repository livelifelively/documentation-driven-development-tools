# Documentation Schema

This file defines **which information appears where** in our Documentation-Driven Development (DDD) hierarchy and **why**. Use it as the canonical source when updating templates or building automation.

## Legend

| Symbol | Meaning                |
| ------ | ---------------------- |
| ✅     | Required               |
| ❓     | Optional (recommended) |
| ➖     | Not applicable / omit  |

> **Note on Usage in Document Headings:** In addition to their meaning in the schema tables below, these icons are used in the headings of the actual `*.md` files to indicate the **completion status** of a section.
>
> - `## ✅ [Section Name]`: Indicates the section is considered **complete**.
> - `## ❓ [Section Name]`: Indicates the section is **incomplete, a placeholder, or needs review**.
> - `## ➖ [Section Name]`: Indicates the section is **not applicable** and has been intentionally omitted.

## Family Index

| #   | Family (Anchor)                                           | Primary Question Answered                                        | Plan | Task |
| --- | --------------------------------------------------------- | ---------------------------------------------------------------- | ---- | ---- |
| 1   | [Meta & Governance](#meta--governance)                    | How critical is this work, what is its current status?           | ✅   | ✅   |
| 2   | [Business & Scope](#business--scope)                      | Why are we doing this?                                           | ✅   | ✅   |
| 3   | [Planning & Decomposition](#planning--decomposition)      | What are we building, in what order?                             | ✅   | ❓   |
| 4   | [High-Level Design](#high-level-design)                   | What are the high-level components and interactions? (Black-Box) | ✅   | ✅   |
| 5   | [Maintenance and Monitoring](#maintenance-and-monitoring) | What are the internal details needed to build it? (White-Box)    | ✅   | ✅   |
| 6   | [Implementation Guidance](#implementation--guidance)      | What are the practical steps?                                    | ✅   | ✅   |
| 7   | [Quality & Operations](#quality--operations)              | How do we validate & run it?                                     | ✅   | ✅   |
| 8   | [Reference](#reference)                                   | What other info might we need?                                   | ❓   | ❓   |

Each plan document now begins with a **family heading** (`## Business & Scope`, etc.). An artefact includes a family only if it has relevant content; otherwise the heading may read `None (inherits from parent)`.

## Context Inheritance Protocol

The Plan/Task hierarchy is not just an organizational tool; it is a strict protocol for context inheritance. To correctly interpret any document, it is **mandatory** to have first processed its parent.

- To understand a **sub-Plan**, you must first read its **parent Plan**.
- To understand a **Task**, you must first read its **parent Plan** (and any parent Plans above it).

This top-down traversal is the only way to gather the complete context required for implementation, as information is progressively narrowed and not repeated at lower levels. Automated tools and LLMs **MUST** enforce this reading order.
