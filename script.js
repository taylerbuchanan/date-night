// This is the web version of the date-night invitation.
// It does the same things as the Python version, just in JavaScript (the language websites use).
//
// How it works: a "state" object remembers what's on screen right now (the typed words,
// where the envelope is, which pop-up is open...). Many times a second, draw() wipes the
// canvas and redraws everything from the state. To animate something, we just change
// the state a little at a time.


// ====================================================================================
// THINGS YOU MIGHT WANT TO CHANGE
// ====================================================================================

const RECIPIENT_NAME = "Jacob";
const GREETING_SUBTITLE = "You have one very important invitation.";

// EVERY DATE INVITE. Each one becomes an icon on the computer's desktop.
//
// TO ADD A NEW DATE: copy one whole { ... }, block (from { to },), paste it at the
// BOTTOM of the list, and change the words. Give it a new "id" that's never been used
// (the date works great). The id is how his browser remembers what he's opened.
//
//   id     - a unique name for this invite (never change it after he's seen it!)
//   date   - the day of the date, as year-month-day. The day AFTER this, the invite
//            moves off the desktop and into the Memories folder.
//   label  - the words under the desktop icon (keep it short)
//   title  - the big words at the top of the letter
//   plan, bring, when - the details on the letter. "\n" starts a new line.
const INVITES = [
  {
    id: "2026-10-26",
    date: "2026-10-26",
    label: "Oct 26, 2026",
    title: `${RECIPIENT_NAME}, be my date?`,
    plan: "Top secret",
    bring: "Your cute self, and maybe some snacks",
    when: "Monday, Oct 26\n9pm your time, 2pm my time",
  },
];

// The words on the taskbar's Start button.
const START_BUTTON_TEXT = "Start";

// Your name, for the "Miss ___" option in the Start menu.
const YOUR_NAME = "Tayler";

// LOVE NOTES. Each one shows up on his desktop as "love_note" (with a NEW tag).
// Once he's opened and read it, it moves into Memories > Love notes by itself.
//
// TO WRITE A NEW ONE: copy one whole { ... }, block and paste it at the BOTTOM of the
// list. Give it a new "id" that's never been used (the date works great), a "label" for
// the Memories folder, and your note. Leave the old ones in the list so he can reread them.
// "\n" starts a new line ("\n\n" leaves a blank line). Keep each one to about 8 lines.
const LOVE_NOTES = [
  {
    id: "2026-10-25",
    label: "Oct 25, 2026",
    text: "Hi Jacob,\n\nThis little computer is all yours. Whenever it's my turn to plan a date, it'll show up right here.\n\nI love you MORE hehe\n\nlove, Tayler",
  },
];

// The pop-ups from the Start menu.
const MISS_YOU_MESSAGE = `${YOUR_NAME} misses you too. Like, a lot.`;
const SHUT_DOWN_MESSAGE = "Nice try. This computer runs on love and never shuts down.";

// Photos of you two, shown in Memories > Photos. To add one:
//   1. Put the picture in the website/images/photos folder (make the folder if it's not there).
//   2. Add a line here like:  { file: "first-date.jpg", label: "Oct 26", caption: "Our first game night!" },
const PHOTOS = [];

// The guestbook's Discord ping. When he sends a note, Discord tells you (without the note
// itself). If junk pings ever show up, delete this webhook in Discord, make a new one,
// and paste the new link here.
const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1564168396155658311/9vqWn7Luv9RE5e5ihskt4G80UugDwYi7_5JmQDXFsWj0YWkD3y4ta2vIf-O0Dk3-TN0X";

// The two clocks on the taskbar. These are official time zone names, so daylight
// saving time is handled automatically. (Arizona never changes its clocks; Scotland does.)
const YOUR_TIME_ZONE = "America/Phoenix";
const HIS_TIME_ZONE = "Europe/London";

// The "Open when..." letters. Each one is { when: "...", text: "..." }.
// "when" finishes the sentence "Open when ___". "\n" starts a new line in the letter.
// Add, remove, or rewrite them however you like!
const OPEN_WHEN = [
  {
    when: "you miss me",
    text: "hi my sweet boy :3\n\ni miss you too, probably more than you know. i wish i could just teleport to you rn and give you the biggest hug ever. it's so unfair that my favorite person lives a whole ocean away from me :(\n\nbut even though we're so far apart, you're still such a big part of my everyday life. you're the person i wanna tell all my random little thoughts to, the person i wanna laugh with, and the person i look forward to spending time with every day.\n\none day we won't have to say goodnight through a screen. i'll get to fall asleep next to you instead of in a discord call, and i genuinely cannot wait for that day.\n\nuntil then, just pretend i'm giving you a million kisses rn.\n\nmwah mwah mwah mwah mwah\n\ni love you so much ml. <3",
  },
  {
    when: "you can't sleep",
    text: "hi sleepyhead :3\n\nWHY ARE YOU AWAKE HMMMM???\n\nlet me guess. you've been coding for 900 hours arguing with claude trying to make something perfect LOL.\n\nwell, whatever the reason, i hope you can get some rest soon, baby.\n\ni wish i could cuddle up next to you until you fall asleep (and annoy you by stealing all the blankets hehe).\n\nyou don't have to figure everything out tonight. whatever you're working on will still be there tomorrow. i promise it's okay to give that big brain of yours a break sometimes.\n\nnow close those eyes and get some sleep, my love.\n\nmwah. sweet dreams ml",
  },
  {
    when: "you're feeling sad",
    text: "hi baby :(\n\ni wish i could be there to hold you right now. i hate thinking about my sweet boy being sad, especially when i'm too far away to give him a hug.\n\ni hope you know that you never have to pretend to be happy around me. you don't have to be funny or energetic or entertaining all the time. if you wanna talk, i'll listen. if you wanna cry, that's okay too. and if you just wanna sit in silence together, i'll happily do that.\n\ni love you on your good days and your bad days. even when you're quiet, grumpy, tired, or just not feeling like yourself.\n\nyou make my life so much happier just by being in it, and i hope i can do the same for you.\n\nyou're my favorite boy in the whole wide world. don't forget that, okay?\n\ni love you, sweet boy. 💗",
  },
  {
    when: "you're overwhelmed",
    text: "hi my love.\n\nfirst of all, i wish i could give you the biggest hug right now.\n\ni know your brain is always going a million miles an hour and you've always got some new idea or project you wanna work on. and while i absolutely love how passionate you are, i hope you remember that you don't have to do everything all at once.\n\nyou're allowed to take breaks. you're allowed to have days where you don't accomplish anything. and you're allowed to just exist without feeling like you need to be productive.\n\ni'm so proud of you, baby. not because of how much you accomplish, but because of the person you are.\n\nyou don't have to prove anything to me.\n\ni love you just as much when you're doing absolutely nothing as i do when you're making something amazing.\n\nplease be gentle with yourself, okay?\n\nyour wife loves you so so much.",
  },
  {
    when: "you need my love",
    text: "JACOBBBBB!!!\n\nHELLO???? DO YOU KNOW HOW MUCH I LOVE YOU????\n\nprobably not because i don't think there's actually a way for me to explain it properly 😭\n\ni love your silly little hehe's. i love your voice. i love how excited you get about the things you're passionate about. i love how smart and creative you are, even when i have absolutely no idea what you're talking about LMAO.\n\ni love that you randomly show me things you're making. i love when you call me your wife. i love when you do that silly little \"NO I LOVE U MORE\" thing even though you're WRONG because i obviously love you more.\n\nand i love the little things you probably don't even realize mean so much to me.\n\ni love YOU, jacob. not just the attention you give me or the things we do together. you.\n\nand i'd choose you a million times over.\n\nso HA. I LOVE YOU THE MOST. 💗",
  },
  {
    when: "you want a kiss",
    text: "MWAHHHHHHHH",
  },
  {
    when: "we've had an argument",
    text: "hi baby.\n\nif you're reading this, i'm guessing things might feel a little difficult between us right now.\n\ni just want you to remember something.\n\neven when we disagree, even when we misunderstand each other, and even when one of us is upset, i still love you.\n\nwe're two different people learning how to love each other, and we're not always going to get everything right.\n\ni know sometimes i struggle to explain my feelings, and sometimes we don't understand each other right away.\n\nyou mean so much to me, jacob.\n\ni don't expect us to be perfect. i just want us to keep listening to each other, being patient, and trying to understand where the other person is coming from.\n\nwe're on the same team, okay?\n\ni love you, even when things aren't easy.\n\nand you're still my favorite boy ever.\n\nMWAH i love you.",
  },
  {
    when: "you need a laugh",
    text: "67",
  },
  {
    when: "you think of our future",
    text: "hi future husband hehe :3\n\nsometimes i think about what it'll be like when we finally get to meet.\n\nlike actually seeing you standing in front of me instead of on a screen. hearing your voice without headphones. getting to hold your hand. hugging you for the first time.\n\nI'M GONNA BE SO NERVOUS LMAOOO.\n\nbut i'm also so excited.\n\ni think about all the little things we could do together. going on silly dates, playing games in the same room, watching anime while cuddling, or just doing absolutely nothing together.\n\neven boring everyday things sound exciting when i imagine doing them with you.\n\ni know we have a lot of distance between us right now, and i know the future isn't something we can plan perfectly.\n\nbut i really hope we get to experience all those little moments together someday.\n\nand when we finally do meet, i'm giving you the biggest hug of your entire life.\n\ni love you so much.",
  },
  {
    when: "we're about to meet",
    // LOCKED until the day you visit. Right now (null) it stays locked.
    // Once you know the date, change null to the date in quotes, like: unlocks: "2027-06-14",
    // On that day (his time), it unlocks by itself. Until then, it counts down.
    unlocks: null,
    text: "hi my sweet boy :3\n\nOH MY GOD. ITS ACTUALLY HAPPENING???? 😭\n\nif you're reading this, that means we're finally about to meet and i genuinely cannot believe it. after all the discord calls, falling asleep together, playing games, watching shows, and saying \"i wish you were here\" a million times, we're finally gonna be in the same place.\n\ni wonder if you're nervous right now hehe. because i can almost guarantee i'm freaking out LMAOOO.\n\nbut baby, if you are nervous, please don't be. i already love you so much. you don't have to worry about impressing me or knowing exactly what to say or do. you don't have to be anything other than yourself. that's the boy i fell in love with, remember?\n\ni don't care if we're awkward at first, if we don't know what to say, or if we just stand there giggling like idiots. honestly, that would be pretty cute 😭\n\ni keep thinking about what it's gonna feel like to finally hug you. to hear your voice without my headphones. to look into your eyes instead of at a screen. to actually hold your hand.\n\nand maybeeee finally get to kiss that handsome face i've been obsessing over hehe.\n\ni hope you know how special this moment is to me. out of all the people in the world, somehow i found you, a silly and sweet scottish boy who makes me smile every single day. and now i finally get to see you in person.\n\nso take a deep breath, ml. there's nothing to be scared of.\n\nit's just me. the same girl who's been calling you ml and sending you a million mwahs through a screen.\n\nexcept this time, the kisses are real. :3\n\nnow hurry up and come give your wife a hug.\n\ni love you so so much, jacob.\n\nsee you in a minute. HEHEHEHE",
  },
];

// The secret folder. He types the password to open it (capital letters don't matter).
const SECRET_PASSWORD = "mwahhh";
const SECRET_HINT = "Hint: what this computer is called";

// The coupons inside the secret folder. He clicks one to use it, and it gets stamped USED.
const COUPONS = [
  "Good for one movie of YOUR choice",
  "Good for winning one argument",
  "Good for one surprise voice call",
  "Good for one cute selfie, on demand",
  "Good for picking our next date",
  "Good for one big hug (in person!)",
];

// How many hearts he can drop in "Catch the hearts" before it's game over.
const CATCH_LIVES = 3;

// How many miles apart you are, for the "Run to you" game. Change it to your real distance!
const RUN_MILES = 5000;

// The jokes in the ERROR pop-up, one for each time he clicks Decline.
// After the last one, Decline turns into Accept.
const DECLINE_MESSAGES = [
  "Whoops! Looks like you misclicked.",
  "Hmm. That button seems to be broken.",
  "Are you sure? Think of your beautiful wife...",
  "Error 404: 'Decline' not found.",
];

const SUGGEST_TEXT = "Suggest a new time";
const SUGGEST_MESSAGE = "Message me on Discord to suggest a new time!";

const CELEBRATION_TITLE = "YIPPIE";
const CELEBRATION_SUBTITLE = "It's a date!";

// How loud things are. 1 = full volume.
// MASTER_VOLUME turns EVERY sound up or down together (0.5 = half as loud).
const MASTER_VOLUME = 0.6;
const CHIME_VOLUME = 0.5;      // the Accept "It's a date!" melody
const BUZZER_VOLUME = 0.12;
const FAST_TYPING_VOLUME = 0.35;


// ====================================================================================
// COLORS, FONTS, AND SIZES
// ====================================================================================

const COLORS = {
  screen: "#BBE1FD",          // the computer screen's blue
  text: "#45284A",            // dark plum, for words and outlines
  titleBar: "#F8BFCB",        // the pink "INCOMING MESSAGE" bar
  sparkle: "#FFFFFF",
  sparkleDim: "#D6ECFE",
  envelopePaper: "#FFF4EA",
  envelopeLine: "#E89AAE",
  heart: "#F07A9C",
  envelopeShadow: "#A6D3F7",
  letterPaper: "#FFFBF5",
  letterShade: "#D9C6B8",     // the paper's color while a flap is tilted (in shadow)
  acceptFill: "#C98298",
  acceptText: "#FFFFFF",
  cream: "#FFF7EE",           // Decline button and pop-up
  wallpaperHeart: "#A9D6FB",  // the faint hearts on the desktop wallpaper
  iconHover: "#D6ECFE",       // the highlight behind a desktop icon when the mouse is on it
  newTag: "#F07A9C",
  check: "#4CAF6A",           // the green "accepted" checkmark
  folder: "#FFD98A",          // the folder icons
  white: "#FFFFFF",
  lostLife: "#C9C2CF",        // a grayed-out heart, for a lost life
};

// Little icons for the power menu.
const POWER_ICON = [
  "...X...",
  ".X.X.X.",
  "X..X..X",
  "X.....X",
  "X.....X",
  ".X...X.",
  "..XXX..",
];
const MOON_ICON = [
  "..XXX..",
  ".XX....",
  "XX.....",
  "XX.....",
  "XX....X",
  ".XX.XX.",
  "..XXX..",
];

// A little pixel checkmark, for invites he's accepted.
const CHECK = [
  ".....X",
  "....XX",
  "X..XX.",
  "XXXX..",
  ".XX...",
];

const CONFETTI_COLORS = ["#F07A9C", "#F8BFCB", "#7FB8F0", "#FFE08A", "#C9B6F2", "#FFFFFF"];

// "bold 43px" = bold, 43 pixels tall.
const FONTS = {
  title: "bold 43px 'Pixelify Sans'",
  body: "19px 'Pixelify Sans'",
  small: "bold 13px 'Pixelify Sans'",
  button: "bold 19px 'Pixelify Sans'",
  letterTitle: "bold 32px 'Pixelify Sans'",
  letter: "17px 'Pixelify Sans'",
  suggest: "13px 'Pixelify Sans'",
  celebrationSubtitle: "27px 'Pixelify Sans'",
  iconLabel: "bold 11px 'Pixelify Sans'",
  tag: "bold 10px 'Pixelify Sans'",
  menu: "bold 14px 'Pixelify Sans'",
  note: "15px 'Pixelify Sans'",
};

// The drawing is 768 x 512 (half the size of the background picture).
const WIDTH = 768;
const HEIGHT = 512;
const CENTER_X = 384;   // the middle of the computer screen, left to right

// Where the fully unfolded letter goes.
const LETTER = { left: 174, top: 108, right: 594, bottom: 356 };
const THIRD = (LETTER.bottom - LETTER.top) / 3;
const TOP_FOLD = LETTER.top + THIRD;
const BOTTOM_FOLD = LETTER.top + THIRD * 2;

// The envelope's middle, and its edges.
const ENVELOPE = { left: 348, right: 420, top: 253, bottom: 303, centerX: 384 };

// Pixel-art pictures: every "X" is one colored square.
const HEART = [
  ".XX.XX.",
  "XXXXXXX",
  "XXXXXXX",
  ".XXXXX.",
  "..XXX..",
  "...X...",
];
const SPARKLE = [
  "...X...",
  "...X...",
  "..XXX..",
  "XXXXXXX",
  "..XXX..",
  "...X...",
  "...X...",
];

// Sparkles on the computer screen: [x, y, pixel size].
const SPARKLE_SPOTS = [
  [165, 115, 3], [194, 108, 2], [582, 115, 3], [558, 108, 2],
  [165, 312, 3], [195, 340, 2], [596, 285, 2],
];

// Hearts on the "YIPPIE" screen: [x, y, pixel size].
const CELEBRATION_HEARTS = [
  [180, 120, 3], [560, 125, 3], [205, 300, 2], [545, 295, 2], [250, 330, 2], [500, 330, 3],
];


// ====================================================================================
// SETTING UP THE CANVAS
// ====================================================================================

const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");

// The canvas is really 1536 x 1024 so it looks crisp on sharp screens,
// but we draw as if it were 768 x 512. scale(2, 2) doubles everything we draw.
ctx.scale(2, 2);

const background = new Image();
background.src = "images/background.png";

// The desktop wallpaper. If images/wallpaper.png exists, it fills the desktop.
// If it doesn't, the desktop shows faint pixel hearts instead.
const wallpaper = new Image();
let hasWallpaper = false;
wallpaper.onload = () => { hasWallpaper = true; };
wallpaper.src = "images/wallpaper.png";

// The edges of the computer's blue screen (the wallpaper is trimmed to fit inside).
// (This goes all the way to the cream frame, covering the picture's dark gray edge.)
const SCREEN = { left: 137, top: 50, right: 631, bottom: 373, corner: 3 };

// The taskbar along the very bottom of the screen.
const TASKBAR = { left: 137, top: 349, right: 631, bottom: 373 };

// The picture doesn't fill wide (or tall) screens, so the page behind it is painted to
// match: wall on top, then the desk's dark edge line, then desk below. These are where
// those things are in the picture, as a fraction of its height (0 = top, 1 = bottom).
const DESK_EDGE_TOP = 802 / 1024;
const DESK_TOP = 806 / 1024;

function extendDesk() {
  const box = canvas.getBoundingClientRect();
  const top = box.top;
  const edge = box.top + box.height * DESK_EDGE_TOP;
  const desk = box.top + box.height * DESK_TOP;
  document.body.style.background = `linear-gradient(to bottom,
    #CBBED8 0px, #CABDD6 ${top}px, #C0B5CE ${edge}px,
    #A59A9C ${edge}px, #A59A9C ${desk}px,
    #F5E5CE ${desk}px, #FCEDD5 100%)`;
}

