# Workflow: Post-Implementation Documentation Synchronization

**Objective:** To synchronize the `*.task.md` document and its parent `*.plan.md` documents with the final implementation. This ensures any discoveries, changes, or improvements made during the coding phase are accurately reflected in all relevant documentation, maintaining it as the definitive source of truth.

**Participants:** Human Developer, AI Assistant

**Trigger:** The `Implementation Review` and `Tests Implementation Review` workflows are complete. The code has been finalized, approved, and is considered ready for merge.

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

- **Phase 1: Context Gathering & Discrepancy Analysis**
- **Phase 2: Task Document Synchronization**
- **Phase 3: Plan Document Synchronization**
- **Phase 4: Final Verification and Closure**

---

## Workflow Artifacts

This workflow generates the following artifacts, which are stored in a directory named after the task ID.

- **Path Pattern**: `docs/workflow/<task_id>/`
- **Generated Reports**:
  - `post-implementation-discrepancy-report.md`: A detailed report of differences between the code and documentation.

---

## Phase 1: Context Gathering & Discrepancy Analysis

**Goal:** To build a complete, shared understanding of the final implementation and to identify any differences between the code and the existing documentation (`*.task.md` and `*.plan.md`).

1.  **Human's Action: Initiate Synchronization**

    - The developer triggers the workflow by providing the path to the completed `*.task.md` file.
    - _"Please begin documentation synchronization for the task at `<path-to-task.md>`."_

2.  **AI Assistant's Action: Gather Full Context and Changed Files**

    - **Step 2a: Read Documentation:**

      - Read the provided `*.task.md` and its full parent hierarchy (`*.plan.md` files).

    - **Step 2b: Identify Changed Files (Automated & Interactive):**

      - The AI will first attempt to automatically find the changed files by assuming it is on a feature branch.
      - **Scenario 1 (Pre-Merge):**
        - The AI executes `git diff --name-only main...HEAD` (or a similar command for the project's primary branch).
        - If this command returns a list of files, the AI proceeds with that list.
      - **Scenario 2 (Post-Merge / Interactive Fallback):**
        - If the previous command returns an empty list, the AI assumes the branch has been merged.
        - It then invokes the interactive commit selection utility (as defined in task `p1-p2-p3.t27-interactive-commit-selection.task.md`) to prompt the Human Developer to select the correct merge commit.
        - The AI uses the selected commit hash to get the list of changed files.

    - **Step 2c: Read Changed File Contents:**
      - Using the file list obtained from either Scenario 1 or 2, the AI reads the contents of each changed file to build a complete picture of the implementation.

3.  **AI Assistant's Action: Perform Discrepancy Analysis**

    - **Code vs. Task Document:** Systematically compare the implementation against the `*.task.md`, focusing on:
      - `4.2 Target Architecture`: Does the code's structure match the diagrams?
      - `5.2 Target Maintenance and Monitoring`: Is the error handling and logging implemented as designed?
      - `7.2 Configuration`: Are all configuration variables present and used correctly?
    - **Code vs. Plan Document(s):** Compare the implementation against the parent `*.plan.md` files, focusing on:
      - `4.0 Guiding Principles`: Does the code adhere to the high-level architectural rules?
      - `4.2 Target Architecture`: Does the implementation align with the broader system design?

4.  **Checkpoint: Discrepancy Report**

    - The AI Assistant creates and saves a `post-implementation-discrepancy-report.md` file to the artifact directory (`docs/workflow/<task_id>/`).
    - This report lists all identified discrepancies between the final code and the documentation, structured by document (`Task` then `Plan`).
    - The AI then presents the path to this new report to the Human Developer for review.

**Exit Criteria:** The Human Developer reviews and approves the `Discrepancy Report`, confirming it accurately captures the changes needed to synchronize the documentation.

---

## Phase 2: Task Document Synchronization

**Goal:** To update the `*.task.md` document to accurately reflect the final state of the implementation, based on the approved `Discrepancy Report`.

1.  **AI Assistant's Action: Propose Task Document Changes**

    - Based on the approved discrepancies, generate the specific changes required for the `*.task.md` file.
    - This includes, but is not limited to:
      - **Updating `6.1.2 Files Change Log`** with the definitive list of changed files obtained from `git`.
      - Correcting architectural diagrams in `4.2 Target Architecture`.
      - Updating configuration details in `7.2 Configuration`.
      - Aligning any other sections with the final implementation.

2.  **Human's Action: Review and Approve Changes**

    - Review the proposed changes for accuracy and completeness.
    - Provide feedback or grant approval to proceed.

3.  **AI Assistant's Action: Apply Changes**

    - Apply the approved changes to the `*.task.md` document using its available file manipulation capabilities.

**Checkpoint:** The `*.task.md` file is updated and reflects the final implementation.

**Exit Criteria:** The `*.task.md` document is fully synchronized with the final implementation, and the changes have been approved by the Human Developer.

---

## Phase 3: Plan Document Synchronization

**Goal:** To update any parent `*.plan.md` documents to reflect architectural changes or discoveries that emerged during the implementation of a child task.

1.  **AI Assistant's Action: Identify and Propose Plan Changes**

    - Review the `Discrepancy Report` for any items related to parent plans.
    - If discrepancies exist, propose the necessary changes to the relevant `*.plan.md` file(s).
    - If no discrepancies related to plans were found, state this and recommend skipping to the next phase.

2.  **Human's Action: Review and Approve Changes**

    - Review the proposed changes to the plan(s) for accuracy and strategic alignment.
    - Provide feedback or grant approval to proceed.

3.  **AI Assistant's Action: Apply Changes**

    - Apply the approved changes to the relevant `*.plan.md` document(s) using available file manipulation capabilities.

**Checkpoint:** All relevant `*.plan.md` files are updated and reflect the final implementation details.

**Exit Criteria:** All affected parent `*.plan.md` documents are fully synchronized, and the changes have been approved by the Human Developer.

---

## Phase 4: Final Verification and Closure

**Goal:** To formally conclude the synchronization process, ensuring all documentation is consistent and the work is officially closed and versioned.

1.  **AI Assistant's Action: Final Confirmation**

    - The AI Assistant states that all approved changes from the `Discrepancy Report` have been applied to the documentation.
    - It presents a list of all the document files that were modified.

2.  **Human's Action: Final Review**

    - The Human Developer performs a final spot-check of the modified documents to ensure everything is in order.

3.  **AI Assistant's Action: Commit Documentation Changes**

    - Once final approval is given, the AI Assistant commits the documentation changes to Git with a standardized message.
    - **Commit Message:** `docs(sync): synchronize docs for task <task_id>`

**Checkpoint:** All documentation changes are committed to version control.

**Outcome:** The documentation is now the definitive source of truth for the implemented feature. The synchronization workflow is complete.
