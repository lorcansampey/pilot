console.log("JS connected!");

// show DATA - only append never add in middle
const shows = [
";",
"The Last of Us",
"The Office",
"Stranger Things",
"Game of Thrones",
"The Walking Dead",
"Gravity Falls",
"The Boys",
"Breaking Bad",
"Friends",
"The Mandalorian",
"Dark",
"Brooklyn 99",
"The Witcher",
"Teen Wolf",
"Severance",
"Narcos",
"Suite Life on Deck",
"Modern Family",
"Euphoria",
"Arrow",
"The Crown",
"BoJack Horseman",
"Lucifer",
"Avatar The Last Airbender",
"Sex Education",
"Shameless",
"Rick and Morty",
"House",
"American Dad",
"The Originals",
"Fargo",
"Prison Break",
"Elite",
"Jessica Jones",
"Vikings",
"Phineas and Ferb",
"Westworld",
"The Flash",
"Outer Banks",
"The Amazing World of Gumball",
"Invincible",
"Better Call Saul",
"The Big Bang Theory",
"The Legend of Korra",
"The Punisher",
"The Book of Boba Fett",
"Drake and Josh",
"Obi Wan Kenobi",
"Community",
"Mr Robot",
"Regular Show",
"Skins",
"Wizards of Waverly Place",
"Agents of Shield",
"The Umbrella Academy",
"Arcane",
"Hannah Montana",
"Family Guy",
"Full House",
"The Vampire Diaries",
"Andor",
"Dexter",
"Smallville",
"The Simpsons",
"Supernatural",
"The IT Crowd",
"Parks and Recreation",
"The Handmaids Tale",
"Wednesday",
"Money Heist",
"Black Mirror",
"The Inbetweeners",
"Lost",
"House of the Dragon",
"Peaky Blinders",
"iCarly",
"The Falcon and the Winter Soldier",
"True Detective",
"Sam and Cat",
"Gossip Girl",
"Daredevil",
"Victorious",
"SpongeBob SquarePants",
"The Clone Wars",
"Loki",
"Adventure Time",
"The Bear",
"Ben 10",
"Moon Knight",
"How I Met Your Mother",
"South Park",
"Silicon Valley",
"Pretty Little Liars",
"Suite Life of Zack and Cody",
"Ms Marvel",
"Chernobyl",
"Hawkeye",
"The Suite Life",
"Band of Brothers"

].map(title => ({
title,
frames: [
`images/${title.toLowerCase().replaceAll(" ","")}1.jpg`,
`images/${title.toLowerCase().replaceAll(" ","")}2.jpg`,
`images/${title.toLowerCase().replaceAll(" ","")}3.jpg`,
`images/${title.toLowerCase().replaceAll(" ","")}4.jpg`,
`images/${title.toLowerCase().replaceAll(" ","")}5.jpg`,
`images/${title.toLowerCase().replaceAll(" ","")}6.jpg`,
`images/${title.toLowerCase().replaceAll(" ","")}7.jpg`,
`images/${title.toLowerCase().replaceAll(" ","")}8.jpg`
]
}));

// DOM ELEMENTS
const frameImage = document.getElementById("show-frame");
const guessInput = document.getElementById("guess-input");
const guessBtn = document.getElementById("guess-btn");
const skipBtn = document.getElementById("skip-btn");
const resultMessage = document.getElementById("result-message");
const frameNumber = document.getElementById("frame-number");
const frameProgress = document.getElementById("frame-progress");

// WEEKLY SERIES SYSTEM
const launchDate = new Date(2026, 2, 15);
const today = new Date();

// Calculate number of weeks since launch
const weekNumber = Math.floor((today - launchDate) / (1000 * 60 * 60 * 24 * 7));

// Pick show based on week
const showIndex = weekNumber % shows.length;
const todaysshow = shows[showIndex];

// GAME STATE
let currentFrame = 0;
let guesses = [];
let gameEnded = false;

// LOAD FIRST FRAME
frameImage.src = todaysshow.frames[currentFrame];
frameNumber.innerText = currentFrame + 1;
updateFrameProgress();

