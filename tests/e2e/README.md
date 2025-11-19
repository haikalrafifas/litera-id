# Cypress E2E Tests for Litera.id

## Overview

This directory contains end-to-end (E2E) tests for the Litera.id library management system using Cypress.

## Test Coverage

### Authentication Tests (`tests/e2e/auth.cy.ts`)
- ✅ Login page rendering
- ✅ Form validation
- ✅ Admin login
- ✅ Member login
- ✅ Failed login attempts
- ✅ Protected routes
- ✅ Session persistence
- ✅ Logout functionality

### Admin Book Management Tests (`tests/e2e/app/books.cy.ts`)
- ✅ View book list with pagination
- ✅ Create new book
- ✅ Edit existing book
- ✅ Delete book
- ✅ Form validation
- ✅ Responsive design (mobile/tablet/desktop)

### Member Book Browsing Tests (`tests/e2e/books.cy.ts`)
- ✅ View book catalog
- ✅ Search books
- ✅ Filter by category
- ✅ Add books to cart
- ✅ View cart
- ✅ Empty states
- ✅ Responsive design

### Loan Workflow Tests (`tests/e2e/app/borrowment.cy.ts`)
- ✅ Member: Add to cart and submit request
- ✅ Member: View active loans
- ✅ Member: View loan history
- ✅ Admin: View all loan requests
- ✅ Admin: Filter loans by status
- ✅ Admin: View loan details
- ✅ Admin: Loan history

## Setup

### Prerequisites

1. Install Cypress:
```powershell
pnpm install -D cypress@^13.16.1
```

2. Install TypeScript types for Cypress:
```powershell
pnpm install -D @types/cypress
```

### Test Data Requirements

Before running tests, ensure you have the following test users in your database:

**Admin User:**
- Email: `admin@litera.id`
- Password: `admin123`
- Role: `admin`

**Member User:**
- Email: `member@litera.id`
- Password: `member123`
- Role: `member`

You can create these users by running the database seeders or manually through the application.

## Running Tests

### Open Cypress Test Runner (Interactive)

```powershell
pnpm cypress
# or
pnpm cypress:open
```

This opens the Cypress Test Runner where you can:
- Select and run individual test files
- Watch tests run in real-time
- Debug tests interactively
- Take screenshots and videos

### Run Tests Headlessly (CI/CD)

```powershell
pnpm cypress:headless
# or
pnpm test:e2e
```

This runs all tests in headless mode, suitable for CI/CD pipelines.

### Run Tests in Headed Mode

```powershell
pnpm test:e2e:headed
```

This runs tests with a visible browser window (useful for debugging).

### Run Specific Test File

```powershell
npx cypress run --spec "tests/e2e/auth.cy.ts"
```

### Run Tests on Specific Browser

```powershell
npx cypress run --browser chrome
npx cypress run --browser firefox
npx cypress run --browser edge
```

## Test Structure

```
tests/
├── e2e/
│   ├── auth.cy.ts              # Authentication tests
│   ├── books.cy.ts             # Member book browsing tests
│   └── app/
│       ├── books.cy.ts         # Admin book management tests
│       └── borrowment.cy.ts    # Loan workflow tests
├── support/
│   ├── e2e.ts                  # Cypress support file
│   └── commands.ts             # Custom Cypress commands
└── results/
    ├── screenshots/            # Test failure screenshots
    └── videos/                 # Test run videos
```

## Custom Commands

We've created custom Cypress commands for common operations:

### Login Commands

```typescript
// Login with email and password
cy.login('user@example.com', 'password123');

// Login as admin (uses predefined credentials)
cy.loginAsAdmin();

// Login as member (uses predefined credentials)
cy.loginAsMember();

// Logout
cy.logout();
```

## Configuration

The Cypress configuration is in `cypress.config.ts`:

- **Base URL**: `http://localhost:3000`
- **Spec Pattern**: `tests/e2e/**/*.cy.{js,jsx,ts,tsx}`
- **Default Viewport**: 1280x720
- **Timeout**: 10 seconds
- **Videos**: Disabled (can be enabled for CI/CD)
- **Screenshots**: Enabled on failure

## Best Practices

### 1. Test Isolation
Each test should be independent and not rely on the state from previous tests. Use `beforeEach` hooks to set up test state.

### 2. Waiting Strategies
- Use `cy.wait()` sparingly and only when necessary
- Prefer `should()` assertions which automatically retry
- Use `{ timeout: X }` for elements that may take longer to appear

### 3. Selectors
- Prefer `data-testid` attributes for stable selectors
- Use semantic selectors (e.g., `cy.contains()`) when appropriate
- Avoid brittle CSS selectors that may change

### 4. Assertions
- Be specific with assertions
- Use multiple assertions to verify complete behavior
- Check both positive and negative cases

### 5. Test Data
- Use unique identifiers (timestamps, UUIDs) for test data
- Clean up test data in `afterEach` hooks when possible
- Don't rely on specific database state

## Debugging Tests

### Visual Debugging
```typescript
cy.pause();              // Pause test execution
cy.debug();              // Add debugger breakpoint
cy.screenshot('name');   // Take screenshot
```

### Console Logging
```typescript
cy.log('Custom message'); // Log to Cypress command log
cy.then(() => {
  console.log('Data');   // Log to browser console
});
```

### Time Travel
In Cypress Test Runner:
- Hover over commands to see DOM snapshots
- Click commands to pin the snapshot
- Use before/after states to debug

## CI/CD Integration

Add to your CI/CD pipeline:

```yaml
# Example GitHub Actions
- name: Install dependencies
  run: pnpm install

- name: Start application
  run: pnpm dev &
  
- name: Wait for app
  run: npx wait-on http://localhost:3000

- name: Run E2E tests
  run: pnpm test:e2e
  
- name: Upload screenshots
  if: failure()
  uses: actions/upload-artifact@v3
  with:
    name: cypress-screenshots
    path: tests/results/screenshots
```

## Troubleshooting

### Tests Fail Locally But Pass in CI
- Check viewport sizes
- Verify test user credentials
- Check for race conditions
- Ensure consistent test data

### Timeouts
- Increase timeout in cypress.config.ts
- Add specific timeouts to slow elements: `{ timeout: 15000 }`
- Check network tab for slow API calls

### Element Not Found
- Verify element selectors
- Check if element is visible/enabled
- Wait for page to fully load
- Check for dynamic content

### Authentication Issues
- Verify test user credentials
- Check cookie persistence
- Clear cookies between tests
- Check session management

## Writing New Tests

1. Create a new `.cy.ts` file in appropriate directory
2. Add TypeScript reference: `/// <reference types="cypress" />`
3. Use descriptive test names
4. Follow the Arrange-Act-Assert pattern
5. Add cleanup in `afterEach` if needed
6. Test both happy and error paths

Example:
```typescript
/// <reference types="cypress" />

describe('Feature Name', () => {
  beforeEach(() => {
    // Setup
    cy.loginAsAdmin();
    cy.visit('/page');
  });

  it('should do something', () => {
    // Arrange
    const testData = 'value';
    
    // Act
    cy.get('input').type(testData);
    cy.get('button').click();
    
    // Assert
    cy.contains(testData).should('be.visible');
  });
});
```

## Resources

- [Cypress Documentation](https://docs.cypress.io)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Cypress TypeScript](https://docs.cypress.io/guides/tooling/typescript-support)

## Support

For issues or questions about tests:
1. Check this README
2. Review existing test files for examples
3. Check Cypress documentation
4. Contact the development team
