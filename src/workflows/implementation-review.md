# Workflow: Implementation Review

**Objective:** To review the source code's architectural alignment and quality, assuming its functional correctness has already been verified by a robust and approved test suite.

**Participants:** Human Developer, AI Assistant

**Trigger:** The `Test Implementation Review` for a task is complete, and the developer is ready for the source code review.

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

- **Phase 1: Context and Prerequisite Check** - Verify that the test review is complete and gather context.
- **Phase 2: Source Code Audit** - Perform a detailed audit of the implementation code against the documentation.

---

## Phase 1: Context and Prerequisite Check

**Goal:** To ensure the `Test Implementation Review` is complete and to build full context before reviewing the source code.

1.  **Human's Action: Initiate Review**

    - _"Please begin an implementation review for the task documented in `<path-to-task.md>`."_

2.  **AI Assistant's Action: Prerequisite Verification & Context Gathering**

    - Verify that the `Test Implementation Review` for the task has been completed and the test suite was approved.
    - Read the provided `*.task.md` and its full parent hierarchy (`*.plan.md` files) to build complete context.

3.  **Checkpoint: Readiness Confirmation**
    - The AI Assistant confirms that the prerequisite is met and it has the full context.
    - _"The test suite has been approved. I have reviewed the documentation and am ready to review the implementation."_

**Exit Criteria:** The AI Assistant has confirmed the test suite is approved and has a full contextual understanding of the work.

---

## Phase 2: Source Code Audit

**Goal:** To review the source code for architectural alignment and quality, with high confidence that its functionality is already verified by the robust test suite.

1.  **AI Assistant's Action: Source Code Audit**

    - Identify the primary source code files (excluding tests).
    - **Architectural Alignment Audit**: Compare the code's structure against the `4.2 Target Architecture` in the task document.
    - **Code Quality and Security Audit**: Scan the code for potential issues not covered by functional tests, such as security vulnerabilities, performance bottlenecks, or poor maintainability.

2.  **Checkpoint: Implementation Audit Report**

    - The AI Assistant will produce a final report containing:
      - An **Architectural Alignment Report**.
      - A **Code Quality and Security Report** with a prioritized list of issues.

3.  **Human's Action: Remediation**
    - Review the report and implement any final refactoring or fixes.
    - Run the test suite a final time to ensure no regressions were introduced.

**Outcome:** The implementation is fully reviewed, corrected, and verified. The code is ready to be merged.
