const choices = ['rock', 'paper', 'scissors'];
const maxRounds = 5;
const moveEmojis = { rock: '✊', paper: '✋', scissors: '✌️' };
const counterMove = { rock: 'paper', paper: 'scissors', scissors: 'rock' };

const playerScoreEl = document.getElementById('player-score');
const computerScoreEl = document.getElementById('computer-score');
const roundNumberEl = document.getElementById('round-number');
const statusTextEl = document.getElementById('status-text');
const resultTextEl = document.getElementById('result-text');
const historyTextEl = document.getElementById('history-text');
const playerMoveEl = document.getElementById('player-move');
const computerMoveEl = document.getElementById('computer-move');
const historyListEl = document.getElementById('history-list');
const choiceButtons = document.querySelectorAll('.choice-btn');
const resetButton = document.getElementById('reset-button');
const resultCard = document.querySelector('.result-card');

let playerScore = 0;
let computerScore = 0;
let round = 0;
let lastWinner = null;
let playerHistory = [];

function getComputerChoice(history = playerHistory) {
  if (history.length < 2) {
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
  }

  const counts = history.reduce((acc, move) => {
    acc[move] += 1;
    return acc;
  }, { rock: 0, paper: 0, scissors: 0 });

  const mostPlayed = Object.keys(counts).reduce((a, b) => (counts[a] >= counts[b] ? a : b));
  const prediction = counterMove[mostPlayed];
  const shouldCounter = Math.random() < 0.68;
  if (shouldCounter) {
    return prediction;
  }

  const randomIndex = Math.floor(Math.random() * choices.length);
  return choices[randomIndex];
}

function getRoundResult(playerChoice, computerChoice) {
  if (playerChoice === computerChoice) {
    return 'tie';
  }

  if (
    (playerChoice === 'rock' && computerChoice === 'scissors') ||
    (playerChoice === 'paper' && computerChoice === 'rock') ||
    (playerChoice === 'scissors' && computerChoice === 'paper')
  ) {
    return 'player';
  }

  return 'computer';
}

function normalizeChoice(choice) {
  return choice.trim().toLowerCase();
}

function formatChoice(choice) {
  if (choice === 'rock') return 'Rock';
  if (choice === 'paper') return 'Paper';
  if (choice === 'scissors') return 'Scissors';
  return choice;
}

function updateScoreboard() {
  playerScoreEl.textContent = playerScore;
  computerScoreEl.textContent = computerScore;
  roundNumberEl.textContent = `${round} / ${maxRounds}`;
}

function disableChoices(disabled) {
  choiceButtons.forEach(button => {
    button.disabled = disabled;
    button.style.filter = disabled ? 'brightness(0.8)' : 'brightness(1)';
  });
}

function setHands(playerChoice, computerChoice) {
  playerMoveEl.textContent = playerChoice ? moveEmojis[playerChoice] : '?';
  computerMoveEl.textContent = computerChoice ? moveEmojis[computerChoice] : '?';
}

function addHistoryEntry(roundNumber, playerChoice, computerChoice, result) {
  const entry = document.createElement('li');
  const winnerText = result === 'tie' ? 'Draw' : result === 'player' ? 'You win' : 'Computer wins';
  entry.textContent = `Round ${roundNumber}: ${moveEmojis[playerChoice]} ${formatChoice(playerChoice)} vs ${moveEmojis[computerChoice]} ${formatChoice(computerChoice)} — ${winnerText}`;

  if (historyListEl.children.length === 1 && historyListEl.children[0].textContent.includes('No rounds')) {
    historyListEl.innerHTML = '';
  }

  historyListEl.prepend(entry);
}

function animateResult() {
  resultCard.classList.add('animating');
  setTimeout(() => {
    resultCard.classList.remove('animating');
  }, 1100);
}

function showResponsibleMessage() {
  if (round === maxRounds) {
    historyTextEl.textContent = 'Good game! The smartest move is staying balanced — take a break and play again later.';
  } else if (playerScore > computerScore + 1) {
    historyTextEl.textContent = 'You are leading the match. Keep the energy positive and play with respect.';
  } else if (computerScore > playerScore + 1) {
    historyTextEl.textContent = 'The computer is ahead. Stay calm, adapt your strategy, and remember it’s just a game.';
  } else {
    historyTextEl.textContent = 'It’s a tight match. Enjoy the challenge and keep the game friendly.';
  }
}

function playRound(playerChoiceRaw) {
  if (round >= maxRounds) {
    statusTextEl.textContent = 'The match is complete. Restart to challenge the computer again.';
    return;
  }

  const playerChoice = normalizeChoice(playerChoiceRaw);
  const previousHistory = playerHistory.slice();
  playerHistory.push(playerChoice);
  round += 1;

  disableChoices(true);
  statusTextEl.textContent = 'Computer is analyzing your move...';
  resultTextEl.textContent = 'Revealing moves soon...';
  setHands(playerChoice, null);
  computerMoveEl.classList.add('shake');

  setTimeout(() => {
    computerMoveEl.classList.remove('shake');
    const computerChoice = getComputerChoice(previousHistory);
    const result = getRoundResult(playerChoice, computerChoice);

    if (result === 'player') {
      playerScore += 1;
      lastWinner = 'You';
      resultTextEl.textContent = `${formatChoice(playerChoice)} beats ${formatChoice(computerChoice)}. You win this round!`;
    } else if (result === 'computer') {
      computerScore += 1;
      lastWinner = 'Computer';
      resultTextEl.textContent = `${formatChoice(computerChoice)} beats ${formatChoice(playerChoice)}. Computer wins this round.`;
    } else {
      lastWinner = 'Tie';
      resultTextEl.textContent = `Both chose ${formatChoice(playerChoice)}. It’s a tie.`;
    }

    setHands(playerChoice, computerChoice);
    statusTextEl.textContent = `Round ${round} of ${maxRounds}: ${lastWinner === 'Tie' ? 'Tie round.' : lastWinner + ' is ahead.'}`;
    updateScoreboard();
    showResponsibleMessage();
    addHistoryEntry(round, playerChoice, computerChoice, result);
    animateResult();

    if (round === maxRounds) {
      const finalWinner = playerScore > computerScore ? 'You win the game!' : playerScore < computerScore ? 'Computer wins the game.' : 'The game ends in a draw.';
      statusTextEl.textContent = `${finalWinner} ${statusTextEl.textContent}`;
      disableChoices(true);
    } else {
      disableChoices(false);
    }
  }, 750);
}

function resetGame() {
  playerScore = 0;
  computerScore = 0;
  round = 0;
  lastWinner = null;
  playerHistory = [];
  playerScoreEl.textContent = '0';
  computerScoreEl.textContent = '0';
  roundNumberEl.textContent = `0 / ${maxRounds}`;
  statusTextEl.textContent = 'Choose rock, paper, or scissors to begin.';
  resultTextEl.textContent = 'No rounds played yet.';
  historyTextEl.textContent = 'Friendly reminder: a fair match is more enjoyable than a perfect one.';
  setHands(null, null);
  historyListEl.innerHTML = '<li>No rounds played yet.</li>';
  disableChoices(false);
}

choiceButtons.forEach(button => {
  button.addEventListener('click', () => playRound(button.dataset.choice));
});

resetButton.addEventListener('click', resetGame);
