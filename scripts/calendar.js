// export async function LoadCalendarHead() {
//   console.log("[INFO] Loading Calendar Head...");

//   return fetch("./calender/head.html")
//     .then((response) => response.text())
//     .then((data) => {
//       const headElement = document.querySelector("head");

//       if (!headElement) {
//         console.error("[ERROR] Calendar Head Content does not exist");
//         return;
//       }
//       headElement.innerHTML = data;
//     })
//     .catch((error) => {
//       console.error("[ERROR] Unable to load Calendar Head");
//     });
// }

export async function LoadCalendarScripts() {
  console.log("[INFO] Loading Calendar Scripts...");

  return fetch("./calender/scripts.html")
    .then((response) => response.text())
    .then((data) => {
      const sciptsElement = document.querySelector(".scripts");

      if (!sciptsElement) {
        console.error("[ERROR] Calendar Scripts Content does not exist");
        return;
      }
      sciptsElement.innerHTML = data;
    })
    .catch((error) => {
      console.error("[ERROR] Unable to load Calendar Scripts");
    });
}

// export async function LoadCalendarScripts() {
//   console.log("[INFO] Loading Calendar Scripts...");
//   const footer = document.querySelector("footer");

//   try {
//     const response = await fetch("./calendar/scripts.html");
//     const scripts = await response.text();
//     const template = document.createElement("template");
//     template.innerHTML = scripts.trim();

//     // Inject the scripts after the footer
//     footer.insertAdjacentElement("afterend", template.content);
//     console.log("[SUCCESS] Scripts loaded from scripts.html!");
//   } catch (error) {
//     console.error("[ERROR] Unable to load scripts: ", error);
//   }
// }
