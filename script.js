const characters = {
  Glorfindel: { hp: 245, attackBonus: 1.7, healBonus: 3.5 },
  Fingolfin:  { hp: 300, attackBonus: 2.5, healBonus: 5.0 },
  Ecthelion:  { hp: 230,  attackBonus: 2.0, healBonus: 3.0 },
  Sauron:     { hp: 350, attackBonus: 3.0, healBonus: 1.5 },
  Gothmog:    { hp: 295, attackBonus: 2.4, healBonus: .75 },
  Eol:        { hp: 130, attackBonus: 4.0, healBonus: .5 }
};

let selected = [];
let playerStats = [];
let hp = [];
let turn = 0;

const charContainer = document.getElementById("char-buttons");
Object.keys(characters).forEach(name => {
  const btn = document.createElement("button");
  btn.innerText = name;
  btn.classList.add("char-button");
  btn.onclick = () => selectCharacter(name);
  charContainer.appendChild(btn);
});

function selectCharacter(name) {
  if (selected.length < 2 && !selected.includes(name)) {
    selected.push(name);
    playerStats.push(characters[name]);
    hp.push(characters[name].hp);
    log(`${name} selected!`);

    if (selected.length === 2) {
      startGame();
    }
  }
}

function startGame() {
  document.getElementById("battle").style.display = "block";
  document.getElementById("name1").innerText = selected[0];
  document.getElementById("name2").innerText = selected[1];
  updateHP();
  updateTurnDisplay();

  // Update character images
  document.getElementById("img1").src = `images/${selected[0].toLowerCase()}.jpg`;
  document.getElementById("img2").src = `images/${selected[1].toLowerCase()}.jpg`;
}

function updateHP() {
  document.getElementById("hp1").innerText = hp[0];
  document.getElementById("hp2").innerText = hp[1];
}

function updateTurnDisplay() {
  document.getElementById("turnDisplay").innerText = `${selected[turn]}'s Turn`;
}

function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

function attack() {
  const base = rollDice() * 5;
  const attacker = turn;
  const defender = (turn + 1) % 2;
  const damage = Math.floor(base * playerStats[attacker].attackBonus);
  hp[defender] -= damage;
  hp[defender] = Math.max(0, hp[defender]);
  updateHP();
  log(`${selected[attacker]} attacks for ${damage} damage!`);

  if (hp[defender] <= 0) {
    log(`${selected[attacker]} wins!`);
    endGame();
  } else {
    turn = defender;
    updateTurnDisplay();
  }
}

function heal() {
  const base = rollDice() * 3;
  const healAmount = Math.floor(base * playerStats[turn].healBonus);
  hp[turn] += healAmount;
  hp[turn] = Math.min(playerStats[turn].hp, hp[turn]);
  updateHP();
  log(`${selected[turn]} heals for ${healAmount} HP!`);
  turn = (turn + 1) % 2;
  updateTurnDisplay();
}

function log(message) {
  const logBox = document.getElementById("log");
  logBox.innerText = message; // 👈 Overwrite, not append
}

function endGame() {
  document.querySelectorAll("button").forEach(btn => {
    if (!btn.id.includes("playAgain")) btn.disabled = true;
  });
  document.getElementById("playAgain").style.display = "inline-block";
}

function resetGame() {
  // Reset state
  selected = [];
  playerStats = [];
  hp = [];
  turn = 0;

  // Clear text
  document.getElementById("log").innerText = "";
  document.getElementById("name1").innerText = "";
  document.getElementById("name2").innerText = "";
  document.getElementById("hp1").innerText = "";
  document.getElementById("hp2").innerText = "";
  document.getElementById("turnDisplay").innerText = "";

  // Clear images
  document.getElementById("img1").src = "";
  document.getElementById("img2").src = "";

  // Reset visibility
  document.getElementById("battle").style.display = "none";
  document.getElementById("playAgain").style.display = "none";

  // Re-enable character buttons
  document.querySelectorAll(".char-button").forEach(btn => btn.disabled = false);

  document.querySelectorAll("#battle button").forEach(btn => btn.disabled = false);
}