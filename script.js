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
//
// THE DATE ITSELF (optional). If an invite has "startsAt" and "parts", then at that time
// a "DATE TIME" pop-up shows on both computers, and "Our date" (in the Start menu) walks
// you through it one part at a time:
//   startsAt - when the date starts, in YOUR time (Arizona), on the invite's "date" day.
//   parts    - each part of the date, in order:
//     kind    - "game" (a card with how to get the game) or "movie" (the little cinema)
//     name    - the game or movie
//     link    - (games) the button that opens the game's page
//     steps   - (games) what he should do, one line each
//     poster  - (movies) the movie's cover picture, in the images folder. If the file
//               isn't there, a cute pixel poster with the name shows instead.
//     backups - other ideas he can pick instead with "Something else" (he can also type his own)
const INVITES = [
  {
    id: "2026-10-26",
    date: "2026-10-26",
    label: "Oct 26, 2026",
    title: `${RECIPIENT_NAME}, be my date?`,
    plan: "Top secret",
    bring: "Your cute self, and maybe some snacks",
    when: "Monday, Oct 26\n9pm your time, 2pm my time",
    startsAt: "14:00",
    parts: [
      {
        kind: "game",
        name: "Unsolved Case",
        link: "https://store.steampowered.com/search/?term=Unsolved%20Case",
        steps: [
          "Open Steam and download Unsolved Case (the Steam button below finds it)",
          "Hop in a call with me",
          "Start it up and we'll crack the case together!",
        ],
        backups: [],
      },
      {
        kind: "movie",
        name: "MOVIE NAME HERE",
        poster: "images/movie.png",
        backups: [],
      },
    ],
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
  cats: null,             // the desktop cats
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

// Phones only allow sound after a tap. Some phones (like iPhones) are picky about WHICH
// part of the tap counts, so this tries again on every kind of tap until sound is on.
function unlockSound() {
  if (audio.state !== "running") audio.resume();
}
["pointerdown", "touchend", "click", "keydown"].forEach(kind => window.addEventListener(kind, unlockSound));

// On newer iPhones, this lets sounds play even when the phone's silent switch is on
// (like music or videos do). Older phones just skip it.
try {
  if (navigator.audioSession) navigator.audioSession.type = "playback";
} catch (problem) {}

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

// A little vase with a flower (images/vase.png), sitting on the desk left of the computer.
const vasePicture = new Image();
vasePicture.src = "images/vase.png";

// Where the flower is inside that picture (the rest of the picture is see-through).
const VASE_CROP = { left: 223, top: 328, right: 732, bottom: 1531 };

// Where it goes on the desk: its left edge, where it sits (bottom), and how tall it is.
// (The left edge of the picture softly fades out, so the vase starts just past that fade.)
const VASE_SPOT = { left: 25, bottom: 470, height: 162 };

// Draws the vase. Clicking it makes the flower sway and a heart float up.
function drawVase(time) {
  if (!vasePicture.complete || !vasePicture.naturalWidth) return;
  const crop = VASE_CROP;
  const height = VASE_SPOT.height;
  const width = height * (crop.right - crop.left) / (crop.bottom - crop.top);
  const left = VASE_SPOT.left, top = VASE_SPOT.bottom - height;

  // For a moment after a click, it sways side to side, tipping from the bottom of the vase.
  const wiggle = state.vaseWiggle ? Math.max(0, 1 - (time - state.vaseWiggle) / 1200) : 0;
  const angle = Math.sin(time / 90) * 0.08 * wiggle;
  ctx.save();
  ctx.translate(left + width / 2, VASE_SPOT.bottom);
  ctx.rotate(angle);
  ctx.imageSmoothingEnabled = false;    // keeps the pixels crisp instead of blurry
  ctx.drawImage(vasePicture, crop.left, crop.top, crop.right - crop.left, crop.bottom - crop.top,
                -width / 2, -height, width, height);
  ctx.restore();

  if (wiggle > 0) drawPixels(HEART, left + width / 2 - 7, top - 16 - (1 - wiggle) * 20, 2, COLORS.heart);
  hitBoxes.push({ left, top, right: left + width, bottom: VASE_SPOT.bottom, onClick: () => {
    playSound("click");
    state.vaseWiggle = performance.now();
  } });
}

// Pixel-art versions of emojis. Any of these in the text gets drawn as pixel art instead.
// O = outline, P = pink, W = white, Y = yellow, B = blue tears, R = red mouth.
// To add another emoji, copy one of these blocks and draw it with letters.
const EMOJI_PIXELS = {
  "💗": {
    rows: [
      ".OO...OO.",
      "OPPO.OPPO",
      "OPWPOPPPO",
      "OPPPPPPPO",
      ".OPPPPPO.",
      "..OPPPO..",
      "...OPO...",
      "....O....",
    ],
    colors: { O: "#45284A", P: "#F07A9C", W: "#FFFFFF" },
  },
  "😭": {
    rows: [
      "..OOOOO..",
      ".OYYYYYO.",
      "OYOOYOOYO",
      "OBYYYYYBO",
      "OBYOOOYBO",
      "OBYOROYBO",
      ".OBYYYBO.",
      "..OOOOO..",
    ],
    colors: { O: "#45284A", Y: "#FFD45E", B: "#7FB8F0", R: "#E05A6B" },
  },
  "😊": {
    rows: [
      "..OOOOO..",
      ".OYYYYYO.",
      "OYOYYYOYO",
      "OYYYYYYYO",
      "ORRYYYRRO",
      "OYOYYYOYO",
      ".OYOOOYO.",
      "..OOOOO..",
    ],
    colors: { O: "#45284A", Y: "#FFD45E", R: "#F4A6BD" },
  },
  "😂": {
    rows: [
      "..OOOOO..",
      ".OYYYYYO.",
      "OYOYYYOYO",
      "BOYOYOYOB",
      "BYOOOOOYB",
      "OYOWWWOYO",
      ".OYOOOYO.",
      "..OOOOO..",
    ],
    colors: { O: "#45284A", Y: "#FFD45E", B: "#7FB8F0", W: "#FFFFFF" },
  },
  "🥺": {
    rows: [
      "..OOOOO..",
      ".OYYYYYO.",
      "OOOYYYOOO",
      "OOWOYOWOO",
      "OOOOYOOOO",
      "OYYYYYYYO",
      ".OYYOYYO.",
      "..OOOOO..",
    ],
    colors: { O: "#45284A", Y: "#FFD45E", W: "#FFFFFF" },
  },
  "😘": {
    rows: [
      "..OOOOO.P",
      ".OYYYYYPP",
      "OYOYYYOYO",
      "OYYYYOOYO",
      "ORYYYYYRO",
      "OYYYOOYYO",
      ".OYYOYYO.",
      "..OOOOO..",
    ],
    colors: { O: "#45284A", Y: "#FFD45E", P: "#F07A9C", R: "#F4A6BD" },
  },
  "🌸": {
    rows: [
      "...O.O...",
      "..OPOPO..",
      ".OPPPPPO.",
      "OPPPYPPPO",
      ".OPPPPPO.",
      "..OPOPO..",
      "...O.O...",
      ".........",
    ],
    colors: { O: "#45284A", P: "#F8BFCB", Y: "#FFD45E" },
  },
  "✨": {
    rows: [
      "...Y.....",
      "..YYY....",
      "YYYWYYY..",
      "..YYY..Y.",
      "...Y..YYY",
      ".......Y.",
      "..Y......",
      ".YYY.....",
    ],
    colors: { Y: "#FFD45E", W: "#FFFFFF" },
  },
  "🐱": {
    rows: [
      "O.......O",
      "OO.....OO",
      "OWOOOOOWO",
      "OWWWWWWWO",
      "OWOWWWOWO",
      "OPWWPWWPO",
      ".OWWWWWO.",
      "..OOOOO..",
    ],
    colors: { O: "#45284A", W: "#FFFFFF", P: "#F4A6BD" },
  },
  "🎮": {
    rows: [
      ".........",
      ".OOOOOOO.",
      "OOWOOOBOO",
      "OWWWOBOBO",
      "OOWOOOBOO",
      ".OO...OO.",
      ".........",
      ".........",
    ],
    colors: { O: "#45284A", W: "#FFFFFF", B: "#7FB8F0" },
  },
};
const EMOJI_PATTERN = new RegExp(`(${Object.keys(EMOJI_PIXELS).join("|")})`, "u");

// Writes words. align: "center", "left", or "right". baseline: "middle" (y is the middle) or "top".
// Emojis from EMOJI_PIXELS are drawn as pixel art, right in line with the words.
function write(text, x, y, font, color, align = "center", baseline = "middle") {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  if (!EMOJI_PATTERN.test(text)) {
    ctx.fillText(text, x, y);
    return;
  }

  // Split the text into words and emojis, and work out how wide it all is.
  const fontSize = Number(font.match(/(\d+)px/)[1]);
  const size = Math.max(1, Math.round(fontSize / 8));     // how big each emoji pixel is
  const pieces = text.split(EMOJI_PATTERN).filter(piece => piece !== "");
  const widthOf = piece => (EMOJI_PIXELS[piece] ? EMOJI_PIXELS[piece].rows[0].length * size + 2
                                                : ctx.measureText(piece).width);
  const total = pieces.reduce((sum, piece) => sum + widthOf(piece), 0);
  let left = align === "center" ? x - total / 2 : align === "right" ? x - total : x;

  // Draw each piece, left to right.
  pieces.forEach(piece => {
    const emoji = EMOJI_PIXELS[piece];
    if (emoji) {
      const height = emoji.rows.length * size;
      const top = baseline === "top" ? y + (fontSize - height) / 2 + 1 : y - height / 2;
      drawSprite(emoji.rows, emoji.colors, Math.round(left + 1), Math.round(top), size);
    } else {
      ctx.font = font;
      ctx.fillStyle = color;
      ctx.textAlign = "left";
      ctx.textBaseline = baseline;
      ctx.fillText(piece, left, y);
    }
    left += widthOf(piece);
  });
}

// Splits words into lines that fit within maxWidth pixels.
function wrapWords(text, font, maxWidth) {
  ctx.font = font;
  const lines = [];
  text.split("\n").forEach(part => {
    let current = "";
    part.split(" ").forEach(word => {
      const attempt = current ? current + " " + word : word;
      if (ctx.measureText(attempt).width <= maxWidth) {
        current = attempt;
        return;
      }
      if (current) lines.push(current);
      current = "";
      // A word too long for a whole line (like "MOREEEEEEEEEEEE") gets chopped
      // into pieces that fit, letter by letter.
      for (const letter of word) {
        if (current && ctx.measureText(current + letter).width > maxWidth) {
          lines.push(current);
          current = "";
        }
        current += letter;
      }
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

  // While an invite is playing, these buttons work: minimize, smaller/bigger, and close.
  if (state.mode === "invite") {
    hitBoxes.push({ left: 540, top: 79, right: 559, bottom: 101, onClick: minimizeInvite });
    hitBoxes.push({ left: 559, top: 79, right: 577, bottom: 101, onClick: toggleInviteSize });
    hitBoxes.push({ left: 577, top: 79, right: 600, bottom: 101, onClick: closeInvite });
  }
}

// ---------- Making the invite smaller, or minimizing it ----------

// When the invite is "small", it shrinks into a window floating over the desktop.
// These numbers are how much it shrinks, and where its middle goes.
const INVITE_SMALL_SCALE = 0.72;
const INVITE_SMALL_CENTER = { x: 384, y: (SCREEN.top + TASKBAR.top) / 2 };
const SCREEN_CENTER = { x: (SCREEN.left + SCREEN.right) / 2, y: (SCREEN.top + SCREEN.bottom) / 2 };

// Moves a spot from the full-size invite to where it is on the small one.
function toSmallInvite(x, y) {
  return {
    x: INVITE_SMALL_CENTER.x + (x - SCREEN_CENTER.x) * INVITE_SMALL_SCALE,
    y: INVITE_SMALL_CENTER.y + (y - SCREEN_CENTER.y) * INVITE_SMALL_SCALE,
  };
}

function minimizeInvite() {
  playSound("click");
  state.inviteMinimized = true;
  state.mode = "desktop";
}

function toggleInviteSize() {
  playSound("click");
  state.inviteSmall = !state.inviteSmall;
}

// The invite's button on the taskbar: brings it back, or minimizes it if it's showing.
function inviteTaskbarClick() {
  playSound("click");
  if (state.mode === "invite") {
    state.inviteMinimized = true;
    state.mode = "desktop";
  } else {
    state.inviteMinimized = false;
    state.mode = "invite";
  }
}

// For previewing: add ?today=2026-10-27 to the end of the link to pretend it's a
// different day. Without it, it uses the real date.
const PREVIEW = new URLSearchParams(location.search);

// Who's using this computer, and who's on the other end.
// The link with ?inbox on the end is YOUR side. The plain link is HIS side.
const IS_TAYLER = PREVIEW.has("inbox");
const ME = IS_TAYLER ? YOUR_NAME : RECIPIENT_NAME;
const OTHER = IS_TAYLER ? RECIPIENT_NAME : YOUR_NAME;
const MY_TIME_ZONE = IS_TAYLER ? YOUR_TIME_ZONE : HIS_TIME_ZONE;
const OTHER_TIME_ZONE = IS_TAYLER ? HIS_TIME_ZONE : YOUR_TIME_ZONE;

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
    ...allInvites().filter(invite => !isPast(invite)).map(inviteIcon),
    // Love notes he hasn't read yet (the one he's reading right now stays until he closes it).
    // (Your love notes and "Open when..." letters are for HIM, so they're only on his side.)
    ...(IS_TAYLER ? [] : allLoveNotes().filter(note => !noteIsRead(note) || state.windows.some(win => win.noteId === note.id)).map(note => ({
      label: "love_note", picture: drawNoteIcon, onClick: () => openNote(note), tag: "new",
    }))),
    { label: "Open when...", picture: drawOpenWhenIcon, onClick: () => openWindow("openwhen"),
      tag: unreadLetters().length ? "new" : null },
    { label: "Memories", picture: drawFolderIcon, onClick: () => openWindow("memories") },
    { label: "Arcade", picture: drawArcadeIcon, onClick: () => openWindow("games") },
    // The secret folder (coupon book) is hidden for now. To bring it back, remove the // below.
    // { label: "Secret", picture: drawSecretIcon, onClick: () => openWindow("secret") },
    { label: "Plan a date", picture: drawPlanIcon, onClick: () => openWindow("plan") },
    { label: "IM", picture: drawIMIcon, onClick: () => openWindow("im"), tag: unreadIMs().length ? "new" : null },
    { label: "Our house", picture: drawHouseIcon, onClick: () => openWindow("house") },
  ];
  // They go down the left side in columns of 4, like a real desktop.
  // (The 5th icon starts a new column.)
  icons.forEach((icon, number) => {
    drawIcon(icon, 182 + Math.floor(number / 4) * 82, 80 + (number % 4) * 70);
  });

  drawCats(time);

  drawAllWindows(time);
  drawTaskbar();
  if (state.startMenu) drawStartMenu();
}

// Turns an invite into a desktop icon.
function inviteIcon(invite) {
  let tag = null;
  if (invite.remote) {
    // A planned date: NEW when it's your turn to answer, a check once it's accepted.
    if (needsMyAnswer(invite.remote)) tag = "new";
    else if (invite.remote.status === "accepted") tag = "check";
  } else if (invite.sentByMe) {
    // One you sent: a green check once he's accepted it (no NEW tag for you).
    tag = state.accepts[invite.id] ? "check" : null;
  } else if (!remembers(`opened:${invite.id}`)) tag = "new";
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

  // A button for each open window, between Start and the clocks.
  // The window on top looks pressed in. Clicking a button brings that window forward,
  // or minimizes it if it's already on top.
  const clocksLeft = heartX - 6 - ctx.measureText(yourClock).width - 8;
  // An open (or minimized) date invite gets the first button, with a little envelope.
  const inviteOpen = state.invite && (state.mode === "invite" || state.inviteMinimized);
  const count = state.windows.length + (inviteOpen ? 1 : 0);
  if (count === 0) return;
  const space = clocksLeft - (button.right + 6);
  const width = Math.min(30, space / count - 4);
  const onTop = topWindow();
  let first = button.right + 6;
  if (inviteOpen) {
    const box = { left: first, top: button.top, right: first + width, bottom: button.bottom,
                  id: "taskbar:invite", onClick: inviteTaskbarClick };
    hitBoxes.push(box);
    steppedBox(box.left, box.top, box.right, box.bottom, 2,
               state.mode === "invite" ? COLORS.iconHover : (state.hoverId === box.id ? COLORS.white : COLORS.cream), COLORS.text, 1.5);
    ctx.save();
    ctx.translate((box.left + box.right) / 2, middle);
    ctx.scale(0.36, 0.36);
    drawEnvelopeIcon(0, 0);
    ctx.restore();
    first += width + 4;
  }
  state.windows.forEach((win, number) => {
    const box = { left: first + number * (width + 4), top: button.top, bottom: button.bottom,
                  id: `taskbar:${number}`, onClick: () => taskbarClick(win) };
    box.right = box.left + width;
    hitBoxes.push(box);
    const pressed = win === onTop && state.mode !== "invite";
    steppedBox(box.left, box.top, box.right, box.bottom, 2,
               pressed ? COLORS.iconHover : (state.hoverId === box.id ? COLORS.white : COLORS.cream), COLORS.text, 1.5);

    // A tiny copy of the window's desktop icon (shrunk down to fit the button).
    ctx.save();
    ctx.translate((box.left + box.right) / 2, middle);
    ctx.scale(0.36, 0.36);
    taskbarPicture(win)(0, 0);
    ctx.restore();
  });
}

// Which icon picture goes on a window's taskbar button (the same one as on the desktop).
function taskbarPicture(win) {
  if (win.window.startsWith("game:")) return GAMES[win.window.slice(5)].picture;
  return {
    notes: drawNoteIcon, memories: drawFolderIcon, games: drawArcadeIcon, openwhen: drawOpenWhenIcon,
    secret: drawSecretIcon, plan: drawPlanIcon, im: drawIMIcon, house: drawHouseIcon,
    datenight: drawPlanIcon,
  }[win.window] || drawNoteIcon;
}

// The choices in the Start menu.
// ("Miss ___" is the other person's name, so it's "Miss Tayler" on his side and
// "Miss Jacob" on yours. Love notes are only on his side, since they're from you.)
const START_MENU = [
  { text: "Love notes", onClick: openLoveNotes },
  { text: "Open when...", onClick: () => openWindow("openwhen") },
  { text: "Memories", onClick: () => openWindow("memories") },
  { text: "Arcade", onClick: () => openWindow("games") },
  { text: "Plan a date", onClick: () => openWindow("plan") },
  { text: "IM", onClick: () => openWindow("im") },
  { text: "Our house", onClick: () => openWindow("house") },
  { text: "Our date", onClick: () => openWindow("datenight") },
  { text: `Miss ${OTHER}`, onClick: () => showPopup("MESSAGE", `${OTHER} misses you too. Like, a lot.`) },
  // The floating mini computer (see POP OUT near the bottom). "get text" means the words
  // are worked out each time, so it says "Pop back in" while it's popped out.
  // ("..." with an empty list adds nothing, for browsers that can't pop out.)
  ...("documentPictureInPicture" in window
    ? [{ get text() { return poppedOut ? "Pop back in" : "Pop out"; }, onClick: () => togglePopOut() }]
    : []),
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

// ====================================================================================
// WINDOWS (he can open several, drag them around, and minimize them, like a real computer)
// ====================================================================================

// How big a window is (when it's not full screen).
const WINDOW_WIDTH = 342;
const WINDOW_HEIGHT = 238;

const WINDOW_TITLES = {
  notes: "love_note.txt - Notepad", memories: "Memories", games: "Arcade",
  openwhen: "Open when...", secret: "Secret",
  plan: `Plan a date for ${OTHER}`, im: `IM - ${OTHER}`, house: "Our little house",
  datenight: "Our date 💗",
};
// The shorter names on the taskbar buttons.
const TASKBAR_NAMES = {
  notes: "love_note", memories: "Memories", games: "Arcade", openwhen: "Open when",
  secret: "Secret", plan: "Plan a date", im: "IM", house: "House", datenight: "Our date",
};

// Every open window. The LAST one in the list is on top (the one he's using).
// Each window remembers its own things (where it is, which letter is open, its game...).
state.windows = [];

// These are the things each window keeps for itself, and what a brand new window starts with.
const WINDOW_DEFAULTS = {
  window: null, game: null, maximized: false, openWhen: null, letterPage: 0,
  letterListScroll: 0, letterListMaxScroll: 0, launcherScroll: 0, launcherMaxScroll: 0,
  memoriesFolder: null, memoryItem: null, noteId: null, inboxMessage: null,
  password: "", passwordWrong: false,
  imScroll: Infinity, imMaxScroll: 0,   // the chat starts scrolled to the newest message
  writingLetter: false,                 // is the "Write one" form open in Open when...?
  writingNote: false,
  houseTab: "shop", houseScroll: 0, houseMaxScroll: 0,   // the house's shop                   // is the "Write one" love note form open (your side)?
  showSent: false,                      // showing "My letters" (the ones you sent) instead?
  passwordLetter: null,                 // the locked letter whose password box is showing
};

// The rest of the code was written for ONE window, using things like state.window and
// state.openWhen. So before working with a window, we "load" its things into state, and
// afterwards "unload" them (saving any changes back into that window).
let loadedWindow = null;

function loadWindow(win) {
  if (loadedWindow === win) return;
  unloadWindow();
  loadedWindow = win;
  Object.keys(WINDOW_DEFAULTS).forEach(key => { state[key] = win[key]; });
}

function unloadWindow() {
  if (loadedWindow) Object.keys(WINDOW_DEFAULTS).forEach(key => { loadedWindow[key] = state[key]; });
  loadedWindow = null;
  Object.assign(state, WINDOW_DEFAULTS);
}

// Does something with a window loaded, then unloads it again.
function withWindow(win, job) {
  if (!win) return job();
  loadWindow(win);
  try { return job(); } finally { unloadWindow(); }
}

// The window on top (that isn't minimized), or null if there isn't one.
function topWindow() {
  for (let i = state.windows.length - 1; i >= 0; i--) {
    if (!state.windows[i].minimized) return state.windows[i];
  }
  return null;
}

// Where a window is: its own spot, or the whole computer screen (above the taskbar) if full screen.
function windowBoxOf(win) {
  if (win.maximized) return { left: SCREEN.left, top: SCREEN.top, right: SCREEN.right, bottom: TASKBAR.top };
  return { left: win.x, top: win.y, right: win.x + WINDOW_WIDTH, bottom: win.y + WINDOW_HEIGHT };
}

// The top window that the mouse is over (for scrolling), or null.
function windowUnderMouse() {
  for (let i = state.windows.length - 1; i >= 0; i--) {
    const win = state.windows[i];
    if (!win.minimized && mouseIsIn(windowBoxOf(win))) return win;
  }
  return null;
}

// Brings a window to the front. Any game in another window pauses itself.
function focusWindow(win) {
  state.windows = state.windows.filter(other => other !== win);
  state.windows.push(win);
  win.minimized = false;
  state.windows.forEach(other => {
    if (other !== win && other.game && other.game.playing) other.game.paused = true;
  });
}

// The minimize button (and clicking a window's taskbar button when it's already on top).
function minimizeWindow(win) {
  win.minimized = true;
  if (win.game && win.game.playing) win.game.paused = true;
}

// Clicking a window's button on the taskbar.
function taskbarClick(win) {
  playSound("click");
  if (!win.minimized && win === topWindow()) minimizeWindow(win);
  else focusWindow(win);
}

// Draws every open window, bottom to top.
function drawAllWindows(time) {
  const top = topWindow();
  // Windows are trimmed to the screen (above the taskbar), so a window dragged near the
  // edge looks like it's sliding off the screen, not hanging over the computer's frame.
  ctx.save();
  ctx.beginPath();
  ctx.rect(SCREEN.left, SCREEN.top, SCREEN.right - SCREEN.left, TASKBAR.top - SCREEN.top);
  ctx.clip();
  state.windows.forEach(win => {
    if (win.minimized) return;
    const first = hitBoxes.length;
    withWindow(win, () => drawWindow(time, win === top));
    // Remember which window each clickable thing belongs to.
    for (let i = first; i < hitBoxes.length; i++) {
      if (!hitBoxes[i].win) hitBoxes[i].win = win;
    }
  });
  ctx.restore();
}

// Dragging a window by its title bar.
let dragging = null;   // { win, dx, dy } while a window is being dragged

// Where the loaded window is right now.
function windowBox() {
  return loadedWindow ? windowBoxOf({ ...loadedWindow, maximized: state.maximized })
                      : windowBoxOf({ x: 250, y: 82, maximized: state.maximized });
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

// A retro window with a pink title bar, and minimize, full-screen, and X buttons.
//   onTop - is this the window he's using? (Windows behind it get a paler title bar.)
function drawWindow(time, onTop = true) {
  const { left, top, right, bottom } = windowBox();
  state.windowOnTop = onTop;

  // An invisible "blocker" covering the window, so clicks don't go through to icons behind it.
  // (In the jumping and flying games, clicking anywhere in the window jumps/flaps.)
  hitBoxes.push({ left, top, right, bottom, onClick: gameAction, blocker: true });

  // The title bar is the handle for dragging the window around (not when it's full screen).
  if (!state.maximized) {
    hitBoxes.push({ left, top, right: right - 58, bottom: top + 22, onClick: () => {}, dragWin: loadedWindow });
  }

  if (!state.maximized) {
    ctx.fillStyle = COLORS.text;                            // shadow
    ctx.fillRect(left + 5, top + 5, right - left, bottom - top);
  }
  ctx.fillStyle = COLORS.cream;
  ctx.fillRect(left, top, right - left, bottom - top);
  ctx.fillStyle = onTop ? COLORS.titleBar : "#FBE3E9";
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

  // The minimize button (a little line), left of the full-screen button.
  const minimizeLeft = right - 56;
  ctx.strokeStyle = COLORS.text;
  ctx.lineWidth = 2;
  ctx.strokeRect(minimizeLeft, top + 4, 14, 14);
  ctx.fillStyle = COLORS.text;
  ctx.fillRect(minimizeLeft + 3, top + 12, 8, 2);
  const win = loadedWindow;
  hitBoxes.push({ left: minimizeLeft - 2, top, right: buttonLeft - 2, bottom: top + 22, onClick: () => {
    playSound("click");
    minimizeWindow(win);
  } });

  // The inside of the window.
  const inside = gameArea();
  if (state.window === "notes") drawNotes(inside, time);
  if (state.window === "memories") drawMemories(inside);
  if (state.window === "games") drawGamesFolder(inside);
  if (state.window === "openwhen") drawOpenWhen(inside);
  if (state.window === "secret") drawSecret(inside, time);
  if (state.window === "plan") drawPlan(inside);
  if (state.window === "im") drawIM(inside);
  if (state.window === "house") drawHouse(inside, time);
  if (state.window === "datenight") drawDateNight(inside, time);
  if (state.game) drawGameWindow(time);
}


// ====================================================================================
// "OPEN WHEN..." LETTERS
// ====================================================================================

// Every "Open when..." letter on this computer:
//   - Yours (OPEN_WHEN, written in this file) are for him, so only his side has them.
//   - Letters written on the site (with "Write one") show up for the other person.
// Locked letters always go at the very end.
function openWhenLetters() {
  // (If you edited one of the letters in this file, the edited copy takes its place.)
  const written = IS_TAYLER ? [] : OPEN_WHEN.map(letter => editedCopyOf(letter) || letter);
  const received = state.remoteLetters.filter(letter => letter.from === OTHER && !letter.replaces);
  const all = [...written, ...received];
  const lockedAny = letter => isLocked(letter) || needsPassword(letter);
  return [...all.filter(letter => !lockedAny(letter)), ...all.filter(lockedAny)];
}

// The name his browser remembers a letter by (to know if it's been read).
// (An edited copy of a letter from this file keeps the original's name, so if he
// already read it, it stays read.)
function letterKey(letter) {
  if (letter.replaces) return `letter:${letter.replaces}`;
  return letter.id ? `letter:${letter.id}` : `letter:${letter.when}`;
}

// The edited copy of one of the letters written in this file (OPEN_WHEN), if you've edited it.
function editedCopyOf(letter) {
  return state.remoteLetters.find(other => other.replaces === letter.when && other.from === YOUR_NAME);
}

// Letters you've received on the site that haven't been opened yet.
// (Edited copies of letters he already had don't count as new.)
function unreadLetters() {
  return state.remoteLetters.filter(letter => letter.from === OTHER && !letter.replaces &&
                                              !remembers(`${SIDE}:${letterKey(letter)}`));
}

// The list of letters, or (once he picks one) that letter, opened up.
function drawOpenWhen(inside) {
  const middle = (inside.left + inside.right) / 2;

  // Typing a letter's password: a little box (a real text box) on top of the list.
  if (state.passwordLetter) {
    requestPanel("letterpass", { left: middle - 120, top: inside.top + 50, right: middle + 120, bottom: inside.top + 170 });
  }

  // Writing a new letter: the form (real text boxes) goes on top.
  if (state.writingLetter) {
    if (state.online !== "ok") {
      drawOnlineProblem(inside, `write ${OTHER} a letter`);
      drawButton(inside.left + 46, inside.bottom - 19, 76, 26, "Back", COLORS.cream, COLORS.text, () => {
        playSound("click");
        state.writingLetter = false;
      });
      return;
    }
    requestPanel("letter", inside);
    return;
  }

  if (state.openWhen === null) {
    // "My letters" shows the ones you've sent (so you can edit them). Otherwise, the ones to you.
    const letters = state.showSent ? sentLetters() : openWhenLetters();

    // Two buttons along the top: write a new one, and switch between their letters and yours.
    drawButton(middle - 82, inside.top + 16, 156, 24, "Write one", COLORS.acceptFill, COLORS.acceptText, () => {
      playSound("click");
      state.writingLetter = true;
    });
    drawButton(middle + 82, inside.top + 16, 156, 24, state.showSent ? `From ${OTHER}` : "My letters",
               COLORS.cream, COLORS.text, () => {
      playSound("click");
      state.showSent = !state.showSent;
      state.letterListScroll = 0;
    });

    // The list: an envelope (or a padlock, if it's locked) and "Open when ___" for each letter.
    // If there are more than fit, the mouse wheel scrolls the list.
    const rowHeight = 30;
    const list = { left: inside.left, top: inside.top + 32, right: inside.right, bottom: inside.bottom - 4 };
    if (state.showSent) write("Click one to edit it", middle, list.top + 6, FONTS.tag, COLORS.text);
    if (letters.length === 0) {
      write(state.showSent ? `You haven't sent ${OTHER} any yet...` : `No letters from ${OTHER} yet...`,
            middle, list.top + 50, FONTS.body, COLORS.text);
      return;
    }
    if (state.showSent) list.top += 12;
    const contentHeight = letters.length * rowHeight + 4;
    state.letterListMaxScroll = Math.max(0, contentHeight - (list.bottom - list.top));
    state.letterListScroll = keepBetween(state.letterListScroll, 0, state.letterListMaxScroll);
    const hasScrollbar = state.letterListMaxScroll > 0;

    // Only show rows inside the list area (ones scrolled out of view get trimmed off).
    ctx.save();
    ctx.beginPath();
    ctx.rect(list.left, list.top, list.right - list.left, list.bottom - list.top);
    ctx.clip();
    letters.forEach((letter, number) => {
      const top = list.top + 4 + number * rowHeight - state.letterListScroll;
      if (top + rowHeight < list.top || top > list.bottom) return;
      // Locked by a date (counts down), or by a password (asks for it).
      // (In "My letters", your own letters are never locked for you, and clicking one edits it.)
      const locked = !state.showSent && (isLocked(letter) || needsPassword(letter));
      const onClick = () => {
        if (state.showSent) editLetter(letter);
        else if (isLocked(letter)) showLockedLetter(letter);
        else if (needsPassword(letter)) askForPassword(letter);
        else openLetter(letter);
      };
      const box = { left: inside.left + 8, top, right: inside.right - (hasScrollbar ? 16 : 8), bottom: top + rowHeight - 4,
                    onClick, id: `openwhen:${number}` };
      // Only clickable if it's actually showing (not scrolled behind the edge).
      if (top >= list.top - 4 && top + rowHeight - 4 <= list.bottom + 4) hitBoxes.push(box);
      steppedBox(box.left, box.top, box.right, box.bottom, 3,
                 state.hoverId === box.id ? COLORS.titleBar : (locked ? COLORS.iconHover : COLORS.white), COLORS.text, 1.5);
      const rowMiddle = top + (rowHeight - 4) / 2;
      if (locked) drawPixels(LOCK, box.left + 17, rowMiddle - 6, 2, COLORS.text);
      else drawSmallEnvelope(box.left + 22, rowMiddle, state.showSent || remembers(`${SIDE}:${letterKey(letter)}`));
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
  const letter = state.openWhen;
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

// Does this letter have a password that hasn't been typed in yet? (Once it's typed
// right, the browser remembers, so it only has to be typed once.)
function needsPassword(letter) {
  return !!letter.password && !remembers(`${SIDE}:unlocked:${letterKey(letter)}`);
}

// Clicking a password-locked letter: shows the password box.
function askForPassword(letter) {
  playSound("click");
  state.passwordLetter = letter;
  letterPassForm.reset();
  letterPassPanel.querySelector(".problem").textContent = "";
  setTimeout(() => letterPassForm.elements.password.focus(), 50);
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
// (It scrolls whichever window the mouse is over.)
canvas.addEventListener("wheel", event => withWindow(windowUnderMouse(), () => {
  if (state.window !== "openwhen" || state.openWhen !== null || !state.letterListMaxScroll) return;
  event.preventDefault();   // scroll the list, not the web page
  state.letterListScroll = keepBetween(state.letterListScroll + event.deltaY * 0.5, 0, state.letterListMaxScroll);
}), { passive: false });

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

function openLetter(letter) {
  playSound("paper");
  remember(`${SIDE}:${letterKey(letter)}`);
  state.openWhen = letter;
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
// (Typing goes to the window on top, like a real computer.)
window.addEventListener("keydown", event => withWindow(topWindow(), () => {
  if (isTypingInForm(event)) return;
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
}));

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
// (S = stripes, which show on the orange cat.)
const CAT_WALK_1 = [
  ".........W..W",
  ".........WWWW",
  "W........WEWE",
  "W........WWPW",
  ".W.WSWWSWWWW.",
  "..WWSWWSWWWW.",
  "..WWWWWWWWW..",
  "..W..W..W..W.",
];
const CAT_WALK_2 = [...CAT_WALK_1.slice(0, 7), "...W.W...W.W."];
const CAT_SIT = [
  ".........W..W",
  ".........WWWW",
  ".........WEWE",
  ".........WWPW",
  "......WSWWWW.",
  ".....WWSWWWW.",
  "WW...WWSWWWW.",
  ".WWWWWWWWWWW.",
];
const CAT_SIZE = 3;   // how big each of the cats' squares is (bigger = bigger cats)
const CAT_WIDTH = 13 * CAT_SIZE, CAT_HEIGHT = 8 * CAT_SIZE;
const CAT_LEFT = 250, CAT_RIGHT = 600;   // how far left and right they wander

// The cats! W = fur, S = stripes, E = eyes, P = nose. "outline" is the line around them.
const CATS = [
  { name: "orange", start: 420, colors: { W: "#F4A259", S: "#D9762B", E: "#45284A", P: "#F4A6BD" }, outline: "#45284A" },
  { name: "black", start: 330, colors: { W: "#2B2530", S: "#2B2530", E: "#FFD45E", P: "#F4A6BD" }, outline: "#6E5A7A" },
];

// Flips a picture left-to-right (so a cat can face the other way).
function mirror(rows) {
  return rows.map(row => [...row].reverse().join(""));
}

// Each cat wanders along the bottom of the screen, sits for a bit, then wanders again.
function drawCats(time) {
  if (!state.cats) {
    state.cats = CATS.map((info, number) => ({
      info, x: info.start, direction: number ? -1 : 1, sitting: number === 1, timer: 2 + number * 2, meow: 0, lastTime: time,
    }));
  }
  state.cats.forEach(cat => drawCat(cat, time));
}

function drawCat(cat, time) {
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

  // An outline (the same picture in one color, nudged one square each way), then the cat itself.
  const outline = { W: cat.info.outline, S: cat.info.outline, E: cat.info.outline, P: cat.info.outline };
  [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dx, dy]) => {
    drawSprite(picture, outline, x + dx * CAT_SIZE, y + dy * CAT_SIZE, CAT_SIZE);
  });
  drawSprite(picture, cat.info.colors, x, y, CAT_SIZE);

  // Clicking a cat: it sits, says meow, and a heart pops up.
  hitBoxes.push({ left: x - 2, top: y - 2, right: x + CAT_WIDTH + 2, bottom: y + CAT_HEIGHT + 2, onClick: () => petCat(cat) });
  if (cat.meow > 0) {
    const bubbleX = x + CAT_WIDTH / 2;
    steppedBox(bubbleX - 24, y - 26, bubbleX + 24, y - 8, 2, COLORS.white, COLORS.text, 1.5);
    write("meow!", bubbleX, y - 16.5, FONTS.tag, COLORS.text);
    drawPixels(HEART, bubbleX - 7, y - 40 - (1.5 - cat.meow) * 8, 2, COLORS.heart);
  }
}

function petCat(cat) {
  cat.sitting = true;
  cat.timer = 2.5;
  cat.meow = 1.5;
  // If there's a meow.wav in the sounds folder, it plays that. If not, a little click.
  if (sounds.meow) playSound("meow", 0.6);
  else playSound("click");
}


// ====================================================================================
// ONLINE STUFF: the IM chat and planning dates for each other
// ====================================================================================
//
// Messages and dates are saved in Firebase (a free Google service), so they can travel
// between your two computers. Discord pings whoever is on the other end.
//
// THE TWO SIDES:
//   YOUR side:  https://taylerbuchanan.github.io/date-night/?inbox
//               You sign in with Google once (in the IM window).
//   HIS side:   the plain link. The very first time, he opens a special "pairing" link
//               (the plain link + ?pair=THE-CODE). That connects his browser for good, and
//               he never has to sign in to anything.
//
// The pairing code is NOT in this file on purpose (this file is public on GitHub).
// It only lives in your Firebase rules, which nobody else can see.

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyA_kebLMqLzl7VF1_USywD42NcN8-7qIcU",
  authDomain: "little-computer-2f668.firebaseapp.com",
  projectId: "little-computer-2f668",
  storageBucket: "little-computer-2f668.firebasestorage.app",
  messagingSenderId: "521343865256",
  appId: "1:521343865256:web:e46175fd71f6f526f5cd9d",
};

// Discord pings. One goes to your private server (pings YOU), one to a channel he can
// see (pings HIM). Leave his as "" until you've made it.
const DISCORD_TO_TAYLER = DISCORD_WEBHOOK;
const DISCORD_TO_JACOB = "https://discord.com/api/webhooks/1564361552344260861/m5CLlM-WBAYAzHhjAuhJbipLZdbpfWBBR9K5GJgDS72WLEeIIum0EPwR0ZNqMrRgbiXy";

// IM pings only happen once per "chat burst": after a ping, it stays quiet this many minutes.
const IM_PING_QUIET_MINUTES = 10;

// The longest IM message, in letters.
const IM_MAX = 1000;

// Connect to Firebase. (If it can't load, like with no internet, the windows say so.)
let database = null, firebaseAuth = null;
try {
  firebase.initializeApp(FIREBASE_CONFIG);
  database = firebase.firestore();
  firebaseAuth = firebase.auth();
} catch (problem) {
  console.log("Firebase didn't load:", problem);
}

state.online = database ? "connecting" : "offline";   // see drawOnlineProblem() for what each means
state.ims = [];           // IM messages: { id, from, text, sentAt }
state.oldNotes = [];      // his old Notepad notes, shown at the top of the chat
state.remoteDates = [];   // dates you two have planned for each other (from Firebase)
state.remoteLetters = []; // "Open when..." letters you two have written each other on the site
state.remoteNotes = [];   // love notes you've written on the site (from Firebase)


// In the preview of his side (on your computer), nothing gets sent as him. Returns true
// (and says so) if this is the preview.
function blockedInPreview() {
  if (!state.previewingHisSide) return false;
  showPopup("PREVIEW", `This is just a preview of ${RECIPIENT_NAME}'s side, so nothing was sent.`);
  return true;
}

// Things this browser remembers are kept separately for each side, so your side and
// the preview of his side (in the same browser) don't mix them up.
const SIDE = IS_TAYLER ? "tayler" : "jacob";

// ---------- Sending a Discord ping to the other person ----------

function pingOther(text) {
  const url = IS_TAYLER ? DISCORD_TO_JACOB : DISCORD_TO_TAYLER;
  if (!url) return;
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: text }),
  }).catch(() => {});   // if Discord doesn't answer, that's okay
}


// ---------- Signing in (you) and pairing (him) ----------

// If he opened the pairing link, remember the code, then tidy the link in the address bar.
const pairCode = PREVIEW.get("pair");
if (pairCode) history.replaceState(null, "", location.pathname);

let listening = false;

if (firebaseAuth) {
  firebaseAuth.onAuthStateChanged(async user => {
    if (IS_TAYLER) {
      // Your side: you need to be signed in with your Google account.
      if (!user || user.isAnonymous) {
        state.online = "signin";
        return;
      }
      startListening();
      return;
    }

    // His link, opened on YOUR computer while you're signed in: a preview of his side.
    // It shows everything he'd see, but won't send anything as him.
    if (user && !user.isAnonymous) {
      state.previewingHisSide = true;
      startListening();
      return;
    }

    // His side: sign in "anonymously" behind the scenes (no account, nothing to type).
    if (!user) {
      firebaseAuth.signInAnonymously().catch(() => { state.online = "offline"; });
      return;
    }
    // First time, with the pairing link: tell Firebase this browser is his.
    if (pairCode) {
      try {
        await database.collection("devices").doc(user.uid).set({
          code: pairCode,
          pairedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        state.popup = { title: "CONNECTED", message: `This computer is connected to ${YOUR_NAME}'s now! 💗` };
      } catch (problem) {
        console.log("Pairing didn't work:", problem);
        state.popup = { title: "OOPS", message: "That connection link didn't work. Ask for a new one?" };
      }
    }
    startListening();
  });
}

function signIn() {
  playSound("click");
  firebaseAuth.signOut()
    .then(() => firebaseAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()))
    .catch(problem => console.log("Sign-in problem:", problem));
}

// Keep listening for new messages and dates. New ones show up right away.
function startListening() {
  if (listening) return;
  listening = true;
  state.online = "ok";

  const failed = problem => {
    console.log("Couldn't load:", problem);
    listening = false;
    state.online = IS_TAYLER ? "wrongaccount" : "unpaired";
  };

  database.collection("IMs").orderBy("sentAt").limitToLast(300).onSnapshot(snapshot => {
    state.ims = snapshot.docs.map(doc => ({
      id: doc.id,
      from: doc.data().from,
      text: doc.data().text,
      sentAt: doc.data().sentAt ? doc.data().sentAt.toDate() : new Date(),
    }));
    checkForNewIMs();
  }, failed);

  database.collection("guestbook").orderBy("sentAt").onSnapshot(snapshot => {
    state.oldNotes = snapshot.docs.map(doc => ({
      id: doc.id,
      from: doc.data().from || RECIPIENT_NAME,
      text: doc.data().text,
      sentAt: doc.data().sentAt ? doc.data().sentAt.toDate() : new Date(),
    }));
  }, () => {});

  database.collection("dates").orderBy("sentAt").onSnapshot(snapshot => {
    state.remoteDates = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    checkForNewDates();
  }, failed);

  listenForGames(failed);
  listenForScores(failed);
  listenForHouse(failed);
  listenForAccepts(failed);
  listenForDateNight();

  database.collection("notes").orderBy("sentAt").onSnapshot(snapshot => {
    state.remoteNotes = snapshot.docs.map(doc => ({ id: doc.id, label: doc.data().label, text: doc.data().text }));
    // His side: a pop-up for a love note he hasn't read yet (once).
    if (!IS_TAYLER) {
      state.remoteNotes.filter(note => !noteIsRead(note) && !remembers(`${SIDE}:notenews:${note.id}`)).forEach(note => {
        remember(`${SIDE}:notenews:${note.id}`);
        notify("LOVE NOTE", `${YOUR_NAME} left you a new love note! It's on your desktop 💌`);
      });
    }
  }, failed);

  database.collection("letters").orderBy("sentAt").onSnapshot(snapshot => {
    state.remoteLetters = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    checkForNewLetters();
  }, failed);
}

// A pop-up for each new letter (once).
let knownLetters = null;
function checkForNewLetters() {
  const unread = unreadLetters();
  const isNew = knownLetters === null ? unread.length > 0 : unread.some(letter => !knownLetters.has(letter.id));
  knownLetters = new Set(state.remoteLetters.map(letter => letter.id));
  if (isNew) notify("NEW LETTER", `${OTHER} wrote you a new "Open when..." letter! 💌`);
}

// Saves a new "Open when..." letter and pings the other person.
// password and unlocks (a day like "2026-12-25") are optional locks; "" means no lock.
//   unlocks: a day like "2026-12-25", "" for no date lock, or null for "locked until we meet".
//   replaces: when editing one of the letters written in this file, its "when" (so the
//             edited copy takes its place). Edited copies don't ping.
async function sendLetter(when, text, password = "", unlocks = "", replaces = null) {
  if (blockedInPreview()) throw new Error("preview");
  const letter = { when, text, from: ME, sentAt: firebase.firestore.FieldValue.serverTimestamp() };
  if (password) letter.password = password;
  if (unlocks || unlocks === null) letter.unlocks = unlocks;
  if (replaces) letter.replaces = replaces;
  await database.collection("letters").add(letter);
  if (!replaces) pingOther(`💌 ${ME} wrote you a new "Open when..." letter on the little computer!`);
}

// Saves changes to a letter you already sent. (An empty password or date removes that lock;
// unlocks: null keeps it "locked until we meet".)
async function updateLetter(letter, when, text, password = "", unlocks = "") {
  if (blockedInPreview()) throw new Error("preview");
  const remove = firebase.firestore.FieldValue.delete();
  await database.collection("letters").doc(letter.id).update({
    when,
    text,
    password: password || remove,
    unlocks: unlocks === null ? null : (unlocks || remove),
    editedAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
}


// ---------- Pop-ups for new things ----------

// Shows a pop-up, but if he's still on the MWAHHH start screen, waits until he clicks it.
// (yes is optional: a second button, like { text: "Update", onClick: ... }.)
function notify(title, message, yes = null) {
  const popup = yes ? { title, message, yes } : { title, message };
  if (state.mode === "desktop" && !state.popup) {
    playSound("incoming");
    state.popup = popup;
  } else {
    state.waitingPopups = [...(state.waitingPopups || []), popup];
  }
}

// Shows any waiting pop-ups (one after another, each time the last one is closed).
function showWaitingPopups() {
  if (state.mode !== "desktop" || state.popup || !state.waitingPopups || !state.waitingPopups.length) return;
  playSound("incoming");
  state.popup = state.waitingPopups.shift();
}

// Remembers the newest message time he's seen, so new ones get a NEW tag.
function lastSeenIM() {
  try { return Number(localStorage.getItem(`${SIDE}:imSeen`)) || 0; } catch (problem) { return 0; }
}

function unreadIMs() {
  return state.ims.filter(message => message.from !== ME && message.sentAt.getTime() > lastSeenIM());
}

let knownIMs = null;
function checkForNewIMs() {
  const isNew = knownIMs === null ? unreadIMs().length > 0
                                  : unreadIMs().some(message => !knownIMs.has(message.id));
  knownIMs = new Set(state.ims.map(message => message.id));
  const imOnTop = topWindow() && topWindow().window === "im";
  if (isNew && !imOnTop) notify("NEW MESSAGE", `${OTHER} sent you a message! Open IM to read it.`);
}

// Each date only pops up once per change (planned, new time, accepted).
const notifiedDates = new Set();
function checkForNewDates() {
  state.remoteDates.forEach(date => {
    const version = `${date.id}:${date.status}:${date.proposedBy}:${date.when && date.when.seconds}`;
    if (notifiedDates.has(version) || remembers(`${SIDE}:dateseen:${version}`)) return;
    notifiedDates.add(version);
    if (needsMyAnswer(date)) {
      notify("NEW DATE", date.proposedBy ? `${date.proposedBy} suggested a new time for your date!`
                                         : `${date.from} planned a date for you! 💌`);
    } else if (date.status === "accepted" && date.from === ME) {
      notify("YIPPIE", `${OTHER} accepted your date! 🎉`);
    }
    remember(`${SIDE}:dateseen:${version}`);
  });
}


// ---------- Times in both of your time zones ----------

// Splits a moment into its year, month, day, hour, and minute in one time zone.
function zonedParts(date, timeZone) {
  const format = new Intl.DateTimeFormat("en-US", {
    timeZone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  });
  return Object.fromEntries(format.formatToParts(date).map(part => [part.type, part.value]));
}

// A day like "2026-11-06" and a time like "21:00", in a time zone, as a real moment.
function zonedTimeToDate(day, time, timeZone) {
  const [year, month, dayNumber] = day.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const wanted = Date.UTC(year, month - 1, dayNumber, hour, minute);
  let guess = wanted;
  // Guess, check what that looks like in the time zone, and fix the difference (twice, to be sure).
  for (let i = 0; i < 2; i++) {
    const parts = zonedParts(new Date(guess), timeZone);
    guess += wanted - Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute);
  }
  return new Date(guess);
}

function dayIn(date, timeZone) {
  const parts = zonedParts(date, timeZone);
  return `${parts.year}-${parts.month}-${parts.day}`;
}
function timeIn(date, timeZone) {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone });
}
function longDayIn(date, timeZone) {
  return date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", timeZone });
}

// "Friday, Nov 6" + "9:00 PM your time, 2:00 PM Tayler's time"
function bothTimes(date) {
  return `${longDayIn(date, MY_TIME_ZONE)}\n${timeIn(date, MY_TIME_ZONE)} your time, ${timeIn(date, OTHER_TIME_ZONE)} ${OTHER}'s time`;
}

// A date like "Oct 26, 9:15 PM".
function formatDate(date) {
  return date.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}


// ---------- Dates you plan for each other ----------

// Is it this person's turn to answer? (They didn't make the last change, and it's not accepted yet.)
function needsMyAnswer(date) {
  return date.status === "pending" && (date.proposedBy || date.from) !== ME;
}

// Turns a date from Firebase into the same shape as the INVITES list, so the envelope,
// letter, and buttons all work the same way.
function remoteInvite(date) {
  const when = date.when.toDate();
  return {
    id: `remote:${date.id}`,
    remote: date,
    date: dayIn(when, MY_TIME_ZONE),
    label: when.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: MY_TIME_ZONE }),
    opening: date.opening,
    subtitle: date.subtitle,
    title: date.title,
    plan: date.plan,
    bring: date.bring,
    when: bothTimes(when),
    declines: date.declines && date.declines.length ? date.declines : null,
    colors: date.colors || null,
  };
}

// The colors you can pick for an invite: [name in the code, label in the form].
const INVITE_COLOR_CHOICES = [
  ["screen", "Background"], ["text", "Words"], ["buttons", "Buttons"], ["paper", "Paper"],
];
const DEFAULT_INVITE_COLORS = {
  screen: COLORS.screen, text: COLORS.text, buttons: COLORS.acceptFill, paper: COLORS.letterPaper,
};

// While an invite with its own colors is playing, the usual colors are swapped for its
// colors, then put back afterwards.
function withInviteColors(colors, job) {
  if (!colors) return job();
  const saved = { ...COLORS };
  Object.assign(COLORS, {
    screen: colors.screen, text: colors.text,
    acceptFill: colors.buttons, heart: colors.buttons, envelopeLine: colors.buttons,
    letterPaper: colors.paper, envelopePaper: colors.paper, cream: colors.paper,
  });
  try { return job(); } finally { Object.assign(COLORS, saved); }
}

// Every invite on this computer:
//   - The ones written into this file (INVITES) are from you to him, so only HIS side has them.
//   - Planned ones show up for whoever they were sent TO (and for the sender too, if the
//     other person suggested a new time and it's their turn to answer).
function allInvites() {
  // (A written invite that got a new time is replaced by the new one.)
  // (On your side, the invites written in this file show too, as ones you sent him.)
  const moved = id => state.remoteDates.some(date => date.rescheduleOf === id);
  const written = INVITES.filter(invite => !moved(invite.id)).map(invite => (IS_TAYLER ? { ...invite, sentByMe: true } : invite));
  // Planned dates show for both of you: the person they're for, and the person who sent them.
  const planned = state.remoteDates.filter(date => date.when);
  return [...written, ...planned.map(remoteInvite)];
}

function declinesFor(invite) {
  return (invite && invite.declines) || DECLINE_MESSAGES;
}

// Saves a planned date to Firebase and pings the other person.
async function sendDate(form) {
  if (blockedInPreview()) throw new Error("preview");
  const when = zonedTimeToDate(form.day, form.time, MY_TIME_ZONE);
  await database.collection("dates").add({
    from: ME,
    to: OTHER,
    opening: form.opening,
    subtitle: form.subtitle,
    title: form.title,
    plan: form.plan,
    bring: form.bring,
    when: firebase.firestore.Timestamp.fromDate(when),
    declines: form.declines,
    colors: form.colors,
    status: "pending",
    proposedBy: null,
    sentAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
  pingOther(`📅 ${ME} planned a date for you! Open the little computer to see it 💌`);
}

// Accepting a planned date.
function acceptRemoteDate(date) {
  if (blockedInPreview()) return;
  database.collection("dates").doc(date.id).update({
    status: "accepted",
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  }).catch(problem => console.log("Couldn't accept:", problem));
  pingOther(`🎉 ${ME} accepted your date! It's a date!`);
}

// Suggesting a new time for a planned date.
async function rescheduleRemoteDate(date, day, time) {
  if (blockedInPreview()) throw new Error("preview");
  const when = zonedTimeToDate(day, time, MY_TIME_ZONE);
  await database.collection("dates").doc(date.id).update({
    when: firebase.firestore.Timestamp.fromDate(when),
    proposedBy: ME,
    status: "pending",
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
  pingOther(`🕐 ${ME} suggested a new time for your date: ${longDayIn(when, OTHER_TIME_ZONE)}, ${timeIn(when, OTHER_TIME_ZONE)} your time.`);
}


// Accepting an invite written into this file: saved in Firebase ("accepts"), so the
// person who sent it gets a pop-up and a green check on their copy.
function acceptWrittenInvite(invite) {
  if (state.online !== "ok" || state.previewingHisSide) return;
  database.collection("accepts").doc(invite.id).set({
    by: ME, acceptedAt: firebase.firestore.FieldValue.serverTimestamp(),
  }).catch(problem => console.log("Couldn't save the accept:", problem));
  pingOther(`🎉 ${ME} accepted your date! It's a date!`);
}

// Your side: a pop-up (once) when he accepts one of the invites written in this file.
state.accepts = {};
function listenForAccepts(failed) {
  database.collection("accepts").onSnapshot(snapshot => {
    snapshot.docs.forEach(doc => {
      state.accepts[doc.id] = doc.data();
      const seen = `${SIDE}:acceptnews:${doc.id}`;
      if (doc.data().by === OTHER && !remembers(seen)) {
        remember(seen);
        notify("YIPPIE", `${OTHER} accepted your date! 🎉`);
      }
    });
  }, failed);
}

// Suggesting a new time for an invite written into this file. It becomes a planned date
// (same words, new time) that the other person sees and can accept or move again.
async function rescheduleWrittenInvite(invite, day, time) {
  if (blockedInPreview()) throw new Error("preview");
  const when = zonedTimeToDate(day, time, MY_TIME_ZONE);
  await database.collection("dates").add({
    from: ME,
    to: OTHER,
    rescheduleOf: invite.id,
    opening: `${ME} suggested a new time!`,
    subtitle: "For our date...",
    title: invite.title,
    plan: invite.plan,
    bring: invite.bring,
    when: firebase.firestore.Timestamp.fromDate(when),
    declines: DECLINE_MESSAGES,
    status: "pending",
    proposedBy: ME,
    sentAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
  pingOther(`🕐 ${ME} suggested a new time for your date: ${longDayIn(when, OTHER_TIME_ZONE)}, ${timeIn(when, OTHER_TIME_ZONE)} your time.`);
}


// ---------- The IM chat ----------

// Every chat message, oldest first (his old Notepad notes first).
function chatMessages() {
  return [...state.oldNotes, ...state.ims];
}

async function sendIM(text) {
  if (blockedInPreview()) throw new Error("preview");
  await database.collection("IMs").add({
    text,
    from: ME,
    sentAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
  playSound("coin", 0.6);
  // Only ping once per chat burst.
  let lastPing = 0;
  try { lastPing = Number(localStorage.getItem(`${SIDE}:imPinged`)) || 0; } catch (problem) {}
  if (Date.now() - lastPing > IM_PING_QUIET_MINUTES * 60000) {
    pingOther(`💬 ${ME} sent you a message on the little computer!`);
    try { localStorage.setItem(`${SIDE}:imPinged`, String(Date.now())); } catch (problem) {}
  }
}

// Draws the chat: bubbles for each message (yours on the right in pink, theirs on the left),
// and a typing box along the bottom.
function drawIM(inside) {
  if (state.online !== "ok") {
    drawOnlineProblem(inside, `chat with ${OTHER}`);
    return;
  }

  const chat = { left: inside.left + 4, top: inside.top + 4, right: inside.right - 4, bottom: inside.bottom - 32 };
  ctx.fillStyle = COLORS.white;
  ctx.fillRect(chat.left, chat.top, chat.right - chat.left, chat.bottom - chat.top);
  ctx.strokeStyle = COLORS.text;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(chat.left, chat.top, chat.right - chat.left, chat.bottom - chat.top);

  // Work out every bubble's size first.
  const lineHeight = 16;
  const maxText = (chat.right - chat.left) * 0.7 - 16;
  const bubbles = chatMessages().map(message => {
    const lines = wrapWords(message.text, FONTS.note, maxText);
    ctx.font = FONTS.note;
    const textWidth = Math.max(...lines.map(line => ctx.measureText(line).width), 30);
    return { message, lines, width: textWidth + 16, height: lines.length * lineHeight + 26 };
  });
  const contentHeight = bubbles.reduce((sum, bubble) => sum + bubble.height, 0) + 8;

  // Scrolling: it stays at the newest message unless he's scrolled up to read older ones.
  const wasAtBottom = state.imScroll >= state.imMaxScroll - 2;
  state.imMaxScroll = Math.max(0, contentHeight - (chat.bottom - chat.top));
  if (wasAtBottom) state.imScroll = state.imMaxScroll;
  state.imScroll = keepBetween(state.imScroll, 0, state.imMaxScroll);

  ctx.save();
  ctx.beginPath();
  ctx.rect(chat.left + 1, chat.top + 1, chat.right - chat.left - 2, chat.bottom - chat.top - 2);
  ctx.clip();
  if (bubbles.length === 0) {
    write(`Say hi to ${OTHER}!`, (chat.left + chat.right) / 2, (chat.top + chat.bottom) / 2, FONTS.body, COLORS.lostLife);
  }
  let y = chat.top + 6 - state.imScroll;
  bubbles.forEach(({ message, lines, width, height }) => {
    const mine = message.from === ME;
    const left = mine ? chat.right - 8 - width : chat.left + 8;
    // A tiny "name, time" line above the bubble.
    write(`${message.from}, ${formatDate(message.sentAt)}`, mine ? chat.right - 8 : chat.left + 8, y + 5,
          FONTS.tag, COLORS.text, mine ? "right" : "left");
    steppedBox(left, y + 12, left + width, y + height - 4, 3,
               mine ? COLORS.acceptFill : COLORS.cream, COLORS.text, 1.5);
    lines.forEach((line, number) => {
      write(line, left + 8, y + 16 + number * lineHeight, FONTS.note, mine ? COLORS.acceptText : COLORS.text, "left", "top");
    });
    y += height;
  });
  ctx.restore();

  // A little scrollbar when there's more to scroll to.
  if (state.imMaxScroll > 0) {
    const track = chat.bottom - chat.top - 4;
    const thumb = Math.max(16, track * (chat.bottom - chat.top) / contentHeight);
    ctx.fillStyle = COLORS.acceptFill;
    ctx.fillRect(chat.right - 6, chat.top + 2 + (track - thumb) * state.imScroll / state.imMaxScroll, 4, thumb);
  }

  // The typing box is a real text box (so phones get a keyboard), placed on top of the drawing.
  requestPanel("im", { left: inside.left + 4, top: inside.bottom - 28, right: inside.right - 4, bottom: inside.bottom - 4 });

  // While the chat is the window on top, everything in it counts as read.
  if (state.windowOnTop) {
    const newest = state.ims.filter(message => message.from !== ME).pop();
    if (newest && newest.sentAt.getTime() > lastSeenIM()) {
      try { localStorage.setItem(`${SIDE}:imSeen`, String(newest.sentAt.getTime())); } catch (problem) {}
    }
  }
}


// ---------- The "Plan a date" window ----------

function drawPlan(inside) {
  if (state.online !== "ok") {
    drawOnlineProblem(inside, `plan a date for ${OTHER}`);
    return;
  }
  // The whole form is real text boxes and a real calendar, placed on top of the drawing.
  requestPanel("plan", inside);
}


// ---------- When the online windows can't connect ----------

function drawOnlineProblem(inside, what) {
  const middle = (inside.left + inside.right) / 2;
  const say = (text, y, font = FONTS.note, color = COLORS.text) => {
    wrapWords(text, font, inside.right - inside.left - 40).forEach((line, number) => {
      write(line, middle, y + number * 18, font, color);
    });
  };
  if (state.online === "connecting") {
    say("Connecting...", inside.top + 90, FONTS.body);
  } else if (state.online === "offline") {
    say("Can't connect right now. Check your internet?", inside.top + 90);
  } else if (state.online === "signin" || state.online === "wrongaccount") {
    drawPixels(LOCK, middle - 10, inside.top + 20, 4, COLORS.text);
    say(`Sign in to ${what}`, inside.top + 66, FONTS.body);
    if (state.online === "wrongaccount") say("That Google account isn't allowed. Try yours?", inside.top + 90, FONTS.tag, COLORS.newTag);
    drawButton(middle, inside.top + 130, 200, 30, "Sign in with Google", COLORS.acceptFill, COLORS.acceptText, signIn);
  } else if (state.online === "unpaired") {
    drawPixels(LOCK, middle - 10, inside.top + 20, 4, COLORS.text);
    say(`This computer isn't connected yet. Ask ${YOUR_NAME} for your special link!`, inside.top + 70);
  }
}


// ---------- Real text boxes on top of the drawing ----------
//
// The canvas can't make a phone keyboard pop up, and it can't show a calendar. So these
// parts are real web-page boxes, placed exactly on top of the right window each frame.

const ui = document.getElementById("ui");
const panels = {};
let panelRequests = {};

// Is he typing in one of the real text boxes? (Then keys shouldn't jump or pause games.)
function isTypingInForm(event) {
  return /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName);
}

// A window asks for its panel to be shown, in this spot, this frame.
function requestPanel(name, box) {
  panelRequests[name] = { box, onTop: state.windowOnTop };
}

// After drawing, show the requested panels in the right spots, and hide the rest.
function placePanels() {
  const rect = canvas.getBoundingClientRect();
  ui.style.left = `${rect.left}px`;
  ui.style.top = `${rect.top}px`;
  ui.style.transform = `scale(${rect.width / WIDTH})`;
  Object.entries(panels).forEach(([name, panel]) => {
    const request = panelRequests[name];
    // Only for the window on top (or, for "Suggest a new time", on the date's letter),
    // and not while a pop-up, menu, or screensaver is in the way.
    const inRightPlace = name === "reschedule" ? state.mode === "invite"
                                               : request && request.onTop && state.mode === "desktop";
    const show = request && inRightPlace && !state.popup && !state.startMenu &&
                 !state.powerMenu && !state.screensaver;
    if (show) {
      const box = request.box;
      // If the window is dragged partway off the screen, trim the panel at the screen's
      // edges too (so the typing box doesn't hang over the computer's frame).
      // (These can be negative, meaning "the screen's edge is further out than the panel",
      // so things that pop up outside the panel, like the emoji menu, still show.)
      const trim = {
        left: SCREEN.left - box.left,
        right: box.right - SCREEN.right,
        top: SCREEN.top - box.top,
        bottom: box.bottom - TASKBAR.top,
      };
      Object.assign(panel.style, {
        display: "block",
        left: `${box.left}px`, top: `${box.top}px`,
        width: `${box.right - box.left}px`, height: `${box.bottom - box.top}px`,
        clipPath: `inset(${trim.top}px ${trim.right}px ${trim.bottom}px ${trim.left}px)`,
      });
    } else {
      // (ownerDocument = whichever window the panel is in, in case it's popped out.)
      const focused = panel.ownerDocument.activeElement;
      if (panel.contains(focused)) focused.blur();
      panel.style.display = "none";
    }
  });
  panelRequests = {};
}

// Makes a panel from some HTML.
function makePanel(name, html) {
  const panel = document.createElement("div");
  panel.className = "panel";
  panel.innerHTML = html;
  ui.appendChild(panel);
  panels[name] = panel;
  return panel;
}

// Turns a pixel emoji into a little picture the web page can show (for the emoji menu).
function emojiPicture(emoji) {
  const { rows, colors } = EMOJI_PIXELS[emoji];
  const picture = document.createElement("canvas");
  picture.width = rows[0].length * 3;
  picture.height = rows.length * 3;
  const pen = picture.getContext("2d");
  rows.forEach((row, rowNumber) => [...row].forEach((letter, columnNumber) => {
    if (!colors[letter]) return;
    pen.fillStyle = colors[letter];
    pen.fillRect(columnNumber * 3, rowNumber * 3, 3, 3);
  }));
  return picture.toDataURL();
}

// The IM typing box, with a heart button that opens the pixel emoji menu.
const imPanel = makePanel("im", `
  <div class="picker" hidden>
    ${Object.keys(EMOJI_PIXELS).map(emoji =>
      `<button type="button" data-emoji="${emoji}"><img src="${emojiPicture(emoji)}" alt="${emoji}"></button>`).join("")}
  </div>
  <form class="im-row">
    <button type="button" class="emoji-button" title="Emojis"><img src="${emojiPicture("💗")}" alt="emojis"></button>
    <input name="text" maxlength="${IM_MAX}" placeholder="Type a message..." autocomplete="off">
    <button>Send</button>
  </form>`);

// The heart button opens and closes the emoji menu.
const emojiMenu = imPanel.querySelector(".picker");
imPanel.querySelector(".emoji-button").addEventListener("click", () => {
  playSound("click");
  emojiMenu.hidden = !emojiMenu.hidden;
});
// Clicking an emoji adds it to the message (and closes the menu).
emojiMenu.addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;
  playKeySound(0.3);
  const box = imPanel.querySelector("input");
  box.value += button.dataset.emoji;
  emojiMenu.hidden = true;
  box.focus();
});
imPanel.querySelector("form").addEventListener("submit", async event => {
  event.preventDefault();
  const box = imPanel.querySelector("input");
  const text = box.value.trim();
  if (!text) return;
  box.value = "";
  try {
    await sendIM(text);
  } catch (problem) {
    console.log("Couldn't send:", problem);
    box.value = text;
    playSound("buzzer", BUZZER_VOLUME);
  }
});
imPanel.querySelector("input").addEventListener("keydown", () => playKeySound(0.25));

// The "Plan a date" form. Everything starts filled in with the usual words, so he only
// has to change what he wants.
const escapeHTML = text => text.replace(/[&<>"]/g, letter => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[letter]);
const planPanel = makePanel("plan", `
  <form class="plan">
    <div class="sent" hidden>
      <p class="big">Sent! 💌</p>
      <p>It's on ${OTHER}'s desktop now.</p>
      <button type="button" class="again">Plan another</button>
    </div>
    <div class="fields">
      <label>Opening message <input name="opening" maxlength="60" value="${escapeHTML(`Psst, ${OTHER}...`)}"></label>
      <label>Line under it <input name="subtitle" maxlength="80" value="${escapeHTML(GREETING_SUBTITLE)}"></label>
      <label>Title <input name="title" maxlength="40" value="${escapeHTML(`${OTHER}, be my date?`)}"></label>
      <label>Plan <input name="plan" maxlength="80" placeholder="Top secret"></label>
      <label>What to bring <input name="bring" maxlength="80" placeholder="Your cute self"></label>
      <div class="two">
        <label>Day <input name="day" type="date" required></label>
        <label>Time (yours) <input name="time" type="time" step="900" value="21:00" required></label>
      </div>
      <p class="hint"></p>
      <p class="section">Decline jokes (one for each time they click Decline)</p>
      ${DECLINE_MESSAGES.map((joke, number) =>
        `<input name="decline${number}" maxlength="70" value="${escapeHTML(joke)}">`).join("")}
      <p class="section">Colors</p>
      <div class="colors">
        ${INVITE_COLOR_CHOICES.map(([key, label]) =>
          `<label><input name="color-${key}" type="color" value="${DEFAULT_INVITE_COLORS[key]}"> ${label}</label>`).join("")}
      </div>
      <p class="problem"></p>
      <div class="two">
        <button type="button" class="preview cancel">Preview</button>
        <button>Send invite</button>
      </div>
    </div>
  </form>`);

const planForm = planPanel.querySelector("form");

// Under the time: what that time is for the other person.
function updatePlanHint() {
  const { day, time } = planForm.elements;
  const hint = planPanel.querySelector(".hint");
  if (!day.value || !time.value) {
    hint.textContent = "";
    return;
  }
  const when = zonedTimeToDate(day.value, time.value, MY_TIME_ZONE);
  hint.textContent = `That's ${timeIn(when, OTHER_TIME_ZONE)} on ${longDayIn(when, OTHER_TIME_ZONE)} for ${OTHER}.`;
}
planForm.addEventListener("input", updatePlanHint);

// Everything filled into the form (with the usual words for anything left empty).
function planFormValues() {
  const field = name => planForm.elements[name].value.trim();
  const colors = {};
  INVITE_COLOR_CHOICES.forEach(([key]) => { colors[key] = field(`color-${key}`); });
  return {
    opening: field("opening") || `Psst, ${OTHER}...`,
    subtitle: field("subtitle"),
    title: field("title") || `${OTHER}, be my date?`,
    plan: field("plan") || "Top secret",
    bring: field("bring") || "Your cute self",
    day: field("day"),
    time: field("time"),
    declines: DECLINE_MESSAGES.map((joke, number) => field(`decline${number}`) || joke),
    colors,
  };
}

// The Preview button plays the invite right here, just for you (nothing gets sent).
planPanel.querySelector(".preview").addEventListener("click", () => {
  const form = planFormValues();
  const when = form.day && form.time ? zonedTimeToDate(form.day, form.time, MY_TIME_ZONE) : null;
  openInvite({
    id: "preview",
    preview: true,
    opening: form.opening,
    subtitle: form.subtitle,
    title: form.title,
    plan: form.plan,
    bring: form.bring,
    // (The preview shows the time the way the other person will see it.)
    when: when ? `${longDayIn(when, OTHER_TIME_ZONE)}\n${timeIn(when, OTHER_TIME_ZONE)} your time, ${timeIn(when, MY_TIME_ZONE)} ${ME}'s time`
               : "(pick a day and time)",
    declines: form.declines,
    colors: form.colors,
  });
});

planForm.addEventListener("submit", async event => {
  event.preventDefault();
  const form = planFormValues();
  const problem = planPanel.querySelector(".problem");
  if (!form.day || !form.time) {
    problem.textContent = "Pick a day and a time!";
    return;
  }
  problem.textContent = "Sending...";
  try {
    await sendDate(form);
    problem.textContent = "";
    playSound("win", 0.5);
    planPanel.querySelector(".sent").hidden = false;
    planPanel.querySelector(".fields").hidden = true;
  } catch (trouble) {
    console.log("Couldn't send the date:", trouble);
    problem.textContent = "Couldn't send. Try again?";
    playSound("buzzer", BUZZER_VOLUME);
  }
});

planPanel.querySelector(".again").addEventListener("click", () => {
  playSound("click");
  planForm.reset();
  updatePlanHint();
  planPanel.querySelector(".sent").hidden = true;
  planPanel.querySelector(".fields").hidden = false;
});

// The "Write one" form for a new "Open when..." letter.
const letterPanel = makePanel("letter", `
  <form class="plan letter-form">
    <label>Open when... <input name="when" maxlength="32" placeholder="you miss me" required></label>
    <label>Your letter
      <textarea name="text" maxlength="3000" rows="7" placeholder="hi baby..." required></textarea>
    </label>
    <p class="section">Lock it? (optional, leave empty for no lock)</p>
    <div class="two">
      <label>Password <input name="password" maxlength="30" placeholder="no password" autocomplete="off"></label>
      <label>Unlocks on <input name="unlocks" type="date"></label>
    </div>
    <p class="problem"></p>
    <div class="two">
      <button type="button" class="cancel">Cancel</button>
      <button class="send">Send letter</button>
    </div>
  </form>`);
const letterForm = letterPanel.querySelector("form");

// The letter being edited (or null when writing a new one).
let editingLetter = null;

// Closes the form (in the window it's in) and empties it.
function closeLetterForm() {
  const win = state.windows.find(other => other.window === "openwhen");
  if (win) win.writingLetter = false;
  letterForm.reset();
  letterPanel.querySelector(".problem").textContent = "";
  letterPanel.querySelector(".send").textContent = "Send letter";
  editingLetter = null;
}

// Clicking one of your sent letters: the same form, filled in with that letter.
function editLetter(letter) {
  playSound("click");
  editingLetter = letter;
  const fields = letterForm.elements;
  fields.when.value = letter.when;
  fields.text.value = letter.text;
  fields.password.value = letter.password || "";
  fields.unlocks.value = letter.unlocks || "";
  letterPanel.querySelector(".send").textContent = "Save changes";
  // The "we're about to meet" letter is locked with no date yet. Leaving the date empty keeps it that way.
  letterPanel.querySelector(".problem").textContent = letter.unlocks === null
    ? "This one stays locked until you meet (unless you pick an unlock date)." : "";
  state.writingLetter = true;
}

// The letters you've sent, oldest first. On your side, that includes the ones written
// in this file (OPEN_WHEN), or their edited copies.
function sentLetters() {
  const written = IS_TAYLER ? OPEN_WHEN.map(letter => editedCopyOf(letter) || letter) : [];
  return [...written, ...state.remoteLetters.filter(letter => letter.from === ME && !letter.replaces)];
}

letterPanel.querySelector(".cancel").addEventListener("click", () => {
  playSound("click");
  closeLetterForm();
});

letterForm.addEventListener("submit", async event => {
  event.preventDefault();
  const when = letterForm.elements.when.value.trim().replace(/^open when\s*/i, "");
  const text = letterForm.elements.text.value.trim();
  const password = letterForm.elements.password.value.trim();
  const unlocks = letterForm.elements.unlocks.value;
  const problem = letterPanel.querySelector(".problem");
  if (!when || !text) {
    problem.textContent = "Fill in both parts!";
    return;
  }
  problem.textContent = editingLetter ? "Saving..." : "Sending...";
  try {
    const editing = editingLetter;
    // A letter locked "until we meet" (no date) stays that way if the date is left empty.
    const keepLocked = editing && editing.unlocks === null && !unlocks;
    if (editing && editing.id) {
      await updateLetter(editing, when, text, password, keepLocked ? null : unlocks);
    } else if (editing) {
      // One of the letters written in this file: save an edited copy that takes its place.
      await sendLetter(when, text, password, keepLocked ? null : unlocks, editing.when);
    } else {
      await sendLetter(when, text, password, unlocks);
    }
    playSound("win", 0.5);
    closeLetterForm();
    showPopup(editing ? "SAVED" : "SENT", editing ? "Your letter is updated! 💌"
                                                  : `Your letter is in ${OTHER}'s "Open when..." folder now! 💌`);
  } catch (trouble) {
    console.log("Couldn't send the letter:", trouble);
    problem.textContent = "Couldn't send. Try again?";
    playSound("buzzer", BUZZER_VOLUME);
  }
});

// The "Write one" form for a new love note (your side only). It shows up on his desktop
// as "love_note" with a NEW tag, like the ones written in this file.
const loveNotePanel = makePanel("lovenote", `
  <form class="plan">
    <label>Label (shows under it in Memories) <input name="label" maxlength="20" required></label>
    <label>Your love note
      <textarea name="text" maxlength="1500" rows="8" placeholder="Hi Jacob..." required></textarea>
    </label>
    <p class="problem"></p>
    <div class="two">
      <button type="button" class="cancel">Cancel</button>
      <button>Send love note</button>
    </div>
  </form>`);
const loveNoteForm = loveNotePanel.querySelector("form");

// Today's date as a label, like "Oct 27, 2026".
function todayLabel() {
  return new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: MY_TIME_ZONE });
}

function closeLoveNoteForm() {
  const win = state.windows.find(other => other.window === "memories");
  if (win) win.writingNote = false;
  loveNoteForm.reset();
  loveNotePanel.querySelector(".problem").textContent = "";
}

loveNotePanel.querySelector(".cancel").addEventListener("click", () => {
  playSound("click");
  closeLoveNoteForm();
});

loveNoteForm.addEventListener("submit", async event => {
  event.preventDefault();
  const label = loveNoteForm.elements.label.value.trim() || todayLabel();
  const text = loveNoteForm.elements.text.value.trim();
  const problem = loveNotePanel.querySelector(".problem");
  if (!text) {
    problem.textContent = "Write something first!";
    return;
  }
  if (blockedInPreview()) return;
  problem.textContent = "Sending...";
  try {
    await database.collection("notes").add({
      label, text, from: ME, sentAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    pingOther(`💌 ${ME} left you a new love note on the little computer!`);
    playSound("win", 0.5);
    closeLoveNoteForm();
    showPopup("SENT", `Your love note is on ${OTHER}'s desktop now! 💌`);
  } catch (trouble) {
    console.log("Couldn't send the love note:", trouble);
    problem.textContent = "Couldn't send. Try again?";
    playSound("buzzer", BUZZER_VOLUME);
  }
});

// Fill in today's date as the label whenever the form opens empty.
setInterval(() => {
  if (!loveNoteForm.elements.label.value && loveNotePanel.style.display === "block") {
    loveNoteForm.elements.label.value = todayLabel();
  }
}, 300);

// The password box for a locked letter.
const letterPassPanel = makePanel("letterpass", `
  <form class="reschedule">
    <p class="big">This letter is locked</p>
    <label>Password <input name="password" maxlength="30" autocomplete="off" required></label>
    <p class="problem"></p>
    <div class="two">
      <button type="button" class="cancel">Cancel</button>
      <button>Unlock</button>
    </div>
  </form>`);
const letterPassForm = letterPassPanel.querySelector("form");

// Closes the password box (in the window it's in).
function closePasswordBox() {
  const win = state.windows.find(other => other.window === "openwhen");
  if (win) win.passwordLetter = null;
}

letterPassPanel.querySelector(".cancel").addEventListener("click", () => {
  playSound("click");
  closePasswordBox();
});

letterPassForm.addEventListener("submit", event => {
  event.preventDefault();
  const win = state.windows.find(other => other.window === "openwhen");
  const letter = win && win.passwordLetter;
  if (!letter) return;
  // Capital letters and spaces at the ends don't matter.
  const typed = letterPassForm.elements.password.value.trim().toLowerCase();
  if (typed === letter.password.trim().toLowerCase()) {
    remember(`${SIDE}:unlocked:${letterKey(letter)}`);
    closePasswordBox();
    withWindow(win, () => openLetter(letter));
  } else {
    playSound("buzzer", BUZZER_VOLUME);
    letterPassPanel.querySelector(".problem").textContent = "Wrong password! Try again.";
    letterPassForm.elements.password.select();
  }
});

// The "Suggest a new time" box, shown on top of a planned date's letter.
const reschedulePanel = makePanel("reschedule", `
  <form class="reschedule">
    <p class="big">Suggest a new time</p>
    <div class="two">
      <label>Day <input name="day" type="date" required></label>
      <label>Time (yours) <input name="time" type="time" step="900" required></label>
    </div>
    <p class="hint"></p>
    <div class="two">
      <button type="button" class="cancel">Cancel</button>
      <button>Send</button>
    </div>
  </form>`);
const rescheduleForm = reschedulePanel.querySelector("form");

rescheduleForm.addEventListener("input", () => {
  const { day, time } = rescheduleForm.elements;
  const hint = reschedulePanel.querySelector(".hint");
  hint.textContent = day.value && time.value
    ? `That's ${timeIn(zonedTimeToDate(day.value, time.value, MY_TIME_ZONE), OTHER_TIME_ZONE)} for ${OTHER}.` : "";
});

reschedulePanel.querySelector(".cancel").addEventListener("click", () => {
  playSound("click");
  state.rescheduling = null;
});

rescheduleForm.addEventListener("submit", async event => {
  event.preventDefault();
  const { day, time } = rescheduleForm.elements;
  const date = state.rescheduling;
  try {
    if (date.written) await rescheduleWrittenInvite(date.written, day.value, time.value);
    else await rescheduleRemoteDate(date, day.value, time.value);
    state.rescheduling = null;
    playSound("win", 0.5);
    closeInvite();
    showPopup("NEW TIME", `New time sent! ${OTHER} will see it on their desktop.`);
  } catch (problem) {
    console.log("Couldn't reschedule:", problem);
    playSound("buzzer", BUZZER_VOLUME);
  }
});

// Opens the "Suggest a new time" box, starting at the date's current day and time.
function openReschedule(date) {
  playSound("click");
  if (date.written) {
    // A written invite only knows its day, so it starts at that day, 9pm.
    rescheduleForm.elements.day.value = date.written.date;
    rescheduleForm.elements.time.value = "21:00";
  } else {
    const when = date.when.toDate();
    rescheduleForm.elements.day.value = dayIn(when, MY_TIME_ZONE);
    const parts = zonedParts(when, MY_TIME_ZONE);
    rescheduleForm.elements.time.value = `${parts.hour}:${parts.minute}`;
  }
  rescheduleForm.dispatchEvent(new Event("input"));
  state.rescheduling = date;
}


// ---------- The icons ----------

// A little calendar page with a heart, for "Plan a date".
function drawPlanIcon(x, y) {
  ctx.fillStyle = COLORS.white;
  ctx.fillRect(x - 16, y - 15, 32, 31);
  ctx.fillStyle = COLORS.acceptFill;
  ctx.fillRect(x - 16, y - 15, 32, 9);
  ctx.strokeStyle = COLORS.text;
  ctx.lineWidth = 2;
  ctx.strokeRect(x - 16, y - 15, 32, 31);
  ctx.fillStyle = COLORS.text;
  ctx.fillRect(x - 10, y - 19, 3, 6);    // the rings on top
  ctx.fillRect(x + 7, y - 19, 3, 6);
  drawPixels(HEART, x - 7, y - 2, 2, COLORS.heart);
}

// Two chat bubbles, for IM.
function drawIMIcon(x, y) {
  steppedBox(x - 18, y - 16, x + 8, y + 2, 3, COLORS.white, COLORS.text, 2);
  steppedBox(x - 6, y - 4, x + 18, y + 14, 3, COLORS.acceptFill, COLORS.text, 2);
  ctx.fillStyle = COLORS.text;
  [-12, -6, 0].forEach(dx => ctx.fillRect(x + dx, y - 8, 2, 2));
  drawPixels(HEART, x - 1, y + 2, 1, COLORS.white);
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
  const notes = allLoveNotes();
  const note = notes.find(note => note.id === state.noteId) || notes[notes.length - 1];
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
  invites: { label: "Dates", picture: (x, y) => { drawEmptyFolder(x, y); drawSmallEnvelope(x, y + 3, false); } },
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
  const memories = allInvites().filter(isPast);
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

// Every love note: the ones written in this file (LOVE_NOTES), plus ones you've written on
// the site (with "Write one" in Memories > Love notes), oldest first.
function allLoveNotes() {
  return [...LOVE_NOTES, ...state.remoteNotes];
}

// The love notes in Memories, newest first. His side: the ones he's read.
// Your side: every one you've sent him.
function readNotes() {
  if (IS_TAYLER) return allLoveNotes().reverse();
  return allLoveNotes().filter(noteIsRead).reverse();
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
  // Your side: writing a new love note (a real text box on top), and the button for it.
  if (IS_TAYLER) {
    if (state.writingNote) {
      if (state.online === "ok") requestPanel("lovenote", inside);
      else drawOnlineProblem(inside, `send ${OTHER} a love note`);
      return;
    }
    drawButton(inside.right - 64, inside.bottom - 19, 110, 26, "Write one", COLORS.acceptFill, COLORS.acceptText, () => {
      playSound("click");
      state.writingNote = true;
    });
  }
  if (notes.length === 0) {
    if (IS_TAYLER) drawEmptyFolderMessage(inside, "Love notes you send", `${OTHER} will show up here`);
    else drawEmptyFolderMessage(inside, "Love notes you've read", "will be saved here");
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
  higher: {
    label: "Higher", title: "Higher or lower", picture: drawHigherIcon,
    intro: "Guess if the next card is higher or lower!", bestText: n => `${n} in a row`,
    setup: setupHigher, step: stepHigher,
  },
  breakout: {
    label: "Breakout", title: "Breakout", picture: drawBreakoutIcon,
    intro: "Move with your mouse. Break all the hearts!", bestText: n => `${n} hearts`,
    setup: setupBreakout, step: stepBreakout, action: launchBall,
  },
  whack: {
    label: "Boop", title: "Boop the cats!", picture: drawWhackIcon,
    intro: `Boop the cats (black = 3 points). Don't boop ${OTHER}!`, bestText: n => `${n} points`,
    setup: setupWhack, step: stepWhack,
  },
  // The ones you play TOGETHER (custom = they draw their own window, no Play button).
  tictactoe: {
    label: "Tic-tac-toe", title: "Tic-tac-toe", picture: drawTicTacToeIcon,
    custom: (game, area) => drawTurnGame("tictactoe", game, area), tileText: () => turnGameTileText("tictactoe"),
  },
  connect4: {
    label: "Connect 4", title: "Connect 4", picture: drawConnect4Icon,
    custom: (game, area) => drawTurnGame("connect4", game, area), tileText: () => turnGameTileText("connect4"),
  },
  quiz: {
    label: "Quiz", title: "Couples quiz", picture: drawQuizIcon,
    custom: drawQuiz, tileText: quizTileText,
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
    // (Long names like "Tic-tac-toe" use slightly smaller letters, so they fit inside the tile.)
    write(game.label, tileMiddle, top + 52, fontThatFits(game.label, TILE_SIZE - 10), COLORS.text);

    // The best score, small, along the bottom of the tile.
    const best = loadNumber(`best:${key}`);
    const tileText = game.tileText ? game.tileText() : leaderText(key);
    write(tileText, tileMiddle, top + 66, FONTS.tag, tileText === "your turn!" ? COLORS.newTag : COLORS.text);
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
// (It scrolls whichever window the mouse is over.)
canvas.addEventListener("wheel", event => withWindow(windowUnderMouse(), () => {
  if (state.window !== "games" || !state.launcherMaxScroll) return;
  event.preventDefault();   // scroll the Arcade, not the web page
  state.launcherScroll = keepBetween((state.launcherScroll || 0) + event.deltaY * 0.5, 0, state.launcherMaxScroll);
}), { passive: false });

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

// (Keys go to the game in the window on top.)
window.addEventListener("keydown", event => withWindow(topWindow(), () => {
  if (isTypingInForm(event)) return;
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
}));

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
  if (beatIt) {
    saveNumber(`best:${game.key}`, score);
    shareBest(game.key, score);
  }
  // Coins for the house, for playing.
  const coins = state.online === "ok" && !state.previewingHisSide ? coinsForGame(game.key, score) : 0;
  addCoins(coins);
  game.result = { title, line, best: beatIt ? score : old, newBest: beatIt && old !== null, coins };
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

  if (info.custom) {
    info.custom(game, area, time);
    ctx.restore();
    return;
  }

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
    if (game.result.newBest) write("New best score!", middle, area.top + 124, FONTS.small, COLORS.newTag);
    drawBestScores(game.key, middle, area.top + 142);
    if (game.result.coins) {
      drawSpriteScaled(COIN, COIN_COLORS, middle - 70, area.top + 194, 2);
      write(`+${game.result.coins} coins for your house!`, middle - 54, area.top + 200, FONTS.small, COLORS.text, "left");
    }
  } else {
    write(info.title, middle, area.top + 76, FONTS.celebrationSubtitle, COLORS.text);
    write(info.intro, middle, area.top + 106, FONTS.note, COLORS.text);
    drawBestScores(game.key, middle, area.top + 134);
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
        if (!state.windows.some(win => win.game === game)) return;   // he already closed the window
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


// ====================================================================================
// MORE GAMES: Higher or lower, Breakout, and games you play TOGETHER
// (Tic-tac-toe, Connect 4, and the Couples quiz, which take turns through Firebase)
// ====================================================================================

// Your color and his color in the games you play together.
const PLAYER_COLORS = { [YOUR_NAME]: "#F07A9C", [RECIPIENT_NAME]: "#7FB8F0" };

// The questions for the Couples quiz. Each round picks 5 at random.
// Add as many as you like! (Each one finishes "Who's more likely to...")
const QUIZ_QUESTIONS = [
  "fall asleep first on a call?",
  "start a silly argument?",
  "cry at a movie?",
  "forget to text back?",
  "eat all the snacks?",
  "say \"I love you\" first?",
  "get lost somewhere?",
  "stay up way too late?",
  "win at video games?",
  "plan the next date?",
  "send the most memes?",
  "apologize first?",
  "laugh at their own joke?",
  "get hangry?",
  "be late?",
  "talk to the cats like people?",
  "fall asleep during a movie?",
  "want to cuddle all day?",
  "be the big spoon?",
  "spend all their money on something cute?",
];

state.matches = {};   // the Tic-tac-toe and Connect 4 games (from Firebase)
state.quiz = null;    // the Couples quiz (from Firebase)


// ---------- Higher or lower ----------

const CARD_NAMES = ["", "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

function randomCard() {
  return 1 + Math.floor(Math.random() * 13);
}

function setupHigher(game) {
  Object.assign(game, { current: randomCard(), next: null, streak: 0, reveal: 0, correct: false });
}

// He guessed: flip the next card, and see if he was right. (The same number counts as right.)
function guessCard(game, higher) {
  if (game.reveal > 0 || game.paused) return;
  game.next = randomCard();
  game.correct = game.next === game.current || (higher ? game.next > game.current : game.next < game.current);
  game.reveal = 0.9;
  if (game.correct) playSound("coin", 0.6);
  else playSound("buzzer", BUZZER_VOLUME);
}

// One playing card. faceUp false = the pink back with a heart.
function drawCard(value, x, y, faceUp) {
  const width = 60, height = 84;
  steppedBox(x, y, x + width, y + height, 4, faceUp ? COLORS.white : COLORS.acceptFill, COLORS.text, 2);
  if (!faceUp) {
    drawPixels(HEART, x + width / 2 - 10, y + height / 2 - 9, 3, COLORS.titleBar);
    return;
  }
  write(CARD_NAMES[value], x + 8, y + 12, FONTS.menu, COLORS.heart, "left");
  write(CARD_NAMES[value], x + width / 2, y + height / 2 + 2, FONTS.title, COLORS.heart);
  drawPixels(HEART, x + width - 18, y + height - 16, 1.5, COLORS.heart);
}

function stepHigher(game, area, seconds) {
  const middle = (area.left + area.right) / 2;
  write(`Streak: ${game.streak}`, area.left + 8, area.top + 12, FONTS.small, COLORS.text, "left");
  const cardsTop = area.top + 26;
  drawCard(game.current, middle - 70, cardsTop, true);
  drawCard(game.next || 1, middle + 10, cardsTop, !!game.next);

  if (game.reveal > 0) {
    // Showing the flipped card for a moment, then moving on (or game over).
    write(game.correct ? "Yes!" : "Nope!", middle, cardsTop + 100, FONTS.body, game.correct ? COLORS.check : COLORS.newTag);
    game.reveal -= seconds;
    if (game.reveal <= 0) {
      if (game.correct) {
        game.streak += 1;
        game.current = game.next;
        game.next = null;
      } else {
        playSound("gameover");
        endGame(game, "Oops!", `Your streak was ${game.streak}.`, game.streak);
      }
    }
    return;
  }
  write("Will the next card be...", middle, cardsTop + 100, FONTS.note, COLORS.text);
  drawButton(middle - 60, cardsTop + 128, 100, 28, "Higher", COLORS.acceptFill, COLORS.acceptText, () => guessCard(game, true));
  drawButton(middle + 60, cardsTop + 128, 100, 28, "Lower", COLORS.cream, COLORS.text, () => guessCard(game, false));
}


// ---------- Breakout: bounce the ball to break all the hearts ----------

const BREAKOUT_COLORS = ["#F07A9C", "#F8BFCB", "#C9B6F2", "#7FB8F0"];
const PADDLE_WIDTH = 56;

function setupBreakout(game, area) {
  Object.assign(game, { lives: 3, score: 0, level: 1, speed: 170, paddleX: (area.left + area.right) / 2 });
  buildBricks(game, area);
  resetBall(game, area);
}

// Rows of heart bricks along the top.
function buildBricks(game, area) {
  const width = 32, height = 13, gap = 4;
  const columns = Math.floor((area.right - area.left - 16 + gap) / (width + gap));
  const left = (area.left + area.right) / 2 - (columns * (width + gap) - gap) / 2;
  game.bricks = [];
  for (let row = 0; row < 4; row++) {
    for (let column = 0; column < columns; column++) {
      game.bricks.push({ x: left + column * (width + gap), y: area.top + 36 + row * (height + gap),
                         w: width, h: height, color: BREAKOUT_COLORS[row], alive: true });
    }
  }
}

// The ball waits on the paddle until he clicks (or presses Space).
function resetBall(game, area) {
  game.ball = { x: game.paddleX, y: area.bottom - 22, vx: 0, vy: 0, stuck: true };
}

function launchBall(game) {
  const ball = game.ball;
  if (!ball || !ball.stuck) return;
  ball.stuck = false;
  const angle = between(-0.6, 0.6, Math.random());
  ball.vx = Math.sin(angle) * game.speed;
  ball.vy = -Math.cos(angle) * game.speed;
  playSound("jump", 0.6);
}

function stepBreakout(game, area, seconds) {
  const paddleY = area.bottom - 14;
  // The paddle follows the mouse (but stays inside the window).
  if (!game.paused) game.paddleX = keepBetween(state.mouse.x, area.left + PADDLE_WIDTH / 2 + 2, area.right - PADDLE_WIDTH / 2 - 2);
  const ball = game.ball;

  if (ball.stuck) {
    ball.x = game.paddleX;
    ball.y = paddleY - 8;
  } else {
    // Move in small steps, so the ball never skips through a brick.
    const steps = Math.ceil(seconds * 120) || 1;
    for (let i = 0; i < steps; i++) {
      ball.x += ball.vx * seconds / steps;
      ball.y += ball.vy * seconds / steps;
      // Walls.
      if (ball.x < area.left + 4) { ball.x = area.left + 4; ball.vx = Math.abs(ball.vx); }
      if (ball.x > area.right - 4) { ball.x = area.right - 4; ball.vx = -Math.abs(ball.vx); }
      if (ball.y < area.top + 22) { ball.y = area.top + 22; ball.vy = Math.abs(ball.vy); }
      // The paddle: where it hits changes the angle (the edges send it sideways).
      if (ball.vy > 0 && ball.y >= paddleY - 6 && ball.y <= paddleY + 2 &&
          Math.abs(ball.x - game.paddleX) <= PADDLE_WIDTH / 2 + 3) {
        const angle = ((ball.x - game.paddleX) / (PADDLE_WIDTH / 2)) * 1.0;
        ball.vx = Math.sin(angle) * game.speed;
        ball.vy = -Math.cos(angle) * game.speed;
        playKeySound(0.4);
      }
      // Bricks.
      for (const brick of game.bricks) {
        if (!brick.alive) continue;
        if (ball.x > brick.x - 3 && ball.x < brick.x + brick.w + 3 && ball.y > brick.y - 3 && ball.y < brick.y + brick.h + 3) {
          brick.alive = false;
          game.score += 1;
          ball.vy = -ball.vy;
          playSound("coin", 0.4);
          break;
        }
      }
    }
    // Missed it!
    if (ball.y > area.bottom + 6) {
      game.lives -= 1;
      if (game.lives <= 0) {
        playSound("gameover");
        endGame(game, "Game over!", `You broke ${game.score} hearts.`, game.score);
        return;
      }
      playSound("buzzer", BUZZER_VOLUME);
      resetBall(game, area);
    }
    // All the bricks are gone: a new level, a little faster.
    if (game.bricks.every(brick => !brick.alive)) {
      game.level += 1;
      game.speed += 25;
      playSound("chime", 0.4);
      buildBricks(game, area);
      resetBall(game, area);
    }
  }

  // Draw everything.
  game.bricks.forEach(brick => {
    if (!brick.alive) return;
    ctx.fillStyle = brick.color;
    ctx.fillRect(brick.x, brick.y, brick.w, brick.h);
    ctx.strokeStyle = COLORS.text;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(brick.x, brick.y, brick.w, brick.h);
    drawPixels(HEART, brick.x + brick.w / 2 - 3.5, brick.y + 3.5, 1, COLORS.white);
  });
  steppedBox(game.paddleX - PADDLE_WIDTH / 2, paddleY, game.paddleX + PADDLE_WIDTH / 2, paddleY + 8, 2,
             COLORS.acceptFill, COLORS.text, 1.5);
  ctx.fillStyle = COLORS.white;
  ctx.fillRect(Math.round(ball.x) - 3, Math.round(ball.y) - 3, 6, 6);
  ctx.strokeStyle = COLORS.text;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(Math.round(ball.x) - 3, Math.round(ball.y) - 3, 6, 6);

  write(`Hearts: ${game.score}   Level ${game.level}`, area.left + 8, area.top + 12, FONTS.small, COLORS.text, "left");
  for (let i = 0; i < 3; i++) {
    drawPixels(HEART, area.right - 22 - i * 18, area.top + 6, 2, i < game.lives ? COLORS.heart : COLORS.lostLife);
  }
  if (ball.stuck) write("Click to launch!", (area.left + area.right) / 2, area.bottom - 40, FONTS.small, COLORS.text);
}


// ====================================================================================
// OUR LITTLE HOUSE: a room you decorate together
// ====================================================================================
//
// The house is saved in Firebase ("house"), so you both see the same room. Furniture is
// bought with coins, and coins are earned by playing games in the Arcade.
//
// - Drag furniture to move it. Click it (without dragging) to flip it around.
// - Drag it onto the shop on the right to put it away in "Mine".
// - Wallpaper and floors are in the shop too.

// How many coins the house starts with, so you can buy something right away.
const STARTING_COINS = 100;

// The room is a grid: 8 tiles across, 4 rows of floor, and a wall 2.5 tiles tall.
const HOUSE_COLUMNS = 8;
const HOUSE_ROWS = 4;
const HOUSE_WALL = 2.5;
const HOUSE_SIDEBAR = 118;   // how wide the shop is

// The colors the furniture pictures use (each letter is one color).
const FURNITURE_COLORS = {
  O: "#45284A", W: "#FFFFFF", C: "#FFF4EA", P: "#F8A5BE", p: "#E07A9A", B: "#BBE1FD", b: "#7FB8F0",
  L: "#C9B6F2", l: "#9D86D6", G: "#7CC27A", g: "#5E9E5A", Y: "#FFE08A", y: "#F2B33D",
  T: "#E3B07A", t: "#B07A52", K: "#3A3440", k: "#8C8A99", R: "#E05A6B",
};

// Every kind of furniture. Each tile of the room is 8 pixels of a picture.
//   w, d   - how many tiles wide, and how many floor rows deep, it takes up
//   wall   - it hangs on the wall instead of sitting on the floor (wallY = how far down the wall)
//   price  - 0 means it can't be bought (you two and the cats)
const FURNITURE = {
  bed: { name: "Bed", price: 80, w: 2, d: 2, rows: [
    ".OOOOOOOOOOOOOO.",
    "OttttttttttttttO",
    "OtOOOOOOOOOOOOtO",
    "OtOWWWWWOWWWWWtO",
    "OtOWWWWWOWWWWWtO",
    "OtOOOOOOOOOOOOtO",
    "OtOPPPPPPPPPPOtO",
    "OtOPpPPPPPPpPOtO",
    "OtOPPPPPPPPPPOtO",
    "OtOPPPPpPPPPPOtO",
    "OtOPPPPPPPPPPOtO",
    "OtOPpPPPPPPpPOtO",
    "OtOOOOOOOOOOOOtO",
    "OttttttttttttttO",
    "OOOOOOOOOOOOOOOO",
    ".O............O.",
  ] },
  couch: { name: "Couch", price: 70, w: 3, d: 1, rows: [
    "..OOOOOOOOOOOOOOOOOOOO..",
    ".OllllllllllllllllllllO.",
    ".OllllllllllllllllllllO.",
    "OOOOOOOOOOOOOOOOOOOOOOOO",
    "OlOLLLLLLLLOOLLLLLLLLOlO",
    "OlOLLLLLLLLOOLLLLLLLLOlO",
    "OlOOOOOOOOOOOOOOOOOOOOlO",
    "OllllllllllllllllllllllO",
    "OOOOOOOOOOOOOOOOOOOOOOOO",
    ".O....................O.",
  ] },
  table: { name: "Table", price: 40, w: 2, d: 1, rows: [
    "...OO.......O...",
    "..OWWO.....OPO..",
    "..OWWO.....OPO..",
    "OOOOOOOOOOOOOOOO",
    "OTTTTTTTTTTTTTTO",
    "OOOOOOOOOOOOOOOO",
    ".Ot..........tO.",
    ".Ot..........tO.",
    ".OO..........OO.",
  ] },
  desk: { name: "Computer desk", price: 70, w: 2, d: 1, rows: [
    "..OOOOOO........",
    "..OBBBBO........",
    "..OBbBBO........",
    "..OOOOOO....OO..",
    "....OO.....OYYO.",
    "OOOOOOOOOOOOOOOO",
    "OTTTTTTTTTTTTTTO",
    "OOOOOOOOOOOOOOOO",
    ".Ot..........tO.",
    ".Ot..........tO.",
    ".OO..........OO.",
  ] },
  tv: { name: "TV", price: 90, w: 2, d: 1, rows: [
    "....O......O....",
    ".....O....O.....",
    "OOOOOOOOOOOOOOOO",
    "OKKKKKKKKKKKKKKO",
    "OKbbbbbbbbbbbbKO",
    "OKbBBbbbbbbbbbKO",
    "OKbbbbbbpPbbbbKO",
    "OKbbbbbbPPbbbbKO",
    "OKbbbbbbbbbbbbKO",
    "OKKKKKKKKKKKKKKO",
    "OOOOOOOOOOOOOOOO",
    "OttttttttttttttO",
    "OOOOOOOOOOOOOOOO",
    ".O............O.",
  ] },
  bookshelf: { name: "Bookshelf", price: 60, w: 2, d: 1, rows: [
    "OOOOOOOOOOOOOOOO",
    "OttttttttttttttO",
    "OtPbYlRbPYGlbRtO",
    "OtPbYlRbPYGlbRtO",
    "OtPbYlRbPYGlbRtO",
    "OttttttttttttttO",
    "OtGlbPRYbPlYGbtO",
    "OtGlbPRYbPlYGbtO",
    "OtGlbPRYbPlYGbtO",
    "OttttttttttttttO",
    "OtYRbPlGYbPRlGtO",
    "OtYRbPlGYbPRlGtO",
    "OtYRbPlGYbPRlGtO",
    "OttttttttttttttO",
    "OOOOOOOOOOOOOOOO",
  ] },
  lamp: { name: "Lamp", price: 25, w: 1, d: 1, rows: [
    "..OOOO..",
    ".OYYYYO.",
    ".OYYYYO.",
    "OYYYYYYO",
    "OOOOOOOO",
    "...OO...",
    "...OO...",
    "...OO...",
    "...OO...",
    "...OO...",
    "..OOOO..",
    ".OkkkkO.",
    ".OOOOOO.",
  ] },
  plant: { name: "Plant", price: 20, w: 1, d: 1, rows: [
    "..G..G..",
    ".GgG.Gg.",
    "GgGGGgGG",
    ".GGgGGg.",
    "..GGgG..",
    "...gG...",
    ".OOOOOO.",
    ".OppppO.",
    ".OPPPPO.",
    "..OPPO..",
    "..OOOO..",
  ] },
  beanbag: { name: "Beanbag", price: 25, w: 1, d: 1, rows: [
    "..OOOO..",
    ".ObbbbO.",
    "ObBbbbbO",
    "ObbbbbbO",
    "ObbbbbbO",
    ".OOOOOO.",
  ] },
  catbed: { name: "Cat bed", price: 20, w: 1, d: 1, rows: [
    ".OOOOOO.",
    "OPPPPPPO",
    "OPWWWWPO",
    "OPPPPPPO",
    ".OOOOOO.",
  ] },
  rug: { name: "Rug", price: 35, w: 3, d: 2, rug: true },
  window: { name: "Window", price: 50, w: 2, wall: true, wallY: 0.45, rows: [
    "OOOOOOOOOOOOOOOO",
    "OBBBBBBOOBBBBBBO",
    "OBWBBBBOOBBWBBBO",
    "OBBBBBBOOBBBBBBO",
    "OBBBBBBOOBBBBBBO",
    "OOOOOOOOOOOOOOOO",
    "OBBBBBBOOBBBBBBO",
    "OBBBBBBOOBBBBBBO",
    "OBBBBBBOOBBBBBBO",
    "OOOOOOOOOOOOOOOO",
    "OttttttttttttttO",
    "OOOOOOOOOOOOOOOO",
  ] },
  poster: { name: "Heart poster", price: 15, w: 1, wall: true, wallY: 0.5, rows: [
    "OOOOOOOO",
    "OCCCCCCO",
    "OCPPCPPO",
    "OCPPPPPO",
    "OCCPPPCO",
    "OCCCPCCO",
    "OCCCCCCO",
    "OOOOOOOO",
  ] },
  clock: { name: "Clock", price: 20, w: 1, wall: true, wallY: 0.45, rows: [
    "..OOOO..",
    ".OWWWWO.",
    "OWWOWWWO",
    "OWWOWWWO",
    "OWWOOOWO",
    "OWWWWWWO",
    ".OWWWWO.",
    "..OOOO..",
  ] },
  lights: { name: "Fairy lights", price: 30, w: 3, wall: true, wallY: 0.12, rows: [
    "OO....OO....OO....OO....",
    "..OOOO..OOOO..OOOO..OOOO",
    "...Y.....P.....b.....G..",
    "...Y.....P.....b.....G..",
  ] },
  // You two and the cats (free, and already in the house).
  // (scale shrinks them a bit, so they're the right size next to the furniture.)
  tayler: { name: YOUR_NAME, price: 0, w: 1, d: 1, person: "tayler", scale: 0.7 },
  jacob: { name: RECIPIENT_NAME, price: 0, w: 1, d: 1, person: "jacob", scale: 0.7 },
  orangecat: { name: "Orange cat", price: 0, w: 1, d: 1, cat: 0, scale: 0.5 },
  blackcat: { name: "Black cat", price: 0, w: 1, d: 1, cat: 1, scale: 0.5 },
};

const WALLPAPERS = {
  pink: { name: "Pink stripes", price: 0, colors: ["#F8D9E2", "#F4C6D3"], pattern: "stripes" },
  blue: { name: "Sky blue", price: 30, colors: ["#D6ECFE", "#C2E1FB"], pattern: "stripes" },
  lavender: { name: "Lavender", price: 30, colors: ["#E6DDF7", "#D9CDF2"], pattern: "stripes" },
  cream: { name: "Cream checks", price: 30, colors: ["#FFF4EA", "#F5E4D3"], pattern: "checks" },
  hearts: { name: "Hearts", price: 45, colors: ["#FDE7EE", "#F4A6BD"], pattern: "hearts" },
};
const FLOORS = {
  wood: { name: "Wood floor", price: 0, colors: ["#E3B07A", "#C9925C"], pattern: "planks" },
  pinktile: { name: "Pink tiles", price: 40, colors: ["#F8D9E2", "#F0C0CF"], pattern: "checks" },
  carpet: { name: "Blue carpet", price: 40, colors: ["#B9D4F2", "#A3C4EC"], pattern: "dots" },
};

// The pixel coin, for prices and the coin count.
const COIN = [
  ".OOOO.",
  "OYYYYO",
  "OYWYYO",
  "OYYYYO",
  "OYYYYO",
  ".OOOO.",
];
const COIN_COLORS = { O: "#B07A1E", Y: "#FFD45E", W: "#FFFFFF" };

// What a brand new house has in it.
const START_ITEMS = [
  { id: "tayler", type: "tayler", gx: 2, gy: 2, flip: false, placed: true },
  { id: "jacob", type: "jacob", gx: 3, gy: 2, flip: true, placed: true },
  { id: "orangecat", type: "orangecat", gx: 5, gy: 3, flip: false, placed: true },
  { id: "blackcat", type: "blackcat", gx: 6, gy: 3, flip: true, placed: true },
];

state.house = null;     // the house, from Firebase
let houseLayout = null; // where the room and shop were drawn (for dragging)
let houseDrag = null;   // the piece of furniture being dragged


// ---------- Saving and loading ----------

function houseRef() {
  return database.collection("house").doc("main");
}

function listenForHouse(failed) {
  houseRef().onSnapshot(doc => {
    const data = doc.exists ? doc.data() : {};
    // While something is being dragged, don't let an update yank it away.
    if (houseDrag) return;
    state.house = {
      coins: data.coins || 0,
      items: data.items || START_ITEMS,
      wallpaper: data.wallpaper || "pink",
      floor: data.floor || "wood",
      owned: data.owned || ["pink", "wood"],
    };
    if (!data.items) setUpHouse();
  }, failed);
}

// The very first time: put the starting stuff (and coins) in the house.
let settingUpHouse = false;
function setUpHouse() {
  if (settingUpHouse || state.previewingHisSide) return;
  settingUpHouse = true;
  database.runTransaction(async transaction => {
    const doc = await transaction.get(houseRef());
    const data = doc.exists ? doc.data() : {};
    if (data.items) return;
    transaction.set(houseRef(), {
      coins: (data.coins || 0) + STARTING_COINS,
      items: START_ITEMS, wallpaper: "pink", floor: "wood", owned: ["pink", "wood"],
      lastBy: ME, updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
  }).catch(problem => console.log("Couldn't set up the house:", problem));
}

// Saves changes to the house (and shows them right away).
function saveHouse(changes) {
  if (blockedInPreview()) return false;
  Object.assign(state.house, changes);
  houseRef().update({ ...changes, lastBy: ME, updatedAt: firebase.firestore.FieldValue.serverTimestamp() })
    .catch(problem => {
      console.log("Couldn't save the house:", problem);
      playSound("buzzer", BUZZER_VOLUME);
    });
  return true;
}

// Adds coins to the house (from playing games). Everyone shares the same coins.
function addCoins(amount) {
  if (!amount || state.online !== "ok" || state.previewingHisSide) return;
  houseRef().set({ coins: firebase.firestore.FieldValue.increment(amount) }, { merge: true })
    .catch(problem => console.log("Couldn't add coins:", problem));
}


// ---------- Where things go ----------

// The spots a piece of furniture takes up (floor rows), for checking if things overlap.
function footprint(item, gx = item.gx, gy = item.gy) {
  const kind = FURNITURE[item.type];
  return { left: gx, right: gx + kind.w, top: kind.wall ? 0 : gy, bottom: kind.wall ? 1 : gy + kind.d };
}

// Can this go here without bumping into something? (Rugs only bump into other rugs,
// and wall things only bump into other wall things.)
function spotIsFree(item, gx, gy, items = state.house.items) {
  const kind = FURNITURE[item.type];
  if (gx < 0 || gx + kind.w > HOUSE_COLUMNS) return false;
  if (!kind.wall && (gy < 0 || gy + kind.d > HOUSE_ROWS)) return false;
  const mine = footprint(item, gx, gy);
  return !items.some(other => {
    if (other.id === item.id || !other.placed) return false;
    const otherKind = FURNITURE[other.type];
    if (!!otherKind.wall !== !!kind.wall || !!otherKind.rug !== !!kind.rug) return false;
    const theirs = footprint(other);
    return mine.left < theirs.right && theirs.left < mine.right && mine.top < theirs.bottom && theirs.top < mine.bottom;
  });
}

// The first free spot for a piece of furniture (or null if the room is full).
function findFreeSpot(item, items) {
  for (let gy = 0; gy < HOUSE_ROWS; gy++) {
    for (let gx = 0; gx < HOUSE_COLUMNS; gx++) {
      if (spotIsFree(item, gx, gy, items)) return { gx, gy };
    }
  }
  return null;
}


// ---------- Drawing ----------

// Draws a picture with each square rounded to whole screen pixels (so there are no
// thin gaps between squares when it's scaled to an odd size).
function drawSpriteScaled(rows, colors, x, y, px) {
  rows.forEach((row, rowNumber) => {
    const top = Math.round(y + rowNumber * px), bottom = Math.round(y + (rowNumber + 1) * px);
    [...row].forEach((letter, column) => {
      if (!colors[letter]) return;
      const left = Math.round(x + column * px), right = Math.round(x + (column + 1) * px);
      ctx.fillStyle = colors[letter];
      ctx.fillRect(left, top, right - left, bottom - top);
    });
  });
}

// The picture for a piece of furniture: { rows, colors, outline (for cats) }.
function furniturePicture(type, flip) {
  const kind = FURNITURE[type];
  let rows, colors = FURNITURE_COLORS, outline = null;
  if (kind.person) {
    rows = [...(kind.person === "jacob" ? JACOB_TOP : TAYLER_TOP), ...LEGS_STAND];
    colors = kind.person === "jacob" ? JACOB_COLORS : TAYLER_COLORS;
  } else if (kind.cat !== undefined) {
    rows = CAT_SIT;
    colors = CATS[kind.cat].colors;
    outline = CATS[kind.cat].outline;
  } else {
    rows = kind.rows;
  }
  return { rows: flip ? mirror(rows) : rows, colors, outline };
}

// Draws one piece of furniture with its top-left corner at (x, y).
function drawFurniture(type, x, y, px, flip) {
  const { rows, colors, outline } = furniturePicture(type, flip);
  if (outline) {
    const outlineColors = Object.fromEntries(Object.keys(colors).map(letter => [letter, outline]));
    [[-1, 0], [1, 0], [0, -1]].forEach(([dx, dy]) => drawSpriteScaled(rows, outlineColors, x + dx * px, y + dy * px, px));
  }
  drawSpriteScaled(rows, colors, x, y, px);
}

// A rug: a soft pink rounded rectangle with a white stitched edge.
function drawRug(left, top, width, height) {
  steppedBox(left + 2, top + 2, left + width - 2, top + height - 2, 4, "#F8BFCB", COLORS.text, 2);
  ctx.strokeStyle = COLORS.white;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([3, 3]);
  ctx.strokeRect(left + 7, top + 7, width - 14, height - 14);
  ctx.setLineDash([]);
}

// Fills a box with a wallpaper or floor pattern.
function fillPattern(look, x, y, width, height, unit) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.clip();
  ctx.fillStyle = look.colors[0];
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = look.colors[1];
  if (look.pattern === "stripes") {
    for (let stripe = x; stripe < x + width; stripe += unit) ctx.fillRect(stripe, y, unit / 2, height);
  } else if (look.pattern === "checks") {
    for (let row = 0; row * unit < height; row++) {
      for (let column = 0; column * unit < width; column++) {
        if ((row + column) % 2) ctx.fillRect(x + column * unit, y + row * unit, unit, unit);
      }
    }
  } else if (look.pattern === "planks") {
    const plank = unit * 0.75;
    for (let row = 0; row * plank < height; row++) {
      ctx.fillRect(x, y + row * plank, width, 1.5);
      const offset = (row % 2) * unit;
      for (let seam = x + offset; seam < x + width; seam += unit * 2) ctx.fillRect(seam, y + row * plank, 1.5, plank);
    }
  } else if (look.pattern === "dots") {
    for (let row = 0; row * unit < height; row++) {
      for (let column = 0; column * unit < width; column++) {
        ctx.fillRect(x + column * unit + unit / 2 - 1.5, y + row * unit + unit / 2 - 1.5, 3, 3);
      }
    }
  } else if (look.pattern === "hearts") {
    for (let row = 0; row * unit < height; row++) {
      for (let column = 0; column * unit < width; column++) {
        drawPixels(HEART, x + column * unit + (row % 2) * unit / 2 + 4, y + row * unit + 4, 1, look.colors[1]);
      }
    }
  }
  ctx.restore();
}

// Where a piece of furniture is drawn: { left, top, width, height } on the screen.
function furnitureBox(item, layout, gx = item.gx, gy = item.gy) {
  const kind = FURNITURE[item.type];
  const { left, wallTop, wallHeight, floorTop, tile, tileHeight, px } = layout;
  if (kind.rug) {
    return { left: left + gx * tile, top: floorTop + gy * tileHeight, width: kind.w * tile, height: kind.d * tileHeight };
  }
  const { rows } = furniturePicture(item.type, false);
  const scaled = px * (kind.scale || 1);
  const width = rows[0].length * scaled, height = rows.length * scaled;
  const x = left + gx * tile + (kind.w * tile - width) / 2;
  if (kind.wall) return { left: x, top: wallTop + wallHeight * kind.wallY - height / 2, width, height };
  return { left: x, top: floorTop + (gy + kind.d) * tileHeight - height, width, height };
}

// The whole house window: the room on the left, the shop on the right.
function drawHouse(inside, time) {
  if (state.online !== "ok") {
    drawOnlineProblem(inside, "decorate your house");
    return;
  }
  if (!state.house) {
    write("Loading your house...", (inside.left + inside.right) / 2, inside.top + 100, FONTS.body, COLORS.text);
    return;
  }
  const house = state.house;

  // Work out the room's size: as big as fits next to the shop.
  const space = { left: inside.left + 6, top: inside.top + 6, right: inside.right - HOUSE_SIDEBAR - 8, bottom: inside.bottom - 6 };
  const tile = Math.floor(Math.min((space.right - space.left) / HOUSE_COLUMNS,
                                   (space.bottom - space.top) / (HOUSE_WALL + HOUSE_ROWS * 0.75)));
  const tileHeight = tile * 0.75;
  const roomWidth = tile * HOUSE_COLUMNS;
  const left = space.left + Math.floor((space.right - space.left - roomWidth) / 2);
  const wallTop = space.top, wallHeight = tile * HOUSE_WALL;
  const floorTop = wallTop + wallHeight, floorHeight = tileHeight * HOUSE_ROWS;
  const sidebar = { left: inside.right - HOUSE_SIDEBAR - 2, top: inside.top + 4, right: inside.right - 4, bottom: inside.bottom - 4 };
  const layout = houseLayout = { left, wallTop, wallHeight, floorTop, tile, tileHeight, px: tile / 8, roomWidth, floorHeight, sidebar };

  // The wall and floor.
  fillPattern(WALLPAPERS[house.wallpaper] || WALLPAPERS.pink, left, wallTop, roomWidth, wallHeight, tile / 2);
  fillPattern(FLOORS[house.floor] || FLOORS.wood, left, floorTop, roomWidth, floorHeight, tile);
  ctx.fillStyle = "#B07A52";                                  // the baseboard
  ctx.fillRect(left, floorTop - 3, roomWidth, 4);
  ctx.strokeStyle = COLORS.text;
  ctx.lineWidth = 2;
  ctx.strokeRect(left, wallTop, roomWidth, wallHeight + floorHeight);

  // While dragging, a faint grid on the floor shows where things can go.
  if (houseDrag && houseDrag.moved) {
    ctx.strokeStyle = "rgba(69, 40, 74, 0.15)";
    ctx.lineWidth = 1;
    for (let column = 1; column < HOUSE_COLUMNS; column++) {
      ctx.beginPath();
      ctx.moveTo(left + column * tile, floorTop);
      ctx.lineTo(left + column * tile, floorTop + floorHeight);
      ctx.stroke();
    }
    for (let row = 1; row < HOUSE_ROWS; row++) {
      ctx.beginPath();
      ctx.moveTo(left, floorTop + row * tileHeight);
      ctx.lineTo(left + roomWidth, floorTop + row * tileHeight);
      ctx.stroke();
    }
  }

  // The furniture: rugs first, then wall things, then the rest from back to front.
  const placed = house.items.filter(item => item.placed && FURNITURE[item.type]);
  const order = item => {
    const kind = FURNITURE[item.type];
    if (kind.rug) return -100 + item.gy;
    if (kind.wall) return -50;
    return item.gy + kind.d + item.gx / 100;
  };
  ctx.save();
  ctx.beginPath();
  ctx.rect(left, wallTop, roomWidth, wallHeight + floorHeight);
  ctx.clip();
  placed.slice().sort((a, b) => order(a) - order(b)).forEach(item => {
    const dragging = houseDrag && houseDrag.item.id === item.id && houseDrag.moved;
    if (dragging) return;   // drawn last, on top (below)
    const box = furnitureBox(item, layout);
    if (FURNITURE[item.type].rug) drawRug(box.left, box.top, box.width, box.height);
    else drawFurniture(item.type, box.left, box.top, layout.px * (FURNITURE[item.type].scale || 1), item.flip);
    hitBoxes.push({ left: box.left, top: box.top, right: box.left + box.width, bottom: box.top + box.height,
                    houseItem: item, onClick: () => {} });
  });

  // The piece being dragged, where it would land (with a red outline if it doesn't fit).
  if (houseDrag && houseDrag.moved) {
    const { item, gx, gy } = houseDrag;
    const box = furnitureBox(item, layout, gx, gy);
    ctx.globalAlpha = 0.75;
    if (FURNITURE[item.type].rug) drawRug(box.left, box.top, box.width, box.height);
    else drawFurniture(item.type, box.left, box.top, layout.px * (FURNITURE[item.type].scale || 1), item.flip);
    ctx.globalAlpha = 1;
    if (!houseDrag.overShop && !spotIsFree(item, gx, gy)) {
      ctx.strokeStyle = COLORS.newTag;
      ctx.lineWidth = 2;
      ctx.strokeRect(box.left, box.top, box.width, box.height);
    }
  }
  ctx.restore();

  drawHouseShop(house, sidebar);
}

// The shop on the right: coins, two tabs (Shop and Mine), and cards for each thing.
let houseCardNames = {};
function drawHouseShop(house, sidebar) {
  houseCardNames = {};
  const middle = (sidebar.left + sidebar.right) / 2;
  const highlight = houseDrag && houseDrag.moved && houseDrag.overShop;
  steppedBox(sidebar.left, sidebar.top, sidebar.right, sidebar.bottom, 3,
             highlight ? COLORS.titleBar : COLORS.cream, COLORS.text, 2);

  // How many coins you have together.
  drawSpriteScaled(COIN, COIN_COLORS, sidebar.left + 10, sidebar.top + 8, 2);
  write(`${house.coins} coins`, sidebar.left + 26, sidebar.top + 14, FONTS.small, COLORS.text, "left");

  // The tabs.
  ["shop", "mine"].forEach((tab, number) => {
    const tabLeft = sidebar.left + 6 + number * ((sidebar.right - sidebar.left - 12) / 2);
    const box = { left: tabLeft, top: sidebar.top + 26, right: tabLeft + (sidebar.right - sidebar.left - 12) / 2 - 2,
                  bottom: sidebar.top + 44, onClick: () => { playSound("click"); state.houseTab = tab; state.houseScroll = 0; } };
    hitBoxes.push(box);
    steppedBox(box.left, box.top, box.right, box.bottom, 2,
               state.houseTab === tab ? COLORS.acceptFill : COLORS.white, COLORS.text, 1.5);
    write(tab === "shop" ? "Shop" : "Mine", (box.left + box.right) / 2, box.top + 9.5, FONTS.tag,
          state.houseTab === tab ? COLORS.white : COLORS.text);
  });

  if (highlight) {
    write("Drop here to", middle, sidebar.top + 110, FONTS.small, COLORS.text);
    write("put it away", middle, sidebar.top + 126, FONTS.small, COLORS.text);
    return;
  }

  // The cards: everything you can buy, or everything you have put away.
  const cards = state.houseTab === "shop" ? shopCards(house) : mineCards(house);
  const list = { left: sidebar.left + 4, top: sidebar.top + 48, right: sidebar.right - 4, bottom: sidebar.bottom - 20 };
  const cardWidth = (list.right - list.left - 6) / 2, cardHeight = 46;
  const contentHeight = Math.ceil(cards.length / 2) * (cardHeight + 4);
  state.houseMaxScroll = Math.max(0, contentHeight - (list.bottom - list.top));
  state.houseScroll = keepBetween(state.houseScroll || 0, 0, state.houseMaxScroll);

  if (cards.length === 0) {
    write(state.houseTab === "shop" ? "You bought it all!" : "Nothing put away", middle, list.top + 30, FONTS.tag, COLORS.text);
  }
  ctx.save();
  ctx.beginPath();
  ctx.rect(list.left, list.top, list.right - list.left, list.bottom - list.top);
  ctx.clip();
  cards.forEach((card, number) => {
    const x = list.left + 2 + (number % 2) * (cardWidth + 2);
    const y = list.top + 2 + Math.floor(number / 2) * (cardHeight + 4) - state.houseScroll;
    if (y + cardHeight < list.top || y > list.bottom) return;
    const id = `house:card:${number}`;
    houseCardNames[id] = card.label;
    if (y >= list.top - 2 && y + cardHeight <= list.bottom + 2) {
      hitBoxes.push({ left: x, top: y, right: x + cardWidth, bottom: y + cardHeight, id, onClick: card.onClick });
    }
    steppedBox(x, y, x + cardWidth, y + cardHeight, 2,
               card.current ? COLORS.iconHover : (state.hoverId === id ? COLORS.titleBar : COLORS.white), COLORS.text, 1.5);
    card.picture(x + cardWidth / 2, y + 18, cardWidth - 10, 26);
    if (card.price) {
      drawSpriteScaled(COIN, COIN_COLORS, x + cardWidth / 2 - 14, y + cardHeight - 11, 1.2);
      write(String(card.price), x + cardWidth / 2 - 5, y + cardHeight - 7, FONTS.tag,
            house.coins >= card.price ? COLORS.text : COLORS.newTag, "left");
    }
  });
  ctx.restore();

  // The name of whatever card the mouse is on, along the bottom.
  const hovered = houseCardNames[state.hoverId];
  write(hovered || (state.houseTab === "shop" ? "Click to buy" : "Click to use"), middle, sidebar.bottom - 10, FONTS.tag, COLORS.text);
}

// A small picture of a piece of furniture (or a wallpaper or floor), fit inside a box.
function cardPicture(type) {
  return (x, y, maxWidth, maxHeight) => {
    if (FURNITURE[type].rug) {
      drawRug(x - 18, y - 9, 36, 18);
      return;
    }
    const { rows } = furniturePicture(type, false);
    const px = Math.min(maxWidth / rows[0].length, maxHeight / rows.length, 2);
    drawFurniture(type, x - (rows[0].length * px) / 2, y - (rows.length * px) / 2, px, false);
  };
}

function lookPicture(look) {
  return (x, y) => {
    fillPattern(look, x - 17, y - 11, 34, 22, 8);
    ctx.strokeStyle = COLORS.text;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x - 17, y - 11, 34, 22);
  };
}

function shopCards(house) {
  const furniture = Object.entries(FURNITURE).filter(([, kind]) => kind.price > 0).map(([type, kind]) => ({
    label: kind.name, price: kind.price, picture: cardPicture(type), onClick: () => buyFurniture(type),
  }));
  const walls = Object.entries(WALLPAPERS).filter(([key, look]) => look.price && !house.owned.includes(key)).map(([key, look]) => ({
    label: look.name, price: look.price, picture: lookPicture(look), onClick: () => buyLook("wallpaper", key),
  }));
  const floors = Object.entries(FLOORS).filter(([key, look]) => look.price && !house.owned.includes(key)).map(([key, look]) => ({
    label: look.name, price: look.price, picture: lookPicture(look), onClick: () => buyLook("floor", key),
  }));
  return [...furniture, ...walls, ...floors];
}

function mineCards(house) {
  const stored = house.items.filter(item => !item.placed && FURNITURE[item.type]).map(item => ({
    label: FURNITURE[item.type].name, picture: cardPicture(item.type), onClick: () => placeStored(item),
  }));
  const looks = [
    ...Object.entries(WALLPAPERS).filter(([key]) => house.owned.includes(key)).map(([key, look]) => ({
      label: look.name, picture: lookPicture(look), current: house.wallpaper === key,
      onClick: () => { playSound("click"); saveHouse({ wallpaper: key }); },
    })),
    ...Object.entries(FLOORS).filter(([key]) => house.owned.includes(key)).map(([key, look]) => ({
      label: look.name, picture: lookPicture(look), current: house.floor === key,
      onClick: () => { playSound("click"); saveHouse({ floor: key }); },
    })),
  ];
  return [...stored, ...looks];
}


// ---------- Buying and placing ----------

const notEnoughCoins = () => showPopup("NOT ENOUGH COINS", "Play games in the Arcade to earn more coins for your house!");

async function buyFurniture(type) {
  const kind = FURNITURE[type];
  if (state.house.coins < kind.price) { notEnoughCoins(); return; }
  if (blockedInPreview()) return;
  playSound("coin", 0.6);
  try {
    await database.runTransaction(async transaction => {
      const doc = await transaction.get(houseRef());
      const data = doc.data();
      if (data.coins < kind.price) throw new Error("coins");
      const item = { id: `${type}-${Date.now().toString(36)}`, type, gx: 0, gy: 0, flip: false, placed: false };
      const spot = findFreeSpot(item, data.items);
      if (spot) Object.assign(item, spot, { placed: true });
      transaction.update(houseRef(), {
        coins: data.coins - kind.price, items: [...data.items, item],
        lastBy: ME, updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      if (!spot) setTimeout(() => showPopup("NO ROOM", `Your ${kind.name.toLowerCase()} is in "Mine". Make some room, then click it there!`), 300);
    });
  } catch (problem) {
    if (problem.message === "coins") notEnoughCoins();
    else console.log("Couldn't buy it:", problem);
  }
}

async function buyLook(which, key) {
  const look = (which === "wallpaper" ? WALLPAPERS : FLOORS)[key];
  if (state.house.coins < look.price) { notEnoughCoins(); return; }
  if (blockedInPreview()) return;
  playSound("coin", 0.6);
  try {
    await database.runTransaction(async transaction => {
      const doc = await transaction.get(houseRef());
      const data = doc.data();
      if (data.coins < look.price) throw new Error("coins");
      transaction.update(houseRef(), {
        coins: data.coins - look.price, owned: [...new Set([...(data.owned || []), key])], [which]: key,
        lastBy: ME, updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    });
  } catch (problem) {
    if (problem.message === "coins") notEnoughCoins();
    else console.log("Couldn't buy it:", problem);
  }
}

// Takes something out of "Mine" and puts it in the first free spot.
function placeStored(item) {
  const spot = findFreeSpot(item, state.house.items);
  if (!spot) {
    showPopup("NO ROOM", "There's no room for that! Move or put away something first.");
    return;
  }
  playSound("click");
  saveHouse({ items: state.house.items.map(other => (other.id === item.id ? { ...other, ...spot, placed: true } : other)) });
}


// ---------- Dragging furniture around ----------

// The mouse went down on a piece of furniture.
function startHouseDrag(item) {
  const layout = houseLayout;
  const kind = FURNITURE[item.type];
  houseDrag = {
    item, gx: item.gx, gy: item.gy, moved: false, overShop: false,
    startX: state.mouse.x, startY: state.mouse.y,
    // Where on the piece he grabbed it (in tiles), so it doesn't jump to the mouse.
    grabX: (state.mouse.x - layout.left) / layout.tile - item.gx,
    grabY: kind.wall ? 0 : (state.mouse.y - layout.floorTop) / layout.tileHeight - item.gy,
  };
}

// The mouse moved while dragging: work out which spot it's over.
function moveHouseDrag() {
  const drag = houseDrag, layout = houseLayout;
  if (Math.abs(state.mouse.x - drag.startX) > 4 || Math.abs(state.mouse.y - drag.startY) > 4) drag.moved = true;
  const kind = FURNITURE[drag.item.type];
  drag.gx = keepBetween(Math.round((state.mouse.x - layout.left) / layout.tile - drag.grabX), 0, HOUSE_COLUMNS - kind.w);
  drag.gy = kind.wall ? 0 : keepBetween(Math.round((state.mouse.y - layout.floorTop) / layout.tileHeight - drag.grabY), 0, HOUSE_ROWS - kind.d);
  const shop = layout.sidebar;
  drag.overShop = state.mouse.x >= shop.left && state.mouse.x <= shop.right && state.mouse.y >= shop.top && state.mouse.y <= shop.bottom;
}

// The mouse came up: drop it (or flip it, if it was just a click).
function endHouseDrag() {
  const drag = houseDrag;
  houseDrag = null;
  const items = state.house.items;
  if (!drag.moved) {
    playSound("click");
    saveHouse({ items: items.map(other => (other.id === drag.item.id ? { ...other, flip: !other.flip } : other)) });
  } else if (drag.overShop) {
    playSound("paper", 0.6);
    saveHouse({ items: items.map(other => (other.id === drag.item.id ? { ...other, placed: false } : other)) });
  } else if (spotIsFree(drag.item, drag.gx, drag.gy)) {
    playSound("flip", 0.5);
    saveHouse({ items: items.map(other => (other.id === drag.item.id ? { ...other, gx: drag.gx, gy: drag.gy } : other)) });
  } else {
    playSound("buzzer", BUZZER_VOLUME * 0.6);
  }
}


// ---------- Coins for playing games ----------

// How many coins each game gives, from its score.
const GAME_COINS = {
  run: miles => Math.round(miles / 250),
  catch: hearts => hearts,
  fly: clouds => clouds * 2,
  match: moves => 24 - moves,
  higher: streak => streak * 2,
  breakout: hearts => Math.round(hearts / 2),
  whack: points => Math.round(points / 2),
};

// Always at least 1 coin for playing, and at most 25 per game.
function coinsForGame(key, score) {
  const coins = GAME_COINS[key] ? GAME_COINS[key](score) : 1;
  return keepBetween(Math.round(coins), 1, 25);
}


// ---------- The icon ----------

const HOUSE_ICON = [
  ".....OO.....",
  "....OppO....",
  "...OppppO...",
  "..OppppppO..",
  ".OppppppppO.",
  "OOOOOOOOOOOO",
  ".OCCCCCCCCO.",
  ".OCBBCCOOCO.",
  ".OCBBCCOtCO.",
  ".OCCCCCOtCO.",
  ".OOOOOOOOOO.",
];

function drawHouseIcon(x, y) {
  drawSprite(HOUSE_ICON, FURNITURE_COLORS, x - 18, y - 18, 3);
}


// ---------- Boop the cats (whack-a-mole) ----------
//
// The orange cat is +1 and stays up a while. The black cat is +3 but super fast.
// The other person pops up too, and booping THEM ends the game!

const WHACK_SECONDS = 45;

// What can pop up: how often (out of 100), how many points, and how long it stays up.
const WHACK_KINDS = {
  orange: { chance: 55, points: 1, seconds: 1.3 },
  black: { chance: 25, points: 3, seconds: 0.6 },
  person: { chance: 20, points: 0, seconds: 1.2 },
};

function setupWhack(game, area) {
  Object.assign(game, { score: 0, timeLeft: WHACK_SECONDS, clock: 0, nextPop: 0.6, moles: [], pops: [] });
  // 9 holes in 3 rows, spread to fit the window.
  const middle = (area.left + area.right) / 2;
  const rowGap = Math.min(68, (area.bottom - area.top - 50) / 3);
  const columnGap = Math.min(110, (area.right - area.left - 60) / 3);
  game.holes = [];
  for (let row = 0; row < 3; row++) {
    for (let column = 0; column < 3; column++) {
      game.holes.push({ x: middle + (column - 1) * columnGap, y: area.top + 48 + (row + 1) * rowGap - 8 });
    }
  }
}

// Boop! Points for a cat, game over for the person.
function boop(game, mole) {
  if (mole.hit || game.paused) return;
  mole.hit = true;
  mole.hitAt = mole.age;
  if (mole.kind === "person") {
    playSound("crash");
    setTimeout(() => playSound("gameover"), 350);
    endGame(game, "Oops!", `You booped ${OTHER}! You had ${game.score} points.`, game.score);
    return;
  }
  const points = WHACK_KINDS[mole.kind].points;
  game.score += points;
  game.pops.push({ x: game.holes[mole.hole].x, y: game.holes[mole.hole].y - 40, text: `+${points}`, age: 0 });
  if (sounds.meow) playSound("meow", 0.4);
  else playSound("coin", 0.5);
}

function stepWhack(game, area, seconds) {
  game.clock += seconds;
  game.timeLeft -= seconds;
  // It gets faster as the game goes on (down to a bit over half the time).
  const speed = Math.max(0.55, 1 - game.clock / 90);

  // Pop something new up, in an empty hole.
  game.nextPop -= seconds;
  if (game.nextPop <= 0) {
    const empty = game.holes.map((hole, number) => number).filter(number => !game.moles.some(mole => mole.hole === number));
    if (empty.length) {
      const roll = Math.random() * 100;
      const kind = roll < WHACK_KINDS.orange.chance ? "orange"
                 : roll < WHACK_KINDS.orange.chance + WHACK_KINDS.black.chance ? "black" : "person";
      game.moles.push({ hole: empty[Math.floor(Math.random() * empty.length)], kind, age: 0,
                        life: WHACK_KINDS[kind].seconds * speed, hit: false });
    }
    game.nextPop = between(0.35, 0.8, Math.random()) * speed;
  }
  game.moles.forEach(mole => { mole.age += seconds; });
  game.moles = game.moles.filter(mole => (mole.hit ? mole.age < mole.hitAt + 0.25 : mole.age < mole.life));

  // The holes, and whatever is popping out of them.
  game.holes.forEach((hole, number) => {
    // A dark hole with a grassy rim.
    ctx.fillStyle = "#7CC27A";
    ctx.beginPath();
    ctx.ellipse(hole.x, hole.y + 2, 32, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#45284A";
    ctx.beginPath();
    ctx.ellipse(hole.x, hole.y, 26, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    const mole = game.moles.find(other => other.hole === number);
    if (!mole) return;
    // Rising up out of the hole, then sinking back down (or ducking fast when booped).
    const end = mole.hit ? mole.hitAt + 0.25 : mole.life;
    const rise = Math.max(0, Math.min(1, mole.age / 0.12, (end - mole.age) / 0.12));
    const height = mole.kind === "person" ? 32 : CAT_HEIGHT;
    const width = mole.kind === "person" ? 24 : CAT_WIDTH;
    const left = hole.x - width / 2, top = hole.y - height * rise;

    // Only show the part that's above the hole.
    ctx.save();
    ctx.beginPath();
    ctx.rect(hole.x - 40, hole.y - 60, 80, 60);
    ctx.clip();
    if (mole.kind === "person") {
      drawPerson(OTHER === YOUR_NAME ? "tayler" : "jacob", LEGS_STAND, Math.round(left), Math.round(top), 2);
    } else {
      const cat = CATS.find(info => info.name === mole.kind);
      const outline = { W: cat.outline, S: cat.outline, E: cat.outline, P: cat.outline };
      [[-1, 0], [1, 0], [0, -1]].forEach(([dx, dy]) => {
        drawSprite(CAT_SIT, outline, Math.round(left) + dx * CAT_SIZE, Math.round(top) + dy * CAT_SIZE, CAT_SIZE);
      });
      drawSprite(CAT_SIT, cat.colors, Math.round(left), Math.round(top), CAT_SIZE);
    }
    // Booped: little stars.
    if (mole.hit) drawPixels(SPARKLE, hole.x - 10, top - 14, 2, COLORS.white);
    ctx.restore();

    // The front lip of the hole, so it looks like it's coming out of the ground.
    ctx.fillStyle = "#7CC27A";
    ctx.fillRect(hole.x - 30, hole.y + 2, 60, 6);

    if (!mole.hit && rise > 0.5) {
      hitBoxes.push({ left: hole.x - 26, top: hole.y - height - 4, right: hole.x + 26, bottom: hole.y + 8,
                      onClick: () => boop(game, mole) });
    }
  });

  // "+1" and "+3" floating up.
  game.pops.forEach(pop => {
    pop.age += seconds;
    write(pop.text, pop.x, pop.y - pop.age * 30, FONTS.menu, COLORS.newTag);
  });
  game.pops = game.pops.filter(pop => pop.age < 0.7);

  write(`Points: ${game.score}`, area.left + 8, area.top + 12, FONTS.small, COLORS.text, "left");
  write(`Time: ${Math.max(0, Math.ceil(game.timeLeft))}`, area.right - 8, area.top + 12, FONTS.small, COLORS.text, "right");

  if (game.timeLeft <= 0) {
    playSound("win", 0.5);
    endGame(game, "Time's up!", `You got ${game.score} points!`, game.score);
  }
}

// An orange cat peeking out of a hole, for the Arcade tile.
function drawWhackIcon(x, y) {
  ctx.fillStyle = "#45284A";
  ctx.beginPath();
  ctx.ellipse(x, y + 12, 18, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  const cat = CATS[0];
  drawSprite(CAT_SIT.slice(0, 5), cat.colors, x - 21, y - 4, 2);
}


// ---------- Tic-tac-toe and Connect 4 (you take turns, from your own computers) ----------
//
// Each game is saved in Firebase. Your pieces are pink hearts, his are blue.
// When it's someone's turn, Discord pings them.

const TURN_GAMES = {
  tictactoe: { title: "Tic-tac-toe", columns: 3, rows: 3, inARow: 3 },
  connect4: { title: "Connect 4", columns: 7, rows: 6, inARow: 4 },
};

// Who won? (A name, "draw", or null if the game isn't over.)
function findWinner(kind, board) {
  const { columns, rows, inARow } = TURN_GAMES[kind];
  const at = (column, row) => (column >= 0 && column < columns && row >= 0 && row < rows ? board[row * columns + column] : "");
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const who = at(column, row);
      if (!who) continue;
      // Check right, down, and both diagonals.
      for (const [dx, dy] of [[1, 0], [0, 1], [1, 1], [1, -1]]) {
        let count = 1;
        while (count < inARow && at(column + dx * count, row + dy * count) === who) count++;
        if (count === inARow) return who;
      }
    }
  }
  return board.every(cell => cell) ? "draw" : null;
}

// Starts a new game. Whoever starts it goes first.
async function newTurnGame(kind) {
  if (blockedInPreview()) return;
  playSound("click");
  const { columns, rows } = TURN_GAMES[kind];
  try {
    await database.collection("matches").doc(kind).set({
      board: Array(columns * rows).fill(""),
      turn: ME, winner: null, starter: ME, lastMoveBy: ME,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    // The only Discord ping for these games: when a new game starts.
    pingOther(`🎮 ${ME} started a game of ${TURN_GAMES[kind].title} with you!`);
  } catch (problem) {
    console.log("Couldn't start the game:", problem);
    showPopup("OOPS", "Couldn't start the game. Try again?");
  }
}

// Puts your piece in a spot, and passes the turn to the other person.
async function playTurn(kind, spot) {
  const match = state.matches[kind];
  if (!match || match.winner || match.turn !== ME || match.board[spot] || blockedInPreview()) return;
  const board = [...match.board];
  board[spot] = ME;
  const winner = findWinner(kind, board);
  playSound(winner === ME ? "win" : "flip", 0.6);
  // Show it right away (Firebase catches up a moment later).
  state.matches[kind] = { ...match, board, turn: OTHER, winner, lastMoveBy: ME };
  try {
    await database.collection("matches").doc(kind).set({
      board, turn: OTHER, winner, starter: match.starter, lastMoveBy: ME,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    if (winner === ME) {
      shareWin(kind);
      addCoins(10);
    } else if (winner === "draw") {
      addCoins(5);
    }
    // (No Discord ping for each move. The pop-up on the site still shows when it's your turn.)
  } catch (problem) {
    console.log("Couldn't save the move:", problem);
    state.matches[kind] = match;
    playSound("buzzer", BUZZER_VOLUME);
  }
}

// The words at the top: whose turn it is, or who won.
function turnGameStatus(match) {
  if (!match) return `Start a game with ${OTHER}!`;
  if (match.winner === ME) return "You won!";
  if (match.winner === OTHER) return `${OTHER} won!`;
  if (match.winner === "draw") return "It's a tie!";
  return match.turn === ME ? "Your turn!" : `Waiting for ${OTHER}...`;
}

function drawTurnGame(kind, game, area) {
  const middle = (area.left + area.right) / 2;
  if (state.online !== "ok") {
    drawOnlineProblem(area, `play with ${OTHER}`);
    return;
  }
  const { columns, rows } = TURN_GAMES[kind];
  const match = state.matches[kind];
  const board = match ? match.board : Array(columns * rows).fill("");
  const myTurn = match && !match.winner && match.turn === ME;

  write(turnGameStatus(match), middle, area.top + 12, FONTS.menu, COLORS.text);
  drawWins(kind, middle, area.top + 28);

  // The board, as big as fits (leaving room for the words and a button).
  const cell = Math.floor(Math.min((area.right - area.left - 20) / columns, (area.bottom - area.top - 90) / rows, 48));
  const left = middle - (cell * columns) / 2, top = area.top + 40;
  ctx.fillStyle = kind === "connect4" ? COLORS.iconHover : COLORS.white;
  ctx.fillRect(left, top, cell * columns, cell * rows);

  for (let spot = 0; spot < board.length; spot++) {
    const column = spot % columns, row = Math.floor(spot / columns);
    const x = left + column * cell, y = top + row * cell;
    // In Connect 4 you click a COLUMN (the piece drops down). In Tic-tac-toe, a square.
    const target = kind === "connect4" ? dropSpot(board, column) : spot;
    const canPlay = myTurn && target !== null && !board[target];
    if (canPlay) {
      const id = `${kind}:${column}:${kind === "connect4" ? "" : row}`;
      hitBoxes.push({ left: x, top: y, right: x + cell, bottom: y + cell, id, onClick: () => playTurn(kind, target) });
      if (state.hoverId === id) {
        ctx.fillStyle = COLORS.titleBar;
        ctx.fillRect(x + 1, y + 1, cell - 2, cell - 2);
      }
    }
    ctx.strokeStyle = COLORS.text;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, cell, cell);
    if (kind === "connect4" && !board[spot]) {
      // An empty hole.
      ctx.fillStyle = COLORS.white;
      ctx.beginPath();
      ctx.arc(x + cell / 2, y + cell / 2, cell * 0.34, 0, Math.PI * 2);
      ctx.fill();
    }
    if (board[spot]) {
      const size = Math.max(1, Math.floor(cell / 10));
      drawPixels(HEART, x + cell / 2 - 3.5 * size, y + cell / 2 - 3 * size, size, PLAYER_COLORS[board[spot]]);
    }
  }

  // Under the board: who's which color, and a "New game" button when it's over.
  const under = top + cell * rows + 14;
  if (!match || match.winner) {
    drawButton(middle, under + 8, 130, 26, match ? "Rematch" : "New game", COLORS.acceptFill, COLORS.acceptText,
               () => newTurnGame(kind));
  } else {
    drawPixels(HEART, middle - 80, under - 3, 1, PLAYER_COLORS[YOUR_NAME]);
    write(YOUR_NAME, middle - 70, under + 1, FONTS.tag, COLORS.text, "left");
    drawPixels(HEART, middle + 20, under - 3, 1, PLAYER_COLORS[RECIPIENT_NAME]);
    write(RECIPIENT_NAME, middle + 30, under + 1, FONTS.tag, COLORS.text, "left");
  }
}

// In Connect 4, a piece drops to the lowest empty spot in its column (or null if it's full).
function dropSpot(board, column) {
  const { columns, rows } = TURN_GAMES.connect4;
  for (let row = rows - 1; row >= 0; row--) {
    if (!board[row * columns + column]) return row * columns + column;
  }
  return null;
}


// ---------- The Couples quiz: "Who's more likely to...?" ----------
//
// You both answer the same 5 questions on your own computers. Once you've both answered,
// you see how many you matched.

async function newQuiz() {
  if (blockedInPreview()) return;
  playSound("click");
  // Pick 5 different questions at random.
  const numbers = QUIZ_QUESTIONS.map((question, number) => number).sort(() => Math.random() - 0.5).slice(0, 5);
  try {
    await database.collection("quiz").doc("current").set({
      round: ((state.quiz && state.quiz.round) || 0) + 1,
      questions: numbers,
      [`answers${YOUR_NAME}`]: null,
      [`answers${RECIPIENT_NAME}`]: null,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    pingOther(`💕 ${ME} started a couples quiz with you!`);
  } catch (problem) {
    console.log("Couldn't start the quiz:", problem);
    showPopup("OOPS", "Couldn't start the quiz. Try again?");
  }
}

// He picked an answer for this question. After the 5th, his answers are saved.
async function pickQuizAnswer(game, name) {
  playSound("click");
  // If the other person already answered, finishing the quiz earns coins for the house.
  const bothDone = state.quiz && state.quiz[`answers${OTHER}`];
  game.picks = [...(game.picks || []), name];
  if (game.picks.length < 5) return;
  if (blockedInPreview()) { game.picks = []; return; }
  try {
    await database.collection("quiz").doc("current").update({
      [`answers${ME}`]: game.picks,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    playSound("win", 0.5);
    if (bothDone) addCoins(10);
  } catch (problem) {
    console.log("Couldn't save the answers:", problem);
    game.picks = [];
    playSound("buzzer", BUZZER_VOLUME);
  }
}

function drawQuiz(game, area) {
  const middle = (area.left + area.right) / 2;
  if (state.online !== "ok") {
    drawOnlineProblem(area, `play with ${OTHER}`);
    return;
  }
  const quiz = state.quiz;
  const mine = quiz && quiz[`answers${ME}`];
  const theirs = quiz && quiz[`answers${OTHER}`];

  // No quiz yet.
  if (!quiz) {
    write("Couples quiz", middle, area.top + 50, FONTS.celebrationSubtitle, COLORS.text);
    write("Who's more likely to...? Answer 5 questions,", middle, area.top + 84, FONTS.note, COLORS.text);
    write("then see how many you matched!", middle, area.top + 102, FONTS.note, COLORS.text);
    drawButton(middle, area.top + 150, 120, 30, "Start", COLORS.acceptFill, COLORS.acceptText, newQuiz);
    return;
  }

  // Answering: one question at a time.
  if (!mine) {
    if (game.quizRound !== quiz.round) {
      game.quizRound = quiz.round;
      game.picks = [];
    }
    const number = (game.picks || []).length;
    if (number >= 5) {
      write("Saving...", middle, area.top + 90, FONTS.body, COLORS.text);
      return;
    }
    write(`Question ${number + 1} of 5`, middle, area.top + 18, FONTS.small, COLORS.text);
    write("Who's more likely to...", middle, area.top + 50, FONTS.body, COLORS.text);
    wrapWords(QUIZ_QUESTIONS[quiz.questions[number]], FONTS.menu, area.right - area.left - 40).forEach((line, row) => {
      write(line, middle, area.top + 80 + row * 20, FONTS.menu, COLORS.text);
    });
    drawButton(middle - 70, area.top + 150, 120, 30, YOUR_NAME, PLAYER_COLORS[YOUR_NAME], COLORS.white,
               () => pickQuizAnswer(game, YOUR_NAME));
    drawButton(middle + 70, area.top + 150, 120, 30, RECIPIENT_NAME, PLAYER_COLORS[RECIPIENT_NAME], COLORS.white,
               () => pickQuizAnswer(game, RECIPIENT_NAME));
    return;
  }

  // Waiting for the other person.
  if (!theirs) {
    drawPixels(HEART, middle - 14, area.top + 40, 4, COLORS.heart);
    write("Your answers are in!", middle, area.top + 90, FONTS.body, COLORS.text);
    write(`Waiting for ${OTHER} to answer...`, middle, area.top + 116, FONTS.note, COLORS.text);
    return;
  }

  // Results! Each question, with a heart in the color of who each of you picked.
  const matched = quiz.questions.filter((question, number) => mine[number] === theirs[number]).length;
  write(`You matched ${matched} out of 5!`, middle, area.top + 14, FONTS.menu, COLORS.text);
  const rowHeight = Math.min(26, (area.bottom - area.top - 70) / 5);
  quiz.questions.forEach((question, number) => {
    const y = area.top + 34 + number * rowHeight;
    const same = mine[number] === theirs[number];
    let text = QUIZ_QUESTIONS[question];
    ctx.font = FONTS.tag;
    const room = area.right - area.left - 110;
    while (ctx.measureText(text).width > room && text.length > 4) text = text.slice(0, -2);
    if (text !== QUIZ_QUESTIONS[question]) text = text.trim() + "...";
    write(text, area.left + 12, y + 6, FONTS.tag, COLORS.text, "left");
    // Your pick, then his pick (as hearts in that person's color), then a check or an X.
    const picks = { [YOUR_NAME]: quiz[`answers${YOUR_NAME}`][number], [RECIPIENT_NAME]: quiz[`answers${RECIPIENT_NAME}`][number] };
    drawPixels(HEART, area.right - 86, y + 1, 1.5, PLAYER_COLORS[picks[YOUR_NAME]]);
    drawPixels(HEART, area.right - 66, y + 1, 1.5, PLAYER_COLORS[picks[RECIPIENT_NAME]]);
    if (same) drawPixels(CHECK, area.right - 40, y + 2, 2, COLORS.check);
    else write("x", area.right - 34, y + 6, FONTS.menu, COLORS.newTag);
  });
  write(`${YOUR_NAME}'s pick, ${RECIPIENT_NAME}'s pick`, area.right - 12, area.top + 28, FONTS.tag, COLORS.text, "right");
  drawButton(middle, area.bottom - 18, 130, 26, "New quiz", COLORS.acceptFill, COLORS.acceptText, newQuiz);
}


// ---------- Listening for moves, and pop-ups when it's your turn ----------

function listenForGames(failed) {
  database.collection("matches").onSnapshot(snapshot => {
    snapshot.docs.forEach(doc => { state.matches[doc.id] = doc.data(); });
    checkForGameNews();
  }, failed);
  database.collection("quiz").doc("current").onSnapshot(doc => {
    state.quiz = doc.exists ? doc.data() : null;
    checkForGameNews();
  }, failed);
}

// A pop-up (once) when the other person makes a move or answers the quiz.
function checkForGameNews() {
  Object.entries(state.matches).forEach(([kind, match]) => {
    if (match.lastMoveBy !== OTHER || !match.updatedAt) return;
    const seen = `${SIDE}:gamenews:${kind}:${match.updatedAt.seconds}`;
    if (remembers(seen)) return;
    remember(seen);
    const title = TURN_GAMES[kind] ? TURN_GAMES[kind].title : kind;
    if (match.winner === OTHER) notify("GAME OVER", `${OTHER} won ${title}! Rematch?`);
    else if (match.winner === "draw") notify("GAME OVER", `${title} ended in a tie!`);
    else notify("YOUR TURN", `${OTHER} made a move in ${title}! Open the Arcade to play.`);
  });
  const quiz = state.quiz;
  if (quiz && quiz[`answers${OTHER}`] && quiz.updatedAt) {
    const seen = `${SIDE}:quiznews:${quiz.round}`;
    if (!remembers(seen)) {
      remember(seen);
      notify("COUPLES QUIZ", quiz[`answers${ME}`] ? `${OTHER} finished the quiz! See how you matched in the Arcade.`
                                                    : `${OTHER} answered the couples quiz! Your turn, in the Arcade.`);
    }
  }
}

// The little words on a game's tile in the Arcade (instead of a best score).
function turnGameTileText(kind) {
  const match = state.matches[kind];
  if (match && !match.winner && match.turn === ME) return "your turn!";
  return `wins ${winsOf(YOUR_NAME, kind)} - ${winsOf(RECIPIENT_NAME, kind)}`;
}

// "Wins: Tayler 3  Jacob 2" above a Tic-tac-toe or Connect 4 board.
function drawWins(kind, middle, y) {
  const values = { [YOUR_NAME]: winsOf(YOUR_NAME, kind), [RECIPIENT_NAME]: winsOf(RECIPIENT_NAME, kind) };
  drawScoreLine(values, middle, y + 3, n => `${n} ${n === 1 ? "win" : "wins"}`);
}

// Both of your best scores in a solo game ("Tayler: 12 hearts  Jacob: 9 hearts").
function drawBestScores(key, middle, y) {
  const info = GAMES[key];
  const values = { [YOUR_NAME]: bestOf(YOUR_NAME, key), [RECIPIENT_NAME]: bestOf(RECIPIENT_NAME, key) };
  write("best scores", middle, y - 12, FONTS.tag, COLORS.text);
  drawScoreLine(values, middle, y, n => info.bestText(n));
}

function quizTileText() {
  const quiz = state.quiz;
  if (quiz && !quiz[`answers${ME}`]) return "your turn!";
  return `with ${OTHER}`;
}


// ---------- Shared scores: both of your best scores, and who has more wins ----------
//
// Each of you has a "scores" record in Firebase, like:
//   { best_run: 4000, best_catch: 12, wins_tictactoe: 3, ... }
// Best scores are for the solo games, wins are for Tic-tac-toe and Connect 4.

state.scores = {};   // { Tayler: {...}, Jacob: {...} }

function listenForScores(failed) {
  database.collection("scores").onSnapshot(snapshot => {
    snapshot.docs.forEach(doc => { state.scores[doc.id] = doc.data(); });
    uploadOldBests();
  }, failed);
}

// Someone's best score in a game (or null). Your own also checks this browser, so it
// still shows when you're offline.
function bestOf(name, key) {
  const online = state.scores[name] && state.scores[name][`best_${key}`];
  if (name !== ME) return online === undefined ? null : online;
  const local = loadNumber(`best:${key}`);
  if (online === undefined || online === null) return local;
  if (local === null) return online;
  return GAMES[key].lowerIsBetter ? Math.min(local, online) : Math.max(local, online);
}

function winsOf(name, kind) {
  const wins = state.scores[name] && state.scores[name][`wins_${kind}`];
  return typeof wins === "number" ? wins : 0;
}

// Saves a new best score to Firebase, so the other person can see it too.
function shareBest(key, score) {
  if (state.online !== "ok" || state.previewingHisSide) return;
  database.collection("scores").doc(ME).set({ [`best_${key}`]: score }, { merge: true })
    .catch(problem => console.log("Couldn't share the score:", problem));
}

// Adds one win to your count.
function shareWin(kind) {
  if (state.online !== "ok" || state.previewingHisSide) return;
  database.collection("scores").doc(ME).set({ [`wins_${kind}`]: firebase.firestore.FieldValue.increment(1) }, { merge: true })
    .catch(problem => console.log("Couldn't share the win:", problem));
}

// Best scores from before scores were shared (saved only in this browser) get uploaded once.
let uploadedOldBests = false;
function uploadOldBests() {
  if (uploadedOldBests || state.previewingHisSide) return;
  uploadedOldBests = true;
  Object.keys(GAMES).forEach(key => {
    const local = loadNumber(`best:${key}`);
    const online = state.scores[ME] && state.scores[ME][`best_${key}`];
    if (local === null) return;
    const better = online === undefined || online === null ||
                   (GAMES[key].lowerIsBetter ? local < online : local > online);
    if (better) shareBest(key, local);
  });
}

// "Tayler: 12   Jacob: 9", with a little crown-heart next to whoever's winning.
function drawScoreLine(values, middle, y, format) {
  const [mine, his] = [values[YOUR_NAME], values[RECIPIENT_NAME]];
  const text = name => `${name}: ${values[name] === null ? "-" : format(values[name])}`;
  write(text(YOUR_NAME), middle - 12, y, FONTS.small, COLORS.text, "right");
  write(text(RECIPIENT_NAME), middle + 12, y, FONTS.small, COLORS.text, "left");
  drawPixels(HEART, middle - 3.5, y - 3, 1, COLORS.heart);
  return mine === his ? null : (mine > his ? YOUR_NAME : RECIPIENT_NAME);
}

// Who's ahead in a game, for the little words on its Arcade tile (like "Jacob: 12").
function leaderText(key) {
  const info = GAMES[key];
  const scores = [YOUR_NAME, RECIPIENT_NAME].map(name => [name, bestOf(name, key)]).filter(([, value]) => value !== null);
  if (scores.length === 0) return "best: -";
  scores.sort((a, b) => (info.lowerIsBetter ? a[1] - b[1] : b[1] - a[1]));
  return `${scores[0][0]}: ${scores[0][1]}`;
}


// ---------- The icons ----------

function drawTicTacToeIcon(x, y) {
  ctx.fillStyle = COLORS.text;
  [-6, 6].forEach(offset => {
    ctx.fillRect(x + offset - 1, y - 18, 2, 36);
    ctx.fillRect(x - 18, y + offset - 1, 36, 2);
  });
  drawPixels(HEART, x - 18, y - 16, 1.5, PLAYER_COLORS[YOUR_NAME]);
  drawPixels(HEART, x - 5, y - 4, 1.5, PLAYER_COLORS[RECIPIENT_NAME]);
  drawPixels(HEART, x + 8, y + 8, 1.5, PLAYER_COLORS[YOUR_NAME]);
}

function drawConnect4Icon(x, y) {
  steppedBox(x - 20, y - 15, x + 20, y + 17, 2, "#7FB8F0", COLORS.text, 2);
  const colors = [COLORS.white, PLAYER_COLORS[YOUR_NAME], COLORS.white, COLORS.white,
                  PLAYER_COLORS[RECIPIENT_NAME], PLAYER_COLORS[YOUR_NAME], PLAYER_COLORS[RECIPIENT_NAME], PLAYER_COLORS[YOUR_NAME]];
  colors.forEach((color, number) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x - 12 + (number % 4) * 8, y - 6 + Math.floor(number / 4) * 12, 3, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawQuizIcon(x, y) {
  drawPixels(HEART, x - 14, y - 12, 4, COLORS.heart);
  write("?", x, y - 2, FONTS.menu, COLORS.white);
}

function drawHigherIcon(x, y) {
  steppedBox(x - 18, y - 16, x + 2, y + 12, 2, COLORS.white, COLORS.text, 2);
  write("7", x - 8, y - 2, FONTS.menu, COLORS.heart);
  steppedBox(x - 2, y - 12, x + 18, y + 16, 2, COLORS.acceptFill, COLORS.text, 2);
  write("?", x + 8, y + 2, FONTS.menu, COLORS.white);
}

function drawBreakoutIcon(x, y) {
  BREAKOUT_COLORS.slice(0, 3).forEach((color, row) => {
    for (let column = 0; column < 3; column++) {
      ctx.fillStyle = color;
      ctx.fillRect(x - 19 + column * 13, y - 16 + row * 7, 11, 5);
    }
  });
  ctx.fillStyle = COLORS.white;
  ctx.fillRect(x + 1, y + 4, 4, 4);
  ctx.fillStyle = COLORS.acceptFill;
  ctx.fillRect(x - 10, y + 13, 22, 4);
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

  // An invite YOU sent: you see exactly what the other person sees (buttons and all),
  // but it's just a preview, so nothing gets sent.
  const date = invite.remote;
  if (isMyOwnInvite(invite)) {
    write(`Preview of what ${OTHER} sees`, CENTER_X, 290, FONTS.small, COLORS.newTag);
  } else if (date && !needsMyAnswer(date)) {
    // A date from them that's already accepted, or waiting on them: no buttons, just a note.
    const note = date.status === "accepted" ? "It's a date!"
                                            : `Waiting for ${OTHER} to answer...`;
    write(note, CENTER_X, 322, FONTS.celebrationSubtitle, COLORS.text);
    ctx.globalAlpha = 1;
    return;
  } else if (date && date.proposedBy) {
    write(`${date.proposedBy} suggested this new time!`, CENTER_X, 290, FONTS.small, COLORS.newTag);
  }

  // The buttons.
  drawButton(316, 316, 120, 36, "Accept", COLORS.acceptFill, COLORS.acceptText, accept);
  if (state.declines >= declinesFor(invite).length) {
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
                  onClick: suggestOrReschedule });

  // The "Suggest a new time" box, on top of the letter.
  if (state.rescheduling) requestPanel("reschedule", { left: 254, top: 150, right: 514, bottom: 300 });

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
    drawButton(CENTER_X - 50, bottom - 22, 84, 26, popup.yes.noText || "Cancel", COLORS.cream, COLORS.text, closePopup, true);
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
  drawVase(time);

  // A smaller invite floats over the desktop, so the desktop is drawn first, underneath it.
  const smallInvite = state.mode === "invite" && state.inviteSmall;
  if (smallInvite) drawDesktop(time);

  // A planned invite can have its own colors (see withInviteColors).
  const inviteColors = state.mode === "invite" && state.invite ? state.invite.colors : null;
  withInviteColors(inviteColors, () => {
    // The small invite: everything is drawn shrunk down, inside a little framed screen.
    const firstInviteBox = hitBoxes.length;
    if (smallInvite) {
      const corner1 = toSmallInvite(SCREEN.left, SCREEN.top);
      const corner2 = toSmallInvite(SCREEN.right, SCREEN.bottom);
      ctx.fillStyle = COLORS.text;                              // shadow
      ctx.fillRect(corner1.x + 5, corner1.y + 5, corner2.x - corner1.x, corner2.y - corner1.y);
      ctx.save();
      ctx.translate(INVITE_SMALL_CENTER.x, INVITE_SMALL_CENTER.y);
      ctx.scale(INVITE_SMALL_SCALE, INVITE_SMALL_SCALE);
      ctx.translate(-SCREEN_CENTER.x, -SCREEN_CENTER.y);
      // Keep confetti and sparkles inside the little screen.
      ctx.beginPath();
      ctx.rect(SCREEN.left, SCREEN.top, SCREEN.right - SCREEN.left, SCREEN.bottom - SCREEN.top);
      ctx.clip();
      // Clicks on the small invite shouldn't reach the desktop icons underneath.
      hitBoxes.push({ left: SCREEN.left, top: SCREEN.top, right: SCREEN.right, bottom: SCREEN.bottom,
                      onClick: () => {}, blocker: true });
    }

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

    // Pop-ups during an invite use its colors too.
    if (state.mode === "invite") {
      showWaitingPopups();
      if (state.popup) drawPopup();
    }

    if (smallInvite) {
      ctx.restore();
      // A dark outline around the little screen.
      const corner1 = toSmallInvite(SCREEN.left, SCREEN.top);
      const corner2 = toSmallInvite(SCREEN.right, SCREEN.bottom);
      ctx.strokeStyle = COLORS.text;
      ctx.lineWidth = 3;
      ctx.strokeRect(corner1.x, corner1.y, corner2.x - corner1.x, corner2.y - corner1.y);
      // Everything clickable in the invite moves to where it is on the small one.
      for (let i = firstInviteBox; i < hitBoxes.length; i++) {
        const box = hitBoxes[i];
        const topLeft = toSmallInvite(box.left, box.top), bottomRight = toSmallInvite(box.right, box.bottom);
        Object.assign(box, { left: topLeft.x, top: topLeft.y, right: bottomRight.x, bottom: bottomRight.y });
      }
    }
  });

  // The computer's power button (next to the green light) shows the "Shut down" joke.
  hitBoxes.push({ left: 610, top: 390, right: 640, bottom: 412,
                  onClick: () => showPopup("SHUT DOWN", SHUT_DOWN_MESSAGE) });

  // Pop-ups go on top of everything. (New messages and dates that came in while a
  // pop-up was already showing wait their turn.)
  if (state.mode !== "invite") {
    showWaitingPopups();
    if (state.popup) drawPopup();
  }

  // The real text boxes (IM, Plan a date, Suggest a new time) go where their windows are.
  placePanels();

  // The screensaver goes on top of even the pop-ups.
  updateScreensaver(time);
  if (state.screensaver) {
    drawScreensaver(time);
    // Keep showing the little pixel arrow, so he can see where he's clicking.
    canvas.style.cursor = mouseIsIn(SCREEN) ? ARROW_CURSOR : "default";
  } else {
    updateMouse();
  }
  nextFrame(draw);
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
  // (Title bars you can drag show the normal arrow, not the "click me" heart.)
  const clickable = box && !box.blocker && !box.dragWin;
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
  const playing = state.windows.some(win => win.game && win.game.playing && !win.game.paused && !win.minimized);
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

// A click (or a tap) on whatever is under the mouse.
function handleClick() {
  // If this click woke up the screensaver, that's all it does.
  if (wakeUp()) return;
  const box = boxUnderMouse();
  // Clicking anything except the Start button closes the Start menu.
  if (!box || !box.keepsMenu) state.startMenu = false;
  // The power menu closes on any click except the power button itself.
  if (!box || box.id !== "power") state.powerMenu = false;
  if (!box) return;

  // Clicking inside a window brings it to the front, and loads it so the click works on it.
  if (box.win && state.windows.includes(box.win)) {
    focusWindow(box.win);
    loadWindow(box.win);
  }
  box.onClick();
  unloadWindow();
}

// FINGER SCROLLING (on phones and tablets): dragging up and down scrolls the
// "Open when..." list and the Arcade, like a phone app.
//
// To tell a tap from a drag, a finger tap only counts when the finger lifts up,
// and only if it didn't move much. (Mouse clicks still happen right away.)
let touch = null;   // { y, startX, startY, moved } while a finger is on the screen

// Which list a finger drag would scroll right now (or null if nothing can scroll).
function scrollableList() {
  if (state.window === "openwhen" && state.openWhen === null && state.letterListMaxScroll) {
    return { key: "letterListScroll", max: state.letterListMaxScroll };
  }
  if (state.window === "games" && state.launcherMaxScroll) {
    return { key: "launcherScroll", max: state.launcherMaxScroll };
  }
  if (state.window === "house" && state.houseMaxScroll) {
    return { key: "houseScroll", max: state.houseMaxScroll };
  }
  if (state.window === "im" && state.imMaxScroll) {
    return { key: "imScroll", max: state.imMaxScroll };
  }
  return null;
}

// The mouse wheel scrolls the house's shop.
canvas.addEventListener("wheel", event => withWindow(windowUnderMouse(), () => {
  if (state.window !== "house" || !state.houseMaxScroll) return;
  event.preventDefault();
  state.houseScroll = keepBetween(state.houseScroll + event.deltaY * 0.5, 0, state.houseMaxScroll);
}), { passive: false });

// The mouse wheel scrolls the IM chat (whichever window the mouse is over).
canvas.addEventListener("wheel", event => withWindow(windowUnderMouse(), () => {
  if (state.window !== "im" || !state.imMaxScroll) return;
  event.preventDefault();
  state.imScroll = keepBetween(Math.min(state.imScroll, state.imMaxScroll) + event.deltaY * 0.5, 0, state.imMaxScroll);
}), { passive: false });

canvas.addEventListener("pointermove", event => {
  state.mouse = toDrawing(event);
  stillHere();

  // Dragging furniture.
  if (houseDrag) {
    moveHouseDrag();
    return;
  }

  // Dragging a window: it follows the mouse, but can't go fully off the screen
  // (the title bar always stays where he can grab it).
  if (dragging) {
    dragging.win.x = keepBetween(state.mouse.x - dragging.dx, SCREEN.left - WINDOW_WIDTH + 80, SCREEN.right - 80);
    dragging.win.y = keepBetween(state.mouse.y - dragging.dy, SCREEN.top, TASKBAR.top - 24);
    return;
  }

  if (touch) {
    // Moved more than a few pixels? Then it's a drag, not a tap.
    if (Math.abs(state.mouse.y - touch.startY) > 6 || Math.abs(state.mouse.x - touch.startX) > 6) touch.moved = true;
    withWindow(touch.win, () => {
      const list = scrollableList();
      if (touch.moved && list) {
        // Dragging up scrolls down (the list follows the finger).
        state[list.key] = keepBetween((state[list.key] || 0) + (touch.y - state.mouse.y), 0, list.max);
      }
    });
    touch.y = state.mouse.y;
  }
});

canvas.addEventListener("pointerdown", event => {
  state.mouse = toDrawing(event);

  // Grabbing a window's title bar starts dragging it.
  const box = state.screensaver || state.popup ? null : boxUnderMouse();
  // Grabbing a piece of furniture in the house starts dragging it.
  if (box && box.houseItem) {
    state.startMenu = false;
    if (box.win) focusWindow(box.win);
    startHouseDrag(box.houseItem);
    return;
  }
  if (box && box.dragWin) {
    state.startMenu = false;
    focusWindow(box.dragWin);
    dragging = { win: box.dragWin, dx: state.mouse.x - box.dragWin.x, dy: state.mouse.y - box.dragWin.y };
    return;
  }

  // While playing a game, taps count right away (so jumping isn't late).
  const top = topWindow();
  const playing = top && top.game && top.game.playing && !top.game.paused;
  if (event.pointerType === "touch" && !playing) {
    touch = { y: state.mouse.y, startX: state.mouse.x, startY: state.mouse.y, moved: false, win: windowUnderMouse() };
    return;
  }
  handleClick();
});

canvas.addEventListener("pointerup", event => {
  if (houseDrag) {
    state.mouse = toDrawing(event);
    endHouseDrag();
    return;
  }
  if (dragging) {
    dragging = null;
    return;
  }
  if (!touch) return;
  const wasTap = !touch.moved;
  touch = null;
  if (wasTap) {
    state.mouse = toDrawing(event);
    handleClick();
  }
});
canvas.addEventListener("pointercancel", () => { touch = null; dragging = null; houseDrag = null; });

// Opens or closes the Start menu.
function toggleStartMenu() {
  playSound("click");
  state.startMenu = !state.startMenu;
}

// Opens a window on the desktop: "notes", "memories", "games" (the launcher),
// or a game, like "game:run".
//
// If that window is already open, it just comes to the front. Picking a game in the
// Arcade turns that same window into the game.
function openWindow(name) {
  playSound("click");

  // A game opened from inside the Arcade window: that window becomes the game.
  if (name.startsWith("game:") && loadedWindow && state.window === "games") {
    state.window = name;
    state.game = { key: name.slice(5), playing: false, over: false };
    return;
  }

  // Already open? Bring it to the front. (The Arcade and its games count as the same window.)
  const family = kind => (kind.startsWith("game:") ? "games" : kind);
  const existing = state.windows.find(win => family(win.window) === family(name));
  if (existing) {
    focusWindow(existing);
    loadWindow(existing);
    return;
  }

  // A brand new window. Each new one opens a little lower and to the right of the last,
  // so they don't all stack exactly on top of each other.
  const step = state.windows.length % 5;
  const win = {
    ...WINDOW_DEFAULTS,
    window: name,
    game: name.startsWith("game:") ? { key: name.slice(5), playing: false, over: false } : null,
    // "Open when..." and the Arcade start full screen (he can shrink them with the button).
    maximized: name === "openwhen" || name === "games" || name === "house" || name === "datenight",
    x: 200 + step * 20,
    y: 64 + step * 10,
    minimized: false,
  };
  state.windows.push(win);
  focusWindow(win);
  loadWindow(win);
}

// Closing a game goes back to the Arcade. Closing anything else closes the window.
function closeWindow() {
  playSound("click");
  if (state.game) {
    state.window = "games";
    state.game = null;
    return;
  }
  // Take this window out of the list. (A love note he just read moves into Memories.)
  state.windows = state.windows.filter(win => win !== loadedWindow);
  loadedWindow = null;
  Object.assign(state, WINDOW_DEFAULTS);
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
  // (Any new messages or dates that came in while the start screen was up show next.)
}

// Clears away everything from an invite, and stops anything still animating.
function resetInvite() {
  currentRun += 1;
  Object.assign(state, {
    title: "", subtitle: "", envelope: null, paper: null, flaps: null, letter: null,
    declines: 0, popup: null, celebration: null, confetti: [], rescheduling: null,
  });
}

// He clicked an icon on the desktop: play that invite.
function openInvite(invite) {
  playSound("click");
  remember(`opened:${invite.id}`);
  resetInvite();
  state.invite = invite;
  state.mode = "invite";
  state.inviteMinimized = false;
  startShow();
}

// "Suggest a new time": for a planned date, a real calendar to pick from. For the
// invites written into this file, the old pop-up ("message me on Discord").
function suggestOrReschedule() {
  // Your own invite (a preview): nothing to reschedule.
  if (state.invite && isMyOwnInvite(state.invite)) {
    showPopup("PREVIEW", `When ${OTHER} clicks this, they can pick a new day and time.`);
    return;
  }
  // (The calendar box needs the big invite, so it goes back to full size.)
  if (state.invite && state.invite.remote) {
    state.inviteSmall = false;
    openReschedule(state.invite.remote);
  } else if (state.invite && state.online === "ok" && !state.invite.preview) {
    // An invite written into this file: the same calendar box. Sending it turns it into
    // a planned date (with the new time) that the other person can accept.
    state.inviteSmall = false;
    openReschedule({ written: state.invite });
  }
  else suggest();
}

// He clicked the X (or "Back to desktop"): close the invite.
function closeInvite() {
  playSound("click");
  resetInvite();
  state.mode = "desktop";
  state.invite = null;
  state.inviteMinimized = false;
  state.inviteSmall = false;
}


// ====================================================================================
// WHAT HAPPENS, IN ORDER
// ====================================================================================

// Types words into state.title or state.subtitle, one letter at a time.
async function typeText(where, words, delay, volume) {
  for (let count = 1; count <= words.length; count++) {
    await wait(delay);
    state[where] = words.slice(0, count);
    // (Quiet while the invite is minimized.)
    if (words[count - 1] !== " " && state.mode === "invite") playKeySound(volume);
  }
}

// 1. Type the greeting, then fade in the envelope.
async function startShow() {
  await wait(300);
  // A planned date has its own opening words. The invites in this file use the usual ones.
  const invite = state.invite;
  await typeText("title", invite.opening || `Psst, ${RECIPIENT_NAME}...`, 120, 1);
  await typeText("subtitle", invite.subtitle !== undefined ? invite.subtitle : GREETING_SUBTITLE, 55, FAST_TYPING_VOLUME);
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

// Is this an invite YOU sent (one written in this file, seen from your side, or a planned
// date you sent that's not waiting on your answer)? Then playing it is just a preview.
function isMyOwnInvite(invite) {
  if (!invite) return false;
  if (invite.preview || invite.sentByMe) return true;
  return !!invite.remote && invite.remote.from === ME && !needsMyAnswer(invite.remote);
}

// 4a. He clicked Decline: buzzer and a joke pop-up.
function decline() {
  playSound("click");
  playSound("buzzer", BUZZER_VOLUME);
  const message = declinesFor(state.invite)[state.declines];
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
  // (Your own invite is just a preview: the confetti plays, but nothing is saved or sent.)
  if (!isMyOwnInvite(state.invite)) {
    remember(`accepted:${state.invite.id}`);
    // A planned date: tell Firebase (and ping the other person on Discord).
    if (state.invite.remote) acceptRemoteDate(state.invite.remote);
    // An invite written in this file: tell Firebase too, so the sender gets a pop-up.
    else acceptWrittenInvite(state.invite);
  }
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

// UPDATES: every couple of minutes, peek at the website's files. If you've uploaded a
// new version to GitHub, a pop-up offers to update (so nobody has to refresh by hand).
const UPDATE_CHECK_MINUTES = 2;
const UPDATE_FILES = ["script.js", "index.html"];
let loadedVersion = null;
let updateOffered = false;

async function currentVersion() {
  // "no-store" means "don't use a saved copy, get it fresh from the website".
  const texts = await Promise.all(UPDATE_FILES.map(file =>
    fetch(`${file}?check=${Date.now()}`, { cache: "no-store" }).then(response => response.text())));
  return texts.join("").length + ":" + texts.join("").slice(-200);
}

async function checkForUpdate() {
  try {
    const version = await currentVersion();
    if (loadedVersion === null) {
      loadedVersion = version;
    } else if (version !== loadedVersion && !updateOffered) {
      updateOffered = true;
      notify("UPDATE", "There's a new version of the little computer! 💗", { text: "Update", noText: "Later", onClick: () => location.reload() });
    }
  } catch (problem) {
    // No internet right now: try again next time.
  }
}
checkForUpdate();
setInterval(checkForUpdate, UPDATE_CHECK_MINUTES * 60000);


// ====================================================================================
// DATE NIGHT (the date itself, one part at a time)
// ====================================================================================
//
// The date with "startsAt" and "parts" in the INVITES list (at the top of this file).
// At date time, a pop-up says it's time. Then "Our date" walks you both through it:
//   step 0           - not started yet (a countdown, and a Start button)
//   step 1, 2, ...   - each part (the game card, then the little cinema)
//   the last step    - "Thank you for the date"
// The step is saved in Firebase, so when one of you clicks Next, BOTH computers move on.

const DATE_NIGHT = INVITES.filter(invite => invite.parts).pop() || null;

// When it starts, as a real moment in time (startsAt is in YOUR time, Arizona).
const DATE_NIGHT_START = DATE_NIGHT ? zonedTimeToDate(DATE_NIGHT.date, DATE_NIGHT.startsAt, YOUR_TIME_ZONE).getTime() : 0;

// How long after the start the "DATE TIME" pop-up can still show up (6 hours).
const DATE_NIGHT_POPUP_HOURS = 6;

// How long the cinema's curtains take to open, in seconds.
const CURTAIN_SECONDS = 3;

// The cinema's colors.
const CINEMA = {
  wall: "#2A1730", curtain: "#C8324A", fold: "#9E2238", gold: "#FFD98A",
  seat: "#4A2B52", screenGlow: "#3D2547",
};

// step: which part you're on. picks: what he picked instead, like { 2: "Shrek" }.
state.dateNight = { step: 0, picks: {} };
state.datePicking = false;    // is the "Something else" box open?
let curtainStart = null;      // when the curtains started opening (on this computer)
let curtainForStep = null;    // which step those curtains were for

// The movie poster picture (if the file is there).
const posterImage = new Image();
let hasPoster = false;
const moviePart = DATE_NIGHT && DATE_NIGHT.parts.find(part => part.kind === "movie");
if (moviePart && moviePart.poster) {
  posterImage.onload = () => { hasPoster = true; };
  posterImage.src = moviePart.poster;
}

// The game or movie for a part: what he picked instead, or what you planned.
function partName(number) {
  return state.dateNight.picks[number] || DATE_NIGHT.parts[number - 1].name;
}

// Saves the date's progress for both computers. (In the preview of his side, it only
// changes this computer, so nothing gets sent as him.)
function saveDateNight(changes) {
  Object.assign(state.dateNight, changes);
  if (!database || state.online !== "ok" || state.previewingHisSide) return;
  database.collection("datenight").doc(DATE_NIGHT.id).set({
    step: state.dateNight.step,
    picks: state.dateNight.picks,
    by: ME,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  }).catch(problem => console.log("Couldn't save the date:", problem));
}

// Listens for the other person moving the date along.
// (If this part of Firebase isn't set up yet, the date still works, just on each computer separately.)
function listenForDateNight() {
  if (!DATE_NIGHT) return;
  database.collection("datenight").doc(DATE_NIGHT.id).onSnapshot(doc => {
    if (!doc.exists) return;
    const data = doc.data();
    const before = state.dateNight.step;
    state.dateNight = { step: data.step || 0, picks: data.picks || {} };
    if (state.dateNight.step !== before) state.datePicking = false;
    // They moved it along and you're not looking at it? A pop-up to come join.
    const looking = state.windows.some(win => win.window === "datenight" && !win.minimized);
    if (data.by === OTHER && state.dateNight.step > before && !looking) {
      const message = before === 0 ? `${OTHER} started our date! 💗` : `${OTHER} moved on to the next part of our date!`;
      notify("OUR DATE", message, { text: "Open", noText: "Later", onClick: openDateNightFromPopup });
    }
  }, () => {});
}

function openDateNightFromPopup() {
  state.popup = null;
  openWindow("datenight");
}

// At date time, the "DATE TIME" pop-up (once on each computer).
function checkDateTime() {
  if (!DATE_NIGHT) return;
  const now = Date.now();
  const tooLate = DATE_NIGHT_START + DATE_NIGHT_POPUP_HOURS * 3600000;
  const seen = `${SIDE}:datestart:${DATE_NIGHT.id}`;
  if (now < DATE_NIGHT_START || now > tooLate || remembers(seen)) return;
  remember(seen);
  notify("DATE TIME", "It's time for our date! 💗 Ready?", { text: "Start", noText: "Not yet", onClick: openDateNightFromPopup });
}
checkDateTime();
setInterval(checkDateTime, 20000);

// The buttons.
function startDateNight() {
  playSound("chime");
  saveDateNight({ step: 1 });
  if (!state.previewingHisSide) pingOther(`💗 ${ME} started our date! Open the little computer.`);
}
function nextDatePart() {
  playSound("click");
  state.datePicking = false;
  saveDateNight({ step: state.dateNight.step + 1 });
}
function openSteamPage(name) {
  playSound("click");
  const part = DATE_NIGHT.parts[state.dateNight.step - 1];
  // His own pick? Search Steam for it. Otherwise the link you wrote.
  const link = state.dateNight.picks[state.dateNight.step]
    ? `https://store.steampowered.com/search/?term=${encodeURIComponent(name)}`
    : part.link;
  if (link) window.open(link, "_blank");
}

// Draws the whole "Our date" window.
function drawDateNight(area, time) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(area.left, area.top, area.right - area.left, area.bottom - area.top);
  ctx.clip();
  if (!DATE_NIGHT) {
    write("No date planned right now!", (area.left + area.right) / 2, (area.top + area.bottom) / 2, FONTS.body, COLORS.text);
  } else {
    const step = state.dateNight.step;
    const part = DATE_NIGHT.parts[step - 1];
    if (step === 0) drawDateWaiting(area, time);
    else if (!part) drawDateEnd(area, time);
    else if (part.kind === "movie") drawCinema(area, time, step);
    else drawGameCard(area, part, step);
  }
  ctx.restore();

  // The "Something else" box, on top.
  if (state.datePicking && state.dateNight.step >= 1 && DATE_NIGHT.parts[state.dateNight.step - 1]) {
    const middle = (area.left + area.right) / 2;
    // (Taller when there are backup buttons to show.)
    const height = datePickPanel.querySelector(".choices").children.length ? 160 : 128;
    requestPanel("datepick", { left: middle - 140, top: area.top + 40, right: middle + 140, bottom: area.top + 40 + height });
  }
}

// Step 0: a countdown until the date (with a Start button once it's time, or to start early).
function drawDateWaiting(area, time) {
  const middle = (area.left + area.right) / 2;
  const left = DATE_NIGHT_START - Date.now();
  drawPixels(HEART, middle - 21, area.top + 30, 6, COLORS.heart);
  if (left > 0) {
    const hours = Math.floor(left / 3600000), minutes = Math.ceil((left % 3600000) / 60000);
    const countdown = hours > 0 ? `${hours}h ${minutes}m` : `${minutes} min`;
    write("Our date starts in", middle, area.top + 95, FONTS.body, COLORS.text);
    write(countdown, middle, area.top + 135, FONTS.letterTitle, COLORS.heart);
    const clock = new Date(DATE_NIGHT_START).toLocaleTimeString("en-US", { timeZone: MY_TIME_ZONE, hour: "numeric", minute: "2-digit" });
    write(`(${clock} your time)`, middle, area.top + 170, FONTS.note, COLORS.text);
    drawButton(middle, area.bottom - 40, 150, 30, "Start early", COLORS.cream, COLORS.text, startDateNight);
  } else {
    write("It's date time!", middle, area.top + 110, FONTS.letterTitle, COLORS.text);
    write("Grab your snacks and hop in a call 💗", middle, area.top + 150, FONTS.body, COLORS.text);
    drawButton(middle, area.bottom - 50, 170, 36, "Start date", COLORS.acceptFill, COLORS.acceptText, startDateNight);
  }
}

// Which part this is, like "PART 1 OF 2", across the top.
function drawPartLabel(area, step, color) {
  write(`PART ${step} OF ${DATE_NIGHT.parts.length}`, (area.left + area.right) / 2, area.top + 14, FONTS.small, color);
}

// A game part: the game's name, then what to do, then buttons.
function drawGameCard(area, part, step) {
  const middle = (area.left + area.right) / 2;
  drawPartLabel(area, step, COLORS.text);
  const name = partName(step);
  const own = Boolean(state.dateNight.picks[step]);
  const steps = own ? [`Find ${name} on Steam (the button below searches for it)`, "Hop in a call with me", "Have fun!"]
                    : part.steps || [];

  // The card.
  const card = { left: area.left + 30, top: area.top + 28, right: area.right - 30, bottom: area.bottom - 48 };
  steppedBox(card.left, card.top, card.right, card.bottom, 4, COLORS.white, COLORS.text, 2);
  drawSprite(CONTROLLER, CONTROLLER_COLORS, card.left + 16, card.top + 16, 5);   // the Arcade's little controller
  write("Game time!", card.left + 70, card.top + 18, FONTS.small, COLORS.heart, "left", "top");
  // The name, as big as fits (from 24 pixels tall down to 12).
  let nameSize = 24;
  ctx.font = `bold ${nameSize}px 'Pixelify Sans'`;
  while (nameSize > 12 && ctx.measureText(name).width > card.right - card.left - 90) {
    nameSize--;
    ctx.font = `bold ${nameSize}px 'Pixelify Sans'`;
  }
  write(name, card.left + 70, card.top + 32, ctx.font, COLORS.text, "left", "top");

  // The numbered steps, wrapped to fit the card.
  let y = card.top + 76;
  steps.forEach((line, number) => {
    const lines = wrapWords(line, FONTS.note, card.right - card.left - 70);
    write(`${number + 1}.`, card.left + 22, y, FONTS.note, COLORS.heart, "left", "top");
    lines.forEach(text => {
      write(text, card.left + 42, y, FONTS.note, COLORS.text, "left", "top");
      y += 18;
    });
    y += 6;
  });

  // The buttons along the bottom.
  const buttonY = area.bottom - 24;
  drawButton(middle - 160, buttonY, 120, 28, "Steam", COLORS.cream, COLORS.text, () => openSteamPage(name));
  drawButton(middle, buttonY, 170, 28, "Something else", COLORS.cream, COLORS.text, openDatePicker);
  drawButton(middle + 160, buttonY, 130, 28, "Next part", COLORS.acceptFill, COLORS.acceptText, nextDatePart);
}

// A movie part: the little cinema, with curtains that slide open to show the poster.
function drawCinema(area, time, step) {
  const middle = (area.left + area.right) / 2;
  const now = performance.now();

  // Start the curtains the first time this step shows up on this computer.
  if (curtainForStep !== step) {
    curtainForStep = step;
    curtainStart = now + 800;      // a little pause first, for drama
    setTimeout(() => playSound("chime"), 800);
  }
  const opened = keepBetween((now - curtainStart) / (CURTAIN_SECONDS * 1000), 0, 1);
  const eased = 1 - Math.pow(1 - opened, 3);    // starts fast, slows down at the end

  // The dark theater.
  ctx.fillStyle = CINEMA.wall;
  ctx.fillRect(area.left, area.top, area.right - area.left, area.bottom - area.top);
  drawPartLabel(area, step, CINEMA.gold);

  // The marquee sign, with blinking light bulbs around it.
  const sign = { left: middle - 120, top: area.top + 32, right: middle + 120, bottom: area.top + 64 };
  steppedBox(sign.left, sign.top, sign.right, sign.bottom, 3, COLORS.cream, CINEMA.gold, 3);
  for (let x = sign.left + 8; x < sign.right - 4; x += 12) {
    const on = Math.floor(time / 400 + x / 12) % 2 === 0;
    ctx.fillStyle = on ? CINEMA.gold : "#8A6A3A";
    ctx.fillRect(x, sign.top - 5, 3, 3);
    ctx.fillRect(x, sign.bottom + 2, 3, 3);
  }
  write("NOW SHOWING", middle, sign.top + 9, FONTS.tag, COLORS.heart);
  const title = opened >= 1 ? partName(step) : "? ? ?";
  write(title, middle, sign.top + 22, fontThatFits(title, sign.right - sign.left - 16), COLORS.text);

  // The movie screen, with the poster on it.
  const stage = { left: middle - 110, top: area.top + 80, right: middle + 110, bottom: area.top + 200 };
  ctx.fillStyle = CINEMA.screenGlow;
  ctx.fillRect(stage.left, stage.top, stage.right - stage.left, stage.bottom - stage.top);
  const posterHeight = stage.bottom - stage.top - 12;
  const posterWidth = Math.round(posterHeight * 2 / 3);     // posters are 2 wide for every 3 tall
  const poster = { left: middle - posterWidth / 2, top: stage.top + 6, right: middle + posterWidth / 2, bottom: stage.bottom - 6 };
  drawPoster(poster, partName(step), step);

  // The curtains: two red sides that slide apart (they bunch up a little at the edges).
  const half = (stage.right - stage.left) / 2;
  const curtainWidth = half * (1 - eased * 0.85);
  drawCurtain(stage.left, stage.top, curtainWidth, stage.bottom - stage.top);
  drawCurtain(stage.right - curtainWidth, stage.top, curtainWidth, stage.bottom - stage.top);
  // The scalloped valance along the top.
  ctx.fillStyle = CINEMA.curtain;
  ctx.fillRect(stage.left - 8, stage.top - 6, stage.right - stage.left + 16, 10);
  for (let x = stage.left - 8; x + 16 <= stage.right + 8; x += 16) {
    ctx.beginPath();
    ctx.arc(x + 8, stage.top + 4, 8, 0, Math.PI);
    ctx.fill();
  }
  ctx.fillStyle = CINEMA.gold;
  ctx.fillRect(stage.left - 8, stage.top - 6, stage.right - stage.left + 16, 2);

  // A row of seats, with the two of you in the middle (and a little heart above).
  // (The heads go first, so the seat backs cover their bottoms, like they're sitting in them.)
  const seatTop = stage.bottom + 20;
  ctx.fillStyle = "#120A15";
  [middle - 17, middle + 17].forEach(x => {
    ctx.beginPath();
    ctx.arc(x, seatTop - 3, 8, 0, Math.PI * 2);
    ctx.fill();
  });
  for (let x = middle + 3 - 34 * 8; x < area.right; x += 34) {
    steppedBox(x, seatTop, x + 28, seatTop + 18, 4, CINEMA.seat, CINEMA.seat, 1);
  }
  // A little heart floating between your two heads.
  if (opened >= 1) drawPixels(HEART, middle - 7, seatTop - 18 - Math.round(Math.sin(time / 300) * 2), 2, COLORS.heart);

  // The buttons, once the curtains are open.
  if (opened >= 1) {
    const buttonY = area.bottom - 20;
    drawButton(middle - 95, buttonY, 170, 26, "Something else", COLORS.cream, COLORS.text, openDatePicker);
    drawButton(middle + 95, buttonY, 170, 26, "The end 💗", COLORS.acceptFill, COLORS.acceptText, nextDatePart);
  }
}

// One side of the curtains, with darker folds.
function drawCurtain(left, top, width, height) {
  ctx.fillStyle = CINEMA.curtain;
  ctx.fillRect(left, top, width, height);
  ctx.fillStyle = CINEMA.fold;
  for (let x = left + 6; x < left + width - 2; x += 10) ctx.fillRect(Math.round(x), top, 3, height);
}

// The movie's poster: the real picture if you added it (and he didn't pick something
// else), or a cute pixel poster with the name on it.
function drawPoster(box, name, step) {
  const width = box.right - box.left, height = box.bottom - box.top;
  if (hasPoster && !state.dateNight.picks[step]) {
    ctx.drawImage(posterImage, box.left, box.top, width, height);
  } else {
    ctx.fillStyle = COLORS.titleBar;
    ctx.fillRect(box.left, box.top, width, height);
    drawPixels(HEART, box.left + width / 2 - 14, box.top + 16, 4, COLORS.heart);
    const lines = wrapWords(name, FONTS.menu, width - 12);
    lines.forEach((line, i) => write(line, box.left + width / 2, box.top + 64 + i * 17, FONTS.menu, COLORS.text));
  }
  ctx.strokeStyle = CINEMA.gold;
  ctx.lineWidth = 2;
  ctx.strokeRect(box.left, box.top, width, height);
}

// The very end: thank you, with hearts floating up.
function drawDateEnd(area, time) {
  const middle = (area.left + area.right) / 2;
  for (let i = 0; i < 14; i++) {
    const x = area.left + ((i * 73) % (area.right - area.left - 20)) + 6;
    const y = area.bottom - ((time / 20 + i * 41) % (area.bottom - area.top + 30));
    drawPixels(HEART, Math.round(x), Math.round(y), 2, CONFETTI_COLORS[i % CONFETTI_COLORS.length]);
  }
  write("Thank you for the date", middle, area.top + 100, FONTS.letterTitle, COLORS.text);
  write(`I love you, ${OTHER} 💗`, middle, area.top + 145, FONTS.body, COLORS.heart);
  drawButton(middle, area.bottom - 40, 190, 32, "Back to desktop", COLORS.cream, COLORS.text, closeWindow);
}

// The "Something else" box: your backup ideas as buttons, or type your own.
const datePickPanel = makePanel("datepick", `
  <form class="reschedule">
    <p class="big">Pick something else</p>
    <div class="choices"></div>
    <label>Or type your own <input name="pick" maxlength="40" autocomplete="off" required></label>
    <p class="problem"></p>
    <div class="two">
      <button type="button" class="cancel">Cancel</button>
      <button>Pick</button>
    </div>
  </form>`);
const datePickForm = datePickPanel.querySelector("form");

function openDatePicker() {
  playSound("click");
  const step = state.dateNight.step;
  const part = DATE_NIGHT.parts[step - 1];
  // The choices: what you planned (if he picked something else) and your backups.
  const choices = [part.name, ...(part.backups || [])].filter(choice => choice !== partName(step));
  datePickPanel.querySelector(".choices").innerHTML = choices.map(choice =>
    `<button type="button" class="cancel" data-pick="${escapeHTML(choice)}">${escapeHTML(choice)}</button>`).join("");
  datePickForm.elements.pick.value = "";
  datePickPanel.querySelector(".problem").textContent = "";
  state.datePicking = true;
}

// Clicking a backup fills in the box.
datePickPanel.querySelector(".choices").addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;
  playSound("click");
  datePickForm.elements.pick.value = button.dataset.pick;
});

datePickPanel.querySelector(".cancel:not([data-pick])").addEventListener("click", () => {
  playSound("click");
  state.datePicking = false;
});

datePickForm.addEventListener("submit", event => {
  event.preventDefault();
  const pick = datePickForm.elements.pick.value.trim();
  if (!pick) return;
  const step = state.dateNight.step;
  const part = DATE_NIGHT.parts[step - 1];
  const picks = { ...state.dateNight.picks };
  // Picking what you planned just goes back to it.
  if (pick === part.name) delete picks[step];
  else picks[step] = pick;
  state.datePicking = false;
  saveDateNight({ picks });
  // The cinema's curtains open again for the new movie.
  curtainForStep = null;
  playSound("coin");
  if (!state.previewingHisSide) pingOther(`💗 ${ME} picked something else for our date: ${pick}`);
});


// ====================================================================================
// POP OUT (a tiny floating computer, like Bongo Cat)
// ====================================================================================
//
// "Pop out" in the Start menu moves the little computer into its own tiny window that
// floats on top of everything else on the screen. It zooms in on just the computer's
// screen (no desk), so the words stay big enough to read.
//
// This uses a browser feature called "Document Picture-in-Picture". Only Chrome, Edge,
// and Brave on a computer have it, so on other browsers the menu item doesn't show up.

// How big the floating window starts (he can drag its corner to make it bigger or smaller).
const POP_OUT_SIZE = { width: 520, height: 345 };

// How much of the computer's frame to show around the screen, in drawing pixels.
const POP_OUT_FRAME = 10;

let poppedOut = null;   // the floating window, while the computer is popped out

// The message left on the big page while the computer is in its floating window.
const poppedOutNote = document.createElement("div");
poppedOutNote.className = "popped-note";
poppedOutNote.innerHTML = `<p>The little computer popped out! 💗</p><button>Pop back in</button>`;
poppedOutNote.querySelector("button").addEventListener("click", popBackIn);

// "Pop out" / "Pop back in" in the Start menu.
function togglePopOut() {
  playSound("click");
  state.startMenu = false;
  if (poppedOut) popBackIn();
  else popOut();
}

async function popOut() {
  try {
    poppedOut = await documentPictureInPicture.requestWindow(POP_OUT_SIZE);
  } catch (problem) {
    poppedOut = null;
    return;
  }
  const floating = poppedOut.document;
  floating.title = "MWAHHH";

  // Copy the page's styles (fonts, text boxes, buttons) into the floating window.
  document.querySelectorAll("style").forEach(style => floating.head.appendChild(style.cloneNode(true)));
  // The pixel font has to be loaded in there too, or the drawing's words go plain.
  document.fonts.forEach(font => { try { floating.fonts.add(font); } catch (problem) {} });
  floating.body.classList.add("floating");

  // Move the real drawing (and the text boxes on top of it) into the floating window.
  // They're the same ones, so everything keeps working: clicks, games, IMs, all of it.
  floating.body.append(canvas, ui);
  document.body.prepend(poppedOutNote);
  fitPoppedOut();

  // Keep it zoomed right when he resizes the floating window.
  poppedOut.addEventListener("resize", fitPoppedOut);

  // Keys pressed in the floating window still work for games and the secret password.
  // (Not while typing in a text box: those keys go to the box, like normal.)
  poppedOut.addEventListener("keydown", event => {
    unlockSound();
    if (isTypingInForm(event)) return;
    window.dispatchEvent(new KeyboardEvent("keydown", { key: event.key, code: event.code, repeat: event.repeat }));
    if (event.key === " " || event.key.startsWith("Arrow")) event.preventDefault();
  });
  poppedOut.addEventListener("pointerdown", unlockSound);

  // When the floating window closes (his X, or "back to tab"), put everything back.
  poppedOut.addEventListener("pagehide", putComputerBack);
}

// Closing the floating window puts the computer back (see putComputerBack).
function popBackIn() {
  if (poppedOut) poppedOut.close();
}

function putComputerBack() {
  poppedOut = null;
  poppedOutNote.remove();
  document.body.prepend(canvas, ui);
  // Undo the zoom from fitPoppedOut, so the normal page sizes come back.
  ["position", "left", "top", "width", "height", "maskImage", "webkitMaskImage"].forEach(key => { canvas.style[key] = ""; });
  extendDesk();
}

// Zooms the drawing so just the computer's screen (plus a little of its frame) fills
// the floating window. The rest of the picture (the desk, the wall) hangs off the
// edges where you can't see it.
function fitPoppedOut() {
  if (!poppedOut) return;
  const area = {
    left: SCREEN.left - POP_OUT_FRAME, top: SCREEN.top - POP_OUT_FRAME,
    width: SCREEN.right - SCREEN.left + POP_OUT_FRAME * 2,
    height: SCREEN.bottom - SCREEN.top + POP_OUT_FRAME * 2,
  };
  // As big as fits, without cutting off any of the screen.
  const zoom = Math.min(poppedOut.innerWidth / area.width, poppedOut.innerHeight / area.height);
  // Center the screen in the window.
  const left = (poppedOut.innerWidth - area.width * zoom) / 2 - area.left * zoom;
  const top = (poppedOut.innerHeight - area.height * zoom) / 2 - area.top * zoom;
  Object.assign(canvas.style, {
    position: "absolute",
    left: `${left}px`, top: `${top}px`,
    width: `${WIDTH * zoom}px`, height: `${HEIGHT * zoom}px`,
    // No faded edges in here (they'd fade the screen itself).
    maskImage: "none", webkitMaskImage: "none",
  });
}

// The next frame of the drawing. While popped out, the floating window does the timing,
// because the big page might be minimized (and minimized pages stop drawing).
function nextFrame(callback) {
  (poppedOut || window).requestAnimationFrame(() => callback(performance.now()));
}

// Wait for the picture and the font to load, then start drawing.
Promise.all([
  new Promise(resolve => { background.onload = resolve; }),
  document.fonts.load(FONTS.title),
  document.fonts.load(FONTS.body),
]).then(() => requestAnimationFrame(draw));
