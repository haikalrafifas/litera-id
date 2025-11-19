// ***********************************************
// Custom Cypress commands
// ***********************************************

// Login command
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.visit('/auth/login');
    cy.get('input[type="email"], input[name="email"]').type(email);
    cy.get('input[type="password"], input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/app');
  });
});

// Login as admin helper
Cypress.Commands.add('loginAsAdmin', () => {
  cy.login('admin@litera.id', 'admin123');
});

// Login as member helper
Cypress.Commands.add('loginAsMember', () => {
  cy.login('member@litera.id', 'member123');
});

// Logout command
Cypress.Commands.add('logout', () => {
  cy.visit('/app');
  // Click logout button if exists
  cy.get('body').then(($body) => {
    if ($body.find('[data-testid="logout-button"]').length > 0) {
      cy.get('[data-testid="logout-button"]').click();
    }
  });
  cy.clearCookies();
  cy.clearLocalStorage();
});

export {};
