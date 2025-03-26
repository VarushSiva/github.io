"use strict";

/**
 * Dynamically load the header from the header.html
 */
export async function LoadHeader() {
  console.log("[INFO] Loading Header...");

  return fetch("./views/components/header.html")
    .then((response) => response.text())
    .then((data) => {
      const headerElement = document.querySelector("header");

      if (!headerElement) {
        console.error("[ERROR] Header element does not exist");
        return;
      }
      headerElement.innerHTML = data;

      updateActiveNavLink();
      CheckLogin();
    })
    .catch((error) => {
      console.error("[ERROR] Unable to load header");
    });
}

export function updateActiveNavLink() {
  console.log("[INFO] Updating active nav link...");

  const currentPath = location.hash.slice(1);
  const navLinks = document.querySelectorAll("nav a");

  navLinks.forEach((link) => {
    const linkPath = link.getAttribute("href")?.replace("#", "") || "";

    if (currentPath === linkPath) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

function handleLogout(event) {
  event.preventDefault();

  sessionStorage.removeItem("user");
  console.log("[INFO] User logged out. Updating UI...");

  LoadHeader().then(() => {
    CheckLogin();
    location.hash = "/";
  });
}

export function CheckLogin() {
  console.log("[INFO] Checking user login status...");

  const loginNav = document.getElementById("login");

  if (!loginNav) {
    console.warn(
      "[WARNING] loginNav element not found! Skipping CheckLogin()."
    );
    return;
  }

  const userSession = sessionStorage.getItem("user");

  if (userSession) {
    let userObject = JSON.parse(userSession);
    let username = userObject.Username;

    loginNav.innerHTML = `<li class="nav-item dropdown">
        <a
          class="nav-link dropdown-toggle"
          href="#"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i class="fa fas-sign-out-alt"></i> Welcome ${username}!
        </a>
        <ul class="dropdown-menu">
          <li>
            <a id="logout" class="dropdown-item">Log Out</a>
          </li>
        </ul>
      </li>`;
    loginNav.href = "#";

    let logoutNav = document.getElementById("logout");
    logoutNav.removeEventListener("click", handleLogout);
    logoutNav.addEventListener("click", handleLogout);
  } else {
    loginNav.innerHTML = `<i class="fa fas-sign-in-alt"></i> Login`;
    loginNav.removeEventListener("click", handleLogout);
    loginNav.addEventListener("click", () => (location.hash = "/login"));
  }
}