// Repaint it whenever the window changes size.
window.addEventListener("resize", extendDesk);
extendDesk();


// ====================================================================================
// WHAT'S ON SCREEN RIGHT NOW
// ====================================================================================

const state = {
  mode: "start",          // "start" (MWAHHH button), "desktop" (the icons), or "invite" (playing one)
  invite: null,           // which invite is playing (one from the INVITES list)
  startMenu: false,       // is the Start menu open?
  window: null,           // which window is open on the desktop: "notes", "memories", "game", or null
  game: null,             // the "Catch the hearts" game, while its window is open
  openWhen: null,         // which "Open when..." letter is open (or null for the list)
  letterPage: 0,          // which page of that letter he's on (for long letters)
  letterListScroll: 0,    // how far the "Open when..." list is scrolled down
  noteId: null,           // which love note is open in the Notepad window
  memoriesFolder: null,   // which folder is open inside Memories: "invites", "notes", "photos", or null
  memoryItem: null,       // which old note or photo is open inside that folder (or null)
  password: "",           // what he's typed into the secret folder's password box
  passwordWrong: false,   // did he just type the wrong password?
  cat: null,              // the desktop cat
  title: "",              // the big typed words
  subtitle: "",           // the smaller typed words under them
  sparkleDim: SPARKLE_SPOTS.map(() => false),   // which sparkles are blinking
  envelope: null,         // the envelope, once it shows up
  paper: null,            // the letter's paper: { left, top, right, bottom }
  flaps: null,            // the letter's flaps while unfolding: { top, bottom } from 0 to 1
  letter: null,           // the writing on the letter: { alpha } (0 = invisible, 1 = solid)
  declines: 0,            // how many times he's clicked Decline
  popup: null,            // the pop-up window, if one is open
  celebration: null,      // the YIPPIE screen: { alpha }
  confetti: [],           // pieces of confetti flying around
  mouse: { x: -1, y: -1 },
};

// Every frame, clickable things add a "hit box" here, so we know what the mouse is over.
let hitBoxes = [];

// His browser remembers which invites he's opened and accepted ("localStorage").
// try/catch: if the browser blocks it (like some private windows), just carry on.
function remember(key) {
  try { localStorage.setItem(key, "yes"); } catch (problem) {}
}
function remembers(key) {
  try { return localStorage.getItem(key) === "yes"; } catch (problem) { return false; }
}


// ====================================================================================
// SOUNDS
// ====================================================================================

// The Web Audio API plays sounds instantly and can play many at once.
const audio = new (window.AudioContext || window.webkitAudioContext)();
const sounds = {};

// Load every sound file into memory ahead of time.
["key1", "key2", "key3", "key4", "click", "paper", "incoming", "chime", "buzzer",
 "jump", "coin", "crash", "flap", "flip", "gameover", "win", "meow"].forEach(name => {
  fetch(`sounds/${name}.wav`)
    .then(response => response.arrayBuffer())
    .then(data => audio.decodeAudioData(data))
    .then(sound => { sounds[name] = sound; })
    .catch(() => {});   // a missing sound just stays quiet
});

// Plays a sound by name. volume: 1 = normal, 0.5 = half as loud.
function playSound(name, volume = 1) {
  if (!sounds[name]) return;
  const player = audio.createBufferSource();
  player.buffer = sounds[name];
  const loudness = audio.createGain();
  loudness.gain.value = volume * MASTER_VOLUME;
  player.connect(loudness).connect(audio.destination);
  player.start();
}

// Plays one of the 4 keyboard sounds at random, so typing sounds natural.
function playKeySound(volume) {
  playSound(`key${1 + Math.floor(Math.random() * 4)}`, volume);
}


// ====================================================================================
// TIMING HELPERS
// ====================================================================================

// Every time an invite opens or closes, this number goes up by 1.
// Waits and animations remember the number from when they started. If it has changed
// (he closed the invite), they quietly stop, so an old invite can't keep playing.
let currentRun = 0;

// Waits this many milliseconds. Use it like: await wait(500);
function wait(ms) {
  const run = currentRun;
  return new Promise(resolve => setTimeout(() => {
    if (run === currentRun) resolve();
  }, ms));
}

// Animates over this many milliseconds. onStep gets a number from 0 to 1
// (0 = start, 1 = finished) that starts fast and slows down gently at the end.
function animate(ms, onStep) {
  const run = currentRun;
  return new Promise(resolve => {
    const start = performance.now();
    function frame(now) {
      if (run !== currentRun) return;
      const progress = Math.min(1, (now - start) / ms);
      onStep(1 - (1 - progress) ** 2);
      if (progress < 1) requestAnimationFrame(frame);
      else resolve();
    }
    requestAnimationFrame(frame);
  });
}

// Mixes two numbers. amount 0 = all start, 1 = all end.
function between(start, end, amount) {
  return start + (end - start) * amount;
}

// Mixes two colors, like "#FFFFFF" and "#000000". amount 0 = all start, 1 = all end.
function blend(startColor, endColor, amount) {
  const a = parseInt(startColor.slice(1), 16);
  const b = parseInt(endColor.slice(1), 16);
  const mix = shift => Math.round(between((a >> shift) & 255, (b >> shift) & 255, amount));
  return `rgb(${mix(16)}, ${mix(8)}, ${mix(0)})`;
}


// ====================================================================================
// DRAWING HELPERS
// ====================================================================================

// Draws a pixel-art picture (like HEART) with its top-left corner at (x, y).
function drawPixels(pattern, x, y, size, color) {
  ctx.fillStyle = color;
  pattern.forEach((row, rowNumber) => {
    [...row].forEach((letter, columnNumber) => {
      if (letter === "X") ctx.fillRect(x + columnNumber * size, y + rowNumber * size, size, size);
    });
  });
}

// Writes words. align: "center" or "left". baseline: "middle" (y is the middle) or "top".
function write(text, x, y, font, color, align = "center", baseline = "middle") {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  ctx.fillText(text, x, y);
}

// Splits words into lines that fit within maxWidth pixels.
function wrapWords(text, font, maxWidth) {
  ctx.font = font;
  const lines = [];
  text.split("\n").forEach(part => {
    let current = "";
    part.split(" ").forEach(word => {
      const attempt = current ? current + " " + word : word;
      if (ctx.measureText(attempt).width <= maxWidth || !current) current = attempt;
      else { lines.push(current); current = word; }
    });
    lines.push(current);
  });
  return lines;
}

// A box with stepped, pixel-style corners.
function steppedBox(left, top, right, bottom, step, fill, outline, lineWidth) {
  ctx.beginPath();
  const points = [
    [left + step, top], [right - step, top], [right - step, top + step], [right, top + step],
    [right, bottom - step], [right - step, bottom - step], [right - step, bottom],
    [left + step, bottom], [left + step, bottom - step], [left, bottom - step],
    [left, top + step], [left + step, top + step],
  ];
  points.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = outline;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

// Draws a pixel button and makes it clickable.
function drawButton(centerX, centerY, width, height, text, fill, textColor, onClick, inPopup = false) {
  const left = centerX - width / 2, right = centerX + width / 2;
  const top = centerY - height / 2, bottom = centerY + height / 2;
  steppedBox(left, top, right, bottom, 4, fill, COLORS.text, 2);
  write(text, centerX, centerY + 1, FONTS.button, textColor);
  hitBoxes.push({ left, top, right, bottom, onClick, inPopup });
}


// ====================================================================================
// DRAWING EACH PART
// ====================================================================================

// The pink "INCOMING MESSAGE" bar across the top of the computer screen.
function drawTitleBar() {
  ctx.fillStyle = COLORS.titleBar;
  ctx.fillRect(170, 79, 430, 22);
  ctx.strokeStyle = COLORS.text;
  ctx.lineWidth = 2;
  ctx.strokeRect(170, 79, 430, 22);
  write("INCOMING MESSAGE", 180, 90, FONTS.small, COLORS.text, "left");

  // Three little boxes: minimize, maximize, close.
  [544, 562, 580].forEach(left => ctx.strokeRect(left, 83, 14, 14));
  ctx.beginPath();
  ctx.moveTo(547, 93); ctx.lineTo(555, 93);                         // minimize
  ctx.moveTo(584, 87); ctx.lineTo(591, 94);                         // close X
  ctx.moveTo(591, 87); ctx.lineTo(584, 94);
  ctx.stroke();
  ctx.strokeRect(566, 87, 6, 6);                                    // maximize

  // While an invite is playing, the X closes it and goes back to the desktop.
  if (state.mode === "invite") {
    hitBoxes.push({ left: 576, top: 79, right: 600, bottom: 101, onClick: closeInvite });
  }
}

// For previewing: add ?today=2026-10-27 to the end of the link to pretend it's a
// different day. Without it, it uses the real date.
const PREVIEW = new URLSearchParams(location.search);

// Today's date as year-month-day, like "2026-10-25", on HIS computer.
function todayString() {
  if (PREVIEW.has("today")) return PREVIEW.get("today");
  const now = new Date();
  const twoDigits = number => String(number).padStart(2, "0");
  return `${now.getFullYear()}-${twoDigits(now.getMonth() + 1)}-${twoDigits(now.getDate())}`;
}

// Has this invite's date already passed? (Dates written as year-month-day sort in order.)
function isPast(invite) {
  return invite.date < todayString();
}

// Is the mouse inside this box?
function mouseIsIn(box) {
  const { x, y } = state.mouse;
  return x >= box.left && x <= box.right && y >= box.top && y <= box.bottom;
}

// The desktop: wallpaper, icons, any open window, the taskbar, and the Start menu.
function drawDesktop(time) {
  drawWallpaper();

  // Every icon on the desktop: upcoming invites first, then the extras.
  const icons = [
    ...INVITES.filter(invite => !isPast(invite)).map(inviteIcon),
    // Love notes he hasn't read yet (the one he's reading right now stays until he closes it).
    ...LOVE_NOTES.filter(note => !noteIsRead(note) || state.noteId === note.id).map(note => ({
      label: "love_note", picture: drawNoteIcon, onClick: () => openNote(note), tag: "new",
    })),
    { label: "Open when...", picture: drawOpenWhenIcon, onClick: () => openWindow("openwhen") },
    { label: "Memories", picture: drawFolderIcon, onClick: () => openWindow("memories") },
    { label: "Arcade", picture: drawArcadeIcon, onClick: () => openWindow("games") },
    // The secret folder (coupon book) is hidden for now. To bring it back, remove the // below.
    // { label: "Secret", picture: drawSecretIcon, onClick: () => openWindow("secret") },
    { label: "Notepad", picture: drawGuestbookIcon, onClick: () => openWindow("guestbook") },
    // Only on YOUR side: the inbox where his notes show up.
    ...(IS_TAYLER ? [{ label: "Inbox", picture: drawInboxIcon, onClick: () => openWindow("inbox"),
                       tag: unreadMessages().length ? "new" : null }] : []),
  ];
  // They go down the left side in columns of 4, like a real desktop.
  // (The 5th icon starts a new column.)
  icons.forEach((icon, number) => {
    drawIcon(icon, 182 + Math.floor(number / 4) * 82, 80 + (number % 4) * 70);
  });

  drawCat(time);

  if (state.window) drawWindow(time);
  drawTaskbar();
  if (state.startMenu) drawStartMenu();
}

// Turns an invite into a desktop icon.
function inviteIcon(invite) {
  let tag = null;
  if (!remembers(`opened:${invite.id}`)) tag = "new";
  else if (remembers(`accepted:${invite.id}`)) tag = "check";
  return { label: invite.label, picture: drawEnvelopeIcon, onClick: () => openInvite(invite), tag };
}

// The wallpaper picture, trimmed to the screen's rounded corners
// (or faint pixel hearts, if there's no wallpaper picture).
function drawWallpaper() {
  if (hasWallpaper) {
    // Fill the screen with the picture, trimmed to the screen's rounded corners.
    // save() and restore() make the trimming only apply to the wallpaper.
    const width = SCREEN.right - SCREEN.left, height = SCREEN.bottom - SCREEN.top;
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(SCREEN.left, SCREEN.top, width, height, SCREEN.corner);
    ctx.clip();
    // "Cover": grow the picture until it fills the screen, then center it (edges may be cut a little).
    const scale = Math.max(width / wallpaper.width, height / wallpaper.height);
    const drawWidth = wallpaper.width * scale, drawHeight = wallpaper.height * scale;
    ctx.drawImage(wallpaper, SCREEN.left + (width - drawWidth) / 2, SCREEN.top + (height - drawHeight) / 2,
                  drawWidth, drawHeight);
    ctx.restore();
  } else {
    // Faint pixel hearts in a checkerboard pattern. Every other row is shifted over.
    for (let row = 0; row < 6; row++) {
      for (let column = 0; column < 8; column++) {
        const x = 172 + column * 56 + (row % 2) * 28;
        const y = 78 + row * 44;
        if (x < 600) drawPixels(HEART, x, y, 2, COLORS.wallpaperHeart);
      }
    }
  }
}

// One desktop icon: a little picture with a label under it.
//   icon - { label, picture (a function that draws it), onClick, tag ("new", "check", or null) }
//   x, y - the middle of the picture
function drawIcon(icon, x, y) {
  // The clickable area around the picture and its label.
  // id: a name for this spot, so we can tell if it's the thing the mouse is on.
  const id = `icon:${x},${y}`;
  const box = { left: x - 36, top: y - 26, right: x + 36, bottom: y + 42, onClick: icon.onClick, id };
  hitBoxes.push(box);

  // A soft highlight while the mouse is on it (and nothing like the Start menu is on top).
  // globalAlpha 0.55 makes it a bit see-through, so the wallpaper shows behind it.
  if (state.hoverId === id) {
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = COLORS.iconHover;
    ctx.fillRect(box.left, box.top, box.right - box.left, box.bottom - box.top);
    ctx.globalAlpha = 1;
  }

  icon.picture(x, y);

  // The label under it, on a little cream tag so it's easy to read on any wallpaper.
  // Every label uses the same small text, so they all match.
  const labelFont = FONTS.iconLabel;
  ctx.font = labelFont;
  const labelWidth = ctx.measureText(icon.label).width + 10;
  steppedBox(x - labelWidth / 2, y + 21, x + labelWidth / 2, y + 39, 2, COLORS.cream, COLORS.text, 1.5);
  write(icon.label, x, y + 30.5, labelFont, COLORS.text);

  // A pink NEW tag, or a green check.
  if (icon.tag === "new") {
    steppedBox(x + 8, y - 24, x + 44, y - 10, 2, COLORS.newTag, COLORS.text, 1.5);
    write("NEW", x + 26, y - 16.5, FONTS.tag, COLORS.white);
  } else if (icon.tag === "check") {
    drawPixels(CHECK, x + 16, y - 24, 3, COLORS.check);
  }
}

// The icon pictures. Each one is drawn with its middle at (x, y).

function drawEnvelopeIcon(x, y) {
  ctx.fillStyle = COLORS.envelopePaper;
  ctx.fillRect(x - 20, y - 14, 40, 28);
  ctx.strokeStyle = COLORS.text;
  ctx.lineWidth = 2;
  ctx.strokeRect(x - 20, y - 14, 40, 28);
  ctx.strokeStyle = COLORS.envelopeLine;
  ctx.beginPath();
  ctx.moveTo(x - 18, y - 12); ctx.lineTo(x, y + 2); ctx.lineTo(x + 18, y - 12);
  ctx.stroke();
  drawPixels(HEART, x - 7, y - 4, 2, COLORS.heart);
}

// A sheet of paper with a heart and some lines, like a note.
function drawNoteIcon(x, y) {
  ctx.fillStyle = COLORS.white;
  ctx.fillRect(x - 14, y - 17, 28, 34);
  ctx.strokeStyle = COLORS.text;
  ctx.lineWidth = 2;
  ctx.strokeRect(x - 14, y - 17, 28, 34);
  drawPixels(HEART, x - 7, y - 13, 2, COLORS.heart);
  ctx.fillStyle = COLORS.envelopeLine;
  [3, 8, 13].forEach(lineY => ctx.fillRect(x - 9, y + lineY, 18, 2));
}

// A little stack of envelopes, for "Open when...".
function drawOpenWhenIcon(x, y) {
  drawSmallEnvelope(x - 4, y - 6, false);
  drawSmallEnvelope(x + 4, y + 4, false);
}

// A yellow folder with a padlock, for the secret folder.
function drawSecretIcon(x, y) {
  drawEmptyFolder(x, y);
  drawPixels(LOCK, x - 5, y - 5, 2, COLORS.text);
}

// A yellow folder with a little heart.
function drawFolderIcon(x, y) {
  drawEmptyFolder(x, y);
  drawPixels(HEART, x - 7, y - 4, 2, COLORS.heart);
}

// A little pink arcade machine, with a heart on its screen, for the Arcade.
const ARCADE = [
  ".XXXXXXXXXXXX.",
  "XPPPPPPPPPPPPX",
  "XPXXXXXXXXXXPX",
  "XPXSSSSSSSSXPX",
  "XPXSSHHSHHSXPX",
  "XPXSSHHHHHSXPX",
  "XPXSSSHHHSSXPX",
  "XPXSSSSHSSSXPX",
  "XPXXXXXXXXXXPX",
  "XPPPPPPPPPPPPX",
  "XXXXXXXXXXXXXX",
  "XCCJCCCCBCBCCX",
  "XCCXCCCCCCCCCX",
  "XXXXXXXXXXXXXX",
  ".XPPPPPPPPPPX.",
  ".XPPPPPPPPPPX.",
  ".XPPPPPPPPPPX.",
  ".XXXXXXXXXXXX.",
];
const ARCADE_COLORS = {
  X: "#45284A", P: "#F8A5BE", S: "#BBE1FD", H: "#F07A9C", C: "#FFF7EE", J: "#E05A6B", B: "#7FB8F0",
};

function drawArcadeIcon(x, y) {
  drawSprite(ARCADE, ARCADE_COLORS, x - 14, y - 20, 2);
}

function drawEmptyFolder(x, y) {
  ctx.fillStyle = COLORS.folder;
  ctx.strokeStyle = COLORS.text;
  ctx.lineWidth = 2;
  ctx.fillRect(x - 20, y - 17, 16, 6);       // the tab on top
  ctx.strokeRect(x - 20, y - 17, 16, 6);
  ctx.fillRect(x - 20, y - 12, 40, 28);      // the folder itself
  ctx.strokeRect(x - 20, y - 12, 40, 28);
}

// A big pink heart (with a darker shadow), for "Catch the hearts".
function drawGameIcon(x, y) {
  drawPixels(HEART, x - 12, y - 10, 4, COLORS.text);
  drawPixels(HEART, x - 14, y - 12, 4, COLORS.heart);
}

// Him, mid-run, for "Run to you".
function drawRunIcon(x, y) {
  drawPerson("jacob", LEGS_STEP_1, x - 12, y - 20, 2);
}

// The little plane, for "Fly together".
function drawPlaneIcon(x, y) {
  drawSprite(PLANE, PLANE_COLORS, x - 18, y - 12, 2);
}

// Two cards, for "Memory match".
function drawCardsIcon(x, y) {
  steppedBox(x - 18, y - 15, x + 2, y + 11, 2, COLORS.acceptFill, COLORS.text, 2);
  steppedBox(x - 4, y - 11, x + 18, y + 15, 2, COLORS.cream, COLORS.text, 2);
  drawPixels(HEART, x, y - 3, 2, COLORS.heart);
}

// The pink bar along the bottom, with a Start button and a clock.
function drawTaskbar() {
  const { left, top, right, bottom } = TASKBAR;
  const middle = (top + bottom) / 2;
  ctx.fillStyle = COLORS.titleBar;
  ctx.fillRect(left, top, right - left, bottom - top);
  ctx.fillStyle = COLORS.text;
  ctx.fillRect(left, top, right - left, 2);    // a dark line along the top edge

  // The Start button, with a little heart. It looks pressed in while the menu is open.
  const button = { left: left + 5, top: top + 4, right: left + 79, bottom: bottom - 3 };
  steppedBox(button.left, button.top, button.right, button.bottom, 2,
             state.startMenu ? COLORS.iconHover : COLORS.cream, COLORS.text, 1.5);
  drawPixels(HEART, button.left + 6, middle - 5, 2, COLORS.heart);
  write(START_BUTTON_TEXT, button.left + 22, middle + 1, FONTS.small, COLORS.text, "left");
  // keepsMenu: clicking the Start button shouldn't close the menu (it opens/closes it itself).
  hitBoxes.push({ ...button, onClick: toggleStartMenu, keepsMenu: true });

  // Two clocks: your time and his time, with a little heart in between.
  const clock = timeZone => new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone });
  const hisClock = `${RECIPIENT_NAME} ${clock(HIS_TIME_ZONE)}`;
  const yourClock = `${YOUR_NAME} ${clock(YOUR_TIME_ZONE)}`;
  write(hisClock, right - 10, middle + 1, FONTS.small, COLORS.text, "right");
  ctx.font = FONTS.small;
  const heartX = right - 10 - ctx.measureText(hisClock).width - 20;
  drawPixels(HEART, heartX, middle - 5, 2, COLORS.heart);
  write(yourClock, heartX - 6, middle + 1, FONTS.small, COLORS.text, "right");
}

