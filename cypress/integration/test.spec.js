const compareImages = require("resemblejs/compareImages");
const fs = require("fs");

async function runTest() {
  cy.visit("../VRT_colorPalette.html");
}

describe("Should open web site and take screenshots before and after generation a color palette", () => {
  Cypress.on("uncaught:exception", (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
  });
  let datetime;
  before(() => {
    datetime = new Date().toISOString().replace(/:/g, ".");
  });

  it("should visiti the website and take a screenshot", () => {
    cy.visit('./VRT_colorPallete/palette.html');
    cy.screenshot(`${datetime}/image-1`)
  });

  it("should generate a new palette and take a screenshot", () => {
    cy.get("#generate").click();
    cy.screenshot(`${datetime}/image-2`)
  });

  it("should should clean the current palette and take a screenshot", () => {
    cy.get("#clean").click();
    cy.screenshot(`${datetime}/image-3`)
  });
});
