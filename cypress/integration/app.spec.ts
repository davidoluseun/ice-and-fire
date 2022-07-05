describe("App", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.get('[data-testid="init-spinner"]', {
      timeout: 100000,
    }).should("not.exist");
  });

  describe("rendering books", () => {
    it("should render the list of books with publisher, name, isbn, authors and end date", () => {
      cy.get('[data-testid="book"]').then((items) => {
        expect(items).to.have.length(6);
        expect(items[0]).to.contain.text("Bantam Books");
        expect(items[0]).to.contain.text("A Game of Thrones");
        expect(items[0]).to.contain.text("978-0553103540");
        expect(items[0]).to.contain.text("George R. R. Martin");
        expect(items[0]).to.contain.text("1996-08-01");
      });
    });
  });
});
