# Workflow: Task Implementation

**Objective:** To define a standardized, repeatable process for an AI Assistant to implement a `*.task.md` document, ensuring all contextual documentation is reviewed and the implementation adheres to the specifications defined in the DDD framework.

**Participants:** Human Developer, AI Assistant

**Trigger:** The Human Developer assigns a `*.task.md` file to the AI Assistant for implementation.

> **Note:** For detailed instructions on using the CLI, see the main [README.md](../../README.md).

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

## Phase 1: Context Gathering & Planning

**Goal:** To ensure the AI Assistant has a complete understanding of the task's requirements by reading all relevant documentation in the correct hierarchical and peer order.

1.  **AI Assistant's Action: Identify the Document Hierarchy**

    - Parse the filename of the assigned `*.task.md` to identify its parent `*.plan.md` documents.
    - Construct the full hierarchical path of documents to be read.

2.  **AI Assistant's Action: Read Parent Plans and Identify Peers**

    - Read the contents of each parent `*.plan.md` in the hierarchy, starting from the top-level plan.
    - From the immediate parent plan, review the `3.1 Roadmap (In-Focus Items)` and `3.3 Dependencies` sections to identify any relevant sibling tasks or plans.

3.  **AI Assistant's Action: Read Peer Documents and Final Task**

    - Read any identified sibling/peer `*.task.md` or `*.plan.md` documents to understand the immediate context and potential interactions.
    - Read the assigned `*.task.md` document last.
    - Synthesize the complete inherited and peer context.

4.  **AI Assistant's Action: Acknowledge and Confirm Understanding**

    - State that all contextual documents (hierarchy and peers) have been read.
    - Briefly summarize the task's objective and key deliverables to confirm understanding with the Human Developer.
    - Propose a high-level implementation plan based on the task's requirements.

5.  **Checkpoint: Plan Approval**
    - The Human Developer reviews the AI's summary and plan.

**Exit Criteria:** The Human Developer confirms the AI's understanding and approves the implementation plan.

---

## Phase 2: Test Authoring

**Goal:** To write a comprehensive suite of tests that verify the `Acceptance Criteria` before any implementation code is written.

**Core Principle for this Phase:** Changes to existing files must be minimal and strictly limited to the scope of the task. Existing functionality and code must not be altered.

1.  **AI Assistant's Action: Write Failing Tests**

    - Based on the `7.1 Testing Strategy / Requirements` and `2.4 Acceptance Criteria` in the task document, write the test files.
    - The tests should fail initially, as the implementation code does not yet exist.
    - Run the tests using the `Local Test Commands` and confirm they fail as expected.

2.  **Human's Action: Review Tests**

    - Review the tests to ensure they accurately reflect the requirements and cover all acceptance criteria.

3.  **Checkpoint: Failing Tests Approved**
    - The Human Developer approves the failing tests.

**Exit Criteria:** A full suite of failing tests that cover the acceptance criteria is complete and approved.

---

## Phase 3: Implementation & Logging

**Goal:** To execute the implementation steps as defined in the task document, while maintaining a clear log of all actions taken.

**Core Principle for this Phase:** Changes to existing files must be minimal and strictly limited to the scope of the task. Existing functionality and code must not be altered.

1.  **AI Assistant's Action: Explain and Execute Implementation Steps**

    - For each step in the `Implementation Log / Steps` of the `*.task.md` document:
      - **Explain the "Why":** Before executing, briefly state the purpose of the step and reference the specific section of the task document that requires it (e.g., "As required by `Acceptance Criteria` AC-3, I will now add...").
      - **Execute the Step:** Use the appropriate tools (`write_to_file`, `replace_in_file`, `execute_command`, etc.) to perform the required action.

2.  **AI Assistant's Action: Log Actions in the Task Document**

    - After each significant action, update the `Implementation Log / Steps` section in the `*.task.md` file to reflect the work done.
    - Mark completed steps with `[x]`.
    - If new steps are discovered, add them to the log.

3.  **Human's Action: Monitor and Provide Feedback**

    - Observe the AI's progress.
    - Provide clarification or correction if the AI deviates from the plan or encounters an ambiguity.

4.  **Checkpoint: Implementation Review**
    - Periodically, or when a major part of the implementation is complete, the AI presents the work done.

**Exit Criteria:** All implementation steps in the `*.task.md` are completed and logged. The resulting code and artifacts are ready for validation.

---

## Phase 4: Validation & Completion

**Goal:** To verify that the implementation meets all acceptance criteria and to formally complete the task.

1.  **AI Assistant's Action: Run Validation Checks**

    - Execute any `Local Test Commands` specified in the task document.
    - Systematically verify that each item in the `Acceptance Criteria` table has been met.

2.  **AI Assistant's Action: Report Validation Results**

    - Present the results of the tests and the acceptance criteria verification to the Human Developer.
    - Report any failures or discrepancies.

3.  **Human's Action: Final Review and Approval**

    - The Human Developer performs a final review of the implemented code and artifacts.
    - Confirms that the work meets all requirements.

4.  **AI Assistant's Action: Finalize Task Document**

    - Update the `Meta & Governance` section of the `*.task.md` file.
    - Set the `Current State` to `✅ Complete`.
    - Fill in the `Completed` timestamp.

5.  **Checkpoint: Task Completion**
    - The AI Assistant formally presents the completed task and the final, updated task document.

**Outcome:** The task is successfully implemented, validated, and documented as complete. The project is ready for the next task.
