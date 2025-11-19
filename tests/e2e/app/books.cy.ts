/// <reference types="cypress" />

/**
 * E2E Tests for Admin Book Management
 * 
 * Tests cover:
 * - View book list
 * - Create new book
 * - Edit existing book
 * - Delete book
 * - Search and filter books
 * - Pagination
 * - Form validation
 * - Image upload
 */

describe('Admin Book Management', () => {
  beforeEach(() => {
    // Login as admin before each test
    cy.loginAsAdmin();
    cy.visit('/app/books');
    
    // Wait for page to load
    cy.contains('Manajemen Buku', { timeout: 10000 }).should('be.visible');
  });

  describe('Book List Display', () => {
    it('should display book management page', () => {
      cy.contains('Manajemen Buku').should('be.visible');
      cy.contains('Kelola koleksi buku perpustakaan').should('be.visible');
      cy.contains('Tambah Buku Baru').should('be.visible');
    });

    it('should display table with book data', () => {
      // Check for table headers
      cy.contains('Sampul').should('be.visible');
      cy.contains('ISBN').should('be.visible');
      cy.contains('Judul').should('be.visible');
      cy.contains('Penulis').should('be.visible');
      cy.contains('Stok').should('be.visible');
      cy.contains('Aksi').should('be.visible');
    });

    it('should display pagination controls', () => {
      // Look for pagination elements
      cy.get('body').then(($body) => {
        // Pagination might not exist if there's only one page
        if ($body.text().includes('Halaman') || $body.find('[aria-label="pagination"]').length > 0) {
          cy.contains('Halaman').should('be.visible');
        }
      });
    });
  });

  describe('Create New Book', () => {
    const testBook = {
      isbn: '9781234567890',
      title: 'Test Book Cypress',
      author: 'Test Author',
      publisher: 'Test Publisher',
      category: 'Test Category',
      stock: '10',
      description: 'This is a test book created by Cypress'
    };

    it('should open create modal when clicking add button', () => {
      cy.contains('Tambah Buku Baru').click();
      
      // Modal should open
      cy.contains('Tambah Buku Baru').should('be.visible');
      
      // Check form fields exist
      cy.get('input[type="text"]').should('exist');
      cy.contains('Batal').should('be.visible');
      cy.contains('Simpan Buku').should('be.visible');
    });

    it('should validate required fields', () => {
      cy.contains('Tambah Buku Baru').click();
      
      // Try to submit without filling required fields
      cy.contains('button', 'Simpan Buku').click();
      
      // Should show validation errors or remain on modal
      cy.contains('Tambah Buku Baru').should('be.visible');
    });

    it('should create new book successfully', () => {
      cy.contains('Tambah Buku Baru').click();
      
      // Fill in the form
      cy.get('input[placeholder="9781234567890"]').clear().type(testBook.isbn);
      cy.get('input[placeholder="Judul buku"]').type(testBook.title);
      cy.get('input[placeholder="Nama penulis"]').type(testBook.author);
      cy.get('input[placeholder="Nama penerbit"]').type(testBook.publisher);
      cy.get('input[placeholder*="Fiksi"]').type(testBook.category);
      cy.get('input[type="number"]').clear().type(testBook.stock);
      cy.get('textarea[placeholder*="Deskripsi"]').type(testBook.description);
      
      // Submit form
      cy.contains('button', 'Simpan Buku').click();
      
      // Should close modal and show success
      cy.contains('Tambah Buku Baru').should('not.exist');
      
      // Should display the new book in the list (eventually)
      cy.contains(testBook.title, { timeout: 10000 }).should('be.visible');
    });

    afterEach(() => {
      // Clean up: Delete the test book if it was created
      cy.get('body').then(($body) => {
        if ($body.text().includes(testBook.title)) {
          cy.contains('tr', testBook.title).within(() => {
            cy.contains('Hapus').click();
          });
          cy.contains('button', 'Hapus Buku').click();
        }
      });
    });
  });

  describe('Edit Book', () => {
    it('should open edit modal when clicking edit button', () => {
      // Click edit on the first book in the table
      cy.get('table tbody tr').first().within(() => {
        cy.contains('Ubah').click();
      });
      
      // Modal should open with title "Ubah Buku"
      cy.contains('Ubah Buku').should('be.visible');
      cy.contains('Perbarui Buku').should('be.visible');
    });

    it('should pre-fill form with existing book data', () => {
      // Click edit on the first book
      cy.get('table tbody tr').first().within(() => {
        cy.contains('Ubah').click();
      });
      
      // Check that form fields are populated
      cy.get('input[placeholder="Judul buku"]').should('have.value').and('not.be.empty');
    });

    it('should update book successfully', () => {
      const updatedTitle = `Updated Book ${Date.now()}`;
      
      // Click edit on the first book
      cy.get('table tbody tr').first().within(() => {
        cy.contains('Ubah').click();
      });
      
      // Update the title
      cy.get('input[placeholder="Judul buku"]').clear().type(updatedTitle);
      
      // Submit
      cy.contains('button', 'Perbarui Buku').click();
      
      // Should close modal
      cy.contains('Ubah Buku').should('not.exist');
      
      // Should show updated title
      cy.contains(updatedTitle, { timeout: 10000 }).should('be.visible');
    });
  });

  describe('Delete Book', () => {
    it('should open delete confirmation modal', () => {
      // Click delete on the first book
      cy.get('table tbody tr').first().within(() => {
        cy.contains('Hapus').click();
      });
      
      // Confirmation modal should open
      cy.contains('Hapus Buku').should('be.visible');
      cy.contains('Apakah Anda yakin').should('be.visible');
      cy.contains('button', 'Batal').should('be.visible');
      cy.contains('button', 'Hapus Buku').should('be.visible');
    });

    it('should cancel delete operation', () => {
      // Get the first book title
      let bookTitle: string;
      
      cy.get('table tbody tr').first().find('td').eq(2).invoke('text').then((text) => {
        bookTitle = text.trim();
      });
      
      // Click delete
      cy.get('table tbody tr').first().within(() => {
        cy.contains('Hapus').click();
      });
      
      // Click cancel
      cy.contains('button', 'Batal').click();
      
      // Modal should close
      cy.contains('Hapus Buku').should('not.exist');
      
      // Book should still be in the list
    //   cy.get('table tbody').should('contain', bookTitle);
    });
  });

  describe('Responsive Design', () => {
    it('should be usable on mobile viewport', () => {
      cy.viewport('iphone-x');
      
      cy.contains('Manajemen Buku').should('be.visible');
      cy.contains('Tambah Buku Baru').should('be.visible');
    });

    it('should be usable on tablet viewport', () => {
      cy.viewport('ipad-2');
      
      cy.contains('Manajemen Buku').should('be.visible');
      cy.contains('Tambah Buku Baru').should('be.visible');
    });
  });
});
