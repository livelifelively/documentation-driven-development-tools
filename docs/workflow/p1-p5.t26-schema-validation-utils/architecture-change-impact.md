# Architecture Change Impact Analysis

## Proposed Change: SectionProcessor Interface Redesign

This document analyzes how the proposed `SectionProcessor` interface redesign would impact the architecture defined in `p1-p5.t18-core-engine-parser.task.md`.

## Current Architecture (t18) vs Proposed Architecture

### **Current Architecture (t18)**

#### **SectionProcessor Interface**

```typescript
interface SectionProcessor {
  sectionId: string;
  lint(sectionAst: Root): LintingError[];
  extract(sectionAst: Root): any;
  getTargetPath(): string;
}
```

#### **CoreEngine Responsibilities**

1. **File Reading**: Reads the complete markdown file
2. **AST Generation**: Converts markdown to AST using MarkdownParser
3. **AST Slicing**: Uses AstSlicer to slice AST into sections
4. **Plugin Orchestration**: For each section:
   - Gets appropriate processor from PluginManager
   - Calls `lint(sectionAst)` on processor
   - Calls `extract(sectionAst)` on processor
   - Aggregates results

#### **Data Flow**

```
File → CoreEngine → MarkdownParser → AST → AstSlicer → Section ASTs → Plugins
```

### **Proposed Architecture (After Redesign)**

#### **SectionProcessor Interface**

```typescript
interface SectionProcessor {
  sectionId: string;
  process(documentAst: Root): { data: any; errors: LintingError[] };
  getTargetPath(): string;
}
```

#### **CoreEngine Responsibilities**

1. **File Reading**: Reads the complete markdown file
2. **AST Generation**: Converts markdown to AST using MarkdownParser
3. **Plugin Orchestration**: For each registered processor:
   - Calls `process(fullDocumentAst)` on processor
   - Aggregates results

#### **Data Flow**

```
File → CoreEngine → MarkdownParser → Full AST → Plugins (self-contained)
```

## Detailed Impact Analysis

### **Components That Would Change**

| Component            | Current Role                      | Proposed Role                | Impact Level |
| -------------------- | --------------------------------- | ---------------------------- | ------------ |
| **CoreEngine**       | Orchestrates slicing + processing | Orchestrates processing only | 🔴 High      |
| **AstSlicer**        | Slices AST into sections          | **REMOVED**                  | 🔴 High      |
| **PluginManager**    | Provides processors               | Provides processors          | 🟡 Medium    |
| **SectionProcessor** | Processes pre-sliced AST          | Processes full document AST  | 🔴 High      |
| **MarkdownParser**   | Converts to AST                   | Converts to AST              | ✅ None      |

### **Architecture Diagrams - Before vs After**

#### **Current Class Diagram (t18)**

```mermaid
classDiagram
    direction TB

    class CoreEngine {
        +PluginManager pluginManager
        +MarkdownParser markdownParser
        +AstSlicer astSlicer
        +parse(filePath): ParseResult
    }

    class MarkdownParser {
        +toAst(content): AstRoot
    }

    class AstSlicer {
        +slice(ast): Map<string, AstRoot>
    }

    class PluginManager {
        -SectionProcessor[] processors
        +loadPlugins(directory): void
        +getProcessor(sectionId): SectionProcessor
    }

    class SectionProcessor {
        <<interface>>
        +sectionId: string
        +lint(astNode): LintingError[]
        +extract(astNode): object
    }

    CoreEngine o-- PluginManager
    CoreEngine o-- MarkdownParser
    CoreEngine o-- AstSlicer
    PluginManager o-- "0..*" SectionProcessor
```

#### **Proposed Class Diagram**

```mermaid
classDiagram
    direction TB

    class CoreEngine {
        +PluginManager pluginManager
        +MarkdownParser markdownParser
        +parse(filePath): ParseResult
    }

    class MarkdownParser {
        +toAst(content): AstRoot
    }

    class PluginManager {
        -SectionProcessor[] processors
        -Plugin[] plugins
        +loadPlugins(directory): void
        +getProcessor(sectionId): SectionProcessor
        +getPlugin(pluginId): Plugin
    }

    class SectionProcessor {
        <<interface>>
        +sectionId: string
        +process(documentAst): object
    }

    class Plugin {
        <<interface>>
        +pluginId: string
        +execute(filePath: string): Promise<PluginResult>
    }

    class StatusPlugin {
        +execute(filePath: string): Promise<PluginResult>
    }

    class MCPPlugin {
        +execute(filePath: string): Promise<PluginResult>
    }

    class ExternalAPI {
        +call(data: any): Promise<any>
    }

    class MCPServer {
        +request(data: any): Promise<any>
    }

    CoreEngine o-- PluginManager
    CoreEngine o-- MarkdownParser
    PluginManager o-- "0..*" SectionProcessor
    PluginManager o-- "0..*" Plugin
    StatusPlugin --> ExternalAPI
    MCPPlugin --> MCPServer
```

