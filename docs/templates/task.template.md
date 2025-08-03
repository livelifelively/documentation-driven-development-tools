# [Task Name]

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


#### 2.2.3 Core Business Rules

<!--
Required: No
Description: Enumerate domain rules that apply to this artefact.
Content Format: Markdown list.
Notes: Plan: Domain rules that govern this scope. Task: Implementation-specific business constraints.
-->
_ADD_CONTENT_HERE_


### 2.4 Acceptance Criteria

<!--
Required: Yes
Description: A verifiable, tabular list of conditions that a Task must satisfy to be considered complete.
Content Format: Markdown table.
Notes: Verifiable conditions that define when this Task is complete.
-->
_ADD_CONTENT_HERE_


---

## 3 Planning & Decomposition

### 3.3 Dependencies

<!--
Required: Yes
Description: An explicit list of internal or external dependencies that must be resolved before this Plan/Task can be completed.
Content Format: Markdown table or list.
Notes: Plan: External dependencies affecting this scope. Task: Other Tasks/Plans this implementation depends on.
-->
_ADD_CONTENT_HERE_


---

## 4 High-Level Design

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
Required: No
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
Required: No
Description: Defines the access control rules, user roles, and permissions for the system. This section should clearly outline who can access what and perform which actions. The mechanism for assigning these roles in each environment should be detailed in the `7.2 Configuration` section.
Content Format: A Markdown table or bulleted list describing the roles and their associated permissions.
Notes: Plan: Access control strategy. Task: Implementation-specific permissions (if relevant).
-->
_ADD_CONTENT_HERE_


---

## 5 Maintenance and Monitoring

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
Required: No
Description: A detailed, step-by-step log of the implementation process for a Task.
Content Format: Markdown list.
Notes: Plan: Phased rollout strategy for child Plans/Tasks. Task: Direct implementation approach (if complex).
-->
_ADD_CONTENT_HERE_


### 6.1 Implementation Log / Steps

<!--
Required: Yes
Description: A detailed, step-by-step log of the implementation process for a Task. This is often updated as the task progresses.
Content Format: Markdown list.
Notes: Plan: Not applicable (Plans don't implement). Task: Detailed step-by-step execution log.
-->
_ADD_CONTENT_HERE_


#### 6.1.1 Initial Situation

<!--
Required: Yes
Notes: Plan: Not applicable. Task: Baseline state before implementation begins.
-->
_ADD_CONTENT_HERE_


#### 6.1.2 Files Change Log

<!--
Required: Yes
Notes: Plan: Not applicable. Task: File modifications tracking during implementation.
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


### 7.5 Local Test Commands

<!--
Required: Yes
Description: CLI commands to run tests locally.
Content Format: Markdown code blocks.
Notes: Plan: Not applicable (Plans don't execute tests). Task: CLI commands to run tests locally.
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
