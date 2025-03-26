"use strict";

export function LoadFooter() {
  return fetch("views/components/footer.html")
    .then((response) => response.text())
    .then((html) => {
      document.querySelector("footer").innerHTML = html;

      // Back to Top Logic
      let backToTop = document.getElementById("btn-back-to-top");
      backToTop.addEventListener("click", () => {
        console.log("click -> Scroll to Top");
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      });
    })
    .catch((error) => console.error("[ERROR] Failed to load footer", error));
}
