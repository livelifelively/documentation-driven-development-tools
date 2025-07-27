# Workflow: Workflow Creation

**Objective:** To collaboratively design and document a new, standardized workflow that can serve as a clear, executable set of instructions for an AI assistant, ensuring consistency and effectiveness across all defined processes.

**Participants:** Human Developer, AI Assistant

**Trigger:** A new repeatable process has been identified that would benefit from being codified into a standard workflow.

---

## Core Principles of a Workflow Document

A workflow document is not passive documentation; it is an **executable instruction set** for an AI assistant. Every workflow we create must adhere to the following principles:

- **Single, Prime Objective:** Each workflow must have a single, clearly defined `Objective`.
- **Defined Trigger:** The specific event that initiates the workflow must be stated.
- **Clear Participants:** The roles (e.g., Human Developer, AI Assistant) must be listed.
- **Phased Approach:** The workflow must be broken down into logical phases, each with a clear goal.
- **Action-Oriented Steps:** Each step must be a clear, actionable instruction for a specific participant.
- **Checkpoints & Outcomes:** Each phase must conclude with a verifiable checkpoint and a defined outcome or exit criteria.

---

## High-Level Phases

- **Phase 1: Conception and Objective Setting**
- **Phase 2: Detailed Phase and Step Design**
- **Phase 3: Finalization and Standardization**

---

## Phase 1: Conception and Objective Setting

**Goal:** To define the purpose, scope, and core components of the new workflow.

1.  **Human's Action: Propose the Workflow**

    - State the need for a new workflow and its intended purpose.
    - _"Let's create a workflow for..."_

2.  **AI Assistant's Action: Propose a Skeleton from a Template**

    - **Scan Existing Workflows:** The AI will first list the files in `src/workflows/` to find an existing workflow with a similar purpose (e.g., for a new "planning" workflow, look at `plan-documentation.md`).
    - **Propose a Skeleton:** Based on the most relevant existing workflow, the AI will propose a skeleton for the new workflow. This includes:
      - `Objective`, `Participants`, `Trigger`
      - The standard `Core Principles of a Workflow Document` section.
      - A `High-Level Phases` section, which provides a bulleted list overview of all phases in the document, copied from the template workflow.

3.  **Checkpoint: Foundational Agreement**
    - The Human and AI Assistant discuss and refine the draft.

**Exit Criteria:** Both parties agree on the workflow's objective, participants, trigger, and the high-level phase structure.

---

## Phase 2: Detailed Phase and Step Design

**Goal:** To flesh out each phase of the workflow with specific, executable steps and checkpoints.

1.  **AI Assistant's Action: Detail Each Phase**

    - For each phase defined in Phase 1, draft the following:
      - A clear `Goal`.
      - A numbered list of `Action` steps for each participant.
      - A `Checkpoint` that defines the tangible output of the phase.
      - The final `Outcome` or `Exit Criteria` for the phase.

2.  **Human's Action: Iterative Refinement**

    - Review the detailed steps for each phase.
    - Provide feedback to clarify, simplify, or correct the proposed steps. This is a collaborative, iterative process. The goal is to make the instructions as unambiguous as possible.

3.  **Checkpoint: Detailed Review**
    - The Human and AI Assistant review the fully-detailed draft of all phases.

**Exit Criteria:** All phases have clearly defined goals, steps, checkpoints, and outcomes that both parties agree are logical and executable.

---

## Phase 3: Finalization and Standardization

**Goal:** To polish the workflow document, ensuring it is clean, consistent, and ready to be used as a standard instruction set.

1.  **AI Assistant's Action: Final Polish**

    - Review the entire document for consistent terminology, formatting, and clarity.
    - Ensure the language is direct and action-oriented.
    - Ensure the standard `Core Principles of a Workflow Document` section is present and correct.

2.  **Human's Action: Final Approval**
    - Read the finalized workflow document from top to bottom.
    - Give final approval.

**Outcome:** The new workflow is saved and becomes a standard, executable process for future conversations.