// The choices in the Start menu.
const START_MENU = [
  { text: "Love notes", onClick: openLoveNotes },
  { text: "Memories", onClick: () => openWindow("memories") },
  { text: "Arcade", onClick: () => openWindow("games") },
  { text: `Miss ${YOUR_NAME}`, onClick: () => showPopup("MESSAGE", MISS_YOU_MESSAGE) },
];

// The little menu that pops up from the power button, like a real Windows computer.
const POWER_MENU = [
  { text: "Sleep", picture: MOON_ICON, onClick: goToSleep },
  { text: "Shut down", picture: POWER_ICON, onClick: () => showPopup("SHUT DOWN", SHUT_DOWN_MESSAGE) },
];

// The Start menu, popping up above the Start button, with a power button along the bottom.
function drawStartMenu() {
  const left = TASKBAR.left + 3, width = 160, itemHeight = 24, powerRow = 28;
  const bottom = TASKBAR.top, top = bottom - START_MENU.length * itemHeight - 8 - powerRow;

  ctx.fillStyle = COLORS.text;                              // shadow
  ctx.fillRect(left + 4, top + 4, width, bottom - top);
  ctx.fillStyle = COLORS.cream;                             // the menu
  ctx.fillRect(left, top, width, bottom - top);
  ctx.fillStyle = COLORS.titleBar;                          // a pink stripe down the left side
  ctx.fillRect(left, top, 20, bottom - top);
  drawPixels(HEART, left + 3, bottom - 18, 2, COLORS.heart);
  ctx.strokeStyle = COLORS.text;
  ctx.lineWidth = 2;
  ctx.strokeRect(left, top, width, bottom - top);

  START_MENU.forEach((item, number) => {
    const itemTop = top + 4 + number * itemHeight;
    const box = { left: left + 20, top: itemTop, right: left + width, bottom: itemTop + itemHeight,
                  onClick: item.onClick, id: `menu:${number}` };
    hitBoxes.push(box);
    if (state.hoverId === box.id) {
      ctx.fillStyle = COLORS.titleBar;
      ctx.fillRect(box.left + 2, box.top, width - 24, itemHeight);
    }
    write(item.text, left + 30, itemTop + itemHeight / 2 + 1, FONTS.menu, COLORS.text, "left");
  });

  // A thin line, then the power button in the bottom-right corner.
  const lineY = bottom - powerRow;
  ctx.fillStyle = COLORS.text;
  ctx.fillRect(left + 26, lineY, width - 32, 1);
  const power = { left: left + width - 30, top: lineY + 3, right: left + width - 6, bottom: bottom - 3,
                  onClick: togglePowerMenu, keepsMenu: true, id: "power" };
  hitBoxes.push(power);
  if (state.hoverId === "power" || state.powerMenu) {
    ctx.fillStyle = COLORS.titleBar;
    ctx.fillRect(power.left, power.top, power.right - power.left, power.bottom - power.top);
  }
  drawPixels(POWER_ICON, power.left + 5, power.top + 4, 2, COLORS.text);

  if (state.powerMenu) drawPowerMenu(power);
}

// The tiny Sleep / Shut down menu, popping up above the power button.
function drawPowerMenu(power) {
  const width = 112, itemHeight = 24;
  const left = power.left - 20, bottom = power.top - 4;
  const top = bottom - POWER_MENU.length * itemHeight - 8;

  ctx.fillStyle = COLORS.text;                              // shadow
  ctx.fillRect(left + 4, top + 4, width, bottom - top);
  ctx.fillStyle = COLORS.cream;
  ctx.fillRect(left, top, width, bottom - top);
  ctx.strokeStyle = COLORS.text;
  ctx.lineWidth = 2;
  ctx.strokeRect(left, top, width, bottom - top);

  POWER_MENU.forEach((item, number) => {
    const itemTop = top + 4 + number * itemHeight;
    const box = { left: left + 2, top: itemTop, right: left + width - 2, bottom: itemTop + itemHeight,
                  onClick: item.onClick, id: `power:${number}` };
    hitBoxes.push(box);
    if (state.hoverId === box.id) {
      ctx.fillStyle = COLORS.titleBar;
      ctx.fillRect(box.left, box.top, box.right - box.left, itemHeight);
    }
    drawPixels(item.picture, left + 9, itemTop + 5, 2, COLORS.text);
    write(item.text, left + 30, itemTop + itemHeight / 2 + 1, FONTS.menu, COLORS.text, "left");
  });
}

// Opens or closes the little power menu (the Start menu stays open).
function togglePowerMenu() {
  playSound("click");
  state.powerMenu = !state.powerMenu;
}

// Where windows (the love note, Memories, Games) open on the desktop.
const WINDOW = { left: 250, top: 82, right: 592, bottom: 320 };
const WINDOW_TITLES = {
  notes: "love_note.txt - Notepad", memories: "Memories", games: "Arcade",
  openwhen: "Open when...", secret: "Secret",
  guestbook: `Notepad - leave ${YOUR_NAME} a note`, inbox: "Inbox",
};

// Where the open window is right now: normal size, or filling the whole computer screen
// (above the taskbar) when he's clicked the full-screen button.
function windowBox() {
  if (state.maximized) return { left: SCREEN.left, top: SCREEN.top, right: SCREEN.right, bottom: TASKBAR.top };
  return WINDOW;
}

// The inside of the window (under its title bar). Games are played in here.
function gameArea() {
  const { left, top, right, bottom } = windowBox();
  return { left: left + 2, top: top + 22, right: right - 2, bottom: bottom - 2 };
}

// The full-screen button: makes the window fill the little computer's screen, or shrinks it back.
function toggleMaximized() {
  playSound("click");
  state.maximized = !state.maximized;
}

// A retro window with a pink title bar, a full-screen button, and an X to close it.
function drawWindow(time) {
  const { left, top, right, bottom } = windowBox();

  // An invisible "blocker" covering the window, so clicks don't go through to icons behind it.
  // (In the jumping and flying games, clicking anywhere in the window jumps/flaps.)
  hitBoxes.push({ left, top, right, bottom, onClick: gameAction, blocker: true });

  if (!state.maximized) {
    ctx.fillStyle = COLORS.text;                            // shadow
    ctx.fillRect(left + 5, top + 5, right - left, bottom - top);
  }
  ctx.fillStyle = COLORS.cream;
  ctx.fillRect(left, top, right - left, bottom - top);
  ctx.fillStyle = COLORS.titleBar;
  ctx.fillRect(left, top, right - left, 22);
  ctx.strokeStyle = COLORS.text;
  ctx.lineWidth = 3;
  ctx.strokeRect(left, top, right - left, bottom - top);
  ctx.strokeRect(left, top, right - left, 22);
  let title = state.game ? GAMES[state.game.key].title : WINDOW_TITLES[state.window];
  if (state.window === "memories" && state.memoriesFolder) title += ` > ${MEMORY_FOLDERS[state.memoriesFolder].label}`;
  write(title, left + 10, top + 11, FONTS.small, COLORS.text, "left");

  // The X box.
  ctx.lineWidth = 2;
  ctx.strokeRect(right - 20, top + 4, 14, 14);
  ctx.beginPath();
  ctx.moveTo(right - 17, top + 7); ctx.lineTo(right - 9, top + 15);
  ctx.moveTo(right - 9, top + 7); ctx.lineTo(right - 17, top + 15);
  ctx.stroke();
  hitBoxes.push({ left: right - 24, top, right, bottom: top + 22, onClick: closeWindow });

  // The full-screen button, just left of the X.
  // Normal size: one box with a thick top. Full screen: two overlapping boxes (click to shrink back).
  const buttonLeft = right - 38;
  ctx.strokeRect(buttonLeft, top + 4, 14, 14);
  if (state.maximized) {
    ctx.strokeRect(buttonLeft + 5, top + 7, 6, 6);
    ctx.strokeRect(buttonLeft + 3, top + 9, 6, 6);
  } else {
    ctx.strokeRect(buttonLeft + 3, top + 7, 8, 8);
    ctx.fillStyle = COLORS.text;
    ctx.fillRect(buttonLeft + 3, top + 7, 8, 2);
  }
  hitBoxes.push({ left: buttonLeft - 2, top, right: right - 24, bottom: top + 22, onClick: toggleMaximized });

  // The inside of the window.
  const inside = gameArea();
  if (state.window === "notes") drawNotes(inside, time);
  if (state.window === "memories") drawMemories(inside);
  if (state.window === "games") drawGamesFolder(inside);
  if (state.window === "openwhen") drawOpenWhen(inside);
  if (state.window === "secret") drawSecret(inside, time);
  if (state.window === "guestbook") drawGuestbook(inside, time);
  if (state.window === "inbox") drawInbox(inside);
  if (state.game) drawGameWindow(time);
}


// ====================================================================================
// "OPEN WHEN..." LETTERS
// ====================================================================================

// The list of letters, or (once he picks one) that letter, opened up.
function drawOpenWhen(inside) {
  const middle = (inside.left + inside.right) / 2;

  if (state.openWhen === null) {
    // The list: an envelope (or a padlock, if it's locked) and "Open when ___" for each letter.
    // If there are more than fit, the mouse wheel scrolls the list.
    const rowHeight = 30;
    const list = { left: inside.left, top: inside.top + 4, right: inside.right, bottom: inside.bottom - 4 };
    const contentHeight = OPEN_WHEN.length * rowHeight + 4;
    state.letterListMaxScroll = Math.max(0, contentHeight - (list.bottom - list.top));
    state.letterListScroll = keepBetween(state.letterListScroll, 0, state.letterListMaxScroll);
    const hasScrollbar = state.letterListMaxScroll > 0;

    // Only show rows inside the list area (ones scrolled out of view get trimmed off).
    ctx.save();
    ctx.beginPath();
    ctx.rect(list.left, list.top, list.right - list.left, list.bottom - list.top);
    ctx.clip();
    OPEN_WHEN.forEach((letter, number) => {
      const top = list.top + 4 + number * rowHeight - state.letterListScroll;
      if (top + rowHeight < list.top || top > list.bottom) return;
      const locked = isLocked(letter);
      const box = { left: inside.left + 8, top, right: inside.right - (hasScrollbar ? 16 : 8), bottom: top + rowHeight - 4,
                    onClick: () => (locked ? showLockedLetter(letter) : openLetter(number)), id: `openwhen:${number}` };
      // Only clickable if it's actually showing (not scrolled behind the edge).
      if (top >= list.top - 4 && top + rowHeight - 4 <= list.bottom + 4) hitBoxes.push(box);
      steppedBox(box.left, box.top, box.right, box.bottom, 3,
                 state.hoverId === box.id ? COLORS.titleBar : (locked ? COLORS.iconHover : COLORS.white), COLORS.text, 1.5);
      const rowMiddle = top + (rowHeight - 4) / 2;
      if (locked) drawPixels(LOCK, box.left + 17, rowMiddle - 6, 2, COLORS.text);
      else drawSmallEnvelope(box.left + 22, rowMiddle, remembers(`letter:${number}`));
      const title = `Open when ${letter.when}`;
      write(title, box.left + 44, rowMiddle + 1, fontThatFits(title, box.right - box.left - 54), COLORS.text, "left");
    });
    ctx.restore();

    // A little pink scrollbar on the right, when there's more to scroll to.
    if (hasScrollbar) {
      const trackHeight = list.bottom - list.top;
      const thumbHeight = Math.max(20, trackHeight * trackHeight / contentHeight);
      const thumbTop = list.top + (trackHeight - thumbHeight) * state.letterListScroll / state.letterListMaxScroll;
      ctx.fillStyle = COLORS.iconHover;
      ctx.fillRect(list.right - 10, list.top, 6, trackHeight);
      ctx.fillStyle = COLORS.acceptFill;
      ctx.fillRect(list.right - 10, thumbTop, 6, thumbHeight);
    }
    return;
  }

  // One letter, opened: a white page with the words, and a Back button.
  const letter = OPEN_WHEN[state.openWhen];
  const page = { left: inside.left + 10, top: inside.top + 8, right: inside.right - 10, bottom: inside.bottom - 40 };
  ctx.fillStyle = COLORS.white;
  ctx.fillRect(page.left, page.top, page.right - page.left, page.bottom - page.top);
  ctx.strokeStyle = COLORS.text;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(page.left, page.top, page.right - page.left, page.bottom - page.top);

  const title = `Open when ${letter.when}`;
  write(title, middle, page.top + 16, fontThatFits(title, page.right - page.left - 64), COLORS.text);
  drawPixels(HEART, page.left + 10, page.top + 10, 2, COLORS.heart);
  drawPixels(HEART, page.right - 24, page.top + 10, 2, COLORS.heart);
  // Really short letters (one line, like "MWAHHH") show up big and centered, with hearts.
  if (!letter.text.includes("\n") && letter.text.length <= 24) {
    const centerY = (page.top + page.bottom) / 2 + 8;
    write(letter.text, middle, centerY, fontThatFitsBig(letter.text, page.right - page.left - 40), COLORS.text);
    [[-110, -38, 3], [96, -44, 2], [-90, 30, 2], [104, 26, 3], [-6, -58, 2]].forEach(([dx, dy, size]) => {
      drawPixels(HEART, middle + dx, centerY + dy, size, COLORS.heart);
    });
    drawButton(inside.left + 50, inside.bottom - 19, 80, 26, "Back", COLORS.cream, COLORS.text, () => {
      playSound("click");
      state.openWhen = null;
    });
    return;
  }

  // Long letters are split into pages. This works out how many lines fit on one page.
  const lineHeight = 16;
  const perPage = Math.floor((page.bottom - page.top - 42) / lineHeight);
  const lines = wrapWords(letter.text, FONTS.note, page.right - page.left - 24);

  // Split the lines into pages. A blank line never starts a new page (it's just skipped).
  const pageList = [[]];
  lines.forEach(line => {
    let current = pageList[pageList.length - 1];
    if (current.length === perPage) {
      current = [];
      pageList.push(current);
    }
    if (current.length === 0 && line === "") return;
    current.push(line);
  });
  const pages = pageList.length;
  state.letterPage = keepBetween(state.letterPage, 0, pages - 1);

  pageList[state.letterPage].forEach((line, number) => {
    write(line, page.left + 12, page.top + 30 + number * lineHeight, FONTS.note, COLORS.text, "left", "top");
  });

  drawButton(inside.left + 50, inside.bottom - 19, 80, 26, "Back", COLORS.cream, COLORS.text, () => {
    playSound("click");
    state.openWhen = null;
  });

  // Only for letters with more than one page: "Page 1 of 2", and buttons to flip pages.
  if (pages > 1) {
    // The page number, small, at the bottom-right corner of the paper.
    write(`page ${state.letterPage + 1} of ${pages}`, page.right - 10, page.bottom - 9, FONTS.tag, COLORS.text, "right");
    if (state.letterPage > 0) {
      drawButton(inside.right - 112, inside.bottom - 19, 40, 26, "<", COLORS.cream, COLORS.text, () => flipPage(-1));
    }
    if (state.letterPage < pages - 1) {
      drawButton(inside.right - 54, inside.bottom - 19, 70, 26, "Next >", COLORS.acceptFill, COLORS.acceptText, () => flipPage(1));
    }
  }
}

// A big bold font (40 down to 14) that fits the words in this many pixels.
function fontThatFitsBig(text, maxWidth) {
  for (let size = 40; size > 14; size -= 2) {
    ctx.font = `bold ${size}px 'Pixelify Sans'`;
    if (ctx.measureText(text).width <= maxWidth) return ctx.font;
  }
  return "bold 14px 'Pixelify Sans'";
}

// Is this letter still locked? Letters without "unlocks" are never locked.
// unlocks: null = locked until you pick a date. unlocks: "2027-06-14" = unlocks that day.
function isLocked(letter) {
  if (!("unlocks" in letter)) return false;
  if (letter.unlocks === null) return true;
  return todayString() < letter.unlocks;
}

// Clicking a locked letter: "Not yet!", with a countdown once there's a date.
function showLockedLetter(letter) {
  let message = "Not yet! This one unlocks the day we meet 💗";
  if (letter.unlocks) {
    // Count the days between today and the unlock day (both at midnight, his time).
    const days = Math.round((new Date(`${letter.unlocks}T00:00`) - new Date(`${todayString()}T00:00`)) / 86400000);
    message = days === 1 ? "Not yet! This one unlocks TOMORROW 💗"
                         : `Not yet! This one unlocks in ${days} days 💗`;
  }
  playSound("buzzer", BUZZER_VOLUME);
  state.popup = { title: "LOCKED", message };
}

