# [Plan Name]

## 1 Meta & Governance

### 1.2 Status

<!--
Required: Yes
Description: A section containing key status metrics for the document. The specific fields vary depending on whether it's a Plan or Task, with Tasks providing more detailed implementation tracking.
Content Format: Markdown `###` heading followed by a bulleted list.
Notes: Plan: Document lifecycle + strategic phase. Task: Implementation tracking + execution metrics.
-->
_ADD_CONTENT_HERE_


### 1.3 Priority Drivers

<!--
Required: Yes
Description: A bulleted list of stable Driver IDs that justify the priority of the artefact.
Content Format: Markdown bulleted list.
Notes: Plan: Business/strategic drivers. Task: Inherited drivers + technical execution drivers.
-->
_ADD_CONTENT_HERE_


---

## 2 Business & Scope

### 2.1 Overview

<!--
Required: Yes
Description: Provide a concise, bulleted list outlining what this artefact delivers and why it matters.
Content Format: Markdown bulleted list.
Notes: Plan: Strategic identity & value proposition. Task: Specific deliverable & implementation objective.
-->
_ADD_CONTENT_HERE_


### 2.2 Business Context

<!--
Required: Yes
Description: Provides the narrative and domain-specific details behind the work. If no additional context beyond the parent level is needed, this section can contain `None (inherits from parent)`.
Content Format: Markdown text, with optional `####` sub-headings for child sections (Key Workflows, etc.).
Notes: Strategic context including User Journeys, User Personas, Core Business Rules.
-->
_ADD_CONTENT_HERE_


#### 2.2.1 User Journeys

<!--
Required: Yes
Description: A container for one or more `Journey` sections. This section should provide a complete overview of all primary user paths and interactions related to the document.
Notes: Container for one or more User Journey definitions.
-->
_ADD_CONTENT_HERE_


##### 2.2.1.1 Journey: [Name]

<!--
Required: Yes
Description: A self-contained description of a single, specific user journey. The `[Name]` in the heading should be replaced with a descriptive title for the journey (e.g., "Analyst Processes a New Document"). This section must include a brief narrative explaining the journey's context and a diagram to visualize the flow.
Content Format: A `#####` heading, a brief narrative description, and a Mermaid `graph` or `sequenceDiagram`. This section can be repeated as many times as necessary to document all relevant journeys.
Notes: A repeatable section for a single, named user journey, including a description and diagram.
-->
_ADD_CONTENT_HERE_


#### 2.2.2 User Personas

<!--
Required: Yes
Description: Table or list of personas involved.
Content Format: Markdown table or list.
Notes: Table or list of personas involved.
-->
_ADD_CONTENT_HERE_


#### 2.2.3 Core Business Rules

<!--
Required: Yes
Description: Enumerate domain rules that apply to this artefact.
Content Format: Markdown list.
Notes: Plan: Domain rules that govern this scope. Task: Implementation-specific business constraints.
-->
_ADD_CONTENT_HERE_


#### 2.2.4 User Stories

<!--
Required: Yes
Description: A list of user-centric stories that describe a piece of functionality from the end-user's perspective. This section is most critical for Plans but can be used at the Task level if it provides necessary context. The format "As a [persona], I want [to perform an action], so that I can [achieve a goal]" is recommended.
Content Format: Markdown list.
Notes: User-centric goals and workflows relevant to this Plan scope.
-->
_ADD_CONTENT_HERE_


### 2.3 Success Criteria

<!--
Required: Yes
Description: Measurable or binary statements that define when a Plan is considered complete for its current phase.
Content Format: Markdown list.
Notes: How we know this Plan's strategic objectives are achieved.
-->
_ADD_CONTENT_HERE_


### 2.5 Boundaries & Scope

<!--
Required: Yes
Description: A container heading for the explicit definition of the work's boundaries. Its content is in the child sections `2.5.1 In Scope` and `2.5.2 Out of Scope`.
Notes: Container heading for scope definitions.
-->
_ADD_CONTENT_HERE_


#### 2.5.1 In Scope

<!--
Required: Yes
Description: A bulleted list of functionalities, features, or outcomes that are explicitly included in the scope of the artefact. This list serves as a clear commitment of what will be delivered.
Content Format: Markdown bulleted list.
Notes: A bulleted list of items that are explicitly included in this Plan scope.
-->
_ADD_CONTENT_HERE_


#### 2.5.2 Out of Scope

