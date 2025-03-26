//import {Chart} from "chart.js";

export async function DisplayStatistics() {
  try {
    const response = await fetch("./data/statistic.json");
    const data = await response.json();

    const labels = data.map((entry) => entry.start);
    const userCounts = data.filter((entry) => entry.title === "User").length;
    const adminCounts = data.filter((entry) => entry.title === "Admin").length;
    const staffCounts = data.filter((entry) => entry.title === "Staff").length;

    const ctx = document.getElementById("myChart").getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["User", "Admin", "Staff"],
        datasets: [
          {
            label: "# of Roles",
            data: [userCounts, adminCounts, staffCounts],
            backgroundColor: [
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 99, 132, 0.2)",
              "rgba(75, 192, 192, 0.2)",
            ],
            borderColor: [
              "rgba(54, 162, 235, 1)",
              "rgba(255, 99, 132, 1)",
              "rgba(75, 192, 192, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error loading chart data:", error);
  }
}