// The mouse wheel scrolls the "Open when..." list when it's too long to fit.
canvas.addEventListener("wheel", event => {
  if (state.window !== "openwhen" || state.openWhen !== null || !state.letterListMaxScroll) return;
  event.preventDefault();   // scroll the list, not the web page
  state.letterListScroll = keepBetween(state.letterListScroll + event.deltaY * 0.5, 0, state.letterListMaxScroll);
}, { passive: false });

// The biggest bold font (14 down to 9) that fits the words in this many pixels.
function fontThatFits(text, maxWidth) {
  for (let size = 14; size > 9; size--) {
    ctx.font = `bold ${size}px 'Pixelify Sans'`;
    if (ctx.measureText(text).width <= maxWidth) return ctx.font;
  }
  return "bold 9px 'Pixelify Sans'";
}

function flipPage(direction) {
  playSound("paper");
  state.letterPage += direction;
}

function openLetter(number) {
  playSound("paper");
  remember(`letter:${number}`);
  state.openWhen = number;
  state.letterPage = 0;
}

// A tiny envelope (open if he's read it already, sealed with a heart if he hasn't).
function drawSmallEnvelope(x, y, opened) {
  if (opened) {
    // Opened: a little letter (with a heart) sticking up out of the envelope.
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(x - 8, y - 11, 16, 12);
    ctx.strokeStyle = COLORS.text;
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 8, y - 11, 16, 12);
    drawPixels(HEART, x - 3.5, y - 9, 1, COLORS.heart);

    // The front of the envelope, covering the bottom of the letter.
    ctx.fillStyle = COLORS.envelopePaper;
    ctx.fillRect(x - 12, y - 3, 24, 11);
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x - 12, y - 3, 24, 11);
    ctx.strokeStyle = COLORS.envelopeLine;
    ctx.beginPath();
    ctx.moveTo(x - 11, y - 2); ctx.lineTo(x, y + 4); ctx.lineTo(x + 11, y - 2);
    ctx.stroke();
    return;
  }

  // Sealed: a closed envelope with a heart sticker.
  ctx.fillStyle = COLORS.envelopePaper;
  ctx.fillRect(x - 12, y - 8, 24, 16);
  ctx.strokeStyle = COLORS.text;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x - 12, y - 8, 24, 16);
  ctx.strokeStyle = COLORS.envelopeLine;
  ctx.beginPath();
  ctx.moveTo(x - 11, y - 7); ctx.lineTo(x, y + 1); ctx.lineTo(x + 11, y - 7);
  ctx.stroke();
  drawPixels(HEART, x - 4, y - 3, 1, COLORS.heart);
}


// ====================================================================================
// THE SECRET FOLDER (a coupon book, behind a password)
// ====================================================================================

const LOCK = [
  ".XXX.",
  "X...X",
  "X...X",
  "XXXXX",
  "XX.XX",
  "XXXXX",
];

// Locked: a password box. Unlocked: the coupon book.
function drawSecret(inside, time) {
  if (remembers("secret:unlocked")) {
    drawCoupons(inside);
    return;
  }
  const middle = (inside.left + inside.right) / 2;

  drawPixels(LOCK, middle - 10, inside.top + 16, 4, COLORS.text);
  write("This folder is locked.", middle, inside.top + 56, FONTS.body, COLORS.text);
  write(SECRET_HINT, middle, inside.top + 78, FONTS.small, COLORS.text);

  // The password box. Each letter he types shows as a *, with a blinking cursor at the end.
  const box = { left: middle - 90, top: inside.top + 94, right: middle + 90, bottom: inside.top + 120 };
  ctx.fillStyle = COLORS.white;
  ctx.fillRect(box.left, box.top, box.right - box.left, box.bottom - box.top);
  ctx.strokeStyle = COLORS.text;
  ctx.lineWidth = 2;
  ctx.strokeRect(box.left, box.top, box.right - box.left, box.bottom - box.top);
  const stars = "*".repeat(state.password.length);
  write(stars, box.left + 8, box.top + 15, FONTS.body, COLORS.text, "left");
  if (Math.floor(time / 500) % 2 === 0) {
    ctx.font = FONTS.body;
    ctx.fillStyle = COLORS.text;
    ctx.fillRect(box.left + 10 + ctx.measureText(stars).width, box.top + 5, 2, 16);
  }

  if (state.passwordWrong) {
    write("Wrong password! Try again.", middle, inside.top + 134, FONTS.small, COLORS.newTag);
  } else {
    write("Type the password, then press Enter", middle, inside.top + 134, FONTS.tag, COLORS.text);
  }

  drawButton(middle, inside.top + 164, 100, 28, "Unlock", COLORS.acceptFill, COLORS.acceptText, tryPassword);
}

// Checks the password. (Capital letters and spaces at the ends don't matter.)
function tryPassword() {
  if (state.password.trim().toLowerCase() === SECRET_PASSWORD.toLowerCase()) {
    remember("secret:unlocked");
    playSound("win", 0.6);
  } else {
    playSound("buzzer", BUZZER_VOLUME);
    state.passwordWrong = true;
  }
  state.password = "";
}

// Typing goes into the password box while the locked secret folder is open.
window.addEventListener("keydown", event => {
  if (state.mode !== "desktop" || state.window !== "secret" || state.popup || remembers("secret:unlocked")) return;
  if (event.key === "Enter") {
    tryPassword();
  } else if (event.key === "Backspace") {
    event.preventDefault();
    state.password = state.password.slice(0, -1);
  } else if (event.key.length === 1 && state.password.length < 24) {
    event.preventDefault();   // so Space doesn't scroll the page
    state.password += event.key;
    state.passwordWrong = false;
    playKeySound(0.4);
  }
});

// The coupon book: two columns of coupons. Used ones get a USED stamp.
function drawCoupons(inside) {
  const middle = (inside.left + inside.right) / 2;
  write("Coupon Book", middle, inside.top + 14, FONTS.menu, COLORS.text);
  write("Click a coupon to use it!", middle, inside.top + 30, FONTS.tag, COLORS.text);

  const gap = 8, height = 44;
  const width = (inside.right - inside.left - 24 - gap) / 2;
  COUPONS.forEach((coupon, number) => {
    const left = inside.left + 12 + (number % 2) * (width + gap);
    const top = inside.top + 42 + Math.floor(number / 2) * (height + gap);
    const used = remembers(`coupon:${number}`);
    const box = { left, top, right: left + width, bottom: top + height, id: `coupon:${number}`,
                  onClick: () => useCoupon(number) };
    if (!used) hitBoxes.push(box);

    // A ticket with a dotted pink line inside its edge.
    const hovered = !used && state.hoverId === box.id;
    steppedBox(box.left, box.top, box.right, box.bottom, 3, hovered ? COLORS.titleBar : COLORS.cream, COLORS.text, 1.5);
    ctx.strokeStyle = COLORS.envelopeLine;
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.strokeRect(box.left + 4, box.top + 4, width - 8, height - 8);
    ctx.setLineDash([]);

    drawPixels(HEART, box.left + 9, top + height / 2 - 6, 2, COLORS.heart);
    const lines = wrapWords(coupon, FONTS.tag, width - 38);
    lines.forEach((line, lineNumber) => {
      const y = top + height / 2 - ((lines.length - 1) * 12) / 2 + lineNumber * 12;
      write(line, box.left + 28, y, FONTS.tag, COLORS.text, "left");
    });

    // The USED stamp: tilted pink letters in a box.
    if (used) {
      ctx.save();
      ctx.translate(box.left + width / 2, top + height / 2);
      ctx.rotate(-0.2);
      ctx.globalAlpha = 0.85;
      ctx.strokeStyle = COLORS.newTag;
      ctx.lineWidth = 2;
      ctx.strokeRect(-30, -11, 60, 22);
      write("USED", 0, 1, FONTS.menu, COLORS.newTag);
      ctx.restore();
    }
  });
}

function useCoupon(number) {
  playSound("coin", 0.6);
  remember(`coupon:${number}`);
  showPopup("COUPON", `Coupon used! Send ${YOUR_NAME} a screenshot to cash it in.`);
}


// ====================================================================================
// THE DESKTOP CAT
// ====================================================================================

// A little white cat (facing right). W = white fur, E = eyes, P = pink nose.
const CAT_WALK_1 = [
  ".........W..W",
  ".........WWWW",
  "W........WEWE",
  "W........WWPW",
  ".W.WWWWWWWWW.",
  "..WWWWWWWWWW.",
  "..WWWWWWWWW..",
  "..W..W..W..W.",
];
const CAT_WALK_2 = [...CAT_WALK_1.slice(0, 7), "...W.W...W.W."];
const CAT_SIT = [
  ".........W..W",
  ".........WWWW",
  ".........WEWE",
  ".........WWPW",
  "......WWWWWW.",
  ".....WWWWWWW.",
  "WW...WWWWWWW.",
  ".WWWWWWWWWWW.",
];
const CAT_COLORS = { W: "#FFFFFF", E: "#45284A", P: "#F4A6BD" };
const CAT_OUTLINE = { W: "#45284A", E: "#45284A", P: "#45284A" };
const CAT_SIZE = 3;   // how big each of the cat's squares is (bigger = bigger cat)
const CAT_WIDTH = 13 * CAT_SIZE, CAT_HEIGHT = 8 * CAT_SIZE;
const CAT_LEFT = 250, CAT_RIGHT = 600;   // how far left and right it wanders

// Flips a picture left-to-right (so the cat can face the other way).
function mirror(rows) {
  return rows.map(row => [...row].reverse().join(""));
}

// The cat wanders along the bottom of the screen, sits for a bit, then wanders again.
function drawCat(time) {
  if (!state.cat) {
    state.cat = { x: 420, direction: 1, sitting: false, timer: 4, meow: 0, lastTime: time };
  }
  const cat = state.cat;
  const seconds = Math.min(0.05, (time - cat.lastTime) / 1000);
  cat.lastTime = time;

  cat.timer -= seconds;
  cat.meow = Math.max(0, cat.meow - seconds);
  if (cat.sitting) {
    if (cat.timer <= 0) {
      // Done sitting: walk off in a random direction.
      cat.sitting = false;
      cat.direction = Math.random() < 0.5 ? -1 : 1;
      cat.timer = between(3, 7, Math.random());
    }
  } else {
    cat.x += cat.direction * 22 * seconds;
    // Turn around at the edges.
    if (cat.x < CAT_LEFT || cat.x > CAT_RIGHT - CAT_WIDTH) {
      cat.direction = -cat.direction;
      cat.x = keepBetween(cat.x, CAT_LEFT, CAT_RIGHT - CAT_WIDTH);
    }
    if (cat.timer <= 0) {
      cat.sitting = true;
      cat.timer = between(2, 5, Math.random());
    }
  }

  let picture = cat.sitting ? CAT_SIT : (Math.floor(time / 200) % 2 ? CAT_WALK_1 : CAT_WALK_2);
  if (cat.direction < 0) picture = mirror(picture);
  const x = Math.round(cat.x), y = TASKBAR.top - CAT_HEIGHT - 1;

  // A dark outline (the same picture, nudged one square each way), then the cat itself.
  [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dx, dy]) => {
    drawSprite(picture, CAT_OUTLINE, x + dx * CAT_SIZE, y + dy * CAT_SIZE, CAT_SIZE);
  });
  drawSprite(picture, CAT_COLORS, x, y, CAT_SIZE);

  // Clicking the cat: it sits, says meow, and a heart pops up.
  hitBoxes.push({ left: x - 2, top: y - 2, right: x + CAT_WIDTH + 2, bottom: y + CAT_HEIGHT + 2, onClick: petCat });
  if (cat.meow > 0) {
    const bubbleX = x + CAT_WIDTH / 2;
    steppedBox(bubbleX - 24, y - 26, bubbleX + 24, y - 8, 2, COLORS.white, COLORS.text, 1.5);
    write("meow!", bubbleX, y - 16.5, FONTS.tag, COLORS.text);
    drawPixels(HEART, bubbleX - 7, y - 40 - (1.5 - cat.meow) * 8, 2, COLORS.heart);
  }
}

function petCat() {
  const cat = state.cat;
  cat.sitting = true;
  cat.timer = 2.5;
  cat.meow = 1.5;
  // If there's a meow.wav in the sounds folder, it plays that. If not, a little click.
  if (sounds.meow) playSound("meow", 0.6);
  else playSound("click");
}


// ====================================================================================
// THE GUESTBOOK (he writes you notes) AND YOUR INBOX (where you read them)
// ====================================================================================
//
// His notes are saved in Firebase (a free Google service). Discord pings you when one
// arrives, without saying what it is. Only YOUR Google account can read them.
//
// YOUR side of the site is the normal link with ?inbox on the end (bookmark it!):
//   https://taylerbuchanan.github.io/date-night/?inbox
// The plain link (without ?inbox) is always HIS side, even on your computer.

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyA_kebLMqLzl7VF1_USywD42NcN8-7qIcU",
  authDomain: "little-computer-2f668.firebaseapp.com",
  projectId: "little-computer-2f668",
  storageBucket: "little-computer-2f668.firebasestorage.app",
  messagingSenderId: "521343865256",
  appId: "1:521343865256:web:e46175fd71f6f526f5cd9d",
};

// The longest note he can write, in letters.
const GUESTBOOK_MAX = 400;

const IS_TAYLER = PREVIEW.has("inbox");

// Connect to Firebase. (If it can't load, like with no internet, the guestbook says so.)
let database = null, firebaseAuth = null;
try {
  firebase.initializeApp(FIREBASE_CONFIG);
  database = firebase.firestore();
  firebaseAuth = firebase.auth();
} catch (problem) {
  console.log("Firebase didn't load:", problem);
}

// ---------- His side: writing a note ----------

state.guestText = "";       // what he's typed so far
state.guestStatus = "";     // "", "sending", "sent", or "error"

function drawGuestbook(inside, time) {
  const middle = (inside.left + inside.right) / 2;

  if (state.guestStatus === "sent") {
    drawPixels(HEART, middle - 14, inside.top + 40, 4, COLORS.heart);
    write("Sent!", middle, inside.top + 86, FONTS.celebrationSubtitle, COLORS.text);
    write(`${YOUR_NAME} will get your note soon.`, middle, inside.top + 114, FONTS.note, COLORS.text);
    drawButton(middle, inside.top + 160, 160, 30, "Write another", COLORS.cream, COLORS.text, () => {
      playSound("click");
      state.guestStatus = "";
    });
    return;
  }

  write(`Write ${YOUR_NAME} a note:`, inside.left + 12, inside.top + 14, FONTS.menu, COLORS.text, "left");

  // The writing box, with the words wrapped to fit and a blinking cursor at the end.
  const box = { left: inside.left + 10, top: inside.top + 28, right: inside.right - 10, bottom: inside.bottom - 42 };
  ctx.fillStyle = COLORS.white;
  ctx.fillRect(box.left, box.top, box.right - box.left, box.bottom - box.top);
  ctx.strokeStyle = COLORS.text;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(box.left, box.top, box.right - box.left, box.bottom - box.top);

  const lines = wrapWords(state.guestText, FONTS.note, box.right - box.left - 20);
  const lineHeight = 17;
  // If it's too long to show, only show the last lines that fit.
  const fits = Math.floor((box.bottom - box.top - 10) / lineHeight);
  const shown = lines.slice(-fits);
  shown.forEach((line, number) => {
    write(line, box.left + 8, box.top + 6 + number * lineHeight, FONTS.note, COLORS.text, "left", "top");
  });
  if (!state.guestText) {
    write("Start typing...", box.left + 8, box.top + 6, FONTS.note, COLORS.lostLife, "left", "top");
  }
  if (Math.floor(time / 500) % 2 === 0 && state.guestStatus !== "sending") {
    ctx.font = FONTS.note;
    const lastLine = shown[shown.length - 1] || "";
    ctx.fillStyle = COLORS.text;
    ctx.fillRect(box.left + 9 + ctx.measureText(lastLine).width, box.top + 6 + (shown.length - 1) * lineHeight, 2, 15);
  }

  // How many letters he has left, and any problems.
  let status = `${GUESTBOOK_MAX - state.guestText.length} letters left`;
  if (state.guestStatus === "sending") status = "Sending...";
  if (state.guestStatus === "error") status = "Couldn't send. Try again?";
  write(status, inside.left + 12, inside.bottom - 19, FONTS.tag, state.guestStatus === "error" ? COLORS.newTag : COLORS.text, "left");

  drawButton(inside.right - 58, inside.bottom - 19, 90, 26, "Send", COLORS.acceptFill, COLORS.acceptText, sendNote);
}

// Typing (and pasting) goes into the note while the guestbook is open.
function guestbookIsTyping() {
  return state.mode === "desktop" && state.window === "guestbook" && !state.popup &&
         state.guestStatus !== "sending" && state.guestStatus !== "sent";
}

window.addEventListener("keydown", event => {
  if (!guestbookIsTyping() || event.ctrlKey || event.metaKey) return;
  if (event.key === "Backspace") {
    event.preventDefault();
    state.guestText = state.guestText.slice(0, -1);
  } else if (event.key === "Enter") {
    event.preventDefault();
    if (state.guestText.length < GUESTBOOK_MAX) state.guestText += "\n";
  } else if (event.key.length === 1 && state.guestText.length < GUESTBOOK_MAX) {
    event.preventDefault();   // so Space doesn't scroll the page
    state.guestText += event.key;
    playKeySound(0.3);
  } else {
    return;
  }
  if (state.guestStatus === "error") state.guestStatus = "";
});

window.addEventListener("paste", event => {
  if (!guestbookIsTyping()) return;
  const pasted = event.clipboardData.getData("text");
  state.guestText = (state.guestText + pasted).slice(0, GUESTBOOK_MAX);
});

// Saves the note in Firebase, then pings you on Discord (without the note itself).
async function sendNote() {
  const text = state.guestText.trim();
  if (!text || state.guestStatus === "sending") return;
  playSound("click");
  state.guestStatus = "sending";
  try {
    await database.collection("guestbook").add({
      text,
      from: RECIPIENT_NAME,
      sentAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    state.guestText = "";
    state.guestStatus = "sent";
    playSound("win", 0.5);
    // The Discord ping. If it fails, that's okay: the note is already saved.
    fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: `💌 ${RECIPIENT_NAME} left you a message on the little computer! Open your inbox to read it.` }),
    }).catch(() => {});
  } catch (problem) {
    console.log("Couldn't send the note:", problem);
    state.guestStatus = "error";
    playSound("buzzer", BUZZER_VOLUME);
  }
}

