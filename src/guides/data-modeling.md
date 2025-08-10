# Internal Guide: Data Modeling and Event Contracts

Purpose: Shared standards for modeling data and defining contracts used by our documentation-driven development tools. This guide informs how we author diagrams and types across plans/tasks.

## 1. Model Layers (what each is for)

- Conceptual Model: domain language, entities, relationships, high-level constraints.
- Logical Data Model (LDM): attributes, keys, cardinalities, normalization (ER/UML Class).
- Physical Model: tables/indexes/serialization; out of scope for our planning docs.
- Contract Model: event/message/API schemas and versioning (separate from LDM).

## 2. What belongs in the Data Model (LDM)

- Entities: stable, identifiable nouns with lifecycle (e.g., `DocumentFile`, `Section`).
- Value Objects: structured values without identity, owned by entities.
- Relationships: cardinality, optionality, integrity constraints.
- Managed Metadata: schemas, versions, configuration that is stored or referenced persistently.

What does not belong in the LDM

- Components/APIs/Services/Functions.
- Control/Process flow.
- Events as actions (use Contract Model instead).
- Purely transient artifacts unless explicitly persisted.

## 3. Event/Contract Model (separate but linked)

- Purpose: Define integration boundaries and runtime payloads.
- Events: names, channels/topics, payload schema, versioning and compatibility.
- Payloads reference LDM types by name (e.g., `DocumentData`, `LintingError`).
- Canonical result shape (generic):

```ts
type ValidationResult<Payload, Err, Ctx> =
  | { success: true; data: Payload; context: Ctx }
  | { success: false; errors: Err[]; context: Ctx };
```

Example (doc-parser): `ValidationResult<DocumentData, LintingError, ValidationContext>`

## 4. Diagram Conventions

- ER (Mermaid `erDiagram` or UML Class):
  - Entities as PascalCase nouns; primary keys marked clearly.
  - Relationships labeled with verbs; cardinalities shown.
  - Attributes are domain facts, not behavior.
- Component & Flow Diagrams:
  - Keep runtime interactions here (parsing, validation, event emission).
  - Do not duplicate ER content; reference entity names where needed.

## 5. Core Domain Types (templates + example)

- Templates (use these generic roles in any project):

  - `PrimaryEntity` (entity): the main record (e.g., Document, Order, Ticket).
  - `SubEntity` (entity): a contained/granular record (e.g., Section, LineItem).
  - `DataAggregate` (value/aggregate): structured output shaped by the model.
  - `RuleSet` (managed metadata): schema/specification + versioning.
  - `ValidationContext` (managed metadata): environment, provider/source, config.
  - `DomainError` (value): structured violation/error item.
  - `ValidationResult<Payload, Err, Ctx>` (contract): discriminated result (see §3).

- Example mapping (doc-parser):
  - `PrimaryEntity` → `DocumentFile`
  - `SubEntity` → `Section`
  - `DataAggregate` → `DocumentData`
  - `RuleSet` → `Schema`
  - `ValidationContext` → `ValidationContext`
  - `DomainError` → `LintingError`

Notes

- `AstNode` is a parsing artifact; keep it out of the LDM unless persisted.
- Events (`parsing.success`, `validation.failed`, etc.) live in the Contract Model.

## 6. Checklist (use during reviews)

