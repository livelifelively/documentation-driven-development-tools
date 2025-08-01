# Workflow: Task Pre-Implementation Review

**Objective:** To systematically review a `*.task.md` document before implementation begins, ensuring it is complete, compliant with the documentation schema, and that its technical and testing strategies are sound.

**Participants:**

- Human Developer
- AI Assistant

**Trigger:** A `*.task.md` document is ready for technical review before being moved to the "In Progress" state.

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

- **Phase 1: Context Gathering & Initial Compliance Check (Families 1 & 2 Review)**
- **Phase 2: Planning & Decomposition Review (Family 3 Review)**
- **Phase 3: Architectural & Design Review (Family 4 Review)**
- **Phase 4: Implementation & Operational Review (Families 5 & 6 Review)**
- **Phase 5: Quality & Testing Review (Family 7 Review)**
- **Phase 6: Final Synthesis & Recommendation (Family 8 & Go/No-Go)**

---

## Workflow Artifacts

This workflow generates the following artifacts, which are stored in a directory named after the task ID.

- **Path Pattern**: `docs/workflow/<task_id>/`
- **Generated Reports**:
  - `pre-implementation-review.md`: A comprehensive summary of the pre-implementation review, including all phase reports.

---

## Phase 1: Context Gathering & Initial Compliance Check (Families 1 & 2 Review)

**Goal:** To load the full context and perform a compliance check on the "Meta & Governance" and "Business & Scope" families.

1.  **AI Assistant's Action: Load Full Context**

    - Parse the task's filename to identify the full parent hierarchy.
    - Read all parent `*.plan.md` documents from top to bottom to inherit strategic context.
    - Read the target `*.task.md` document.
    - Acknowledge that the full context has been loaded.

2.  **AI Assistant's Action: Review Family 1 (Meta & Governance)**

    - Verify that all required sections (`Status`, `Priority Drivers`) are present and correctly populated.

3.  **AI Assistant's Action: Review Family 2 (Business & Scope)**

    - Verify that `Overview` and `Acceptance Criteria` are clear and well-defined.
    - Ensure that every criterion in the `Acceptance Criteria` table is specific, measurable, and testable.

4.  **Checkpoint: Initial Compliance Report**
    - The AI presents a report on the compliance of Families 1 and 2, noting any missing information or ambiguities.

**Exit Criteria:** Families 1 and 2 are confirmed to be complete and compliant with the schema.

---

## Phase 2: Planning & Decomposition Review (Family 3 Review)

**Goal:** To review the task's dependencies and its place within the larger project plan.

1.  **AI Assistant's Action: Review Family 3 (Planning & Decomposition)**

    - Check the `3.3 Dependencies` section for any listed internal or external dependencies.
    - Cross-reference with the parent plan's `Roadmap` and `Decomposition Graph` to ensure alignment.

2.  **Checkpoint: Dependency Report**
    - The AI presents a report on the task's dependencies, highlighting any potential risks or blockers.

**Exit Criteria:** Family 3 is confirmed to be complete and aligned with the parent plan.

---

## Phase 3: Architectural & Design Review (Family 4 Review)

**Goal:** To conduct an in-depth review of the technical design defined in Family 4.

1.  **AI Assistant's Action: Review Family 4 (High-Level Design)**

    - **`4.2 Target Architecture`**: Ensure all required diagrams (`erDiagram`, `classDiagram`, etc.) are present, syntactically correct, and logically sound.
    - **`4.4 Non-Functional Requirements`**: Assess if the NFRs are specific, measurable, and appropriate for the task's scope.
    - **Alignment Check**: Verify that the proposed architecture is consistent with the guiding principles and constraints set in the parent plan(s).

2.  **Checkpoint: Architectural Review Report**
    - The AI presents a detailed analysis of the technical architecture, noting any inconsistencies, potential issues, or areas of concern.

**Exit Criteria:** Family 4 is confirmed to be architecturally sound and ready for implementation.

---

## Phase 4: Implementation & Operational Review (Families 5 & 6 Review)

**Goal:** To review the implementation plan and operational considerations.

1.  **AI Assistant's Action: Review Family 5 (Maintenance and Monitoring)**

    - Verify that `Error Handling` and `Logging & Monitoring` strategies are defined and appropriate.

2.  **AI Assistant's Action: Review Family 6 (Implementation Guidance)**

    - Review the `6.1 Implementation Log / Steps` to ensure they are clear, logical, and detailed enough to be executed without ambiguity.

3.  **Checkpoint: Implementation Plan Report**
    - The AI presents a report on the readiness of the implementation and operational plans.

**Exit Criteria:** Families 5 and 6 are confirmed to be complete and actionable.

---

## Phase 5: Quality & Testing Review (Family 7 Review)

**Goal:** To ensure a robust quality and testing strategy is in place.

1.  **AI Assistant's Action: Review Family 7 (Quality & Operations)**

    - **`7.1 Testing Strategy / Requirements`**: Verify that every `ID` in the `2.4 Acceptance Criteria` table is covered by a specific test case in this table.
    - **`7.2 Configuration`**: Check for any required configuration and ensure it is well-documented.
    - **`7.5 Local Test Commands`**: Verify that the commands needed to run the tests are present and appear correct.

2.  **Checkpoint: Quality Strategy Report**
    - The AI presents a report on the completeness of the testing strategy, highlighting any gaps in coverage.

**Exit Criteria:** Family 7 is confirmed to provide a comprehensive and sufficient quality assurance plan.

---

## Phase 6: Final Synthesis & Recommendation (Family 8 & Go/No-Go)

**Goal:** To synthesize all findings and provide a final recommendation.

1.  **AI Assistant's Action: Review Family 8 (Reference)**

    - Check for any supplementary materials.

2.  **AI Assistant's Action: Synthesize, Recommend, and Document**

    - **Synthesize Findings**: Consolidate the reports from all previous phases into a single, comprehensive summary.
    - **Provide Recommendation**: Conclude with a clear "Go", "Go with Conditions", or "No-Go" recommendation.
    - **Generate Artifact**: Create and save a `pre-implementation-review.md` file in the task's artifact directory (`docs/workflow/<task_id>/`). This document will contain the full, consolidated report and the final recommendation, serving as the formal record of the review.
    - The AI then presents the path to this new report to the Human Developer.

3.  **Human's Action: Make the Final Decision**
    - Review the AI's final recommendation.
    - Make the final call: Approve the task for implementation, request revisions, or cancel it.

**Outcome:** A clear, documented decision on whether to proceed with the implementation of the task has been made.
