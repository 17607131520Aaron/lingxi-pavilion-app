# LingxiPavilionApp

React Native 0.85 + TypeScript project.

## Environment

- Node: `>=22.11.0` (see `.nvmrc`)
- Install deps: `npm install --legacy-peer-deps`

## Run

- Start Metro: `npm run start`
- Run Android: `npm run android`
- Run iOS: `npm run ios`

## Frontend Standards

### Code quality commands

- Lint: `npm run lint`
- Lint fix: `npm run lint:fix`
- Type check: `npm run typecheck`
- Test (CI style): `npm run test:ci`
- Format check: `npm run format:check`
- Format write: `npm run format`

### Commit quality gates

- `pre-commit`: runs `lint-staged` on staged files
- `commit-msg`: runs `commitlint` validation

### Conventional Commits

Use: `<type>(optional-scope): <subject>`

Examples:

- `feat(home): add debug entry card`
- `fix(storage): handle legacy null token`
- `docs(readme): add frontend standards`

Allowed `type` values:

- `feat`
- `fix`
- `docs`
- `style`
- `refactor`
- `perf`
- `test`
- `build`
- `ci`
- `chore`
- `revert`

## Directory Notes

- Source code lives in `src/`
- Keep route names and route param types in one place (recommended: `src/router`)
- Shared constants/utilities go under `src/common` and `src/utils`
