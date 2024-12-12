// Location of games and images
const gamesFolder = "games/"; // Folder where your games are stored
const imagesFolder = "images/"; // Folder where your images are stored
const coresFolder = "cores/"; // Folder where your cores are stored (if needed)
const gameGrid = document.getElementById("game-grid");

// Path to the WebRetro instance (root directory)
const webretroPath = "embed.js";  

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
          rom: `${gamesFolder}${fullFileName}`, // Pointing to the correct game file in the 'games' folder
          system: "nes", // NES system
          core: "nestopia_libretro" // NES core for WebRetro
        };

        // Log the query object for debugging
        console.log("Launching game:", gameName);
        console.log("Queries:", queries);

        // Clear any existing iframe
        webretroContainer.innerHTML = "";

        // Load the selected game into the WebRetro iframe
        webretroEmbed(webretroContainer, webretroPath, queries);
      });

      gameGrid.appendChild(gameCard);
    });
  })
  .catch(error => console.error("Error loading games:", error));
