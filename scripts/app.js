"use strict";

// IIFE - Immediately Invoked Functional Expression

(function () {
  function DisplayHomePage() {
    console.log("Calling DisplayHomePage()...");

    let aboutUsBtn = document.getElementById("AboutUsBtn");
    aboutUsBtn.addEventListener("click", () => {
      location.href = "about.html";
    });

    let mainContent = document.getElementsByTagName("main")[0];

    let mainParagraph = document.createElement("p");
    mainParagraph.setAttribute("id", "mainParagraph");
    mainParagraph.setAttribute("class", "mt-3");

    mainParagraph.textContent = "This is the first paragraph";
    mainContent.appendChild(mainParagraph);

    let firstString = "This is";
    let secondString = `${firstString} the second paragraph`;
    mainParagraph.textContent = secondString;
    mainContent.appendChild(mainParagraph);
    mainParagraph.style = "color: white;";

    let documentBody = document.body;
    let article = document.createElement("article");
    let articleParagraph = `<p id="ArticleParagraph" class="mt-3">This is my article paragraph</p>`;

    article.setAttribute("class", "container");
    article.innerHTML = articleParagraph;
    documentBody.appendChild(article);
    article.style = "color: white;";
  }

  function DisplayAboutPage() {
    console.log("Calling DisplayAboutPage()...");
  }

  function DisplayProductsPage() {
    console.log("Calling DisplayProductsPage()...");
  }

  function DisplayServicesPage() {
    console.log("Calling DisplayServicesPage()...");
  }

  function DisplayContactPage() {
    console.log("Calling DisplayContactPage()...");
  }

  function Start() {
    console.log("Starting...");

    switch (document.title) {
      case "Home":
        DisplayHomePage();
        break;
      case "About":
        DisplayAboutPage();
        break;
      case "Products":
        DisplayProductsPage();
        break;
      case "Services":
        DisplayServicesPage();
        break;
      case "Contact":
        DisplayContactPage();
        break;
    }
  }
  window.addEventListener("load", Start);
})();
