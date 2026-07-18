# Orixa Permanent Engineering Guidelines

These permanent guidelines govern the development of Orixa, an Enterprise Intelligence Operating System. All agents and engineers working on this repository must strictly adhere to these principles.

## Engineering Principles

1. **Incremental Extension**: Never regenerate the entire project when adding features. Always extend the existing codebase incrementally.
2. **Architectural Consistency**: Preserve existing architectural patterns and directory layout as defined in `/docs/ARCHITECTURE.md`.
3. **Clean Architecture Over Speed**: Always prioritize robust, scalable, modular, and maintainable software over quick-and-dirty workarounds.
4. **SOLID Design**: Apply SOLID principles when writing new classes, modules, and interfaces.
5. **Decoupled Architecture**: Keep the frontend, backend, AI services, and integrations strictly decoupled and modular.
6. **Architectural Explanation**: Explain all major architectural and structural decisions before implementing.
7. **Robust Error Handling**: Every operational feature must include comprehensive, predictable error handling and logging.
8. **Testability**: Structure new interfaces and code modules so they can be easily tested.
9. **Team-Oriented Organization**: Keep files, modules, and directories well-organized, cleanly separated, and clearly documented as if multiple engineers will collaborate on them.
10. **Do Not Implement Features Unbidden**: Acknowledge instructions, and do not implement functional features until explicitly requested.

## Technology Stack

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion

### Backend
- FastAPI (Python)
- Python 3.12+
- PostgreSQL
- Redis
- SQLAlchemy 2.0+ (asyncpg)

### AI & Integrations
- Google Gemini (via modern @google/genai or server-side SDKs)
- LangGraph
- DataHub Metadata Integration

### Infrastructure
- Docker
- Docker Compose
