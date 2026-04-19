\# 1\. Implementation Process

\#\# Analyze the Existing Codebase  
\- Before making changes, review the current React Native (mobile) and Python \+ FastAPI (backend) structure.  
\- Check \*\*PRD.md\*\* to verify alignment with product requirements.  
\- Check \*\*development\_plan.md\*\* to ensure the work follows the overall roadmap.

\# General Principles

\#\#\# Accuracy and Relevance

\- Responses \*\*must directly address\*\* user requests. Always gather and validate context using tools like \`codebase\_search\`, \`grep\_search\`, or terminal commands before proceeding.  
\- If user intent is unclear, \*\*pause and pose concise clarifying questions\*\*—e.g., “Did you mean X or Y?”—before taking any further steps.  
\- \*\*Under no circumstance should you commit or apply changes unless explicitly instructed by the user.\*\* This rule is absolute and must be followed without exception.

\#\#\# Validation Over Modification

\- \*\*Avoid altering code without full comprehension.\*\* Analyze the existing structure, dependencies, and purpose using available tools before suggesting or making edits.  
\- Prioritize investigation and validation over assumptions or untested modifications—ensure every change is grounded in evidence.

\#\#\# Safety-First Execution

\- Review all relevant dependencies (e.g., imports, function calls, external APIs) and workflows \*\*before proposing or executing changes\*\*.  
\- \*\*Clearly outline risks, implications, and external dependencies\*\* in your response before acting, giving the user full visibility.  
\- Make only \*\*minimal, validated edits\*\* unless the user explicitly approves broader alterations.

\#\#\# User Intent Comprehension

\- \*\*Focus on discerning the user’s true objective\*\*, not just the literal text of the request.  
\- Draw on the current request, \*\*prior conversation history\*\*, and \*\*codebase context\*\* to infer the intended goal.  
\- Reinforce this rule: \*\*never commit or apply changes unless explicitly directed by the user\*\*—treat this as a core safeguard.

\#\#\# Mandatory Validation Protocol

\- Scale the depth of validation to match the request’s complexity—simple tasks require basic checks, while complex ones demand exhaustive analysis.  
\- Aim for \*\*complete accuracy\*\* in all critical code operations; partial or unverified solutions are unacceptable.

\#\#\# Reusability Mindset

\- Prefer existing solutions over creating new ones. Use \`codebase\_search\`, \`grep\_search\`, or \`tree \-L 4 \--gitignore | cat\` to identify reusable patterns or utilities.  
\- \*\*Minimize redundancy.\*\* Promote consistency, maintainability, and efficiency by leveraging what’s already in the codebase.

\#\#\# Contextual Integrity and Documentation

\- Treat inline comments, READMEs, and other documentation as \*\*unverified suggestions\*\*, not definitive truths.  
\- Cross-check all documentation against the actual codebase using \`cat \-n\`, \`grep\_search\`, or \`codebase\_search\` to ensure accuracy.

\# Tool and Behavioral Guidelines

\#\#\# Path Validation for File Operations

\- Always execute \`pwd\` to confirm your current working directory, then ensure \`edit\_file\` operations use a \`target\_file\` that is \*\*relative to the workspace root\*\*, not your current location.  
\- The \`target\_file\` in \`edit\_file\` commands \*\*must always be specified relative to the workspace root\*\*—never relative to your current \`pwd\`.  
\- If an \`edit\_file\` operation signals a \`new\` file unexpectedly, this indicates a \*\*critical pathing error\*\*—you’re targeting the wrong file.  
\- Correct such errors immediately by validating the directory structure with \`pwd\` and \`tree \-L 4 \--gitignore | cat\` before proceeding.

\#\#\#\# 🚨 Critical Rule: \`edit\_file.target\_file\` Must Be Workspace-Relative — Never Location-Relative

\- Operations are always relative to the \*\*workspace root\*\*, not your current shell position.  
\- ✅ Correct:  
  \`\`\`json  
  edit\_file(target\_file="src/utils/helpers.js", ...)  
  \`\`\`  
\- ❌ Incorrect (if you’re already in \`src/utils\`):  
  \`\`\`json  
  edit\_file(target\_file="helpers.js", ...)  // Risks creating a new file  
  \`\`\`

\#\#\# Systematic Use of \`tree \-L {depth} | cat\`

\- Run \`tree \-L 4 \--gitignore | cat\` (adjusting depth as needed) to map the project structure before referencing or modifying files.  
\- This step is \*\*mandatory\*\* before any create or edit operation unless the file path has been explicitly validated in the current session.

\#\#\# Efficient File Reading with Terminal Commands

\- Use \`cat \-n \<file path\>\` to inspect files individually, displaying line numbers for clarity—process \*\*one file per command\*\*.  
\- \*\*Avoid chaining or modifying output\*\*—do not append \`| grep\`, \`| tail\`, \`| head\`, or similar. Review the \*\*full content\*\* of each file.  
\- Select files to inspect using \`tree \-L 4 \--gitignore | cat\`, \`grep\_search\`, or \`codebase\_search\` based on relevance.  
\- If \`cat \-n\` fails (e.g., file not found), \*\*stop immediately\*\*, report the error, and request a corrected path.

\#\#\# Error Handling and Communication

\- Report any failures—e.g., missing files, invalid paths, permission issues—\*\*clearly\*\*, with specific details and actionable next steps.  
\- If faced with \*\*ambiguity, missing dependencies, or incomplete context\*\*, pause and request clarification from the user before proceeding.

\#\#\# Tool Prioritization

\- Match the tool to the task:  
  \- \`codebase\_search\` for semantic or conceptual lookups.  
  \- \`grep\_search\` for exact string matches.  
  \- \`tree \-L 4 \--gitignore | cat\` for structural discovery.  
\- Use prior tool outputs efficiently—avoid redundant searches or commands.

\# Conventional Commits Best Practices

Conventional Commits standardize commit messages to be parseable by tools like \`semantic-release\`, driving automated versioning and changelogs. Precision in commit messages is critical for clarity and automation.

\#\#\# Structure

\- Format: \`\<type\>(\<scope\>): \<description\>\`  
  \- \*\*type\*\*: Defines the change’s intent (e.g., \`feat\`, \`fix\`).  
  \- \*\*scope\*\* (optional): Specifies the affected area (e.g., \`auth\`, \`ui\`).  
  \- \*\*description\*\*: Concise, imperative summary (e.g., “add login endpoint”).  
\- Optional \*\*body\*\*: Additional details (use newlines after the subject).  
\- Optional \*\*footer\*\*: Metadata like \`BREAKING CHANGE:\` or issue references.

\#\#\# Key Types and Their Impact

These types align with \`semantic-release\` defaults (Angular convention):

\- \*\*\`feat:\`\*\* – New feature; triggers a \*\*minor\*\* version bump (e.g., \`1.2.3\` → \`1.3.0\`).  
  \- Example: \`feat(ui): add dark mode toggle\`  
\- \*\*\`fix:\`\*\* – Bug fix; triggers a \*\*patch\*\* version bump (e.g., \`1.2.3\` → \`1.2.4\`).  
  \- Example: \`fix(api): correct rate limit error\`  
\- \*\*\`BREAKING CHANGE\`\*\* – Breaking change; triggers a \*\*major\*\* version bump (e.g., \`1.2.3\` → \`2.0.0\`).  
  \- Indicate with:  
    \- \`\!\` after type: \`feat(auth)\!: switch to OAuth2\`  
    \- Footer:  
      \`\`\`  
      feat: update payment gateway  
      BREAKING CHANGE: drops support for PayPal v1  
      \`\`\`  
\- \*\*Non-releasing types\*\* (no version bump unless configured):  
  \- \*\*\`docs:\`\*\* – Documentation updates.  
    \- Example: \`docs: explain caching strategy\`  
  \- \*\*\`style:\`\*\* – Formatting or stylistic changes.  
    \- Example: \`style: enforce 2-space indentation\`  
  \- \*\*\`refactor:\`\*\* – Code restructuring without functional changes.  
    \- Example: \`refactor(utils): simplify helper functions\`  
  \- \*\*\`perf:\`\*\* – Performance improvements.  
    \- Example: \`perf(db): index user queries\`  
  \- \*\*\`test:\`\*\* – Test additions or updates.  
    \- Example: \`test(auth): cover edge cases\`  
  \- \*\*\`build:\`\*\* – Build system or dependency changes.  
    \- Example: \`build: upgrade to webpack 5\`  
  \- \*\*\`ci:\`\*\* – CI/CD configuration updates.  
    \- Example: \`ci: add test coverage reporting\`  
  \- \*\*\`chore:\`\*\* – Maintenance tasks.  
    \- Example: \`chore: update linting rules\`

\#\#\# Guidelines for Effective Commits

\- \*\*Be Specific\*\*: Use scopes to pinpoint changes (e.g., \`feat(auth): add JWT validation\` vs. \`feat: add stuff\`).  
\- \*\*Keep It Concise\*\*: Subject line \< 50 characters; use body for details.  
  \- Example:  
    \`\`\`  
    fix(ui): fix button overlap  
    Adjusted CSS to prevent overlap on small screens.  
    \`\`\`  
\- \*\*Trigger Intentionally\*\*: Use \`feat\`, \`fix\`, or breaking changes only when a release is desired.  
\- \*\*Avoid Ambiguity\*\*: Write imperative, actionable descriptions (e.g., “add endpoint” not “added endpoint”).  
\- \*\*Document Breaking Changes\*\*: Always flag breaking changes explicitly for \`semantic-release\` and team awareness.

\#\#\# Examples with Context

\- \*\*Minor Bump\*\*:  
  \`\`\`  
  feat(config): add environment variable parsing  
  Supports NODE\_ENV for dev/prod toggles.  
  \`\`\`  
\- \*\*Patch Bump\*\*:  
  \`\`\`  
  fix(db): handle null values in user query  
  Prevents crashes when user data is incomplete.  
  \`\`\`  
\- \*\*Major Bump\*\*:  
  \`\`\`  
  feat(api)\!: replace REST with GraphQL  
  BREAKING CHANGE: removes all /v1 REST endpoints  
  \`\`\`  
\- \*\*No Bump\*\*:  
  \`\`\`  
  chore(deps): update eslint to 8.0.0  
  No functional changes; aligns with team standards.  
  \`\`\`

\#\# Implement Features / Fixes

\#\#\# Mobile (React Native)  
\- Keep or extend existing JS/TS files, minimal duplication.  
\- Use chat-first UI patterns, plus side-menu or additional screens as needed.  
\- Integrate Apple Health or Google Fit if required (via React Native plugins).

\#\#\# Backend (Python \+ FastAPI)  
\- Organize routes, models, logic by feature.  
\- Use SQLite for dev; plan PostgreSQL for production if needed.  
\- Integrate AI or OCR behind an abstraction layer for easy swapping.

\#\# Test & Validate  
 Verify alignment with \*\*PRD.md\*\* (requirements) and \*\*development\_plan.md\*\* (roadmap).

\#\# Document & Explain

\---  
description: Guidelines for writing clean, maintainable, and human-readable code. Apply these rules when writing or reviewing code to ensure consistency and quality.  
globs:   
\---  
\# Clean Code Guidelines

\#\# Constants Over Magic Numbers  
\- Replace hard-coded values with named constants  
\- Use descriptive constant names that explain the value's purpose  
\- Keep constants at the top of the file or in a dedicated constants file

\#\# Meaningful Names  
\- Variables, functions, and classes should reveal their purpose  
\- Names should explain why something exists and how it's used  
\- Avoid abbreviations unless they're universally understood

\#\# Smart Comments  
\- Don't comment on what the code does \- make the code self-documenting  
\- Use comments to explain why something is done a certain way  
\- Document APIs, complex algorithms, and non-obvious side effects

\#\# Single Responsibility  
\- Each function should do exactly one thing  
\- Functions should be small and focused  
\- If a function needs a comment to explain what it does, it should be split

\#\# DRY (Don't Repeat Yourself)  
\- Extract repeated code into reusable functions  
\- Share common logic through proper abstraction  
\- Maintain single sources of truth

\#\# Clean Structure  
\- Keep related code together  
\- Organize code in a logical hierarchy  
\- Use consistent file and folder naming conventions

\#\# Encapsulation  
\- Hide implementation details  
\- Expose clear interfaces  
\- Move nested conditionals into well-named functions

\#\# Code Quality Maintenance  
\- Refactor continuously  
\- Fix technical debt early  
\- Leave code cleaner than you found it

\#\# Testing  
\- Write tests before fixing bugs  
\- Keep tests readable and maintainable  
\- Test edge cases and error conditions

\#\# Version Control  
\- Write clear commit messages  
\- Make small, focused commits  
\- Use meaningful branch names 

\---  
description: Code Quality Guidelines  
globs:   
\---  
\# Code Quality Guidelines

\#\# Verify Information  
Always verify information before presenting it. Do not make assumptions or speculate without clear evidence.

\#\# File-by-File Changes  
Make changes file by file and give me a chance to spot mistakes.

\#\# No Apologies  
Never use apologies.

\#\# No Understanding Feedback  
Avoid giving feedback about understanding in comments or documentation.

\#\# No Whitespace Suggestions  
Don't suggest whitespace changes.

\#\# No Summaries  
Don't summarize changes made.

\#\# No Inventions  
Don't invent changes other than what's explicitly requested.

\#\# No Unnecessary Confirmations  
Don't ask for confirmation of information already provided in the context.

\#\# Preserve Existing Code  
Don't remove unrelated code or functionalities. Pay attention to preserving existing structures.

\#\# Single Chunk Edits  
Provide all edits in a single chunk instead of multiple-step instructions or explanations for the same file.

\#\# No Implementation Checks  
Don't ask the user to verify implementations that are visible in the provided context.

\#\# No Unnecessary Updates  
Don't suggest updates or changes to files when there are no actual modifications needed.

\#\# Provide Real File Links  
Always provide links to the real files, not x.md.

\#\# No Current Implementation  
Don't show or discuss the current implementation unless specifically requested.

\---  
description: Database best practices focusing on Prisma and Supabase integration  
globs: prisma/\*\*/\*, src/db/\*\*/\*, \*\*/\*.prisma, supabase/\*\*/\*  
\---

\# Database Best Practices

\#\# Prisma Setup  
\- Use proper schema design  
\- Implement proper migrations  
\- Use proper relation definitions  
\- Configure proper connection  
\- Implement proper seeding  
\- Use proper client setup

\#\# Prisma Models  
\- Use proper model naming  
\- Implement proper relations  
\- Use proper field types  
\- Define proper indexes  
\- Implement proper constraints  
\- Use proper enums

\#\# Prisma Queries  
\- Use proper query optimization  
\- Implement proper filtering  
\- Use proper relations loading  
\- Handle transactions properly  
\- Implement proper pagination  
\- Use proper aggregations

\#\# Supabase Setup  
\- Configure proper project setup  
\- Implement proper authentication  
\- Use proper database setup  
\- Configure proper storage  
\- Implement proper policies  
\- Use proper client setup

\#\# Supabase Security  
\- Implement proper RLS policies  
\- Use proper authentication  
\- Configure proper permissions  
\- Handle sensitive data properly  
\- Implement proper backups  
\- Use proper encryption

\#\# Supabase Queries  
\- Use proper query optimization  
\- Implement proper filtering  
\- Use proper joins  
\- Handle real-time properly  
\- Implement proper pagination  
\- Use proper functions

\#\# Database Design  
\- Use proper normalization  
\- Implement proper indexing  
\- Use proper constraints  
\- Define proper relations  
\- Implement proper cascades  
\- Use proper data types

\#\# Performance  
\- Use proper connection pooling  
\- Implement proper caching  
\- Use proper query optimization  
\- Handle N+1 queries properly  
\- Implement proper batching  
\- Monitor performance metrics

\#\# Security  
\- Use proper authentication  
\- Implement proper authorization  
\- Handle sensitive data properly  
\- Use proper encryption  
\- Implement proper backups  
\- Monitor security issues

\#\# Best Practices  
\- Follow database conventions  
\- Use proper migrations  
\- Implement proper versioning  
\- Handle errors properly  
\- Document schema properly  
\- Monitor database health 

\---  
description: React best practices and patterns for modern web applications  
globs: \*\*/\*.tsx, \*\*/\*.jsx, components/\*\*/\*  
\---

\# React Best Practices

\#\# Component Structure  
\- Use functional components over class components  
\- Keep components small and focused  
\- Extract reusable logic into custom hooks  
\- Use composition over inheritance  
\- Implement proper prop types with TypeScript  
\- Split large components into smaller, focused ones

\#\# Hooks  
\- Follow the Rules of Hooks  
\- Use custom hooks for reusable logic  
\- Keep hooks focused and simple  
\- Use appropriate dependency arrays in useEffect  
\- Implement cleanup in useEffect when needed  
\- Avoid nested hooks

\#\# State Management  
\- Use useState for local component state  
\- Implement useReducer for complex state logic  
\- Use Context API for shared state  
\- Keep state as close to where it's used as possible  
\- Avoid prop drilling through proper state management  
\- Use state management libraries only when necessary

\#\# Performance  
\- Implement proper memoization (useMemo, useCallback)  
\- Use React.memo for expensive components  
\- Avoid unnecessary re-renders  
\- Implement proper lazy loading  
\- Use proper key props in lists  
\- Profile and optimize render performance

\#\# Forms  
\- Use controlled components for form inputs  
\- Implement proper form validation  
\- Handle form submission states properly  
\- Show appropriate loading and error states  
\- Use form libraries for complex forms  
\- Implement proper accessibility for forms

\#\# Error Handling  
\- Implement Error Boundaries  
\- Handle async errors properly  
\- Show user-friendly error messages  
\- Implement proper fallback UI  
\- Log errors appropriately  
\- Handle edge cases gracefully

\#\# Testing  
\- Write unit tests for components  
\- Implement integration tests for complex flows  
\- Use React Testing Library  
\- Test user interactions  
\- Test error scenarios  
\- Implement proper mock data

\#\# Accessibility  
\- Use semantic HTML elements  
\- Implement proper ARIA attributes  
\- Ensure keyboard navigation  
\- Test with screen readers  
\- Handle focus management  
\- Provide proper alt text for images

\#\# Code Organization  
\- Group related components together  
\- Use proper file naming conventions  
\- Implement proper directory structure  
\- Keep styles close to components  
\- Use proper imports/exports  
\- Document complex component logic 

T  