<!--
Required: Yes
Description: A bulleted list of functionalities, features, or outcomes that are explicitly excluded from the scope of the artefact. This is critical for managing expectations and preventing future misunderstandings. It is often useful to list items that were considered but deliberately deferred.
Content Format: Markdown bulleted list.
Notes: A bulleted list of items that are explicitly excluded from this Plan scope.
-->
_ADD_CONTENT_HERE_


### 2.6 Core Business Processes

<!--
Required: Yes
Description: A container for one or more `Process` sections. This section details the key, step-by-step business workflows that the Plan implements or affects.
Notes: Container for detailed business process descriptions.
-->
_ADD_CONTENT_HERE_


#### 2.6.1 Process: [Name]

<!--
Required: Yes
Description: A self-contained description of a single business process. The `[Name]` should be a descriptive title (e.g., "Document Ingestion and Triage"). This section should detail the participants, goals, and steps of the process.
Content Format: A `####` heading, followed by narrative text, bullet points, or a Mermaid diagram to illustrate the process flow.
Notes: A repeatable section for a single, named business process.
-->
_ADD_CONTENT_HERE_


---

## 3 Planning & Decomposition

### 3.1 Roadmap (In-Focus Items)

<!--
Required: Yes
Description: A table of direct child Plans/Tasks that are currently planned for implementation in the active cycle.
Content Format: Markdown table.
Notes: Plan: Lists the immediate child Plans/Tasks being actively worked on.
-->
_ADD_CONTENT_HERE_


### 3.2 Backlog / Icebox

<!--
Required: Yes
Description: A list of direct child Plans/Tasks that have been considered but are not scheduled for the current implementation cycle. This is crucial for capturing scope decisions.
Content Format: Markdown list.
Notes: Plan: Lists considered but de-scoped or deferred child Plans/Tasks.
-->
_ADD_CONTENT_HERE_


### 3.3 Dependencies

<!--
Required: Yes
Description: An explicit list of internal or external dependencies that must be resolved before this Plan/Task can be completed.
Content Format: Markdown table or list.
Notes: Plan: External dependencies affecting this scope. Task: Other Tasks/Plans this implementation depends on.
-->
_ADD_CONTENT_HERE_


### 3.4 Decomposition Graph

<!--
Required: Yes
Description: A Mermaid diagram that visually represents the dependencies and sequencing of the child Plans/Tasks listed in the `3.1 Roadmap`. This graph shows the relationship between child Plans and Tasks, clarifying the critical path and helping developers understand the required order of implementation.
Content Format: Mermaid `graph` diagram.
-->
_ADD_CONTENT_HERE_


---

## 4 High-Level Design

### 4.0 Guiding Principles

<!--
Required: Yes
Description: A list of high-level architectural rules, patterns, or constraints that apply to the entire artefact (e.g., "All UI components must be stateless," "All services must be idempotent"). These principles guide all subsequent design decisions.
Content Format: Markdown list.
Notes: Plan: High-level architectural rules that govern this scope.
-->
_ADD_CONTENT_HERE_


### 4.1 Current Architecture

<!--
Required: Yes
Notes: Plan: Existing system analysis for planning. Task: Not applicable (inherits context from Plan).
-->
_ADD_CONTENT_HERE_


#### 4.1.1 Data Models

<!--
Required: Yes
Notes: Plan: Current entity relationships analysis. Task: Not applicable.
-->
_ADD_CONTENT_HERE_


#### 4.1.2 Components

<!--
Required: Yes
Notes: Plan: Current component relationships analysis. Task: Not applicable.
-->
_ADD_CONTENT_HERE_


#### 4.1.3 Data Flow

<!--
Required: Yes
Notes: Plan: Current data movement analysis. Task: Not applicable.
-->
_ADD_CONTENT_HERE_


#### 4.1.4 Control Flow

<!--
Required: Yes
Notes: Plan: Current system interactions analysis. Task: Not applicable.
-->
_ADD_CONTENT_HERE_


#### 4.1.5 Integration Points

<!--
Required: Yes
Notes: Plan: Current external system boundaries analysis. Task: Not applicable.
-->
_ADD_CONTENT_HERE_


##### 4.1.5.1 Upstream Integrations

<!--
Required: Yes
Notes: Plan: Current systems this scope consumes analysis. Task: Not applicable.
-->
_ADD_CONTENT_HERE_


##### 4.1.5.2 Downstream Integrations

