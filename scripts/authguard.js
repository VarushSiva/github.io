"use strict";

let sessionTimeout;

function resetSessionTimeout() {
  clearTimeout(sessionTimeout);
  sessionTimeout = setTimeout(() => {
    console.warn("[WARNING] Session expired due to inactivity");
    sessionStorage.removeItem("user");

    // Dispatch a global event to redirect the user
    window.dispatchEvent(new CustomEvent("sessionExpired"));
  }, 30 * 60 * 1000); //
}

// Listen for user activity
document.addEventListener("mousemove", resetSessionTimeout);
document.addEventListener("keypress", resetSessionTimeout);

export function AuthGuard() {
  const user = sessionStorage.getItem("user");
  const protectedRoutes = ["/opportunities-list"];

  if (!user && protectedRoutes.includes(location.hash.slice(1))) {
    console.log(
      "[AUTHGUARD] Unauthorized access detected, Redirecting to login page"
    );
    location.hash = "/login";
    window.dispatchEvent(new CustomEvent("sessionExpired"));
  } else {
    resetSessionTimeout();
  }
}
