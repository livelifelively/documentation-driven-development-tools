# Workflow: Test Implementation Review

**Objective:** To audit the completed test suite for a task, ensuring it is comprehensive and correct _after_ implementation is finished but _before_ the implementation code itself is reviewed.

**Participants:** Human Developer, AI Assistant

**Trigger:** A developer has completed the implementation of a task, including all associated tests, and is ready for the first stage of review.

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

## High-Level Phases

- **Phase 1: Context Gathering** - Build a complete understanding of the task's requirements.
- **Phase 2: Test Suite Audit** - Perform a detailed audit of the test files against the documentation.

---

## Workflow Artifacts

This workflow generates the following artifacts, which are stored in a directory named after the task ID.

- **Path Pattern**: `docs/workflow/<task_id>/`
- **Generated Reports**:
  - `tests-implementation-review.md`: A comprehensive summary of the test suite review.

---

## Phase 1: Context Gathering

**Goal:** For the AI Assistant to build a complete understanding of the task's requirements.

1.  **Human's Action**: Initiate the review.
    - _"Please begin a test strategy review for the task documented in `<path-to-task.md>`."_
2.  **AI Assistant's Action**:
    - Read the task's parent `plan` document(s).
    - Read any relevant peer `task` documents.
    - Thoroughly read the target `*.task.md` file.
3.  **Checkpoint**: The AI Assistant confirms it has the full context.
    - _"I have reviewed the documentation. I am ready to review the test strategy."_

**Exit Criteria:** The AI Assistant has a full contextual understanding of the work.

---

## Phase 2: Test Suite Audit

**Goal:** To perform a detailed audit of the test files against the task documentation.

1.  **AI Assistant's Action**:
    - **Identify Test Files**: Locate all test files associated with the changed source code files (referencing `6.1.2 Files Change Log` and `7.1 Testing Strategy / Requirements`).
    - **Review Test Coverage**: Compare the test cases against the `2.4 Acceptance Criteria`. Are all criteria covered by at least one test?
    - **Review Test Quality**: Evaluate the tests against the `4.2 Target Architecture` and `4.4 Non-Functional Requirements`. Do the tests validate the architecture? Do they cover performance, security, and reliability requirements?
2.  **AI Assistant's Action: Generate Test Review Summary Document**
    - Create and save a new markdown file named `tests-implementation-review.md` in the task's artifact directory (`docs/workflow/<task_id>/`).
    - The document must contain:
      - **Coverage Report**: A checklist mapping each Acceptance Criterion to the corresponding test(s) and its status (e.g., ✅ Covered, ❌ Incomplete).
      - **Quality Assessment**: An analysis of the test suite's robustness, including edge case and error handling.
      - **Recommendations**: A prioritized list of suggestions for new or improved test cases.
    - This file serves as a formal record of the test suite review.
3.  **Human's Action**: Review the summary document and update the test suite to address any gaps.
4.  **Verification**: Run the final test suite and ensure all tests pass.

**Outcome:** The test suite is now considered complete and correct. The implementation is ready for the architectural review.
