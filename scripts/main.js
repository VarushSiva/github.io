/*
 * Name:        Varush Sivalingam   Farhat Rahman
 * Student ID:  100661860           100953269
 * Date:        March 23rd 2025
 */

"use strict";

import { LoadHeader } from "./header.js";
import { Router } from "./router.js";
import { LoadFooter } from "./footer.js";
import { AuthGuard } from "./authguard.js";
import { CheckLogin } from "./header.js";
import { DisplayStatistics } from "./statistics.js";

const pageTitles = {
  "/": "Home",
  "/home": "Home",
  "/about": "About",
  "/contact": "Contact Us",
  "/donate": "Donate",
  "/events": "Events",
  "/login": "Login Page",
  "/gallery": "Gallery",
  "/news": "News",
  "/opportunities-list": "Opportunities List",
  "/opportunities": "Opportunities",
  "/privacy-policy": "Privacy Policy",
  "/tos": "Terms of Service",
  "/404": "Page Not Found",
  "/statistics": "Statistics",
};

const routes = {
  "/": "views/pages/home.html",
  "/home": "views/pages/home.html",
  "/about": "views/pages/about.html",
  "/contact": "views/pages/contact.html",
  "/donate": "views/pages/donate.html",
  "/events": "views/pages/events.html",
  "/login": "views/pages/login.html",
  "/gallery": "views/pages/gallery.html",
  "/news": "views/pages/news.html",
  "/opportunities-list": "views/pages/opportunities-list.html",
  "/opportunities": "views/pages/opportunities.html",
  "/privacy-policy": "views/pages/privacy-policy.html",
  "/tos": "views/pages/tos.html",
  "/404": "views/pages/404.html",
  "/statistics": "views/pages/statistics.html",
};

const router = new Router(routes);