- Entity or Value? Has identity and lifecycle → Entity; else Value.
- Belongs to LDM? Stored/referenced across operations → yes; transient runtime-only → Contract/Flow.
- Names are nouns (entities) and verbs (relationships)?
- Cardinalities present and correct (||, |{, }|, o{, etc.)?
- No components/APIs in ER diagrams.
- Contracts reference LDM types instead of redefining data.
- Versioning/compatibility addressed for contracts.

## 7. References (quick pointers)

- Chen: Entity–Relationship Model (1976)
- Codd: Relational Model (1970)
- Date: An Introduction to Database Systems
- Elmasri & Navathe: Fundamentals of Database Systems
- Evans: Domain-Driven Design; Vernon: DDD Distilled
- Fowler: UML Distilled; Patterns of Enterprise Application Architecture
- Hay/Silverston: Data Model Patterns; Data Model Resource Book
- DAMA-DMBOK (governance); Kimball & Ross (dimensional)

---

Scope note: This guide lives in `src/guides/` because it standardizes how our tools define and enforce models across consuming projects. Generated docs and project-specific requirements remain under `docs/`.

## 8. Concept Map

```mermaid
graph TD
  subgraph Perspectives
    C[Conceptual Model]
    L[Logical Data Model]
    P[Physical Model]
    X[Contract Model]
  end

  subgraph Domain Constructs
    E[Entities]
    V[Value Objects]
    R[Relationships]
    M[Managed Metadata]
  end

  subgraph Contracts
    EV[Events]
    PR[API Payloads]
    VR[ValidationResult]
  end

  C --> L
  L --> P
  L --> X

  L --> E
  L --> V
  L --> R
  L --> M

  X --> EV
  X --> PR
  X --> VR

  %% Doc Parser examples
  E -->|example| DF[DocumentFile]
  E -->|example| SEC[Section]
  V -->|example| LD[LintingError]
  M -->|example| SC[Schema]
  M -->|example| VC[ValidationContext]
  PR -->|references| DD[DocumentData]
  VR -->|carries| DD
  VR -->|carries| LD
  VR -->|includes| VC
```

## 9. Learning Path (ordered progression)

Follow these steps to build a solid, practical understanding of data modeling. Each step references sections above.

1. Vocabulary & Scope (see §2)

   - Learn Entities vs Value Objects; Aggregates; Relationships; Managed Metadata.
   - Identify what belongs in a data model vs. implementations.

2. Model Layers & Diagrams (see §1, §4)

   - Understand Conceptual → Logical → Physical models.
   - Learn ER basics and UML Class basics; when to use each.

3. Keys, Constraints, Normalization (Logical modeling)

   - Primary/Foreign/Alternate keys; uniqueness and check constraints.
   - 1NF → 3NF → BCNF; when (and why) to denormalize.

4. Relationships & Cardinality (see §4)

   - One-to-One, One-to-Many, Many-to-Many; optionality and ownership.
   - Modeling associative entities for Many-to-Many.

5. Separation of Concerns (see §3)

   - Distinguish Data Model from Contracts/APIs/Events and from Process/Flow.
   - Define contracts that reference domain types instead of duplicating them.

6. Apply Templates to Your Domain (see §5)

   - Map `PrimaryEntity`, `SubEntity`, `DataAggregate`, `RuleSet`, `DomainError`, `ValidationContext`.
   - Build a minimal ER first; iterate with real use cases.

7. Evolution & Governance

   - Versioning for both data schemas and contracts; migration strategies.
   - Naming conventions, lineage, and documentation standards.

8. Performance & Specializations

   - Dimensional modeling (facts/dimensions) for analytics vs OLTP models.
   - NoSQL patterns (document/column/graph) and when to adapt models.

9. Review & Checklists (see §6)
   - Run the checklist; validate cardinalities, keys, and separation.
   - Cross-check contracts and diagrams for consistency.

```mermaid
flowchart TD
  A[Vocabulary & Scope] --> B[Model Layers & Diagrams]
  B --> C[Keys, Constraints, Normalization]
  C --> D[Relationships & Cardinality]
  D --> E[Separation of Concerns]
  E --> F[Apply Templates to Domain]
  F --> G[Evolution & Governance]
  G --> H[Performance & Specializations]
  H --> I[Review & Checklists]

  %% Quick references
  A -. see §2 .-> A2
  B -. see §1, §4 .-> B2
  E -. see §3 .-> E2
  F -. see §5 .-> F2
  I -. see §6 .-> I2
```