<!--
Required: Yes
Notes: Plan: Current systems this scope serves analysis. Task: Not applicable.
-->
_ADD_CONTENT_HERE_


### 4.2 Target Architecture

<!--
Required: Yes
Notes: Plan: Proposed system design. Task: Implementation architecture requirements.
-->
_ADD_CONTENT_HERE_


#### 4.2.1 Data Models

<!--
Required: Yes
Description: The structure of data at a high level, often represented as an Entity-Relationship Diagram. This section defines the core data entities and their relationships before detailing the components that manage them.
Content Format: Mermaid `erDiagram`.
Notes: Plan: Target entity relationships. Task: Implementation data structures.
-->
_ADD_CONTENT_HERE_


#### 4.2.2 Components

<!--
Required: Yes
Description: A diagram illustrating the main components and their relationships. The term "component" is used broadly and does not necessarily map to a class; it represents a logical block of functionality.
Content Format: Mermaid `classDiagram` diagram.
Notes: Plan: Target component architecture. Task: Implementation component interfaces.
-->
_ADD_CONTENT_HERE_


#### 4.2.3 Data Flow

<!--
Required: Yes
Description: A diagram showing how data moves between components, with numbered steps to indicate the sequence of actions.
Content Format: Mermaid `graph` diagram. The labels on the connectors should be numbered (e.g., `"1 - Action"`).
Notes: Plan: Target data movement patterns. Task: Implementation data transformations.
-->
_ADD_CONTENT_HERE_


#### 4.2.4 Control Flow

<!--
Required: Yes
Description: A diagram showing the sequence of interactions between components.
Content Format: Mermaid `sequenceDiagram`.
Notes: Plan: Target interaction patterns. Task: Implementation operation sequences.
-->
_ADD_CONTENT_HERE_


#### 4.2.5 Integration Points

<!--
Required: Yes
Description: A container for defining all systems, services, or APIs that this component interacts with, broken down into `Upstream` and `Downstream` sections.
Notes: Plan: Target integration strategy. Task: Implementation integration contracts.
-->
_ADD_CONTENT_HERE_


##### 4.2.5.1 Upstream Integrations

<!--
Required: Yes
Description: Defines how this artefact is triggered and what data it receives from other systems.
Content Format: Markdown list or table.
Notes: Plan: Target upstream systems. Task: Implementation upstream dependencies.
-->
_ADD_CONTENT_HERE_


##### 4.2.5.2 Downstream Integrations

<!--
Required: Yes
Description: Defines what happens when this artefact completes its work and what data it sends to other systems.
Content Format: Markdown list or table.
Notes: Plan: Target downstream systems. Task: Implementation downstream contracts.
-->
_ADD_CONTENT_HERE_


#### 4.2.6 Exposed API

<!--
Required: Yes
Description: The API surface this component exposes to consumers.
Content Format: OpenAPI/Swagger snippet, or a Markdown table.
Notes: Plan: Public API strategy. Task: Specific API implementation specification.
-->
_ADD_CONTENT_HERE_


### 4.3 Tech Stack & Deployment

<!--
Required: Yes
Description: A list of the primary technologies, frameworks, or libraries foundational to this artefact, along with the deployment strategy.
Content Format: Markdown list or table.
Notes: Plan: Technology choices and deployment strategy. Task: Implementation-specific tech requirements (if relevant).
-->
_ADD_CONTENT_HERE_


### 4.4 Non-Functional Requirements

<!--
Required: Yes
Description: A container for the high-level, non-functional requirements (NFRs) or quality attributes that the system must meet. This section defines what the requirements are, while the `7. Quality & Operations` family describes how they will be tested and monitored.
Notes: Plan: Quality attributes strategy. Task: Implementation-specific NFR targets.
-->
_ADD_CONTENT_HERE_


#### 4.4.1 Performance

<!--
Required: Yes
Description: Defines the performance-related NFRs, such as response times, throughput, and resource utilization, in a prioritized table.
Content Format: Markdown table.
Notes: Plan: Performance strategy. Task: Specific performance targets.
-->
_ADD_CONTENT_HERE_


#### 4.4.2 Security

<!--
Required: Yes
Description: Defines the security-related NFRs, such as data encryption, access control, and vulnerability standards, in a prioritized table.
Content Format: Markdown table.
Notes: Plan: Security approach. Task: Implementation security requirements.
-->
_ADD_CONTENT_HERE_


#### 4.4.3 Reliability