// ---------- Your side: the inbox ----------

state.messages = [];          // his notes, newest first: { id, text, sentAt }
state.inboxSignedIn = false;  // are you signed in with your Google account?
state.inboxMessage = null;    // which note is open (or null for the list)
state.inboxProblem = "";      // a problem to show, like "That account can't read these"

// Notes you haven't opened yet. (Your browser remembers which ones you've read.)
function unreadMessages() {
  return state.messages.filter(message => !remembers(`message:${message.id}`));
}

// When you're signed in, keep listening for his notes. New ones show up right away,
// with a "New message!" pop-up, even while the site is already open.
let knownMessageIds = null;
if (IS_TAYLER && firebaseAuth) {
  firebaseAuth.onAuthStateChanged(user => {
    state.inboxSignedIn = !!user;
    if (!user) return;
    database.collection("guestbook").orderBy("sentAt", "desc").onSnapshot(snapshot => {
      state.inboxProblem = "";
      state.messages = snapshot.docs.map(doc => ({
        id: doc.id,
        text: doc.data().text,
        sentAt: doc.data().sentAt ? doc.data().sentAt.toDate() : new Date(),
      }));
      const unread = unreadMessages();
      // Pop up once when the site opens (if there's anything unread), and again for each new note.
      const isNew = knownMessageIds === null ? unread.length > 0
                                             : unread.some(message => !knownMessageIds.has(message.id));
      knownMessageIds = new Set(state.messages.map(message => message.id));
      if (isNew && state.window !== "inbox") {
        playSound("incoming");
        state.popup = { title: "NEW MESSAGE", message: `You have a new message from ${RECIPIENT_NAME}! Open your Inbox to read it.` };
      }
    }, problem => {
      console.log("Couldn't load messages:", problem);
      state.inboxProblem = "This account can't read the notes. Try signing in with your own Google account.";
    });
  });
}

function signIn() {
  playSound("click");
  state.inboxProblem = "";
  firebaseAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch(problem => {
    console.log("Sign-in problem:", problem);
    state.inboxProblem = "Sign-in didn't work. Try again?";
  });
}

function drawInbox(inside) {
  const middle = (inside.left + inside.right) / 2;

  if (!firebaseAuth) {
    write("The inbox can't connect right now.", middle, inside.top + 90, FONTS.note, COLORS.text);
    return;
  }
  if (!state.inboxSignedIn) {
    drawPixels(LOCK, middle - 10, inside.top + 24, 4, COLORS.text);
    write(`Sign in to read ${RECIPIENT_NAME}'s notes`, middle, inside.top + 70, FONTS.body, COLORS.text);
    if (state.inboxProblem) write(state.inboxProblem, middle, inside.top + 94, FONTS.tag, COLORS.newTag);
    drawButton(middle, inside.top + 132, 200, 30, "Sign in with Google", COLORS.acceptFill, COLORS.acceptText, signIn);
    return;
  }
  if (state.inboxProblem) {
    const lines = wrapWords(state.inboxProblem, FONTS.note, inside.right - inside.left - 40);
    lines.forEach((line, number) => write(line, middle, inside.top + 80 + number * 18, FONTS.note, COLORS.newTag));
    return;
  }

  // One note, opened.
  if (state.inboxMessage) {
    const message = state.inboxMessage;
    const page = { left: inside.left + 10, top: inside.top + 8, right: inside.right - 10, bottom: inside.bottom - 40 };
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(page.left, page.top, page.right - page.left, page.bottom - page.top);
    ctx.strokeStyle = COLORS.text;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(page.left, page.top, page.right - page.left, page.bottom - page.top);
    write(`From ${RECIPIENT_NAME}, ${formatDate(message.sentAt)}`, page.left + 12, page.top + 14, FONTS.small, COLORS.text, "left");
    const lines = wrapWords(message.text, FONTS.note, page.right - page.left - 24);
    lines.slice(0, 9).forEach((line, number) => {
      write(line, page.left + 12, page.top + 28 + number * 16, FONTS.note, COLORS.text, "left", "top");
    });
    drawButton(inside.left + 46, inside.bottom - 19, 76, 26, "Back", COLORS.cream, COLORS.text, () => {
      playSound("click");
      state.inboxMessage = null;
    });
    return;
  }

  // The list of notes, newest first. Unread ones are pink with a NEW tag.
  if (state.messages.length === 0) {
    drawEmptyFolderMessage(inside, "No notes yet...", "but he'll write one soon!");
    return;
  }
  const rowHeight = 30;
  state.messages.slice(0, 6).forEach((message, number) => {
    const top = inside.top + 8 + number * rowHeight;
    const unread = !remembers(`message:${message.id}`);
    const box = { left: inside.left + 8, top, right: inside.right - 8, bottom: top + rowHeight - 4,
                  onClick: () => openMessage(message), id: `message:${message.id}` };
    hitBoxes.push(box);
    steppedBox(box.left, box.top, box.right, box.bottom, 3,
               state.hoverId === box.id ? COLORS.titleBar : COLORS.white, COLORS.text, 1.5);
    drawSmallEnvelope(box.left + 20, top + 13, !unread);
    write(formatDate(message.sentAt), box.left + 40, top + 13, FONTS.small, COLORS.text, "left");
    if (unread) {
      steppedBox(box.right - 44, top + 5, box.right - 8, top + 21, 2, COLORS.newTag, COLORS.text, 1.5);
      write("NEW", box.right - 26, top + 13.5, FONTS.tag, COLORS.white);
    }
  });
}

function openMessage(message) {
  playSound("paper");
  remember(`message:${message.id}`);
  state.inboxMessage = message;
}

// A date like "Oct 26, 9:15 PM".
function formatDate(date) {
  return date.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

// ---------- The icons ----------

// A pink book with a heart, for the guestbook.
function drawGuestbookIcon(x, y) {
  steppedBox(x - 15, y - 18, x + 15, y + 18, 2, COLORS.acceptFill, COLORS.text, 2);
  ctx.fillStyle = COLORS.cream;
  ctx.fillRect(x - 11, y - 14, 3, 28);     // the pages along the spine
  drawPixels(HEART, x - 5, y - 6, 2, COLORS.white);
}

// A little mailbox with a flag (pink when there's unread mail), for your inbox.
function drawInboxIcon(x, y) {
  steppedBox(x - 18, y - 12, x + 14, y + 10, 4, COLORS.screen, COLORS.text, 2);
  ctx.fillStyle = COLORS.text;
  ctx.fillRect(x - 2, y + 10, 4, 10);        // the post
  ctx.fillRect(x + 14, y - 16, 2, 14);       // the flag pole
  ctx.fillStyle = unreadMessages().length ? COLORS.heart : COLORS.lostLife;
  ctx.fillRect(x + 16, y - 16, 8, 6);        // the flag
  drawSmallEnvelope(x - 2, y, false);
}

// The love note, like an old Notepad window.
function drawNotes(inside, time) {
  // The little menu bar along the top (just for looks).
  write("File   Edit   Format   Help", inside.left + 8, inside.top + 9, FONTS.tag, COLORS.text, "left");

  // The white page.
  const page = { left: inside.left + 4, top: inside.top + 18, right: inside.right - 4, bottom: inside.bottom - 4 };
  ctx.fillStyle = COLORS.white;
  ctx.fillRect(page.left, page.top, page.right - page.left, page.bottom - page.top);
  ctx.strokeStyle = COLORS.text;
  ctx.lineWidth = 1;
  ctx.strokeRect(page.left, page.top, page.right - page.left, page.bottom - page.top);

  // The note itself, wrapped to fit.
  const note = LOVE_NOTES.find(note => note.id === state.noteId) || LOVE_NOTES[LOVE_NOTES.length - 1];
  const lines = wrapWords(note.text, FONTS.note, page.right - page.left - 20);
  const lineHeight = 19;
  lines.forEach((line, number) => {
    write(line, page.left + 10, page.top + 8 + number * lineHeight, FONTS.note, COLORS.text, "left", "top");
  });

  // A blinking typing cursor after the last word.
  if (Math.floor(time / 500) % 2 === 0) {
    const lastLine = lines[lines.length - 1];
    ctx.font = FONTS.note;
    const cursorX = page.left + 12 + ctx.measureText(lastLine).width;
    ctx.fillStyle = COLORS.text;
    ctx.fillRect(cursorX, page.top + 8 + (lines.length - 1) * lineHeight, 2, 16);
  }
}

// The Memories folder has three folders inside it: Invitations, Love notes, and Photos.
const MEMORY_FOLDERS = {
  invites: { label: "Invitations", picture: (x, y) => { drawEmptyFolder(x, y); drawSmallEnvelope(x, y + 3, false); } },
  notes: { label: "Love notes", picture: (x, y) => { drawEmptyFolder(x, y); drawPixels(HEART, x - 7, y - 4, 2, COLORS.heart); } },
  photos: { label: "Photos", picture: (x, y) => { drawEmptyFolder(x, y); drawMiniPhoto(x, y + 2); } },
};

// A tiny photo (a sky with a green hill and a sun), for the Photos folder.
function drawMiniPhoto(x, y) {
  ctx.fillStyle = COLORS.white;
  ctx.fillRect(x - 11, y - 9, 22, 18);
  ctx.fillStyle = COLORS.screen;
  ctx.fillRect(x - 9, y - 7, 18, 14);
  ctx.fillStyle = "#8BC77B";
  ctx.fillRect(x - 9, y + 2, 18, 5);
  ctx.fillStyle = "#FFE08A";
  ctx.fillRect(x + 3, y - 5, 4, 4);
  ctx.strokeStyle = COLORS.text;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x - 11, y - 9, 22, 18);
}

// The images for the Photos folder, loaded the first time they're needed.
const photoImages = {};
function photoImage(file) {
  if (!photoImages[file]) {
    photoImages[file] = new Image();
    photoImages[file].src = `images/photos/${file}`;
  }
  return photoImages[file];
}

// What's inside Memories right now: the three folders, or one folder's contents.
function drawMemories(inside) {
  const middle = (inside.left + inside.right) / 2;
  const folder = state.memoriesFolder;

  if (!folder) {
    Object.entries(MEMORY_FOLDERS).forEach(([key, info], number) => {
      drawIcon({ label: info.label, picture: info.picture, onClick: () => openMemoryFolder(key) },
               middle - 90 + number * 90, inside.top + 70);
    });
    return;
  }

  // Inside a folder, a Back button goes up to the three folders.
  const back = () => {
    playSound("click");
    if (state.memoryItem !== null) state.memoryItem = null;
    else state.memoriesFolder = null;
  };
  drawButton(inside.left + 46, inside.bottom - 19, 76, 26, "Back", COLORS.cream, COLORS.text, back);

  if (folder === "invites") drawMemoryInvites(inside);
  if (folder === "notes") drawMemoryNotes(inside);
  if (folder === "photos") drawMemoryPhotos(inside);
}

// "Nothing here yet" for an empty folder.
function drawEmptyFolderMessage(inside, line1, line2) {
  const middle = (inside.left + inside.right) / 2;
  write(line1, middle, inside.top + 64, FONTS.body, COLORS.text);
  write(line2, middle, inside.top + 90, FONTS.body, COLORS.text);
  drawPixels(HEART, middle - 7, inside.top + 110, 2, COLORS.heart);
}

// Where the Nth icon goes inside a Memories folder (rows of 4).
function memorySpot(inside, number) {
  return [inside.left + 50 + (number % 4) * 80, inside.top + 40 + Math.floor(number / 4) * 74];
}

// Invitations: an envelope for every date that's already happened.
// Memories never say NEW, but keep the check if he accepted.
function drawMemoryInvites(inside) {
  const memories = INVITES.filter(isPast);
  if (memories.length === 0) {
    drawEmptyFolderMessage(inside, "No past dates yet...", "but not for long!");
    return;
  }
  memories.forEach((invite, number) => {
    const icon = inviteIcon(invite);
    if (icon.tag === "new") icon.tag = null;
    drawIcon(icon, ...memorySpot(inside, number));
  });
}

// Has he read this love note yet? (His browser remembers.)
function noteIsRead(note) {
  return remembers(`note:${note.id}`);
}

// The love notes he's already read, newest first.
function readNotes() {
  return LOVE_NOTES.filter(noteIsRead).reverse();
}

// Opens a love note from the desktop, and remembers he's read it.
// (It stays on the desktop until he closes it, then it's in Memories > Love notes.)
function openNote(note) {
  openWindow("notes");
  state.noteId = note.id;
  remember(`note:${note.id}`);
}

// "Love notes" in the Start menu: opens Memories > Love notes.
function openLoveNotes() {
  openWindow("memories");
  state.memoriesFolder = "notes";
}

// Love notes: every one he's already read, and clicking one opens it.
function drawMemoryNotes(inside) {
  const notes = readNotes();
  if (state.memoryItem !== null) {
    drawOldNote(inside, notes[state.memoryItem]);
    return;
  }
  if (notes.length === 0) {
    drawEmptyFolderMessage(inside, "Love notes you've read", "will be saved here");
    return;
  }
  notes.forEach((note, number) => {
    drawIcon({ label: note.label, picture: drawNoteIcon, onClick: () => openMemoryItem(number) },
             ...memorySpot(inside, number));
  });
}

// One old love note, on a white page.
function drawOldNote(inside, note) {
  const page = { left: inside.left + 10, top: inside.top + 8, right: inside.right - 10, bottom: inside.bottom - 40 };
  ctx.fillStyle = COLORS.white;
  ctx.fillRect(page.left, page.top, page.right - page.left, page.bottom - page.top);
  ctx.strokeStyle = COLORS.text;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(page.left, page.top, page.right - page.left, page.bottom - page.top);
  const lines = wrapWords(note.text, FONTS.note, page.right - page.left - 24);
  lines.forEach((line, number) => {
    write(line, page.left + 12, page.top + 7 + number * 16, FONTS.note, COLORS.text, "left", "top");
  });
}

// Photos: a little picture for every photo, and clicking one shows it big.
function drawMemoryPhotos(inside) {
  if (state.memoryItem !== null) {
    drawBigPhoto(inside, PHOTOS[state.memoryItem]);
    return;
  }
  if (PHOTOS.length === 0) {
    drawEmptyFolderMessage(inside, "No photos together yet...", "but there will be!");
    return;
  }
  PHOTOS.forEach((photo, number) => {
    const picture = (x, y) => drawPhotoFit(photoImage(photo.file), { left: x - 22, top: y - 18, right: x + 22, bottom: y + 18 });
    drawIcon({ label: photo.label, picture, onClick: () => openMemoryItem(number) }, ...memorySpot(inside, number));
  });
}

// One photo, as big as fits, with its caption under it.
function drawBigPhoto(inside, photo) {
  const middle = (inside.left + inside.right) / 2;
  drawPhotoFit(photoImage(photo.file), { left: inside.left + 12, top: inside.top + 8, right: inside.right - 12, bottom: inside.bottom - 52 });
  write(photo.caption || photo.label, middle + 30, inside.bottom - 19, FONTS.small, COLORS.text);
}

// Draws a photo as big as fits in a box (without stretching it), with a white frame.
function drawPhotoFit(image, box) {
  const boxWidth = box.right - box.left, boxHeight = box.bottom - box.top;
  ctx.fillStyle = COLORS.white;
  ctx.fillRect(box.left, box.top, boxWidth, boxHeight);
  if (image.complete && image.naturalWidth) {
    const scale = Math.min((boxWidth - 6) / image.naturalWidth, (boxHeight - 6) / image.naturalHeight);
    const width = image.naturalWidth * scale, height = image.naturalHeight * scale;
    ctx.drawImage(image, box.left + (boxWidth - width) / 2, box.top + (boxHeight - height) / 2, width, height);
  }
  ctx.strokeStyle = COLORS.text;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(box.left, box.top, boxWidth, boxHeight);
}

function openMemoryFolder(key) {
  playSound("click");
  state.memoriesFolder = key;
  state.memoryItem = null;
}

function openMemoryItem(number) {
  playSound("click");
  state.memoryItem = number;
}

// ====================================================================================
// MINI GAMES (starring you two!)
// ====================================================================================

// Tiny pixel versions of you two. Each letter is a color (see the palettes below),
// and "." is see-through. The head-and-body part and the legs are separate, so the
// legs can swap back and forth to make them walk and run.
const JACOB_TOP = [
  "..H.HHH.H...",
  ".HHHHHHHHHH.",
  "HHHHHHHHHHHH",
  "HHSSSSSSSSHH",
  "HSSESSSSESSH",
  ".SSSSSSSSSS.",
  "..SSSSSSSS..",
  ".TTTTTTTTTT.",
  "TTTTTWWTTTTT",
  "STTTWWWWTTTS",
  "S.TTTWWTTT.S",
  "..TTTTTTTT..",
];
const TAYLER_TOP = [
  "...HHHHHH...",
  "..HHHHHHHH..",
  ".HYHHHHHHHH.",
  ".YYSSSSSSHH.",
  "HYSESSSSESHH",
  "HYSSSSSSSSHH",
  "HHHSSSSSSHHH",
  "HHTTTTTTTTHH",
  "HHTTTTTTTTHH",
  "HSSTTTTTTSSH",
  "H.SSSSSSSS.H",
  "..PPPPPPPP..",
];
const LEGS_STAND = [
  "..PPPPPPPP..",
  "..PPP..PPP..",
  "..PPP..PPP..",
  ".BBBw..wBBB.",
];
const LEGS_STEP_1 = [
  "..PPPPPPPP..",
  ".PPP....PPP.",
  "PPP......PPP",
  "BBw......wBB",
];
const LEGS_STEP_2 = [
  "..PPPPPPPP..",
  "...PPPPPP...",
  "....PPPP....",
  "...BBwwBB...",
];

// H = hair, Y = blonde streak, S = skin, E = eyes, T = top, W = shirt print,
// P = pants, B = shoes, w = shoe soles.
const JACOB_COLORS = {
  H: "#6B3A22", S: "#E8B48C", E: "#2B1A14", T: "#222026", W: "#CFCFD6",
  P: "#5B5862", B: "#1C1B1F", w: "#F2F2F2",
};
const TAYLER_COLORS = {
  H: "#7A4128", Y: "#F1D9A8", S: "#E8B48C", E: "#3E5A2E", T: "#222026",
  P: "#3A3840", B: "#1C1B1F", w: "#F2F2F2",
};

// You two in a little pink plane.
const PLANE = [
  "X.................",
  "XX...HHH...HHH....",
  "XPX.HSSSH.HYSSH...",
  "XPPX.SSS...SSS....",
  "XPPPXXXXXXXXXXXX..",
  "XPPPPPPPPPPPPPPPXX",
  "XPPPPWPPWPPWPPPPPX",
  ".XXXPPPPPPPPPPPPX.",
  "....XXXPPPPXXXXX..",
  "......XPPX........",
  "......XXXX........",
];
const PLANE_COLORS = {
  X: "#45284A", P: "#F8A5BE", W: "#BBE1FD", H: "#6B3A22", Y: "#F1D9A8", S: "#E8B48C",
};

