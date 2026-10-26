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
//   label  - the words under the desktop icon (keep it short)
//   title  - the big words at the top of the letter
//   plan, bring, when - the details on the letter. "\n" starts a new line.
const INVITES = [
  {
    id: "2026-10-26",
    label: "Oct 26",
    title: `${RECIPIENT_NAME}, be my date?`,
    plan: "Top secret",
    bring: "Your cute self, and maybe some snacks",
    when: "Monday, Oct 26\n9pm your time, 1pm my time",
  },
];

// The name of the computer, shown on the taskbar's Start button.
const START_BUTTON_TEXT = "Start";

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
};

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
  iconLabel: "bold 14px 'Pixelify Sans'",
  tag: "bold 10px 'Pixelify Sans'",
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
const SCREEN = { left: 146, top: 61, right: 621, bottom: 362, corner: 14 };

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
["key1", "key2", "key3", "key4", "click", "paper", "incoming", "chime", "buzzer"].forEach(name => {
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
  loudness.gain.value = volume;
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

// The desktop: heart wallpaper, an icon for each invite, and a taskbar.
function drawDesktop() {
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

  INVITES.forEach((invite, number) => drawIcon(invite, number));
  drawTaskbar();
}

// One desktop icon: a little envelope with the date under it.
// Icons go in rows of 4, left to right, then the next row.
function drawIcon(invite, number) {
  const x = 214 + (number % 4) * 100;            // the middle of the icon, left to right
  const y = 128 + Math.floor(number / 4) * 92;   // the middle of the envelope, top to bottom

  // The clickable area around the icon and its label.
  const box = { left: x - 42, top: y - 26, right: x + 42, bottom: y + 44, onClick: () => openInvite(invite) };
  hitBoxes.push(box);

  // A soft highlight while the mouse is over it.
  const { x: mouseX, y: mouseY } = state.mouse;
  if (mouseX >= box.left && mouseX <= box.right && mouseY >= box.top && mouseY <= box.bottom) {
    // globalAlpha 0.55 makes it a bit see-through, so the wallpaper shows behind it.
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = COLORS.iconHover;
    ctx.fillRect(box.left, box.top, box.right - box.left, box.bottom - box.top);
    ctx.globalAlpha = 1;
  }

  // The little envelope.
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

  // The date under it, on a little cream tag so it's easy to read on any wallpaper.
  ctx.font = FONTS.iconLabel;
  const labelWidth = ctx.measureText(invite.label).width + 10;
  steppedBox(x - labelWidth / 2, y + 21, x + labelWidth / 2, y + 39, 2, COLORS.cream, COLORS.text, 1.5);
  write(invite.label, x, y + 30.5, FONTS.iconLabel, COLORS.text);

  // A pink NEW tag if he hasn't opened it yet, or a green check if he's accepted it.
  if (!remembers(`opened:${invite.id}`)) {
    steppedBox(x + 8, y - 24, x + 44, y - 10, 2, COLORS.newTag, COLORS.text, 1.5);
    write("NEW", x + 26, y - 16.5, FONTS.tag, "#FFFFFF");
  } else if (remembers(`accepted:${invite.id}`)) {
    drawPixels(CHECK, x + 16, y - 24, 3, COLORS.check);
  }
}

// The pink bar along the bottom, with a Start button and a clock.
function drawTaskbar() {
  ctx.fillStyle = COLORS.titleBar;
  ctx.fillRect(160, 330, 448, 24);
  ctx.strokeStyle = COLORS.text;
  ctx.lineWidth = 2;
  ctx.strokeRect(160, 330, 448, 24);

  // The Start button, with a little heart.
  steppedBox(164, 333, 238, 351, 2, COLORS.cream, COLORS.text, 1.5);
  drawPixels(HEART, 170, 337, 2, COLORS.heart);
  write(START_BUTTON_TEXT, 186, 342.5, FONTS.small, COLORS.text, "left");

  // The clock shows the time on HIS computer, like a real taskbar.
  const time = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  write(time, 598, 342.5, FONTS.small, COLORS.text, "right");
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
  const left = 234, top = 168, right = 534, bottom = 290;

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

  // The message, centered and wrapped.
  const lines = wrapWords(popup.message, FONTS.body, 260);
  const lineHeight = 24;
  const firstY = top + 56 - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, i) => write(line, CENTER_X, firstY + i * lineHeight, FONTS.body, COLORS.text));

  drawButton(CENTER_X, bottom - 22, 70, 26, "OK", COLORS.cream, COLORS.text, closePopup, true);
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

  if (state.mode === "start") {
    drawTitleBar();
    drawSparkles();
    drawStartMessage(time);
  } else if (state.mode === "desktop") {
    drawDesktop();
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
    if (state.popup) drawPopup();
  }

  updateMouse();
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

// Shows a pointing hand over clickable things, and lifts the envelope when hovered.
function updateMouse() {
  const box = boxUnderMouse();
  canvas.style.cursor = box ? "pointer" : "default";
  if (state.mode === "invite" && state.envelope && state.envelope.clickable) {
    state.envelope.lift = box && box.isEnvelope ? 4 : 0;
  }
}

canvas.addEventListener("pointermove", event => {
  state.mouse = toDrawing(event);
});

canvas.addEventListener("pointerdown", event => {
  state.mouse = toDrawing(event);
  const box = boxUnderMouse();
  if (box) box.onClick();
});

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
  playSound("chime");
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
