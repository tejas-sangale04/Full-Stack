describe('Login Flow', () => {
  it('should login successfully as a waiter', () => {
    cy.login('waiter1', 'waiter123');
    // After login, it should redirect to /waiter
    cy.url().should('include', '/waiter');
    cy.contains('Take Order').should('exist');
  });

  it('should login successfully as admin', () => {
    cy.login('admin', 'admin123');
    // After login, it should redirect to /admin
    cy.url().should('include', '/admin');
    cy.contains('Yearly Revenue').should('exist');
  });

  it('should show error for invalid credentials', () => {
    cy.login('wronguser', 'wrongpass');
    cy.get('.text-red-500').should('contain', 'Invalid username or password');
  });
});