### **Data Flow Comparison**

#### **Current Data Flow (t18)**

```mermaid
graph TD
    A[File Path] --> B(Core Engine);
    B -- "1: Reads File" --> C[File Content];
    C --> D(Markdown Parser);
    D -- "2: Produces AST" --> E(AstSlicer);
    E -- "3: Slices AST into Sections" --> B;
    B -- "4: Gets Processor via PluginManager" --> F(Section Processor);
    B -- "5: Sends Section AST to Processor" --> F;
    F -- "6: Returns Data/Errors" --> B;
    B --> G[ParseResult];
```

#### **Proposed Data Flow**

```mermaid
graph TD
    A[File Path] --> B(Core Engine);
    B -- "1: Reads File" --> C[File Content];
    C --> D(Markdown Parser);
    D -- "2: Produces Full AST" --> B;
    B -- "3: Gets Processors via PluginManager" --> F(Section Processors);
    B -- "4: Sends Full AST to Each Processor" --> F;
    F -- "5: Returns Data/Errors" --> B;
    B --> G[ParseResult];
```

### **Control Flow Comparison**

#### **Current Control Flow (t18)**

```mermaid
sequenceDiagram
    participant API
    participant CoreEngine
    participant MarkdownParser
    participant PluginManager

    API->>CoreEngine: parse("path/to/file.md")
    CoreEngine->>CoreEngine: readFileContent()
    CoreEngine->>MarkdownParser: toAst(content)
    MarkdownParser-->>CoreEngine: ast
    CoreEngine->>PluginManager: loadPlugins()
    PluginManager-->>CoreEngine: processors loaded
    loop for each section in AST
        CoreEngine->>PluginManager: getProcessor(sectionId)
        PluginManager-->>CoreEngine: processor
        CoreEngine->>processor: lint(sectionNode)
        processor-->>CoreEngine: errors[]
        CoreEngine->>processor: extract(sectionNode)
        processor-->>CoreEngine: data
    end
    CoreEngine-->>API: { data, errors }
```

#### **Proposed Control Flow**

```mermaid
sequenceDiagram
    participant API
    participant CoreEngine
    participant MarkdownParser
    participant PluginManager

    API->>CoreEngine: parse("path/to/file.md")
    CoreEngine->>CoreEngine: readFileContent()
    CoreEngine->>MarkdownParser: toAst(content)
    MarkdownParser-->>CoreEngine: fullAst
    CoreEngine->>PluginManager: loadPlugins()
    PluginManager-->>CoreEngine: processors loaded
    loop for each registered processor
        CoreEngine->>PluginManager: getProcessor(sectionId)
        PluginManager-->>CoreEngine: processor
        CoreEngine->>processor: process(fullAst)
        processor-->>CoreEngine: {data, errors}
    end
    CoreEngine-->>API: { data, errors }
```

## Benefits of the Proposed Change

### **1. Simplified Architecture**

- **Removes AstSlicer**: No longer needed as plugins handle their own section extraction
- **Simplifies CoreEngine**: Fewer responsibilities, cleaner code
- **Reduces Dependencies**: One less component to maintain

### **2. Better Encapsulation**

- **Self-contained Plugins**: Each plugin knows how to find its own section
- **Schema Integration**: Plugins can use schema for both validation and extraction
- **Consistent Processing**: Single method handles both validation and extraction

### **3. Improved Maintainability**

- **Single Source of Truth**: Schema drives both validation and extraction
- **Easier Testing**: Plugins can be tested with full document AST
- **Better Error Handling**: Plugins can provide context-aware errors

### **4. Enhanced Flexibility**

- **Schema-Driven**: Extraction can use field definitions from schema
- **Type Safety**: Better typing for extracted data
- **Future-Proof**: Easier to add new processing capabilities

## Proposed Third Entry Point: Plugin Execution

### **Current Entry Points (index.ts)**

```typescript
// 1. Parse and validate task file
export async function parseTask(filePath: string): Promise<ParseResult>;

// 2. Validate task file only
export async function lintTask(filePath: string): Promise<LintingError[]>;
```

### **Proposed Plugin Entry Points**

```typescript
// 3. Direct plugin execution (plugins become entry points)
export async function executeStatusPlugin(filePath: string): Promise<PluginResult>;
export async function executeMCPPlugin(filePath: string): Promise<PluginResult>;
export async function executeAnalyticsPlugin(filePath: string): Promise<PluginResult>;

// 4. Generic plugin execution
export async function executePlugin(filePath: string, pluginId: string): Promise<PluginResult>;
export async function executePlugins(filePath: string, pluginIds: string[]): Promise<PluginResult[]>;

// 5. Pull mechanism entry points
export async function getTaskStatus(filePath: string): Promise<TaskStatus>;
export async function getAllTaskStatuses(directoryPath: string): Promise<TaskStatus[]>;
export async function getSectionData(filePath: string, sectionId: string): Promise<any>;
```

