# Workflow: Human-Led Implementation Review

## Workflow Definition

### Objective

To conduct a thorough, human-driven review of newly implemented code, using tests and a debugger to validate, refine, and extend the code with direct human oversight.

### Participants

- Human Developer
- AI Assistant

### Trigger

AI-led implementation of a Task is complete, and the work is ready for a detailed, interactive review by a human.

### Control Model

**Human-Led (Instructional)** - The Human Developer provides specific, step-by-step instructions. The AI Assistant executes these instructions precisely and waits for the next command.

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

- **Phase 1: Setup and Initial Review**
- **Phase 2: Interactive Debugging and Refinement**
- **Phase 3: Finalization and Documentation Sync**

---

## Phase 1: Setup and Initial Review

**Goal:** To prepare the environment and establish a logical review order by analyzing code dependencies.

1.  **AI Assistant's Action: Identify Task Files and Propose Review Order**

    - Prompt the Human for the relevant Task ID or Git branch name associated with the completed implementation.
    - Based on the provided context (e.g., `git diff`), identify all files that were modified or created.
    - For each file, parse its content to identify imports from other files within the same task implementation.
    - Construct a dependency graph.
    - Perform a topological sort to determine the optimal review order (least dependent to most dependent).
    - Present the ordered list of files to the Human as the recommended review sequence.

2.  **Human's Action: Approve Order and Begin Review**

    - Approve the proposed order.
    - Instruct the AI to open the relevant Task document (`*.task.md`) and the first file in the review sequence.

3.  **AI Assistant's Action: Present Information**

    - Display the contents of the requested files.

4.  **Human's Action: Initial Validation**

    - Instruct the AI to run the tests associated with the Task to get a baseline.

5.  **AI Assistant's Action: Execute Tests**
    - Run the tests and present the results.

**Checkpoint:** The Human has approved a dependency-ordered review plan and has the first file and its tests ready for inspection.

**Exit Criteria:** The environment is set up for a logical, dependency-based review, and the Human has a baseline understanding of the implementation's starting point.

---

## Phase 2: Interactive Debugging and Refinement

**Goal:** To perform a comprehensive, human-led analysis of the code's control/data flows, algorithmic efficiency, and overall correctness, using an interactive debugging process to drive iterative refinements.

1.  **Human's Action: Prepare for Debugging**

    - For the current file under review, the Human sets breakpoints at key locations. Optionally, the Human can instruct the AI to analyze the code and _suggest_ useful breakpoints.
    - The Human runs the tests in debug mode, or instructs the AI to do so if a `start:debug` script is available.

2.  **Human's Action: Drive the Interactive Review**

    - As the debugger pauses, the Human inspects the program state (variables, call stack) and steps through the code to analyze control flow, data transformations, and algorithmic logic.
    - The Human can instruct the AI to evaluate expressions or provide more context on specific variables.

3.  **Human's Action: Direct or Perform Code Modifications**

    - Based on the review, the Human decides on necessary changes, which may include refactoring algorithms, correcting logic, or modifying data models.
    - The Human can either make these changes directly in their editor or instruct the AI to perform the specific modifications.

4.  **AI Assistant's Action: Support and Validate**
    - If instructed, apply specified code modifications.
    - Re-run the tests to validate the changes and present the results.
    - Provide analysis or suggestions when requested.

**Checkpoint:** The Human has thoroughly analyzed the code's behavior and directed or performed all necessary refinements for the current file.

**Exit Criteria:** The code for the file under review is considered correct, robust, and efficient. All associated tests are passing. The review proceeds to the next file in the dependency-ordered list.

---

## Phase 3: Finalization and Documentation Sync

**Goal:** To ensure the final code is clean, all discoveries from the review are propagated back into the relevant documentation, and the workflow is formally concluded by the Human.

1.  **Human's Action: Initiate Finalization**

    - Once the review of all files is complete, instruct the AI to begin the finalization process.

2.  **Human's Action: Direct Documentation Updates**

    - Review all changes made during the session.
    - Instruct the AI to update the `*.task.md` file with any necessary changes (e.g., to `Acceptance Criteria`, `Implementation Log / Steps`, `Target Architecture`).
    - If any changes have broader implications (e.g., a data model change affecting other components), instruct the AI to update the relevant parent `*.plan.md` documents as well.

3.  **AI Assistant's Action: Synchronize All Documentation**

    - Apply the specified changes to all relevant Task and Plan documents.

4.  **Human's Action: Direct Code Cleanup**

    - Instruct the AI to remove any remaining breakpoints or temporary debugging code.

5.  **AI Assistant's Action: Sanitize Code**

    - Remove all debugging artifacts from the codebase and confirm completion.

6.  **Human's Action: Final Approval**
    - Perform a final check of the code and documentation.
    - Formally approve the completion of the _review workflow_.

**Checkpoint:** The code is sanitized, and all levels of documentation (`Task` and `Plan`) accurately reflect the final, reviewed implementation.

**Exit Criteria:** The Human has given final approval, concluding the Human-Led Implementation Review workflow. The Task is now ready for the next step in its lifecycle (e.g., integration testing, final sign-off).