<!--
Required: Yes
Description: Defines the reliability-related NFRs, such as uptime, data integrity, and disaster recovery, in a prioritized table.
Content Format: Markdown table.
Notes: Plan: Reliability strategy. Task: Implementation reliability targets.
-->
_ADD_CONTENT_HERE_


#### 4.4.4 Permission Model

<!--
Required: Yes
Description: Defines the access control rules, user roles, and permissions for the system. This section should clearly outline who can access what and perform which actions. The mechanism for assigning these roles in each environment should be detailed in the `7.2 Configuration` section.
Content Format: A Markdown table or bulleted list describing the roles and their associated permissions.
Notes: Plan: Access control strategy. Task: Implementation-specific permissions (if relevant).
-->
_ADD_CONTENT_HERE_


---

## 5 Maintenance and Monitoring

### 5.1 Current Maintenance and Monitoring

<!--
Required: Yes
Notes: Plan: Existing observability analysis for planning. Task: Not applicable (inherits context from Plan).
-->
_ADD_CONTENT_HERE_


#### 5.1.1 Error Handling

<!--
Required: Yes
Notes: Plan: Current error handling analysis. Task: Not applicable.
-->
_ADD_CONTENT_HERE_


#### 5.1.2 Logging & Monitoring

<!--
Required: Yes
Notes: Plan: Current observability analysis. Task: Not applicable.
-->
_ADD_CONTENT_HERE_


### 5.2 Target Maintenance and Monitoring

<!--
Required: Yes
Notes: Plan: Target observability strategy. Task: Implementation requirements.
-->
_ADD_CONTENT_HERE_


#### 5.2.1 Error Handling

<!--
Required: Yes
Description: The strategy for managing and communicating errors, often best represented as a table detailing the condition, trigger, action, and feedback.
Content Format: Markdown table.
Notes: Plan: Target error handling strategy. Task: Specific error scenarios and implementation requirements.
-->
_ADD_CONTENT_HERE_


#### 5.2.2 Logging & Monitoring

<!--
Required: Yes
Description: The strategy for system observability.
Content Format: Markdown list or table.
Notes: Plan: Target observability strategy. Task: Specific logging/monitoring implementation requirements.
-->
_ADD_CONTENT_HERE_


---

## 6 Implementation Guidance

### 6.1 Implementation Plan

<!--
Required: Yes
Description: A detailed, step-by-step log of the implementation process for a Task.
Content Format: Markdown list.
Notes: Plan: Phased rollout strategy for child Plans/Tasks. Task: Direct implementation approach (if complex).
-->
_ADD_CONTENT_HERE_


### 6.2 Prompts (LLM reuse)

<!--
Required: No
Description: A collection of prompts that can be used with an LLM to assist in the implementation.
Content Format: Markdown code blocks.
Notes: Plan: Strategic prompts for planning. Task: Implementation-specific prompts.
-->
_ADD_CONTENT_HERE_


---

## 7 Quality & Operations

### 7.1 Testing Strategy / Requirements

<!--
Required: Yes
Description: The overall strategy for testing, and a list of specific tests that must pass, often mapping to Acceptance Criteria.
Content Format: Markdown table.
Notes: Plan: Overall testing approach and strategy. Task: Specific tests and requirements for implementation.
-->
_ADD_CONTENT_HERE_


### 7.2 Configuration

<!--
Required: Yes
Description: How the system is configured in different environments (e.g., production, development).
Content Format: Markdown list or table.
Notes: Plan: Configuration strategy and approach. Task: Implementation-specific configuration requirements.
-->
_ADD_CONTENT_HERE_


### 7.3 Alerting & Response

<!--
Required: Yes
Description: How to respond to alerts and operational logs, especially errors, and how they are integrated with alerting systems.
Content Format: Markdown list or table.
Notes: Plan: Alerting strategy and response protocols. Task: Implementation-specific alerts and responses.
-->
_ADD_CONTENT_HERE_


### 7.4 Deployment Steps

<!--
Required: Yes
Description: Any manual steps required to deploy the component.
Content Format: Markdown list.
Notes: Plan: Deployment strategy and approach. Task: Not applicable (Tasks don't handle deployment).
-->
_ADD_CONTENT_HERE_


---

## 8 Reference

### 8.1 Appendices/Glossary

<!--
Required: No
Description: A place for glossaries, appendices, or links to external resources.
Content Format: Markdown list or text.
Notes: Additional information or definitions.
-->
_ADD_CONTENT_HERE_


---
