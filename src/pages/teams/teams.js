$(document).ready(() => {
  // Get the container and its child div elements
  const container = document.querySelector(".img-1");
  const divs = Array.from(container.querySelectorAll("div"));

  // Shuffle the div elements using the Fisher-Yates (Knuth) Shuffle algorithm
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  shuffleArray(divs);
  container.innerHTML = ''; // Clear the container

  divs.forEach((div) => {
    divs.push(div.cloneNode(true));
  });

  divs.forEach((div) => {
    divs.push(div.cloneNode(true));
  });

  divs.forEach((div) => {
    container.appendChild(div);
  });



})