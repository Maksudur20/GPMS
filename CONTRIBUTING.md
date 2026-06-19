# Contributing to GPMS

## Code Style

- Use camelCase for variables and functions
- Use PascalCase for components and classes
- Use UPPER_SNAKE_CASE for constants
- Add JSDoc comments for functions

## Backend Conventions

### Controllers
- One controller per resource
- Handle request/response in controllers
- Return consistent JSON responses

### Routes
- Use RESTful conventions
- Group related routes
- Apply middleware appropriately

### Utilities
- Pure functions where possible
- Export as named exports
- Include error handling

## Frontend Conventions

### Components
- One component per file
- Use functional components
- Use React hooks for state

### Pages
- One page per route
- Import components from /components
- Use custom hooks for data fetching

### Styling
- Use Tailwind CSS classes
- Avoid inline styles
- Create reusable component styles

## Git Commit Messages

Format: `type: brief description`

Types:
- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring
- `docs:` - Documentation
- `style:` - Formatting
- `test:` - Tests
- `chore:` - Maintenance

Examples:
```
feat: add order filtering by status
fix: resolve exchange rate calculation error
docs: update API documentation
```

## Pull Request Process

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes following conventions
3. Commit with meaningful messages
4. Push to GitHub
5. Create pull request with description
6. Wait for review and merge

## Testing

- Write unit tests for utilities
- Test API endpoints with Postman or similar
- Test UI components manually

## Deployment

- Ensure all tests pass
- Update documentation
- Follow deployment guides in INSTALLATION.md
