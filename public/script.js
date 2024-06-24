let races = [];
let themes = [];
let personalities = [];
let clothings = [];

// Fetch data from the server
fetch('/data')
  .then(response => response.json())
  .then(data => {
    data.forEach(row => {
      if (row.Race) races.push(row.Race);
      if (row.Theme) themes.push(row.Theme);
      if (row.Personality) personalities.push(row.Personality);
      if (row.Clothing) clothings.push(row.Clothing);
    });
  });

// Utility function to get random elements from an array
function getRandomElements(arr, count) {
  let shuffled = arr.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Function to create list items
function createListItems(items) {
  return items.map(item => `<li>${item}</li>`).join('');
}

// Randomize Race
document.getElementById('randomizeRace').addEventListener('click', () => {
  document.getElementById('race').textContent = races[Math.floor(Math.random() * races.length)];
});

// Randomize Theme
document.getElementById('randomizeTheme').addEventListener('click', () => {
  document.getElementById('theme').textContent = themes[Math.floor(Math.random() * themes.length)];
});

// Randomize Personality Traits
document.getElementById('randomizePersonality').addEventListener('click', () => {
  const numPersonality = document.getElementById('numPersonality').value || 3;
  document.querySelector('#personality ul').innerHTML = createListItems(getRandomElements(personalities, numPersonality));
});

// Randomize Clothing Items
document.getElementById('randomizeClothing').addEventListener('click', () => {
  const numClothing = document.getElementById('numClothing').value || 3;
  document.querySelector('#clothing ul').innerHTML = createListItems(getRandomElements(clothings, numClothing));
});

// Randomize All Attributes
document.getElementById('randomizeAll').addEventListener('click', () => {
  document.getElementById('randomizeRace').click();
  document.getElementById('randomizeTheme').click();
  document.getElementById('randomizePersonality').click();
  document.getElementById('randomizeClothing').click();
});