// Things to jump over in "Run to you".
const SUITCASE = [
  "...XXXX...",
  "...X..X...",
  "XXXXXXXXXX",
  "XPPPPPPPPX",
  "XPPPPPPPPX",
  "XXXXXXXXXX",
  "XPPPPPPPPX",
  "XXXXXXXXXX",
];
const CLOCK = [
  "..XXXX..",
  ".XWWWWX.",
  "XWWXWWWX",
  "XWWXWWWX",
  "XWWXXXWX",
  "XWWWWWWX",
  ".XWWWWX.",
  "..XXXX..",
];
const OBSTACLE_COLORS = { X: "#45284A", P: "#E89AAE", W: "#FFFFFF" };

// Pictures for the Memory match cards.
const CONTROLLER = [
  ".XXXXXXX.",
  "XX.XXXBXX",
  "X...XBXBX",
  "XX.XXXBXX",
  ".XX...XX.",
];
const CONTROLLER_COLORS = { X: "#45284A", B: "#7FB8F0" };
const CAT = [
  "X.....X",
  "XX...XX",
  "XXXXXXX",
  "X.XXX.X",
  "XXXXXXX",
  ".XXXXX.",
];
const MOON = [
  "..XXX..",
  ".XX....",
  "XX.....",
  "XX.....",
  "XX.....",
  ".XX....",
  "..XXX..",
];
const POPCORN = [
  ".W.W.W.",
  "WWWWWWW",
  "RWRWRWR",
  "RWRWRWR",
  ".RWRWR.",
  ".RWRWR.",
  ".RRRRR.",
];
const CARD_PICTURES = [
  { rows: HEART, colors: { X: "#F07A9C" } },
  { rows: SPARKLE, colors: { X: "#F2B33D" } },
  { rows: MOON, colors: { X: "#E8B83A" } },
  { rows: CAT, colors: { X: "#8C8A99" } },
  { rows: POPCORN, colors: { W: "#FFF3D6", R: "#E05A6B" } },
  { rows: CONTROLLER, colors: CONTROLLER_COLORS },
];

// Draws a picture where each letter can be a different color.
//   colors - which color each letter is, like { H: "#6B3A22" }. Letters not listed are see-through.
function drawSprite(rows, colors, x, y, size) {
  rows.forEach((row, rowNumber) => {
    [...row].forEach((letter, columnNumber) => {
      if (!colors[letter]) return;
      ctx.fillStyle = colors[letter];
      ctx.fillRect(x + columnNumber * size, y + rowNumber * size, size, size);
    });
  });
}

// Draws one of you. who: "jacob" or "tayler". legs: LEGS_STAND, LEGS_STEP_1, or LEGS_STEP_2.
// At size 2, a person is 24 wide and 32 tall.
function drawPerson(who, legs, x, y, size) {
  const top = who === "jacob" ? JACOB_TOP : TAYLER_TOP;
  const colors = who === "jacob" ? JACOB_COLORS : TAYLER_COLORS;
  drawSprite([...top, ...legs], colors, x, y, size);
}

// Keeps a number between a smallest and a biggest value.
function keepBetween(number, smallest, biggest) {
  return Math.max(smallest, Math.min(biggest, number));
}

// Best scores are saved in the browser, so his computer keeps his and yours keeps yours.
function loadNumber(key) {
  try {
    const saved = localStorage.getItem(key);
    return saved === null ? null : Number(saved);
  } catch (problem) { return null; }
}
function saveNumber(key, number) {
  try { localStorage.setItem(key, String(number)); } catch (problem) {}
}

// Every game in the launcher.
//   label     - the name on its tile
//   title     - the name in the window's title bar
//   intro     - how to play
//   bestText  - how to show a best score, like "12 hearts"
//   lowerIsBetter - true if a SMALLER score is better (like fewer moves)
//   setup, step, action - the game's own code (below)
const GAMES = {
  run: {
    label: "Run", title: `Run to ${YOUR_NAME}`, picture: drawRunIcon,
    intro: "Click or press Space to jump!", bestText: n => `${n} miles`,
    setup: setupRun, step: stepRun, action: jump,
  },
  catch: {
    label: "Catch", title: "Catch the hearts!", picture: drawGameIcon,
    intro: `Move with your mouse. Drop ${CATCH_LIVES} and it's over!`, bestText: n => `${n} hearts`,
    setup: setupCatch, step: stepCatch,
  },
  fly: {
    label: "Fly", title: "Fly together", picture: drawPlaneIcon,
    intro: "Click or press Space to flap!", bestText: n => `${n} clouds`,
    setup: setupFly, step: stepFly, action: flap,
  },
  match: {
    label: "Match", title: "Memory match", picture: drawCardsIcon,
    intro: "Flip the cards to find the pairs.", bestText: n => `${n} moves`, lowerIsBetter: true,
    setup: setupMatch, step: stepMatch,
  },
};

// The game launcher: a square tile for each game, with its best score.
// Tiles go left to right, then wrap onto a new row, so there's room to add more games.
const TILE_SIZE = 76;
const TILE_GAP = 8;

function drawGamesFolder(area) {
  const middle = (area.left + area.right) / 2;
  write("Pick a game!", middle, area.top + 20, FONTS.body, COLORS.text);

  // How many tiles fit across, and centering the whole row.
  const count = Object.keys(GAMES).length;
  const perRow = Math.max(1, Math.min(count, Math.floor((area.right - area.left - 6 + TILE_GAP) / (TILE_SIZE + TILE_GAP))));
  const rowWidth = perRow * TILE_SIZE + (perRow - 1) * TILE_GAP;
  const firstLeft = middle - rowWidth / 2;

  // If there are more rows than fit, the mouse wheel scrolls through them.
  // "list" is the part of the window the tiles show in (under "Pick a game!").
  const list = { left: area.left, top: area.top + 36, right: area.right, bottom: area.bottom - 4 };
  const rows = Math.ceil(count / perRow);
  const contentHeight = rows * (TILE_SIZE + TILE_GAP);
  state.launcherMaxScroll = Math.max(0, contentHeight - (list.bottom - list.top));
  state.launcherScroll = keepBetween(state.launcherScroll || 0, 0, state.launcherMaxScroll);

  // Only show tiles inside the list area (ones scrolled out of view get trimmed off).
  ctx.save();
  ctx.beginPath();
  ctx.rect(list.left, list.top, list.right - list.left, list.bottom - list.top);
  ctx.clip();

  Object.entries(GAMES).forEach(([key, game], number) => {
    const left = firstLeft + (number % perRow) * (TILE_SIZE + TILE_GAP);
    const top = list.top + 4 + Math.floor(number / perRow) * (TILE_SIZE + TILE_GAP) - state.launcherScroll;
    // Skip tiles that are completely scrolled out of view (so they can't be clicked).
    if (top + TILE_SIZE < list.top || top > list.bottom) return;
    const tileMiddle = left + TILE_SIZE / 2;
    const box = { left, top, right: left + TILE_SIZE, bottom: top + TILE_SIZE,
                  onClick: () => openWindow(`game:${key}`), id: `tile:${key}` };
    hitBoxes.push(box);

    // The tile, which turns pink while the mouse is on it.
    steppedBox(box.left, box.top, box.right, box.bottom, 4,
               state.hoverId === box.id ? COLORS.titleBar : COLORS.white, COLORS.text, 2);
    game.picture(tileMiddle, top + 26);
    write(game.label, tileMiddle, top + 52, FONTS.menu, COLORS.text);

    // The best score, small, along the bottom of the tile.
    const best = loadNumber(`best:${key}`);
    write(best === null ? "best: -" : game.bestText(best), tileMiddle, top + 66, FONTS.tag, COLORS.text);
  });
  ctx.restore();

  // A little pink scrollbar on the right, only when there's more to scroll to.
  if (state.launcherMaxScroll > 0) {
    const trackHeight = list.bottom - list.top;
    const thumbHeight = Math.max(20, trackHeight * trackHeight / contentHeight);
    const thumbTop = list.top + (trackHeight - thumbHeight) * state.launcherScroll / state.launcherMaxScroll;
    ctx.fillStyle = COLORS.iconHover;
    ctx.fillRect(list.right - 8, list.top, 6, trackHeight);
    ctx.fillStyle = COLORS.acceptFill;
    ctx.fillRect(list.right - 8, thumbTop, 6, thumbHeight);
  }
}

// The mouse wheel scrolls the Arcade when it has more games than fit.
canvas.addEventListener("wheel", event => {
  if (state.window !== "games" || !state.launcherMaxScroll) return;
  event.preventDefault();   // scroll the Arcade, not the web page
  state.launcherScroll = keepBetween((state.launcherScroll || 0) + event.deltaY * 0.5, 0, state.launcherMaxScroll);
}, { passive: false });

// Starts (or restarts) the game in the open window.
function startGame() {
  playSound("click");
  const game = state.game;
  Object.assign(game, { playing: true, paused: false, over: false, lastTime: null, result: null });
  GAMES[game.key].setup(game, gameArea());
}

// Clicking in the window (or pressing Space) jumps or flaps, in the games that have that.
function gameAction() {
  const game = state.game;
  if (game && game.playing && GAMES[game.key].action) GAMES[game.key].action(game);
}

window.addEventListener("keydown", event => {
  const game = state.game;
  if (!game || !game.playing) return;

  // Esc pauses or unpauses.
  if (event.code === "Escape") {
    togglePause();
    return;
  }
  if (event.code !== "Space" && event.code !== "ArrowUp") return;
  event.preventDefault();   // stop Space from scrolling the page
  if (!game.paused) gameAction();
});

// Pauses or unpauses the game that's playing.
function togglePause() {
  const game = state.game;
  if (!game || !game.playing) return;
  playSound("click");
  game.paused = !game.paused;
  // Forget the last frame's time, so the game doesn't jump ahead when it unpauses.
  game.lastTime = null;
}

// Ends a game: saves a new best score if he beat it, and shows the result.
function endGame(game, title, line, score) {
  game.playing = false;
  game.over = true;
  const info = GAMES[game.key];
  const old = loadNumber(`best:${game.key}`);
  const beatIt = old === null || (info.lowerIsBetter ? score < old : score > old);
  if (beatIt) saveNumber(`best:${game.key}`, score);
  game.result = { title, line, best: beatIt ? score : old, newBest: beatIt && old !== null };
}

// The pause screen: the game fades behind a little "Paused" box with a Resume button.
function drawPauseScreen(area) {
  const middle = (area.left + area.right) / 2, centerY = (area.top + area.bottom) / 2;

  // A see-through cover, which also blocks clicks from reaching the game underneath.
  ctx.globalAlpha = 0.6;
  ctx.fillStyle = COLORS.cream;
  ctx.fillRect(area.left, area.top, area.right - area.left, area.bottom - area.top);
  ctx.globalAlpha = 1;
  hitBoxes.push({ ...area, onClick: () => {}, blocker: true });

  steppedBox(middle - 90, centerY - 50, middle + 90, centerY + 50, 4, COLORS.cream, COLORS.text, 2);
  write("Paused", middle, centerY - 26, FONTS.celebrationSubtitle, COLORS.text);
  write("Press Esc to keep playing", middle, centerY - 2, FONTS.tag, COLORS.text);
  drawButton(middle, centerY + 28, 110, 28, "Resume", COLORS.acceptFill, COLORS.acceptText, togglePause);
}

// A game's window: the game itself while playing, or its start/end screen.
function drawGameWindow(time) {
  const game = state.game, info = GAMES[game.key], area = gameArea();
  const middle = (area.left + area.right) / 2;

  // A blue sky, trimmed to the inside of the window.
  ctx.save();
  ctx.beginPath();
  ctx.rect(area.left, area.top, area.right - area.left, area.bottom - area.top);
  ctx.clip();
  ctx.fillStyle = COLORS.screen;
  ctx.fillRect(area.left, area.top, area.right - area.left, area.bottom - area.top);

  if (game.playing) {
    // How much time passed since the last frame, in seconds. While paused, it's 0, so
    // the game still gets drawn but nothing moves.
    // (Math.min stops a huge jump if the browser tab was hidden for a while.)
    let seconds = game.lastTime === null ? 0 : Math.min(0.05, (time - game.lastTime) / 1000);
    game.lastTime = time;
    if (game.paused) seconds = 0;
    info.step(game, area, seconds);
    ctx.restore();

    if (game.paused) {
      drawPauseScreen(area);
    } else {
      // Top left, just under the score.
      write("Esc = pause", area.left + 8, area.top + 26, FONTS.tag, COLORS.text, "left");
    }
    return;
  }

  // The start and end screens: you two with a heart in between.
  drawPerson("jacob", LEGS_STAND, middle - 40, area.top + 14, 2);
  drawPixels(HEART, middle - 7, area.top + 24, 2, COLORS.heart);
  drawPerson("tayler", LEGS_STAND, middle + 16, area.top + 14, 2);

  const best = loadNumber(`best:${game.key}`);
  if (game.over) {
    write(game.result.title, middle, area.top + 76, FONTS.celebrationSubtitle, COLORS.text);
    write(game.result.line, middle, area.top + 106, FONTS.note, COLORS.text);
    const bestLine = game.result.newBest ? "New best score!" : `Best: ${info.bestText(game.result.best)}`;
    write(bestLine, middle, area.top + 130, FONTS.small, COLORS.text);
  } else {
    write(info.title, middle, area.top + 76, FONTS.celebrationSubtitle, COLORS.text);
    write(info.intro, middle, area.top + 106, FONTS.note, COLORS.text);
    if (best !== null) write(`Best: ${info.bestText(best)}`, middle, area.top + 130, FONTS.small, COLORS.text);
  }
  ctx.restore();
  drawButton(middle, area.top + 168, 140, 32, game.over ? "Play again" : "Play",
             COLORS.acceptFill, COLORS.acceptText, startGame);
}


// ---------- Run to you: jump over suitcases and clocks until the miles hit 0 ----------

const RUN_FINISH = 14000;   // how far he has to run (in pixels) to reach you

function setupRun(game) {
  Object.assign(game, { height: 0, upSpeed: 0, obstacles: [], distance: 0, speed: 170, gap: 260 });
}

function jump(game) {
  if (game.height === 0) {
    game.upSpeed = 390;
    playSound("jump");
  }
}

function stepRun(game, area, seconds) {
  const ground = area.bottom - 14;

  // He speeds up little by little.
  game.speed += 6 * seconds;
  game.distance += game.speed * seconds;

  // Jumping: gravity slows him going up, then pulls him back down to the ground.
  game.upSpeed -= 1150 * seconds;
  game.height = Math.max(0, game.height + game.upSpeed * seconds);
  if (game.height === 0 && game.upSpeed < 0) game.upSpeed = 0;

  // New obstacles come in from the right (but not right at the end, when you're there).
  const last = game.obstacles[game.obstacles.length - 1];
  if ((!last || last.x < area.right - game.gap) && game.distance < RUN_FINISH - 700) {
    game.obstacles.push({ x: area.right + 10, kind: Math.random() < 0.5 ? "suitcase" : "clock" });
    // The faster he runs, the more space between obstacles, so there's always time to land.
    game.gap = between(200, 340, Math.random()) * game.speed / 170;
  }
  game.obstacles.forEach(obstacle => { obstacle.x -= game.speed * seconds; });
  game.obstacles = game.obstacles.filter(obstacle => obstacle.x > area.left - 40);

  // The ground, with little dashes sliding by so it looks like he's moving.
  const width = area.right - area.left;
  ctx.fillStyle = COLORS.text;
  ctx.fillRect(area.left, ground, width, 2);
  for (let i = 0; i < 12; i++) {
    const x = area.left + (((i * 31 - game.distance) % width) + width) % width;
    ctx.fillRect(x, ground + 6, 6, 2);
  }

  // Him, running (legs swap as he goes), or mid-jump.
  const playerX = area.left + 40;
  const playerY = ground - 32 - game.height;
  let legs = Math.floor(game.distance / 22) % 2 ? LEGS_STEP_1 : LEGS_STAND;
  if (game.height > 0) legs = LEGS_STEP_2;
  drawPerson("jacob", legs, playerX, playerY, 2);

  // You, waiting for him at the end!
  const almostThere = game.distance - (RUN_FINISH - 300);
  if (almostThere > 0) drawPerson("tayler", LEGS_STAND, playerX + 30 + (300 - almostThere), ground - 32, 2);

  // The obstacles, and did he bump into one?
  const player = { left: playerX + 5, right: playerX + 19, top: playerY + 4, bottom: playerY + 32 };
  let crashed = false;
  game.obstacles.forEach(obstacle => {
    const isSuitcase = obstacle.kind === "suitcase";
    const obstacleWidth = isSuitcase ? 30 : 24;
    drawSprite(isSuitcase ? SUITCASE : CLOCK, OBSTACLE_COLORS, obstacle.x, ground - 24, 3);
    if (player.right > obstacle.x + 3 && player.left < obstacle.x + obstacleWidth - 3 && player.bottom > ground - 21) {
      crashed = true;
    }
  });

  const miles = Math.max(0, Math.round(RUN_MILES * (1 - game.distance / RUN_FINISH)));
  write(`${miles} miles to ${YOUR_NAME}`, area.left + 8, area.top + 12, FONTS.small, COLORS.text, "left");

  if (game.distance >= RUN_FINISH) {
    playSound("win");
    endGame(game, `You made it to ${YOUR_NAME}!`, "Worth every single mile.", RUN_MILES);
  } else if (crashed) {
    playSound("crash");
    // Then the game over sound, once the crash has mostly finished.
    setTimeout(() => playSound("gameover"), 350);
    endGame(game, "Ouch!", `Only ${miles} miles to go. Try again?`, RUN_MILES - miles);
  }
}


// ---------- Catch the hearts: you drop hearts from the top, he catches them ----------

function setupCatch(game, area) {
  Object.assign(game, {
    score: 0, lives: CATCH_LIVES, hearts: [], nextHeart: 0.6,
    x: (area.left + area.right) / 2 - 12, clock: 0, walking: 0,
  });
}

