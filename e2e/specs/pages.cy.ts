describe("Web site", (): void => {
  it("Navigation", (): void => {
    localStorage.setItem("theme", "light");
    cy.visit("/");
    cy.contains("Yeison Liscano").click();

    cy.contains("About Me");
    cy.contains("Background");
    cy.contains("Education");

    cy.contains("blog").click();
    cy.contains("Article");
    cy.get(".preview-container").first().find("h2 a").click();
    cy.contains("Table of contents");

    cy.get("html").should("have.attr", "data-theme", "light");
    cy.get("#theme-toggle").click();
    cy.get("html").should("have.attr", "data-theme", "dark");
    cy.get("#theme-toggle").click();
    cy.get("html").should("have.attr", "data-theme", "light");
  });
});
