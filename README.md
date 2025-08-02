# DDD Tools

[![NPM version](https://img.shields.io/npm/v/ddd-tools.svg)](https://www.npmjs.com/package/ddd-tools)

A command-line interface (CLI) to support and enforce a Documentation-Driven Development (DDD) workflow. This toolset helps developers create, manage, and validate a documentation-first project structure.

## Quick Start

### From Repository (Recommended)

```bash
# Clone and setup
git clone <repository-url>
cd ddd-tools
npm install

# Run CLI commands
./ddd.sh --help
./ddd.sh template plan my-first-plan
```

### Global Installation

```bash
# Install globally from npm registry
npm install -g @livelifelively/ddd-tools

# OR install globally from local repository
npm install -g .

# Run CLI commands
ddd --help
ddd template plan my-first-plan
```

## Core Concepts

This tool is built around a Documentation-Driven Development methodology, which follows a simple principle: **Document -> Implement -> Validate**. All development work is driven by clear, version-controlled documentation.

The documentation is organized into a flexible hierarchy of **Plans** and **Tasks**:

- **Plans** (`*.plan.md`): Define high-level strategic direction, architecture, and business requirements.
- **Tasks** (`*.task.md`): Describe the specific implementation details for a piece of work.

## Local Development Setup

To set up the `ddd` command for local development, follow these steps:

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Link the CLI**: This command makes the `ddd` executable available in your system's path, allowing you to run it from any directory.

    ```bash
    npm link
    ```

    After these steps, you can run `ddd --help` to verify that the command is working.

## Usage

### `ddd template`

This command generates new `plan` or `task` template files with automatic ID assignment based on the project's existing structure.

**Syntax**

```bash
# Create a Plan
ddd template plan <name> [--parent <parent-filename>]

# Create a Task (requires a parent)
ddd template task <name> --parent <parent-filename>
```

**Examples**

```bash
# Creates docs/requirements/p1-user-management.plan.md
ddd template plan user-management

# Creates docs/requirements/p2-another-plan.plan.md (if p1 exists)
ddd template plan another-plan

# Creates docs/requirements/p1.t1-user-authentication.task.md
ddd template task user-authentication --parent p1-user-management.plan.md
```

### `ddd start`

Starts work on a specific task by creating a dedicated Git branch and updating the task's status.

**Syntax**

```bash
ddd start <task_id>
```

_`<task_id>` is the full name of the task file, e.g., `p1.t1-user-authentication.task.md`_

**What it does:**

1.  Creates and checks out a new Git branch named `task/<task_id>`.
2.  Updates the `Current State` in the task file to `⏳ In Progress`.

### `ddd commit`

Guides you through creating a compliant commit message that is automatically linked to your current task.

**Syntax**

```bash
ddd commit
```

**What it does:**

1.  Checks that you are on a `task/...` branch.
2.  Extracts the `<task_id>` from the branch name.
3.  Prompts you for the `type`, `scope`, and `subject` of your commit.
4.  Stages all changes (`git add .`).
5.  Creates a commit with the formatted message: `type(scope): subject (refs: <task_id>)`.

## Git Integration

This project uses a `commit-msg` Git hook to ensure that every commit message is linked to a valid task. This is configured automatically when you run `npm install`. This hook enforces the DDD workflow by preventing commits that don't reference a task.

## Contributing

This project is developed using the very same DDD methodology it helps to enforce. All new features or changes start with a `plan` or `task` document. If you wish to contribute, please start by creating a document that outlines your proposed changes.