function stepCatch(game, area, seconds) {
  game.clock += seconds;
  const middle = (area.left + area.right) / 2;

  // You walk back and forth along the top.
  const taylerX = middle - 12 + Math.sin(game.clock * 1.3) * (area.right - area.left - 70) / 2;
  drawPerson("tayler", Math.floor(game.clock * 6) % 2 ? LEGS_STEP_1 : LEGS_STAND, taylerX, area.top + 22, 2);

  // You drop a heart every so often. The more he catches, the faster they come.
  game.nextHeart -= seconds;
  if (game.nextHeart <= 0) {
    game.hearts.push({ x: taylerX + 5, y: area.top + 50, speed: between(80, 120, Math.random()) + game.score * 3 });
    game.nextHeart = Math.max(0.35, between(0.7, 1.1, Math.random()) - game.score * 0.02);
  }

  // He follows the mouse along the bottom (his legs move while he's walking).
  // (While paused, he stays put.)
  const target = game.paused ? game.x : keepBetween(state.mouse.x - 12, area.left + 2, area.right - 26);
  if (Math.abs(target - game.x) > 1) game.walking += seconds;
  game.x = target;
  const playerY = area.bottom - 34;

  // Move every heart down: caught if it reaches him, a lost life if it hits the ground.
  game.hearts.forEach(heart => {
    heart.y += heart.speed * seconds;
    const heartMiddle = heart.x + 7, heartBottom = heart.y + 12;
    if (heartBottom >= playerY && heartBottom <= playerY + 14 && heartMiddle >= game.x - 2 && heartMiddle <= game.x + 26) {
      heart.gone = true;
      game.score += 1;
      playSound("coin");
    } else if (heart.y > area.bottom) {
      heart.gone = true;
      game.lives -= 1;
      playSound("buzzer", BUZZER_VOLUME * 0.6);
    }
  });
  game.hearts = game.hearts.filter(heart => !heart.gone);

  game.hearts.forEach(heart => drawPixels(HEART, heart.x, heart.y, 2, COLORS.heart));
  drawPerson("jacob", Math.floor(game.walking * 8) % 2 ? LEGS_STEP_1 : LEGS_STAND, game.x, playerY, 2);

  // The score, and his lives as little hearts (gray once they're lost).
  write(`Hearts: ${game.score}`, area.left + 8, area.top + 12, FONTS.small, COLORS.text, "left");
  for (let i = 0; i < CATCH_LIVES; i++) {
    drawPixels(HEART, area.right - 22 - i * 18, area.top + 6, 2, i < game.lives ? COLORS.heart : COLORS.lostLife);
  }

  if (game.lives <= 0) {
    playSound("gameover");
    const line = game.score >= 20 ? "Wow. You must really love me." : "So close! Try again?";
    endGame(game, `You caught ${game.score} hearts!`, line, game.score);
  }
}


// ---------- Fly together: flap your plane through the gaps ----------

const FLY_GAP = 86;        // how tall the gaps are
const WALL_WIDTH = 34;

function setupFly(game, area) {
  Object.assign(game, { y: (area.top + area.bottom) / 2 - 11, downSpeed: -150, walls: [], nextWall: 0.6, score: 0 });
}

function flap(game) {
  game.downSpeed = -270;
  playSound("flap", 0.7);
}

function stepFly(game, area, seconds) {
  // Gravity pulls the plane down; flapping pushes it up.
  game.downSpeed += 820 * seconds;
  game.y += game.downSpeed * seconds;

  // A new cloud-and-building pair every so often, with the gap at a random height.
  game.nextWall -= seconds;
  if (game.nextWall <= 0) {
    game.walls.push({ x: area.right + 4, gapMiddle: between(area.top + 60, area.bottom - 60, Math.random()), passed: false });
    game.nextWall = 1.55;
  }
  game.walls.forEach(wall => { wall.x -= 115 * seconds; });
  game.walls = game.walls.filter(wall => wall.x > area.left - WALL_WIDTH - 4);

  const planeX = area.left + 50;
  game.walls.forEach(wall => {
    const gapTop = wall.gapMiddle - FLY_GAP / 2, gapBottom = wall.gapMiddle + FLY_GAP / 2;
    ctx.strokeStyle = COLORS.text;
    ctx.lineWidth = 2;

    // A cloud hanging from the top.
    ctx.fillStyle = COLORS.white;
    ctx.beginPath();
    ctx.roundRect(wall.x, area.top - 10, WALL_WIDTH, gapTop - area.top + 10, 10);
    ctx.fill();
    ctx.stroke();

    // A building from the bottom, with yellow windows.
    ctx.fillStyle = "#C9B6F2";
    ctx.beginPath();
    ctx.roundRect(wall.x, gapBottom, WALL_WIDTH, area.bottom - gapBottom + 10, 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#FFE08A";
    for (let windowY = gapBottom + 8; windowY < area.bottom - 6; windowY += 14) {
      ctx.fillRect(wall.x + 7, windowY, 6, 6);
      ctx.fillRect(wall.x + 21, windowY, 6, 6);
    }

    // A point for every pair you fly past.
    if (!wall.passed && wall.x + WALL_WIDTH < planeX) {
      wall.passed = true;
      game.score += 1;
    }
  });

  drawSprite(PLANE, PLANE_COLORS, planeX, game.y, 2);
  write(`Clouds: ${game.score}`, area.left + 8, area.top + 12, FONTS.small, COLORS.text, "left");

  // Did the plane hit a cloud, a building, or fly off the screen?
  const plane = { left: planeX + 3, right: planeX + 33, top: game.y + 3, bottom: game.y + 21 };
  const hitWall = game.walls.some(wall =>
    plane.right > wall.x && plane.left < wall.x + WALL_WIDTH &&
    (plane.top < wall.gapMiddle - FLY_GAP / 2 || plane.bottom > wall.gapMiddle + FLY_GAP / 2));
  if (hitWall || plane.top < area.top - 20 || plane.bottom > area.bottom) {
    playSound("crash");
    // Then the game over sound, once the crash has mostly finished.
    setTimeout(() => playSound("gameover"), 350);
    const line = game.score >= 10 ? "Smooth flying, captain." : "Bumpy flight! Try again?";
    endGame(game, `You flew past ${game.score} clouds!`, line, game.score);
  }
}


// ---------- Memory match: flip cards to find the pairs ----------

function setupMatch(game) {
  // Two of each picture, shuffled. (Swap each card with a random one before it.)
  const pictures = [0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5];
  for (let i = pictures.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pictures[i], pictures[j]] = [pictures[j], pictures[i]];
  }
  Object.assign(game, {
    cards: pictures.map(picture => ({ picture, up: false, matched: false })),
    flipped: [], moves: 0, waiting: false,
  });
}

function stepMatch(game, area) {
  const cardWidth = 54, cardHeight = 46, gap = 7;
  const gridLeft = (area.left + area.right) / 2 - (4 * cardWidth + 3 * gap) / 2;
  const gridTop = area.top + 36;   // leaves room for the score and "Esc = pause"

  write(`Moves: ${game.moves}`, area.left + 8, area.top + 12, FONTS.small, COLORS.text, "left");

  game.cards.forEach((card, number) => {
    const x = gridLeft + (number % 4) * (cardWidth + gap);
    const y = gridTop + Math.floor(number / 4) * (cardHeight + gap);
    if (card.up) {
      // Face up: the picture, in the middle of a cream card.
      steppedBox(x, y, x + cardWidth, y + cardHeight, 3, COLORS.cream, COLORS.text, 2);
      const picture = CARD_PICTURES[card.picture];
      const pictureWidth = picture.rows[0].length * 4, pictureHeight = picture.rows.length * 4;
      drawSprite(picture.rows, picture.colors, x + (cardWidth - pictureWidth) / 2, y + (cardHeight - pictureHeight) / 2, 4);
    } else {
      // Face down: pink, with a heart. Clicking it flips it.
      steppedBox(x, y, x + cardWidth, y + cardHeight, 3, COLORS.acceptFill, COLORS.text, 2);
      drawPixels(HEART, x + cardWidth / 2 - 7, y + cardHeight / 2 - 6, 2, COLORS.titleBar);
      hitBoxes.push({ left: x, top: y, right: x + cardWidth, bottom: y + cardHeight, onClick: () => flipCard(game, number) });
    }
  });
}

function flipCard(game, number) {
  const card = game.cards[number];
  if (game.waiting || card.up) return;
  playSound("flip");
  card.up = true;
  game.flipped.push(card);
  if (game.flipped.length < 2) return;

  // Two cards are up: do they match?
  game.moves += 1;
  const [first, second] = game.flipped;
  game.flipped = [];
  if (first.picture === second.picture) {
    first.matched = second.matched = true;
    playSound("coin", 0.6);
    if (game.cards.every(c => c.matched)) {
      setTimeout(() => {
        if (state.game !== game) return;   // he already closed the window
        playSound("win");
        endGame(game, "You found them all!", `It took you ${game.moves} moves.`, game.moves);
      }, 500);
    }
  } else {
    // Not a match: show them for a moment, then flip them back over.
    game.waiting = true;
    setTimeout(() => {
      first.up = second.up = false;
      game.waiting = false;
    }, 800);
  }
}

function drawSparkles() {
  SPARKLE_SPOTS.forEach(([x, y, size], i) => {
    drawPixels(SPARKLE, x, y, size, state.sparkleDim[i] ? COLORS.sparkleDim : COLORS.sparkle);
  });
}

// The start screen: a pink MWAHHH button, with "click MWAHHH to start" under it.
// (Nothing else shows yet, so "Psst, Jacob..." gets to type itself out.)
function drawStartMessage(time) {
  drawButton(CENTER_X, 200, 160, 44, "MWAHHH", COLORS.acceptFill, COLORS.acceptText, start);

  // The words gently bob up and down.
  // sin() goes smoothly back and forth between -1 and 1.
  const bob = Math.sin(time / 300) * 3;
  write("click MWAHHH to start", CENTER_X, 255 + bob, FONTS.body, COLORS.text);
}

function drawEnvelope() {
  const envelope = state.envelope;
  const lift = envelope.lift;
  const left = ENVELOPE.left, right = ENVELOPE.right, cx = ENVELOPE.centerX;
  const top = ENVELOPE.top - lift, bottom = ENVELOPE.bottom - lift;

  ctx.globalAlpha = envelope.alpha;

  // Soft blue shadow underneath (it doesn't lift).
  ctx.fillStyle = COLORS.envelopeShadow;
  ctx.beginPath();
  ctx.ellipse(cx, ENVELOPE.bottom + 2, 44, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // The flap: a triangle. Its point moves up as it opens (open goes from 0 to 1).
  function drawFlap() {
    const pointY = top + 26 - 50 * envelope.open;
    ctx.beginPath();
    ctx.moveTo(left + 2, top + 2);
    ctx.lineTo(cx, pointY);
    ctx.lineTo(right - 2, top + 2);
    ctx.closePath();
    ctx.fillStyle = COLORS.envelopePaper;
    ctx.fill();
    ctx.strokeStyle = COLORS.envelopeLine;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Once it's opening, the flap goes BEHIND the envelope, with the letter in between.
  if (envelope.opening) {
    drawFlap();
    drawPaper();
  }

  // The body.
  ctx.fillStyle = COLORS.envelopePaper;
  ctx.fillRect(left, top, right - left, bottom - top);
  ctx.strokeStyle = COLORS.text;
  ctx.lineWidth = 3;
  ctx.strokeRect(left, top, right - left, bottom - top);

  if (!envelope.opening) drawFlap();

  // Two pink lines from the bottom corners.
  ctx.strokeStyle = COLORS.envelopeLine;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(left + 2, bottom - 2); ctx.lineTo(cx - 10, top + 27);
  ctx.moveTo(right - 2, bottom - 2); ctx.lineTo(cx + 10, top + 27);
  ctx.stroke();

  // The heart seal.
  if (envelope.seal) drawPixels(HEART, cx - 10, top + 18, 3, COLORS.heart);

  ctx.globalAlpha = 1;

  // Clickable while it's waiting to be opened.
  if (envelope.clickable) {
    hitBoxes.push({ left: left - 8, top: ENVELOPE.top - 8, right: right + 8, bottom: ENVELOPE.bottom + 8,
                    onClick: openEnvelope, isEnvelope: true });
  }
}

// The letter's paper (and its flaps while it's unfolding).
function drawPaper() {
  const paper = state.paper;
  if (!paper) return;
  ctx.fillStyle = COLORS.letterPaper;
  ctx.fillRect(paper.left, paper.top, paper.right - paper.left, paper.bottom - paper.top);
  ctx.strokeStyle = COLORS.text;
  ctx.lineWidth = 2;
  ctx.strokeRect(paper.left, paper.top, paper.right - paper.left, paper.bottom - paper.top);

  if (state.flaps) {
    drawFlap(BOTTOM_FOLD, state.flaps.bottom, false);
    drawFlap(TOP_FOLD, state.flaps.top, true);
  }
}

// One flap of the letter, partway through swinging open.
// open: 0 = folded shut, 1 = flat open. upward: true for the top flap.
function drawFlap(hinge, open, upward) {
  const angle = Math.PI * open;
  // cos goes 1 -> 0 -> -1 as it swings, so the far edge moves toward you and past the hinge.
  const reach = THIRD * Math.cos(angle);
  const farEdge = upward ? hinge + reach : hinge - reach;
  // sin is biggest when the flap points right at you: it looks wider and a bit shadowy.
  const tilt = Math.sin(angle);
  const bulge = 14 * tilt;

  ctx.beginPath();
  ctx.moveTo(LETTER.left, hinge);
  ctx.lineTo(LETTER.right, hinge);
  ctx.lineTo(LETTER.right + bulge, farEdge);
  ctx.lineTo(LETTER.left - bulge, farEdge);
  ctx.closePath();
  ctx.fillStyle = blend(COLORS.letterPaper, COLORS.letterShade, tilt * 0.7);
  ctx.fill();
  ctx.strokeStyle = COLORS.text;
  ctx.lineWidth = 2;
  ctx.stroke();
}

// The writing on the letter, plus the buttons.
function drawLetter() {
  ctx.globalAlpha = state.letter.alpha;

  // The title, with a pink heart on each side, and a dotted line under it.
  const invite = state.invite;
  write(invite.title, CENTER_X, 118, FONTS.letterTitle, COLORS.text, "center", "top");
  drawPixels(HEART, 196, 128, 2, COLORS.heart);
  drawPixels(HEART, 558, 128, 2, COLORS.heart);

  ctx.strokeStyle = COLORS.envelopeLine;
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(254, 162); ctx.lineTo(514, 162);
  ctx.stroke();
  ctx.setLineDash([]);

  // The details. If one wraps onto more lines, the extra lines are indented a little.
  const textLeft = LETTER.left + 30;
  const textRight = LETTER.right - 30;
  const indent = 18;
  const lineHeight = 21;
  let y = 171;

  [["Plan:", invite.plan], ["What to bring:", invite.bring], ["When:", invite.when]].forEach(([label, value]) => {
    const lines = wrapDetail(label, value, textRight - textLeft, indent);
    lines.forEach((line, i) => {
      write(line, i === 0 ? textLeft : textLeft + indent, y + i * lineHeight,
            FONTS.letter, COLORS.text, "left", "top");
    });
    y += lines.length * lineHeight + 3;
  });

  // The buttons.
  drawButton(316, 316, 120, 36, "Accept", COLORS.acceptFill, COLORS.acceptText, accept);
  if (state.declines >= DECLINE_MESSAGES.length) {
    // Out of jokes: Decline has turned into another Accept!
    drawButton(452, 316, 120, 36, "Accept", COLORS.acceptFill, COLORS.acceptText, accept);
  } else {
    drawButton(452, 316, 120, 36, "Decline", COLORS.cream, COLORS.text, decline);
  }

  // The little underlined "Suggest a new time" link.
  write(SUGGEST_TEXT, CENTER_X, 346, FONTS.suggest, COLORS.text);
  const linkWidth = ctx.measureText(SUGGEST_TEXT).width;
  ctx.fillStyle = COLORS.text;
  ctx.fillRect(CENTER_X - linkWidth / 2, 353, linkWidth, 1);
  hitBoxes.push({ left: CENTER_X - linkWidth / 2, top: 338, right: CENTER_X + linkWidth / 2, bottom: 356,
                  onClick: suggest });

  ctx.globalAlpha = 1;
}

// Splits "Label: value" into lines: the first line uses the full width, the rest are indented.
function wrapDetail(label, value, maxWidth, indent) {
  ctx.font = FONTS.letter;
  const lines = [];
  let current = label;
  value.split("\n").forEach((part, partNumber) => {
    if (partNumber > 0) { lines.push(current); current = ""; }
    part.split(" ").forEach(word => {
      const attempt = current ? current + " " + word : word;
      const room = lines.length ? maxWidth - indent : maxWidth;
      if (ctx.measureText(attempt).width <= room || !current) current = attempt;
      else { lines.push(current); current = word; }
    });
  });
  lines.push(current);
  return lines;
}

// A little retro pop-up window, like an old computer error message.
function drawPopup() {
  const popup = state.popup;

  // Work out how tall the pop-up needs to be, so long messages don't squish into the OK button.
  const lines = wrapWords(popup.message, FONTS.body, 260);
  const lineHeight = 24;
  const height = 22 + 18 + lines.length * lineHeight + 48;   // title bar + gap + message + room for OK
  const left = 234, right = 534;
  const top = 220 - height / 2, bottom = 220 + height / 2;   // centered on the screen

  ctx.fillStyle = COLORS.text;                                   // shadow
  ctx.fillRect(left + 5, top + 5, right - left, bottom - top);
  ctx.fillStyle = COLORS.cream;                                  // box
  ctx.fillRect(left, top, right - left, bottom - top);
  ctx.fillStyle = COLORS.titleBar;                               // pink bar
  ctx.fillRect(left, top, right - left, 22);
  ctx.strokeStyle = COLORS.text;
  ctx.lineWidth = 3;
  ctx.strokeRect(left, top, right - left, bottom - top);
  ctx.strokeRect(left, top, right - left, 22);
  write(popup.title, left + 10, top + 11, FONTS.small, COLORS.text, "left");

  // The little X box.
  ctx.lineWidth = 2;
  ctx.strokeRect(right - 20, top + 4, 14, 14);
  ctx.beginPath();
  ctx.moveTo(right - 17, top + 7); ctx.lineTo(right - 9, top + 15);
  ctx.moveTo(right - 9, top + 7); ctx.lineTo(right - 17, top + 15);
  ctx.stroke();

  // The message, centered.
  const firstY = top + 22 + 18 + lineHeight / 2;
  lines.forEach((line, i) => write(line, CENTER_X, firstY + i * lineHeight, FONTS.body, COLORS.text));

  // Most pop-ups just have OK. "Are you sure?" pop-ups have Cancel and a yes button.
  if (popup.yes) {
    drawButton(CENTER_X - 50, bottom - 22, 84, 26, "Cancel", COLORS.cream, COLORS.text, closePopup, true);
    drawButton(CENTER_X + 50, bottom - 22, 84, 26, popup.yes.text, COLORS.acceptFill, COLORS.acceptText, popup.yes.onClick, true);
  } else {
    drawButton(CENTER_X, bottom - 22, 70, 26, "OK", COLORS.cream, COLORS.text, closePopup, true);
  }
}

function drawCelebration() {
  ctx.globalAlpha = state.celebration.alpha;
  write(CELEBRATION_TITLE, CENTER_X, 195, FONTS.title, COLORS.text);
  write(CELEBRATION_SUBTITLE, CENTER_X, 245, FONTS.celebrationSubtitle, COLORS.text);
  CELEBRATION_HEARTS.forEach(([x, y, size]) => drawPixels(HEART, x, y, size, COLORS.heart));
  ctx.globalAlpha = 1;

  // Once it's faded in, a button to go back to the desktop.
  if (state.celebration.alpha >= 1) {
    drawButton(CENTER_X, 312, 190, 32, "Back to desktop", COLORS.cream, COLORS.text, closeInvite);
  }
}

function drawConfetti() {
  state.confetti.forEach(piece => {
    // Only show it while it's inside the computer's blue screen.
    if (piece.x < 150 || piece.x > 618 || piece.y < 104) return;
    const halfWidth = (piece.size / 2) * Math.abs(Math.cos(piece.flutter)) + 0.5;
    const halfHeight = piece.size / 2;
    ctx.fillStyle = piece.color;
    ctx.fillRect(piece.x - halfWidth, piece.y - halfHeight, halfWidth * 2, halfHeight * 2);
  });
}


// ====================================================================================
// DRAWING EVERYTHING, OVER AND OVER
// ====================================================================================

function draw(time) {
  hitBoxes = [];
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.drawImage(background, 0, 0, WIDTH, HEIGHT);

  // Paint the screen blue all the way to the cream frame, covering the picture's
  // dark gray edge. (The desktop's wallpaper covers it instead.)
  if (state.mode !== "desktop") {
    ctx.fillStyle = COLORS.screen;
    ctx.beginPath();
    ctx.roundRect(SCREEN.left, SCREEN.top, SCREEN.right - SCREEN.left, SCREEN.bottom - SCREEN.top, SCREEN.corner);
    ctx.fill();
  }

  if (state.mode === "start") {
    // Just the MWAHHH button and its words, nothing else.
    drawStartMessage(time);
  } else if (state.mode === "desktop") {
    drawDesktop(time);
  } else {
    drawTitleBar();
    drawSparkles();
    write(state.title, CENTER_X, 170, FONTS.title, COLORS.text);
    write(state.subtitle, CENTER_X, 218, FONTS.body, COLORS.text);
    if (state.envelope) drawEnvelope();
    else drawPaper();
    if (state.letter) drawLetter();
    if (state.celebration) drawCelebration();
    drawConfetti();
  }

  // The computer's power button (next to the green light) shows the "Shut down" joke.
  hitBoxes.push({ left: 610, top: 390, right: 640, bottom: 412,
                  onClick: () => showPopup("SHUT DOWN", SHUT_DOWN_MESSAGE) });

  // Pop-ups go on top of everything.
  if (state.popup) drawPopup();

  // The screensaver goes on top of even the pop-ups.
  updateScreensaver(time);
  if (state.screensaver) {
    drawScreensaver(time);
    // Keep showing the little pixel arrow, so he can see where he's clicking.
    canvas.style.cursor = mouseIsIn(SCREEN) ? ARROW_CURSOR : "default";
  } else {
    updateMouse();
  }
  requestAnimationFrame(draw);
}

// Sparkles blink: every 0.4 seconds, each one has a 1 in 4 chance of being dim.
setInterval(() => {
  state.sparkleDim = state.sparkleDim.map(() => Math.random() < 0.25);
}, 400);


// ====================================================================================
// THE MOUSE
// ====================================================================================

// Turns a mouse position on the page into a position on our 768 x 512 drawing.
function toDrawing(event) {
  const box = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - box.left) / box.width) * WIDTH,
    y: ((event.clientY - box.top) / box.height) * HEIGHT,
  };
}