### **Plugin Interface Design (Push Mechanism)**

```typescript
interface Plugin {
  pluginId: string;
  description: string;
  requiredSections: string[]; // e.g., ['1.2', '2.1']

  /**
   * Execute plugin logic with extracted section data (PUSH)
   * @param sectionData Map of sectionId -> extracted data
   * @returns Plugin execution result
   */
  execute(sectionData: Record<string, any>): Promise<PluginResult>;
}

interface PluginResult {
  pluginId: string;
  success: boolean;
  data?: any;
  error?: string;
}
```

### **Query Interface Design (Pull Mechanism)**

```typescript
interface TaskQueryAPI {
  /**
   * Get current status of a task (PULL)
   * @param filePath Path to the task file
   * @returns Current task status
   */
  getTaskStatus(filePath: string): Promise<TaskStatus>;

  /**
   * Get all tasks in a directory (PULL)
   * @param directoryPath Path to directory containing task files
   * @returns Array of task statuses
   */
  getAllTaskStatuses(directoryPath: string): Promise<TaskStatus[]>;

  /**
   * Get specific section data from a task (PULL)
   * @param filePath Path to the task file
   * @param sectionId Section to extract (e.g., '1.2')
   * @returns Section data
   */
  getSectionData(filePath: string, sectionId: string): Promise<any>;
}

interface TaskStatus {
  filePath: string;
  currentState: string;
  priority: string;
  progress: number;
  lastUpdated: string;
  errors: LintingError[];
}
```

### **Example Plugin Use Cases**

1. **Status Sync Plugin**: Extracts status data and updates external project management tools
2. **MCP Integration Plugin**: Sends task data to MCP server for AI processing
3. **Notification Plugin**: Sends notifications based on status changes
4. **Analytics Plugin**: Sends metrics to analytics platforms

### **Data Flow for Plugin Execution**

```mermaid
graph TD
    A[Task File] --> B[parseTask]
    B --> C[Extracted Data]
    C --> D[Plugin Manager]
    D --> E[Plugin 1: Status Sync]
    D --> F[Plugin 2: MCP Integration]
    D --> G[Plugin 3: Analytics]
    E --> H[External API]
    F --> I[MCP Server]
    G --> J[Analytics Platform]
```

### **Plugin as Entry Point Architecture**

```mermaid
graph TD
    A[Task File] --> B[StatusPlugin.execute]
    A --> C[MCPPlugin.execute]
    A --> D[AnalyticsPlugin.execute]
    B --> E[External Project Management]
    C --> F[MCP Server]
    D --> G[Analytics Platform]

    subgraph "Plugin Entry Points"
        B
        C
        D
    end
```

### **Data Flow for Pull Mechanism**

```mermaid
graph TD
    A[External System] --> B[getTaskStatus]
    A --> C[getAllTaskStatuses]
    A --> D[getSectionData]
    B --> E[Task File]
    C --> F[Directory Scan]
    D --> G[Section Extraction]
    E --> H[Status Response]
    F --> I[Status Array]
    G --> J[Section Data]
```

### **Combined Push/Pull Architecture**

```mermaid
graph TD
    subgraph "Push Mechanism"
        A1[Task File Change] --> B1[Plugin.execute]
        B1 --> C1[External System Update]
    end

    subgraph "Pull Mechanism"
        A2[External System Query] --> B2[getTaskStatus]
        B2 --> C2[Task File Read]
        C2 --> D2[Status Response]
    end

    subgraph "Shared Components"
        E[Task File]
        F[Schema Validation]
        G[Data Extraction]
    end
```

## Migration Strategy

1. Update `SectionProcessor` interface
2. Create new `process()` method signature
3. Update existing plugins to new interface

### **Phase 2: CoreEngine Simplification**

1. Remove `AstSlicer` dependency
2. Update `CoreEngine` to pass full AST to plugins
3. Simplify orchestration logic

### **Phase 3: Schema Integration**

1. Add schema-driven extraction to plugins
2. Implement unified validation/extraction logic
3. Add type safety improvements

### **Phase 4: Plugin System Implementation**

1. Design and implement `Plugin` interface
2. Add `executePlugins()` entry point to `index.ts`
3. Create example plugins (Status Sync, MCP Integration)
4. Update `PluginManager` to handle both processors and plugins

## Conclusion

The proposed architecture change would significantly simplify the system while improving encapsulation and maintainability. The removal of `AstSlicer` and the redesign of the `SectionProcessor` interface would create a cleaner, more self-contained architecture that better leverages the schema system.

**Recommendation**: Implement this architecture change in a future task to improve the overall system design.
