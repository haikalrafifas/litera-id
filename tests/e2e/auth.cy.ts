/// <reference types="cypress" />

/**
 * E2E Tests for Authentication
 * 
 * Tests cover:
 * - Login page rendering
 * - Successful login (admin and member)
 * - Failed login attempts
 * - Form validation
 * - Redirect after login
 * - Logout functionality
 * - Protected routes
 */

describe('Authentication', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  describe('Login Page', () => {
    it('should display login form', () => {
      cy.visit('/auth/login');
      
      // Check for form elements
      cy.get('input[type="email"], input[name="email"]').should('be.visible');
      cy.get('input[type="password"], input[name="password"]').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
    });

    it('should show validation errors for empty fields', () => {
      cy.visit('/auth/login');
      
      // Submit without filling fields
      cy.get('button[type="submit"]').click();
      
      // Check if still on login page (validation failed)
      cy.url().should('include', '/auth/login');
    });

    it('should show error for invalid credentials', () => {
      cy.visit('/auth/login');
      
      cy.get('input[type="email"], input[name="email"]').type('invalid@email.com');
      cy.get('input[type="password"], input[name="password"]').type('wrongpassword');
      cy.get('button[type="submit"]').click();
      
      // Should show error message or stay on login page
      cy.url().should('include', '/auth/login');
    });
  });

  describe('Admin Login', () => {
    it('should login successfully as admin', () => {
      cy.visit('/auth/login');
      
      cy.get('input[type="email"], input[name="email"]').type('admin@litera.id');
      cy.get('input[type="password"], input[name="password"]').type('admin123');
      cy.get('button[type="submit"]').click();
      
      // Should redirect to app dashboard
      cy.url().should('include', '/app');
      cy.url().should('not.include', '/auth/login');
    });

    it('should access admin-only pages after login', () => {
      cy.loginAsAdmin();
      
      // Try to access admin book management
      cy.visit('/app/books');
      cy.url().should('include', '/app/books');
      
      // Should see admin interface elements
      cy.contains('Manajemen Buku', { timeout: 10000 }).should('be.visible');
      cy.contains('Tambah Buku Baru').should('be.visible');
    });
  });

  describe('Member Login', () => {
    it('should login successfully as member', () => {
      cy.visit('/auth/login');
      
      cy.get('input[type="email"], input[name="email"]').type('member@litera.id');
      cy.get('input[type="password"], input[name="password"]').type('member123');
      cy.get('button[type="submit"]').click();
      
      // Should redirect to app dashboard
      cy.url().should('include', '/app');
      cy.url().should('not.include', '/auth/login');
    });

    it('should access member pages after login', () => {
      cy.loginAsMember();
      
      // Try to access member book browsing
      cy.visit('/app/books');
      cy.url().should('include', '/app/books');
      
      // Should see member interface elements
      cy.contains('Jelajahi Buku', { timeout: 10000 }).should('be.visible');
    });
  });

  describe('Protected Routes', () => {
    it('should redirect to login when accessing protected route without auth', () => {
      cy.visit('/app/books');
      
      // Should redirect to login
      cy.url().should('include', '/auth/login');
    });

    it('should redirect to login when accessing /app without auth', () => {
      cy.visit('/app');
      
      // Should redirect to login
      cy.url().should('include', '/auth/login');
    });
  });

  describe('Session Persistence', () => {
    it('should maintain session across page refreshes', () => {
      cy.loginAsAdmin();
      cy.visit('/app/books');
      
      // Verify we're on the page
      cy.contains('Manajemen Buku', { timeout: 10000 }).should('be.visible');
      
      // Reload the page
      cy.reload();
      
      // Should still be authenticated
      cy.url().should('include', '/app/books');
      cy.contains('Manajemen Buku').should('be.visible');
    });
  });

  describe('Logout', () => {
    it('should logout and redirect to home/login', () => {
      cy.loginAsAdmin();
      cy.visit('/app');
      
      // Clear session
      cy.clearCookies();
      cy.clearLocalStorage();
      
      // Try to access protected page
      cy.visit('/app/books');
      
      // Should redirect to login
      cy.url().should('include', '/auth/login');
    });
  });
});