// IIFE - Immediately Invoked Function Expression
(function () {
  const apiKey = "28a7b3941271481ebb812d71ead3a0cd";
  const url = `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${apiKey}`;

  async function fetchSearchData() {
    try {
      // Fetch events from local JSON
      const eventsRes = await fetch("data/events.json");
      const eventsData = await eventsRes.json();
      console.log("Events Data:", eventsData); // Debugging

      // Fetch news from API
      const newsRes = await fetch(url);
      const newsData = await newsRes.json();
      console.log("News API Response:", newsData); // Debugging

      // Handle cases where API response is incorrect
      if (!newsData.articles || !Array.isArray(newsData.articles)) {
        console.error("[ERROR] News API response is invalid:", newsData);
        return [...eventsData]; // Only return events if news fails
      }

      // Format news results
      const newsFormatted = newsData.articles.map((article) => ({
        title: article.title,
        category: "News",
        link: article.url,
      }));

      return [...eventsData, ...newsFormatted]; // Merge data
    } catch (error) {
      console.error("[ERROR] Unable to load search data:", error);
      return []; // Return empty array if an error occurs
    }
  }

  async function setupSearch() {
    console.log("Initializing search...");

    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");
    const searchForm = document.getElementById("searchForm");

    // Load data asynchronously
    const data = await fetchSearchData();

    // Handle input for filtering
    searchInput.addEventListener("input", () => {
      let query = searchInput.value.toLowerCase().trim();
      searchResults.innerHTML = "";

      if (!query) {
        searchResults.style.display = "none";
        return;
      }

      // Filter events & news
      const filteredResults = data.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          (item.category && item.category.toLowerCase().includes(query))
      );

      // Show results
      if (filteredResults.length === 0) {
        searchResults.innerHTML = "<p>No results found.</p>";
      } else {
        const ul = document.createElement("ul");
        filteredResults.forEach((result) => {
          const li = document.createElement("li");
          li.textContent = `${result.title} (${result.category})`;
          li.addEventListener("click", () => {
            if (result.link) {
              window.open(result.link, "_blank"); // Open news articles in a new tab
            } else {
              router.navigate(
                `/events#${result.title.replace(/\s+/g, "-").toLowerCase()}`
              );
              return;
            }
          });
          ul.appendChild(li);
        });
        searchResults.appendChild(ul);
      }

      searchResults.style.display = "block";
    });

    // Prevent form submission & hide results when clicking outside
    searchForm.addEventListener("submit", (event) => event.preventDefault());
    document.addEventListener("click", (event) => {
      if (
        !searchResults.contains(event.target) &&
        event.target !== searchInput
      ) {
        searchResults.style.display = "none";
      }
    });
  }

  // Dynamically update nav link
  function updateActiveNavLink() {
    console.log("[INFO] Updating active nav link...");

    const currentPage = document.title.trim().toLowerCase();
    const navLinks = document.querySelectorAll("nav a");

    navLinks.forEach((link) => {
      if (link.textContent.trim().toLowerCase() === currentPage) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  // Dynamically load the gallery using data in the JSON file.
  async function LoadGallery() {
    console.log("[INFO] Loading Gallery...");
    const galleryContent = document.getElementById("gallery-content");
    return fetch("data/gallery.json")
      .then((response) => response.json())
      .then((data) => {
        data.forEach((image) => {
          let img = document.createElement("img");
          img.src = image.src;
          img.alt = image.alt;
          img.classList.add("gallery-img");

          // Event listener to open Lightbox on click
          img.addEventListener("click", () =>
            OpenLightBox(image.src, image.caption)
          );
          galleryContent.appendChild(img);
        });
      })
      .catch((error) => {
        console.error("[ERROR] Unable to Load Gallery", error);
        galleryContent.textContent = "Unable to load images.";
      });
  }

  // Lightbox
  function OpenLightBox(src, caption) {
    document.getElementById("lightbox").style.display = "flex";
    document.getElementById("lightbox-img").src = src;
    document.getElementById("lightbox-caption").textContent = caption;
  }

  // Load news API , Key is as constant at begining of code.
  async function LoadNews() {
    console.log("[INFO] Loading News...");

    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetchnew data from newsapi.org");
        }
        return response.json();
      })
      .then((data) => {
        console.log("News API Response", data);
        const newsDataElement = document.getElementById("news-data");

        // Clear previous Data
        newsDataElement.innerHTML = "";

        if (data.articles.length === 0) {
          newsDataElement.innerHTML = `<p>No news articles found.</p>`;
          return;
        }

        data.articles.forEach((article) => {
          let newsItem = document.createElement("div");
          newsItem.classList.add("news-item");
          newsItem.innerHTML = `
                <h4>${article.title}</h4>
                <p class="news-description">${
                  article.description || "No description available"
                }</p>
                <a href="${article.url}" target="_blank">Read More</a>
              `;
          newsDataElement.appendChild(newsItem);
        });
      })
      .catch((error) => {
        console.error("[ERROR] Unable to Fetch News Data", error);
        document.getElementById("news-data").textContent =
          "Unable to contact news data at this time";
      });
  }

  function DisplayHomePage() {
    console.log("Calling DisplayHomePage()...");

    let opportunitiesBtn = document.getElementById("OpportunitiesBtn");
    opportunitiesBtn.addEventListener("click", () => {
      router.navigate("/opportunities");
    });
  }

  function DisplayOpportunitiesPage() {
    console.log("Calling DisplayOpportunitiesPage()...");

    let opportunities = [
      "Opportunity #1, Planting Trees, January 25th 8:30am - 10:30am",
      "Opportunity #2, Cleaning Parks, January 27th 9:30am - 11:30am",
      "Opportunity #3, Planting Plants, January 29th 10:30am - 12:30am",
    ];

    let opportunitiesList = document.getElementById("opportunitiesList");
    let data = "";

    let index = 1;
    for (let i = 0; i < opportunities.length; i++) {
      let opportunityData = opportunities[i];

      opportunityData = opportunityData.split(",");
      let title = opportunityData[0];
      let description = opportunityData[1];
      let dateTime = opportunityData[2];

      data += `<tr><th scope="row" class="text-center">${index}</th>
                 <td>${title}</td>
                 <td>${description}</td>
                 <td>${dateTime}</td>
                 </tr>`;
      index++;
    }
    opportunitiesList.innerHTML = data;

    let volunteerBtn = document.getElementById("volunteerBtn");
    let confirmation = document.getElementById("confirmation");
    let resetModal = document.getElementById("resetModal");

    // If submit button is clicked in modal --> Add a confirmation msg inside the p tag.
    volunteerBtn.addEventListener("click", (event) => {
      event.preventDefault();
      let form = document.querySelector("form");
      let fullName = document.getElementById("fullName");
      if (form.checkValidity()) {
        let volunteerName = fullName.value;
        form.reset();

        let confirmationMsg = `<p id="confirmationMsg" class="mb-3">Thank you for Signing Up - ${volunteerName}</p>`;
        confirmation.innerHTML = confirmationMsg;
      } else {
        form.reportValidity();
      }
    });

    resetModal.addEventListener("click", () => {
      confirmation.innerHTML = "";
    });

    const contactListButton = document.getElementById("showOpportunitiesList");
    contactListButton.addEventListener("click", function (event) {
      event.preventDefault();
      router.navigate("/opportunities-list");
    });
  }

  function DisplayOpportunitiesListPage() {
    console.log("Calling DisplayOpportunitiesListPage()...");

    if (localStorage.length > 0) {
      let opportunitiesList = document.getElementById("opportunitiesList");
      let data = ""; // Add deserialized data from localStorage

      let keys = Object.keys(localStorage); // Return a string array of keys

      let index = 1;
      for (const key of keys) {
        if (key.startsWith("opportunity_")) {
          let opportunityData = localStorage.getItem(key);

          try {
            let opportunity = new core.Opportunity();
            opportunity.deserialize(opportunityData);
            data += `<tr><th scope="row" class="text-center">${index}</th>
                                 <td>${opportunity.title}</td>
                                 <td>${opportunity.description}</td>
                                 <td>${opportunity.dateAndTime}</td>
                                 <td class="text-center">
                                  <button value="${key}" class="btn btn-warning btn-sm edit">
                                   <i class="fa-solid fa-pen-to-square"></i> Edit
                                  </button>
                                 </td>
                                 <td class="text-center">
                                  <button value=${key} class="btn btn-danger btn-sm delete">
                                   <i class="fa-solid fa-trash-can"></i> Delete
                                  </button>
                                 </td>
                                 </tr>`;
            index++;
          } catch (error) {
            console.error("Error deserializing opportunity data.");
          }
        } else {
          console.warn("Skipping non-opportunity key");
        }
      }
      opportunitiesList.innerHTML = data;
    }

    const addButton = document.getElementById("addButton");
    if (addButton) {
      addButton.addEventListener("click", () => {
        router.navigate("/edit#add");
      });
    }

    const deleteButtons = document.querySelectorAll("button.delete");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const opportunityKey = this.value; // get the opportunity key from the button value
        console.log(`[DEBUG] Deleting opportunity ID: ${opportunityKey}`);

        if (!opportunityKey.startsWith("opportunity_")) {
          console.error(
            "[ERROR] Invalid opportunity key format: ",
            opportunityKey
          );
          return;
        }

        if (confirm("Delete opportunity, please confirm?")) {
          localStorage.removeItem(this.value);
          DisplayopportunitiesListPage();
        }
      });
    });

    const editButtons = document.querySelectorAll("button.edit");
    editButtons.forEach((button) => {
      button.addEventListener("click", function () {
        // Concatenate the value from the edit link to the edit.html#{key}
        router.navigate(`/edit#${this.value}`);
      });
    });
  }

  function DisplayEventsPage() {
    console.log("Calling DisplayEventsPage()...");

    const addEventButton = document.querySelector("#addEvent");

    if (sessionStorage.getItem("user")) {
      addEventButton.style.display = "block";
    } else {
      addEventButton.style.display = "none";
    }

    // Referenced Varush's Library App https://varushsiva.github.io/library-app/
    let myEvents = [];

    fetch("./data/events.json")
      .then((response) => response.json())
      .then((data) => {
        let storedEvents = localStorage.getItem("myEvents");
        myEvents = storedEvents ? JSON.parse(storedEvents) : data;
        displayEvents(myEvents); // Display the events
      })
      .catch((error) => console.error("Error loading events:", error));
    let container = document.getElementById("upcoming-events");

    function Event(cover, title, date, time, category) {
      this.cover = cover;
      this.title = title;
      this.date = date;
      this.time = time;
      this.category = category;
    }

    function createElementClassAppend(element, className, parent) {
      let attribute = document.createElement(element);
      if (className) {
        attribute.className = className;
      }
      parent.appendChild(attribute);
      return attribute;
    }

    function displayEvents(eventList, startCount = 0) {
      eventList.sort((a, b) => new Date(a.date) - new Date(b.date));

      for (let i = startCount; i < eventList.length; i++) {
        let workshopCover = "./assets/workshop.jpg";
        let fundraiserCover = "./assets/fundraiser-dinner.jpg";
        let cleanupCover = "./assets/volunteerdays-small.png";
        let currentEvent = eventList[i];
        let cards = createElementClassAppend("div", "event", container);
        cards.id = i;
        // Displaying Contents of Event
        // 1. Event Cover
        let eventCover = createElementClassAppend("div", "event-cover", cards);
        if (currentEvent.category == "Workshops") {
          eventCover.style.cssText = `background-image: url(${workshopCover}); background-size: cover; background-position: center;`;
        } else if (currentEvent.category == "Fundraisers") {
          eventCover.style.cssText = `background-image: url(${fundraiserCover}); background-size: cover; background-position: center;`;
        } else if (currentEvent.category == "Cleanups") {
          eventCover.style.cssText = `background-image: url(${cleanupCover}); background-size: cover; background-position: center;`;
        }

        // 2. Event Content
        let eventContent = createElementClassAppend(
          "div",
          "event-content",
          cards
        );

        // 2.1. Title
        let eventTitle = createElementClassAppend("h2", "title", eventContent);
        eventTitle.textContent = currentEvent.title;

        // 2.2. Details
        let eventDetails = createElementClassAppend(
          "div",
          "event-details",
          eventContent
        );

        let eventDate = createElementClassAppend("p", "", eventDetails);
        eventDate.textContent = `Date: ${currentEvent.date}`;

        let eventTime = createElementClassAppend("p", "", eventDetails);
        eventTime.textContent = `Time: ${currentEvent.time}`;

        // 3 Create Div to put  Delete Button inside
        let functionalButtons = createElementClassAppend(
          "div",
          "functional-buttons",
          cards
        );

        // 3.1 Create Delete Button
        let deleteEventButton = createElementClassAppend(
          "button",
          "delete",
          functionalButtons
        );

        let deleteImg = createElementClassAppend(
          "img",
          "delete-icon",
          deleteEventButton
        );
        deleteImg.src = "./assets/trash-can-outline.svg";

        // If delete button is clicked, use the id in card to exec function deleteEvent
        deleteEventButton.addEventListener("click", () => {
          deleteEvent(cards.id);
        });
      }
    }

    // Delete Event using the index
    function deleteEvent(index) {
      let div = document.getElementById(index);
      div.remove();
      myEvents.splice(index, 1);
      localStorage.setItem("myEvents", JSON.stringify(myEvents));
    }

    function addEventToList(event) {
      myEvents.push(event);
      localStorage.setItem("myEvents", JSON.stringify(myEvents));
    }

    displayEvents(myEvents);

    // Add Event Button
    const addEvent = document.querySelector("#addEvent");
    const eventDialog = document.querySelector("dialog");
    addEvent.addEventListener("click", () => {
      eventDialog.showModal();
    });

    const form = document.querySelector("form");

    const dEventTitle = document.getElementById("eventTitle");
    const dEventDate = document.getElementById("eventDate");
    const dEventTime = document.getElementById("eventTime");
    const dEventCategory = document.getElementById("eventCategory");

    const submitButton = document.querySelector("#submit");
    submitButton.addEventListener("click", (event) => {
      event.preventDefault();

      // Variables for Dialog
      if (form.checkValidity()) {
        let dEventCover = "";
        if (dEventCategory.value === "Workshops") {
          dEventCover = "./assets/workshop.jpg";
        } else if (dEventCategory.value === "Fundraisers") {
          dEventCover = "./assets/fundraiser-dinner.jpg";
        } else if (dEventCategory.value === "Cleanups") {
          dEventCover = "./assets/volunteerdays-small.png";
        }

        let event = new Event(
          dEventCover,
          dEventTitle.value,
          dEventDate.value,
          dEventTime.value,
          dEventCategory.value
        );

        let count = myEvents.length;
        addEventToList(event);
        myEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

        displayEvents(myEvents, count);

        form.reset();
        eventDialog.close();
      } else {
        form.reportValidity();
      }
    });

    const closeDialog = document.querySelector("#close");
    closeDialog.addEventListener("click", (e) => {
      e.preventDefault();
      form.reset();
      eventDialog.close();
    });

    function filterEvents(category) {
      let filteredEvents =
        category === "All"
          ? myEvents
          : myEvents.filter((event) => event.category === category);
      document.getElementById("upcoming-events").innerHTML = ""; // Clear current events
      displayEvents(filteredEvents); // Show only filtered events
    }

    // Event Listener for Category Selection
    document
      .getElementById("filterCategory")
      .addEventListener("change", (event) => {
        filterEvents(event.target.value);
      });
  }

  function DisplayContactPage() {
    console.log("Calling DisplayContactPage()...");

    let sendButton = document.getElementById("sendButton");
    let form = document.querySelector("form");

    sendButton.addEventListener("click", (event) => {
      event.preventDefault();

      // If form is valid, open Modal for confirmation msg and then redirect user to home page.
      if (form.checkValidity()) {
        const fullName = document.getElementById("fullName").value.trim();
        const emailAddress = document
          .getElementById("emailAddress")
          .value.trim();
        const subject = document.getElementById("subject").value.trim();
        const message = document.getElementById("message").value.trim();

        // Inject form data into the confirmation modal to let the user know that the information has been recieved.
        document.getElementById("submittedDetails").innerHTML = `
        <strong>Full Name:</strong> ${fullName}<br>
        <strong>Email:</strong> ${emailAddress}<br>
        <strong>Subject:</strong> ${subject}<br>
        <strong>Message:</strong> ${message}
        `;

        let modalForm = document.querySelector("#confirmationModal");
        const modal = new bootstrap.Modal(modalForm); // Bootstrap Documentation
        modal.show();

        setInterval(() => {
          router.navigate("/index");
        }, 5000);
      } else {
        form.reportValidity();
      }
    });
  }

  function DisplayAboutPage() {
    console.log("Calling DisplayAboutPage()...");
  }

  function DisplayPrivacyPage() {
    console.log("Calling DisplayPrivacyPage()...");
  }

  function DisplayToSPage() {
    console.log("Calling DisplayToSPage()...");
  }

  function Display404Page() {
    console.log("Calling Display404Page()...");
  }

  function DisplayDonatePage() {
    console.log("Calling DisplayDonatePage()...");
    let donate = document.querySelector(".donate");
    donate.classList.add("active");
    donate.setAttribute("aria-current", "page");
  }

  async function DisplayNewsPage() {
    console.log("Calling DisplayNewsPage()...");
    // Load asynchronous News
    await LoadNews();
  }

  async function DisplayGalleryPage() {
    console.log("Calling DisplayGalleryPage()...");

    await LoadGallery();

    let closeLightBox = document.getElementById("closeLightBox");
    closeLightBox.addEventListener("click", () => {
      document.getElementById("lightbox").style.display = "none";
    });
  }

  function addEventListenerOnce(elementId, event, handler) {
    const element = document.getElementById(elementId);
    if (element) {
      element.removeEventListener(event, handler);
      element.addEventListener(event, handler);
    } else {
      console.warn(`[WARN] Element with ID '${elementId}' not found`);
    }
  }

  function attachValidationListener() {
    console.log("[INFO] Attaching validation listeners");

    Object.keys(VALIDATION_RULES).forEach((fieldId) => {
      const field = document.getElementById(fieldId);
      if (!fieldId) {
        console.warn(
          `[WARNING] Field '${fieldId}' not found. Skipping listener attachment.`
        );
        return;
      }

      // Attach event listener using centralized validation
      addEventListenerOnce(fieldId, "input", () => validateInput(fieldId));
    });
  }

  function DisplayLoginPage() {
    console.log("[INFO] DisplayLoginPage called...");

    if (sessionStorage.getItem("user")) {
      router.navigate("/home");
      return;
    }

    const messageArea = document.getElementById("messageArea");
    const loginButton = document.getElementById("loginButton");
    const cancelButton = document.getElementById("cancelButton");

    // messageArea
    messageArea.style.display = "none";

    if (!loginButton) {
      console.error("[ERROR] Unable to login button not found");
      return;
    }

    loginButton.addEventListener("click", async (event) => {
      // prevent default form submission
      event.preventDefault();

      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      try {
        // The await keyword tells JavaScript to pause here (thread) until the fetch request completes
        const response = await fetch("./data/users.json");

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const jsonData = await response.json();
        console.log("[DEBUG] Fetched JSON Data:", jsonData);

        const users = jsonData.users;

        if (!Array.isArray(users)) {
          throw new Error("[ERROR] Json data does not contain a valid array");
        }

        let success = false;
        let authenticateUser = null;
        // Authenticate user login
        for (const user of users) {
          if (user.Username === username && user.Password === password) {
            success = true;
            authenticateUser = user;
            break;
          }
        }

        if (success) {
          sessionStorage.setItem(
            "user",
            JSON.stringify({
              DisplayName: authenticateUser.DisplayName,
              Username: authenticateUser.Username,
            })
          );
          // Error messages for validation to make sure user submits valid data.
          messageArea.classList.remove("alert", "alert-danger");
          messageArea.style.display = "none";

          LoadHeader().then(() => {
            router.navigate("/home");
          });
        } else {
          messageArea.classList.add("alert", "alert-danger");
          messageArea.textContent =
            "Invalid username or password. Please try again";
          messageArea.style.display = "block";

          document.getElementById("username").focus();
          document.getElementById("username").select();
        }
      } catch (error) {
        console.error("[ERROR] Login failed", error);
      }
    });

    // Handle cancel event
    cancelButton.addEventListener("click", (event) => {
      document.getElementById("loginForm").reset();
      router.navigate("/");
    });
  }

  /**
   * Listen for changes and update the navigation links
   */
  document.addEventListener("routeLoaded", (event) => {
    const newPath = event.detail; // extract the route from the event passed
    console.log(`[INFO] Route Loaded: ${newPath}`);

    LoadHeader().then(() => {
      handlePageLogic(newPath);
    });
  });

  /**
   * Session expires, redirect the user to the login page
   */
  window.addEventListener("sessionExpired", () => {
    console.warn("[SESSION] Redirecting to login page due to inactivity");
    router.navigate("/login");
  });

  function handlePageLogic(path) {
    // Update page title
    document.title = pageTitles[path] || "Untitled Page";

    // Check authentication level for protected pages
    const protectedRoutes = ["/opportunities-list"];

    if (protectedRoutes.includes(path)) {
      AuthGuard(); // redirect user to login page
    }

    switch (path) {
      case "/":
      case "/home":
        DisplayHomePage();
        break;
      case "/about":
        DisplayAboutPage();
        break;
      case "/statistics":
        DisplayStatistics();
      case "/contact":
        DisplayContactPage();
        attachValidationListener();
        break;
      case "/opportunities":
        DisplayOpportunitiesPage();
        break;
      case "/opportunities-list":
        DisplayOpportunitiesListPage();
        break;
      case "/events":
        DisplayEventsPage();
        break;
      case "/login":
        DisplayLoginPage();
        break;
      case "/donate":
        DisplayDonatePage();
        break;
      case "/gallery":
        DisplayGalleryPage();
        break;
      case "/privacy-policy":
        DisplayPrivacyPage();
        break;
      case "/tos":
        DisplayToSPage();
        break;
      case "/404":
        Display404Page();
        break;
      case "/news":
        DisplayNewsPage();
        break;
      default:
        console.warn(`[WARNING] No display logic found for: ${path}`);
    }
  }

  async function Start() {
    console.log("Starting Assignment 3...");
    console.log(`Current document title: ${document.title}`);

    // Load header first, then run CheckLogin after
    await LoadHeader();
    CheckLogin();
    await LoadFooter();
    AuthGuard();

    // Setup Search on page load
    await setupSearch();

    const currentPath = location.hash.slice(1) || "/";
    router.loadRoute(currentPath);

    handlePageLogic(currentPath);

    // Dynamically Add Donate Link text to NavBar when page loads.
    console.log("Adding 'Donate' link to NavBar");
    let navbar = document.querySelector(".navbar-nav");
    let donateNav = document.createElement("li");
    donateNav.classList.add("nav-item");
    donateNav.innerHTML = `<a class="nav-link donate" href="donate.html">Donate</a>`;
    navbar.appendChild(donateNav);

    let navLinks = document.querySelectorAll("a");
    navLinks.forEach((navLink) => {
      if (navLink.innerHTML == "Opportunities") {
        navLink.innerHTML = "Volunteer Now";
      }
    });
  }
  window.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed");
    Start();
  });
})();
