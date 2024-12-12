// Location of games and images
const gamesFolder = "games/";
const imagesFolder = "images/";
const coresFolder = "cores/"
const gameGrid = document.getElementById("game-grid");

// Path to the WebRetro instance
const webretroPath = "/";

const webretroContainer = document.getElementById("webretro-container");

// Fetch list of games dynamically
fetch(gamesFolder)
  .then(response => {
    if (!response.ok) {
      throw new Error("Could not access the games folder");
    }
    return response.text();
  })
  .then(data => {
    // Extract .nes filenames using regex from the response
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(data, "text/html");
    const files = Array.from(htmlDoc.querySelectorAll("a"))
      .map(link => link.href)
      .filter(file => file.endsWith(".nes"));

    // Create game cards
    files.forEach(file => {
      // Decode filename to replace %20 with spaces, etc.
      const fullFileName = decodeURIComponent(file.split("/").pop());
      const gameName = fullFileName.replace(".nes", ""); // Remove .nes extension
      const imagePath = `${imagesFolder}${gameName}.jpg`;

      // Create HTML for each game
      const gameCard = document.createElement("div");
      gameCard.className = "game-card";

      gameCard.innerHTML = `
        <img src="${imagePath}" alt="${gameName}">
        <h2>${gameName}</h2>
      `;

      // Add click event to launch game in WebRetro
      gameCard.addEventListener("click", () => {
        const queries = {
          rom: `${gamesFolder}${fullFileName}`,
          system: "nes", // NES system
          core: "nestopia_libretro" // NES core for WebRetro
        };

        // Clear any existing iframe
        webretroContainer.innerHTML = "";

        // Load the selected game into the WebRetro iframe
        webretroEmbed(webretroContainer, webretroPath, queries);
      });

      gameGrid.appendChild(gameCard);
    });
  })
  .catch(error => console.error("Error loading games:", error));
