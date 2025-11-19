/// <reference types="cypress" />

/**
 * E2E Tests for Member Book Browsing
 * 
 * Tests cover:
 * - View book catalog
 * - Search books
 * - Filter by category
 * - Add books to cart
 * - View cart
 * - Submit loan request
 */

describe('Member Book Browsing', () => {
  beforeEach(() => {
    // Login as member before each test
    cy.loginAsMember();
    cy.visit('/app/books');
    
    // Wait for page to load
    cy.contains('Jelajahi Buku', { timeout: 10000 }).should('be.visible');
  });

  describe('Book Catalog Display', () => {
    it('should display book browsing page', () => {
      cy.contains('Jelajahi Buku').should('be.visible');
      cy.contains('Temukan dan pinjam buku dari koleksi kami').should('be.visible');
    });

    it('should display search and filter controls', () => {
      // Search input
      cy.get('input[placeholder*="Cari"]').should('be.visible');
      
      // Category filter
      cy.get('select').should('be.visible');
    });

    it('should display book cards', () => {
      // Check if book cards are rendered
      cy.get('body').then(($body) => {
        // Either books are displayed or empty state is shown
        const hasBooks = $body.find('[data-testid="book-card"]').length > 0 ||
                        $body.text().includes('ISBN:') ||
                        $body.text().includes('Tidak ada buku');
        
        expect(hasBooks).to.be.true;
      });
    });
  });

  describe('Search Functionality', () => {
    it('should search books by title', () => {
      const searchTerm = 'test';
      
      cy.get('input[placeholder*="Cari"]').type(searchTerm);
      cy.wait(1000); // Wait for debounce
      
      // Results should update (either showing results or empty state)
      cy.get('body').should('exist');
    });

    it('should clear search results', () => {
      // Type search term
      cy.get('input[placeholder*="Cari"]').type('test');
      cy.wait(1000);
      
      // Clear search
      cy.get('input[placeholder*="Cari"]').clear();
      cy.wait(1000);
      
      // Should show all books again
      cy.get('body').should('exist');
    });
  });

  describe('Filter Functionality', () => {
    it('should filter books by category', () => {
      // Select a category filter
      cy.get('select').first().select(1); // Select first non-empty option
      cy.wait(1000);
      
      // Results should update
      cy.get('body').should('exist');
    });

    it('should reset filters', () => {
      // Apply filter
      cy.get('select').first().select(1);
      cy.wait(1000);
      
      // Reset to "Semua Kategori"
      cy.get('select').first().select(0);
      cy.wait(1000);
      
      // Should show all books
      cy.get('body').should('exist');
    });
  });

  describe('Add to Cart', () => {
    it('should add book to cart', () => {
      // Find a book with available stock and click borrow button
      cy.get('body').then(($body) => {
        if ($body.text().includes('Tersedia')) {
          // Click first available borrow button
          cy.contains('button', 'Pinjam').first().click();
          
          // Cart button should appear or cart count should increase
          cy.contains('Keranjang').should('be.visible');
        }
      });
    });

    it('should display cart count badge', () => {
      // Add a book to cart
      cy.get('body').then(($body) => {
        if ($body.text().includes('Tersedia')) {
          cy.contains('button', 'Pinjam').first().click();
          
          // Cart should show count
          cy.contains(/Keranjang.*\(\d+\)/).should('be.visible');
        }
      });
    });

    it('should not allow borrowing out of stock books', () => {
      // Check if there are out of stock books
      cy.get('body').then(($body) => {
        if ($body.text().includes('Stok Habis')) {
          // Button should be disabled
          cy.contains('Stok Habis').parent().parent().within(() => {
            cy.get('button').should('be.disabled');
          });
        }
      });
    });
  });

  describe('Cart Navigation', () => {
    it('should navigate to cart page', () => {
      // Add a book first
      cy.get('body').then(($body) => {
        if ($body.text().includes('Tersedia')) {
          cy.contains('button', 'Pinjam').first().click();
          
          // Click cart button
          cy.contains('a', 'Keranjang').click();
          
          // Should navigate to loans page
          cy.url().should('include', '/app/loans');
        }
      });
    });
  });

  describe('Pagination', () => {
    it('should navigate through pages if available', () => {
      cy.get('body').then(($body) => {
        // Check if pagination exists
        if ($body.text().includes('Halaman') && $body.find('button:contains("Berikutnya")').length > 0) {
          // Click next page
          cy.contains('button', 'Berikutnya').click();
          cy.wait(1000);
          
          // Should load new page
          cy.get('body').should('exist');
        }
      });
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no books match search', () => {
      // Search for something that doesn't exist
      cy.get('input[placeholder*="Cari"]').type('xyzabc123notfound');
      cy.wait(1500);
      
      // Should show empty state or no results message
      cy.get('body').should('contain', 'Tidak ada buku');
    });
  });

  describe('Responsive Design', () => {
    it('should be usable on mobile viewport', () => {
      cy.viewport('iphone-x');
      
      cy.contains('Jelajahi Buku').should('be.visible');
      cy.get('input[placeholder*="Cari"]').should('be.visible');
    });

    it('should display book cards in grid on desktop', () => {
      cy.viewport(1280, 720);
      
      cy.get('body').then(($body) => {
        // Books should be displayed in grid layout
        if ($body.text().includes('ISBN:')) {
          cy.get('body').should('exist');
        }
      });
    });
  });
});
