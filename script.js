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
const CARD_TITLE = `${RECIPIENT_NAME}, be my date?`;

// The details on the letter. "\n" starts a new line.
const DETAILS = {
  plan: "Top secret",
  bring: "Your cute self, and maybe some snacks",
  when: "Monday, Oct 26\n9pm your time, 1pm my time",
};

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
};

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


// ====================================================================================
// WHAT'S ON SCREEN RIGHT NOW
// ====================================================================================

const state = {
  started: false,         // has he clicked to start yet?
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

// Waits this many milliseconds. Use it like: await wait(500);
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Animates over this many milliseconds. onStep gets a number from 0 to 1
// (0 = start, 1 = finished) that starts fast and slows down gently at the end.
function animate(ms, onStep) {
  return new Promise(resolve => {
    const start = performance.now();
    function frame(now) {
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
}

function drawSparkles() {
  SPARKLE_SPOTS.forEach(([x, y, size], i) => {
    drawPixels(SPARKLE, x, y, size, state.sparkleDim[i] ? COLORS.sparkleDim : COLORS.sparkle);
  });
}

// The start screen: "click MWAHHH to start" and a pink MWAHHH button.
// (Nothing else shows yet, so "Psst, Jacob..." gets to type itself out.)
function drawStartMessage(time) {
  write("click MWAHHH to start", CENTER_X, 190, FONTS.body, COLORS.text);

  // The button gently bobs up and down so it looks clickable.
  // sin() goes smoothly back and forth between -1 and 1.
  const bob = Math.sin(time / 300) * 2;
  drawButton(CENTER_X, 245 + bob, 160, 44, "MWAHHH", COLORS.acceptFill, COLORS.acceptText, start);
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
  write(CARD_TITLE, CENTER_X, 118, FONTS.letterTitle, COLORS.text, "center", "top");
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

  [["Plan:", DETAILS.plan], ["What to bring:", DETAILS.bring], ["When:", DETAILS.when]].forEach(([label, value]) => {
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
  drawTitleBar();
  drawSparkles();

  if (!state.started) {
    drawStartMessage(time);
  } else {
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
  if (state.envelope && state.envelope.clickable) {
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

// He clicked MWAHHH: start everything.
// (Browsers don't allow sounds until you click something, so this click turns sound on.)
function start() {
  audio.resume();
  playSound("click");
  state.started = true;
  startShow();
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

  // Move every piece a step every 30 milliseconds, until they've all fallen.
  const timer = setInterval(() => {
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
