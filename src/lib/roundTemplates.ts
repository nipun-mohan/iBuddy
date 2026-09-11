export interface RoundTemplate { id: string; name: string; prompt: string; builtIn?: boolean; }

export const DEFAULT_ROUND_TEMPLATES: RoundTemplate[] = [
  { id: "general", name: "General Round", builtIn: true, prompt: `GENERAL ROUND. Lead with the answer. Give concise, scannable talking points. Use only candidate facts grounded in the profile or transcript; never invent details.` },
  { id: "coding", name: "Coding / DSA Round", builtIn: true, prompt: `CODING ROUND. The interviewer posed a coding/algorithm problem.
LEAD: one sentence — chosen approach + final time/space complexity.
1. CLARIFY: 2–3 assumptions as bullets (input size, nulls, duplicates, in-place?).
2. APPROACH: brute force + why too slow → optimal pattern + the invariant.
3. CODE: clean, correct, meaningful names, helper functions; comment intent only. Use the selected programming language.
4. COMPLEXITY: time + space (include sort/recursion cost).
5. EDGE CASES: empty, single, all-equal, boundary, overflow.
6. TEST: trace ONE small example.
Speak intent, not syntax. Never dump code silently — communication is scored.` },
  { id: "platform", name: "Platform Round", builtIn: true, prompt: `PLATFORM ROUND.
LEAD: one sentence — chosen design + key classes + operation complexities.
Use the selected programming language. For Kotlin, use MVVM and clean-architecture separation of concerns with simple data classes, interfaces, APIs, repositories, and use cases.
1. CLARIFY: 2–3 assumptions (requirements, operations, constraints, concurrency?).
2. DESIGN: classes/interfaces + responsibilities; separation of concerns; patterns only when useful.
3. PRINCIPLES: SOLID, encapsulation, composition over inheritance, extensibility without over-engineering.
4. CODE: production-quality code, meaningful names, small methods, proper class structure, invalid/edge cases.
5. COMPLEXITY: time/space for important operations.
6. EDGE CASES: empty, duplicate, missing item, capacity/boundary, invalid input.
7. TEST: dry-run ONE small example through the classes.
8. FOLLOW-UP: how to extend, make thread-safe, persist, or unit test.` },
  { id: "system_design", name: "System Design Round", builtIn: true, prompt: `SYSTEM DESIGN ROUND. The interviewer asked to design a system.
LEAD: one sentence naming the dominant constraint.
1. REQUIREMENTS: functional bullets; quantified non-functional requirements; explicit out-of-scope; read:write ratio.
2. ESTIMATE: DAU→QPS, storage/5yr, bandwidth — show arithmetic. Skip only if numbers do not change the design, and say so.
3. API: all relevant endpoints; proper JSON request/response for the interesting one; idempotency + pagination.
4. DATA MODEL: readable schema; partition/primary key matched to dominant read pattern; store choice + why.
5. HLD: ASCII diagram covering the request path end-to-end.
6. COMPONENTS: real tradeoffs — “I chose X over Y because…, tradeoff is Z.”` },
  { id: "behavioral", name: "Behavioral / Cultural Fit Round", builtIn: true, prompt: `BEHAVIORAL ROUND. Give concise STAR talking points grounded only in the candidate profile and transcript. Never invent employers, projects, dates, metrics, or outcomes. If a fact is missing, use a short [fill in] placeholder.` },
];

export const PROGRAMMING_LANGUAGES = ["python", "javascript", "typescript", "java", "cpp", "go", "kotlin", "swift", "csharp", "ruby"] as const;