// FRAME PROGRESS
function updateFrameProgress(winFrame = -1){
let squares = "";
for(let i = 0; i < todaysshow.frames.length; i++){
if(i === winFrame){
squares += "🟩";
}else if(i <= currentFrame){
squares += "⬛";
}else{
squares += "⬜";
}
}
frameProgress.innerText = squares;
}

// CHECK GUESS
guessBtn.addEventListener("click", function(){
if(guessBtn.disabled) return;
const guess = guessInput.value.trim().toLowerCase();
if(guess === "") return;
guesses.push(guess);

if(guess === todaysshow.title.toLowerCase()){
resultMessage.innerText = "🎉 Correct! You got it on frame " + (currentFrame + 1);
updateFrameProgress(currentFrame);
endGame(true);
} else {
resultMessage.innerText = "❌ Incorrect!";
guessBtn.disabled = true;
setTimeout(() => {
guessBtn.disabled = false;
revealNextFrame();
}, 400);
}
guessInput.value = "";
});

// REVEAL NEXT FRAME
skipBtn.addEventListener("click", revealNextFrame);

function revealNextFrame(){
currentFrame++;
updateFrameProgress();

if(currentFrame >= todaysshow.frames.length){
if(!gameEnded){
resultMessage.innerText = "❌ Unlucky! The show was: " + todaysshow.title;
endGame(false);
}
return;
}

frameImage.src = todaysshow.frames[currentFrame];
frameNumber.innerText = currentFrame + 1;
updateFrameProgress();
}

// END GAME
function endGame(win){
gameEnded = true;
guessBtn.disabled = true;
skipBtn.innerText = "Reveal Remaining Scenes";

localStorage.setItem(todayKey, JSON.stringify({
win: win,
frame: currentFrame + 1
}));

updateFrameProgress();
updateStreak(win);
generateShare(win);
}

// SHARE RESULTS
const shareBtn = document.getElementById("share-btn");

shareBtn.addEventListener("click", async () => {
const shareData = {
title: "Pilot",
text: "I just played today's Pilot challenge!",
url: "https://pilotgame.com"
};
try {
await navigator.share(shareData);
} catch(err) {
console.log("Share cancelled");
}
});

// WIN TRACKING
let streak = localStorage.getItem("streak") || 0;

function updateStreak(win){
if(win){
streak++;
}else{
streak = 0;
}
localStorage.setItem("streak", streak);
}

// ENTER KEY
guessInput.addEventListener("keypress", function(event){
if(event.key === "Enter"){
event.preventDefault();
guessBtn.click();
}
});

// COUNTDOWN (weekly reset)
function updateCountdown(){
  const now = new Date();

  const target = new Date();

  const targetDay = 1; // Monday (0 = Sunday, 1 = Monday)
  const currentDay = now.getDay();

  let daysUntil = targetDay - currentDay;
  if (daysUntil <= 0) daysUntil += 7;

  target.setDate(now.getDate() + daysUntil);
  target.setHours(0,0,0,0);

  const diff = target - now;

  const days = Math.floor(diff / (1000*60*60*24));
  const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
  const minutes = Math.floor((diff % (1000*60*60)) / (1000*60));
  const seconds = Math.floor((diff % (1000*60)) / 1000);

  document.getElementById("countdown").innerText =
    `Next show in ${days}d ${hours}h ${minutes}m ${seconds}s`;
}

updateCountdown();
setInterval(updateCountdown, 1000);
// AUTOFILL
const suggestionsBox = document.getElementById("suggestions");

guessInput.addEventListener("input", () => {

const value = guessInput.value.toLowerCase();
suggestionsBox.innerHTML = "";

if(value === "") return;

const matches = shows.filter(show =>
show.title.toLowerCase().includes(value)
);

matches.forEach(show => {

const div = document.createElement("div");
div.classList.add("suggestion");
div.innerText = show.title;

div.addEventListener("click", () => {
guessInput.value = show.title;
suggestionsBox.innerHTML = "";
});

suggestionsBox.appendChild(div);

});

});

// DAILY LOCK
const todayKey = "played-" + showIndex;

if(localStorage.getItem(todayKey)){
resultMessage.innerText = "You already played today's show.";
guessBtn.disabled = true;
skipBtn.disabled = true;
}
