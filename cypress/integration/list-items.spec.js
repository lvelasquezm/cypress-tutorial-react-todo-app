describe('List items', () => {
  beforeEach(() => {
    cy.seedAndVisit();
  });

  it('Properly displays completed items', () => {
    cy.get('.todo-list li')
      .filter('.completed')
      .should('have.length', 1)
      .and('contain', 'Eggs')
      .find('.toggle')
      .should('be.checked');
  });

  it('Shows remaining todos in the footer', () => {
    cy.get('.todo-count')
      .should('contain', 3);
  });

  it('Remove a todo', () => {
    cy.route({
      url: '/api/todos/1',
      method: 'DELETE',
      response: {}
    });

    cy.get('.todo-list li')
      .as('list')

    cy.get('@list')
      .first('.completed')
      .find('.destroy')
      .invoke('show')
      .click();

    cy.get('@list')
      .should('have.length', 3)
      .and('not.contain', 'Milk')
  });
});