// Which clickable thing is the mouse over? (While a pop-up is open, only the pop-up counts.)
function boxUnderMouse() {
  const { x, y } = state.mouse;
  const boxes = hitBoxes.filter(box => (state.popup ? box.inPopup : true));
  return boxes.reverse().find(box => x >= box.left && x <= box.right && y >= box.top && y <= box.bottom);
}

// Pixel-art mouse cursors for the computer screen. O = outline, W = white, P = pink.
const ARROW_CURSOR_PIXELS = [
  "O.........",
  "OO........",
  "OWO.......",
  "OWWO......",
  "OWWWO.....",
  "OWWWWO....",
  "OWWWWWO...",
  "OWWWWWWO..",
  "OWWWWWWWO.",
  "OWWWWOOOOO",
  "OWWOWO....",
  "OWO.OWO...",
  "OO..OWO...",
  ".....OO...",
];
const HEART_CURSOR_PIXELS = [
  "..OOO.OOO..",
  ".OPPPOPPPO.",
  "OPWWPPPPPPO",
  "OPWPPPPPPPO",
  "OPPPPPPPPPO",
  ".OPPPPPPPO.",
  "..OPPPPPO..",
  "...OPPPO...",
  "....OPO....",
  ".....O.....",
];
const CURSOR_COLORS = { O: "#45284A", W: "#FFFFFF", P: "#F07A9C" };

// Turns pixel art into a cursor the browser can use.
//   size - how big each pixel is. hotX, hotY - the exact spot that "clicks".
function makeCursor(rows, size, hotX, hotY, fallback) {
  const picture = document.createElement("canvas");
  picture.width = rows[0].length * size;
  picture.height = rows.length * size;
  const pen = picture.getContext("2d");
  rows.forEach((row, rowNumber) => [...row].forEach((letter, columnNumber) => {
    if (!CURSOR_COLORS[letter]) return;
    pen.fillStyle = CURSOR_COLORS[letter];
    pen.fillRect(columnNumber * size, rowNumber * size, size, size);
  }));
  return `url(${picture.toDataURL()}) ${hotX} ${hotY}, ${fallback}`;
}
const ARROW_CURSOR = makeCursor(ARROW_CURSOR_PIXELS, 2, 0, 0, "default");
const HEART_CURSOR = makeCursor(HEART_CURSOR_PIXELS, 2, 11, 6, "pointer");

// Picks the cursor (pixel ones on the computer screen), and lifts the envelope when hovered.
function updateMouse() {
  const box = boxUnderMouse();
  const clickable = box && !box.blocker;
  if (mouseIsIn(SCREEN)) canvas.style.cursor = clickable ? HEART_CURSOR : ARROW_CURSOR;
  else canvas.style.cursor = clickable ? "pointer" : "default";
  // Remember which icon is on top under the mouse, so only that one lights up next time.
  state.hoverId = box ? box.id : null;
  if (state.mode === "invite" && state.envelope && state.envelope.clickable) {
    state.envelope.lift = box && box.isEnvelope ? 4 : 0;
  }
}

// ====================================================================================
// THE SCREENSAVER
// ====================================================================================

// If he doesn't touch anything on the desktop for this many seconds, the screensaver starts.
// (Add ?idle=5 to the end of the link to make it 5 seconds, for testing.)
const SCREENSAVER_SECONDS = PREVIEW.has("idle") ? Number(PREVIEW.get("idle")) : 60;

// How big the bouncing heart's pixels are. Bigger number = bigger heart.
const SCREENSAVER_HEART_SIZE = 12;

// Each time it bounces off an edge, it switches to the next color.
const SCREENSAVER_COLORS = ["#F07A9C", "#7FB8F0", "#FFE08A", "#C9B6F2", "#8EE3B5", "#F8BFCB"];

let lastActivity = performance.now();

// Moving the mouse, scrolling, or typing counts as "he's here" (so the screensaver waits),
// but once it's on, only a CLICK makes it go away.
function stillHere() {
  lastActivity = performance.now();
}
window.addEventListener("keydown", stillHere);
canvas.addEventListener("wheel", stillHere);

// Clicking turns the screensaver off. Returns true if it did (so that click doesn't
// also click whatever was underneath).
function wakeUp() {
  stillHere();
  if (state.screensaver) {
    playSound("click");
    state.screensaver = null;
    return true;
  }
  return false;
}

// Starts the screensaver once he's been away long enough, but only on the desktop, and
// never in the middle of a game.
function updateScreensaver(time) {
  if (state.screensaver) return;
  const playing = state.game && state.game.playing;
  if (state.mode !== "desktop" || playing) {
    lastActivity = time;
    return;
  }
  if (time - lastActivity < SCREENSAVER_SECONDS * 1000) return;
  startScreensaver();
}

// Starts the bouncing heart somewhere random, heading diagonally.
function startScreensaver() {
  state.screensaver = {
    x: between(SCREEN.left + 20, SCREEN.right - 110, Math.random()),
    y: between(SCREEN.top + 20, SCREEN.bottom - 90, Math.random()),
    speedX: 70, speedY: 55, color: 0, lastTime: performance.now(),
  };
}

// "Go to sleep" in the Start menu: the screensaver right away.
function goToSleep() {
  playSound("click");
  state.startMenu = false;
  startScreensaver();
}

// Black screen, with a big heart bouncing around like an old DVD player.
function drawScreensaver(time) {
  const saver = state.screensaver;
  const seconds = Math.min(0.05, (time - saver.lastTime) / 1000);
  saver.lastTime = time;

  // How big the heart is (the HEART picture is 7 pixels wide and 6 tall).
  const width = 7 * SCREENSAVER_HEART_SIZE;
  const height = 6 * SCREENSAVER_HEART_SIZE;

  // Move, and bounce off the edges (switching color each time).
  saver.x += saver.speedX * seconds;
  saver.y += saver.speedY * seconds;
  if (saver.x < SCREEN.left + 4 || saver.x + width > SCREEN.right - 4) {
    saver.speedX = -saver.speedX;
    saver.x = keepBetween(saver.x, SCREEN.left + 4, SCREEN.right - 4 - width);
    saver.color = (saver.color + 1) % SCREENSAVER_COLORS.length;
  }
  if (saver.y < SCREEN.top + 4 || saver.y + height > SCREEN.bottom - 4) {
    saver.speedY = -saver.speedY;
    saver.y = keepBetween(saver.y, SCREEN.top + 4, SCREEN.bottom - 4 - height);
    saver.color = (saver.color + 1) % SCREENSAVER_COLORS.length;
  }

  ctx.fillStyle = "#15111C";
  ctx.beginPath();
  ctx.roundRect(SCREEN.left, SCREEN.top, SCREEN.right - SCREEN.left, SCREEN.bottom - SCREEN.top, SCREEN.corner);
  ctx.fill();

  // Math.round keeps the heart on whole pixels, so no thin lines show between its squares.
  drawPixels(HEART, Math.round(saver.x), Math.round(saver.y), SCREENSAVER_HEART_SIZE, SCREENSAVER_COLORS[saver.color]);
}

canvas.addEventListener("pointermove", event => {
  state.mouse = toDrawing(event);
  stillHere();
});

canvas.addEventListener("pointerdown", event => {
  state.mouse = toDrawing(event);
  // If this click woke up the screensaver, that's all it does.
  if (wakeUp()) return;
  const box = boxUnderMouse();
  // Clicking anything except the Start button closes the Start menu.
  if (!box || !box.keepsMenu) state.startMenu = false;
  // The power menu closes on any click except the power button itself.
  if (!box || box.id !== "power") state.powerMenu = false;
  if (box) box.onClick();
});

// Opens or closes the Start menu.
function toggleStartMenu() {
  playSound("click");
  state.startMenu = !state.startMenu;
}

// Opens a window on the desktop: "notes", "memories", "games" (the launcher),
// or a game, like "game:run".
function openWindow(name) {
  playSound("click");
  state.window = name;
  state.game = name.startsWith("game:") ? { key: name.slice(5), playing: false, over: false } : null;
  // Start fresh: the letter list (not an open letter), and an empty password box.
  state.openWhen = null;
  state.noteId = null;
  state.inboxMessage = null;
  if (state.guestStatus === "sent" || state.guestStatus === "error") state.guestStatus = "";
  state.memoriesFolder = null;
  state.memoryItem = null;
  state.password = "";
  state.passwordWrong = false;
}

// Closing a game goes back to the launcher. Closing anything else goes back to the desktop.
function closeWindow() {
  playSound("click");
  state.window = state.game ? "games" : null;
  state.game = null;
  // A love note he just read moves off the desktop (into Memories) once it's closed.
  state.noteId = null;
  // Fully closed: the next window opens at normal size again.
  if (!state.window) state.maximized = false;
}

// Shows a pop-up on the desktop.
function showPopup(title, message) {
  playSound("click");
  state.popup = { title, message };
}

// He clicked MWAHHH: go to the desktop.
// (Browsers don't allow sounds until you click something, so this click turns sound on.)
function start() {
  audio.resume();
  playSound("click");
  state.mode = "desktop";
}

// Clears away everything from an invite, and stops anything still animating.
function resetInvite() {
  currentRun += 1;
  Object.assign(state, {
    title: "", subtitle: "", envelope: null, paper: null, flaps: null, letter: null,
    declines: 0, popup: null, celebration: null, confetti: [],
  });
}

// He clicked an icon on the desktop: play that invite.
function openInvite(invite) {
  playSound("click");
  remember(`opened:${invite.id}`);
  resetInvite();
  state.invite = invite;
  state.mode = "invite";
  startShow();
}

// He clicked the X (or "Back to desktop"): close the invite.
function closeInvite() {
  playSound("click");
  resetInvite();
  state.mode = "desktop";
}


// ====================================================================================
// WHAT HAPPENS, IN ORDER
// ====================================================================================

// Types words into state.title or state.subtitle, one letter at a time.
async function typeText(where, words, delay, volume) {
  for (let count = 1; count <= words.length; count++) {
    await wait(delay);
    state[where] = words.slice(0, count);
    if (words[count - 1] !== " ") playKeySound(volume);
  }
}

// 1. Type the greeting, then fade in the envelope.
async function startShow() {
  await wait(300);
  await typeText("title", `Psst, ${RECIPIENT_NAME}...`, 120, 1);
  await typeText("subtitle", GREETING_SUBTITLE, 55, FAST_TYPING_VOLUME);
  await wait(800);

  state.envelope = { alpha: 0, lift: 0, open: 0, seal: true, opening: false, clickable: true };
  playSound("incoming");
  animate(600, amount => { state.envelope.alpha = amount; });
}

// 2. He clicked the envelope: open it, slide the letter out, and unfold it.
async function openEnvelope() {
  const envelope = state.envelope;
  envelope.clickable = false;
  playSound("click");
  state.title = "";
  state.subtitle = "";

  // Pop the seal, then flip the flap open (behind the envelope).
  await wait(120);
  envelope.seal = false;
  await wait(100);
  envelope.opening = true;
  await animate(300, amount => { envelope.open = amount; });
  await wait(150);

  // Slide the folded letter up and out, 30 pixels.
  const top = ENVELOPE.top - envelope.lift;
  const bottom = ENVELOPE.bottom - envelope.lift;
  state.paper = { left: ENVELOPE.left + 12, top: top + 4, right: ENVELOPE.right - 12, bottom: bottom - 6 };
  const startTop = state.paper.top, startBottom = state.paper.bottom;
  playSound("paper");
  await animate(420, amount => {
    state.paper.top = startTop - 30 * amount;
    state.paper.bottom = startBottom - 30 * amount;
  });
  await wait(250);

  // The envelope disappears; now unfold the letter.
  state.envelope = null;
  await unfoldLetter();
}

// 3. Unfold the letter: grow to full width (still folded in thirds), then flip each flap open.
async function unfoldLetter() {
  const start = { ...state.paper };
  await animate(400, amount => {
    state.paper = {
      left: between(start.left, LETTER.left, amount),
      top: between(start.top, TOP_FOLD, amount),
      right: between(start.right, LETTER.right, amount),
      bottom: between(start.bottom, BOTTOM_FOLD, amount),
    };
  });
  await wait(100);

  state.flaps = { top: 0, bottom: 0 };
  await wait(150);
  playSound("paper");
  await animate(440, amount => { state.flaps.top = amount; });
  await wait(100);
  playSound("paper");
  await animate(440, amount => { state.flaps.bottom = amount; });

  // All open: one smooth sheet. Fade the writing and buttons in.
  state.flaps = null;
  state.paper = { ...LETTER };
  state.letter = { alpha: 0 };
  animate(875, amount => { state.letter.alpha = amount; });
}

// 4a. He clicked Decline: buzzer and a joke pop-up.
function decline() {
  playSound("click");
  playSound("buzzer", BUZZER_VOLUME);
  const message = DECLINE_MESSAGES[state.declines];
  state.declines += 1;
  state.popup = { title: "ERROR", message };
}

// 4b. He clicked "Suggest a new time".
function suggest() {
  playSound("click");
  state.popup = { title: "NEW TIME?", message: SUGGEST_MESSAGE };
}

function closePopup() {
  playSound("click");
  state.popup = null;
}

// 5. He said yes! Clear the letter and celebrate.
function accept() {
  playSound("click");
  playSound("chime", CHIME_VOLUME);
  remember(`accepted:${state.invite.id}`);
  state.letter = null;
  state.paper = null;
  state.celebration = { alpha: 0 };
  animate(875, amount => { state.celebration.alpha = amount; });
  launchConfetti();
}

// Confetti shoots out of two "party poppers" in the bottom corners, flutters, and falls.
function launchConfetti() {
  [[185, 350, 1], [583, 350, -1]].forEach(([x, y, direction]) => {
    for (let i = 0; i < 55; i++) {
      state.confetti.push({
        x, y,
        speedX: direction * between(1, 9, Math.random()),
        speedY: between(-11, -6, Math.random()),
        size: [6, 7, 8][Math.floor(Math.random() * 3)],
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        flutter: Math.random() * Math.PI,
        flutterSpeed: between(0.15, 0.4, Math.random()),
      });
    }
  });

  // Move every piece a step every 30 milliseconds, until they've all fallen
  // (or he closes the invite).
  const run = currentRun;
  const timer = setInterval(() => {
    if (run !== currentRun) { clearInterval(timer); return; }
    state.confetti.forEach(piece => {
      piece.speedY += 0.28;      // gravity
      piece.speedX *= 0.98;      // air slows it sideways
      piece.x += piece.speedX;
      piece.y += piece.speedY;
      piece.flutter += piece.flutterSpeed;
    });
    state.confetti = state.confetti.filter(piece => piece.y <= 360);
    if (state.confetti.length === 0) clearInterval(timer);
  }, 30);
}


// ====================================================================================
// START
// ====================================================================================

// Wait for the picture and the font to load, then start drawing.
Promise.all([
  new Promise(resolve => { background.onload = resolve; }),
  document.fonts.load(FONTS.title),
  document.fonts.load(FONTS.body),
]).then(() => requestAnimationFrame(draw));
