// Scenes for scripts/pixel-3d.ts: original objects modelled from simple shapes, seen with the item
// camera. Each material's ramp runs dark → light; its `char` string gives one palette character per
// tone. Object space: y up, x right, z toward the viewer before the camera turns.
import {
  rotX, rotY, rotZ, sdBadge, sdBox, sdCapsule, sdCylinder, sdEllipsoid, sdLathe, sdPolygon2, sdSphere, sdTorus, subtract, union,
  type Scene, type V3,
} from "./lib/pixel-3d";

const GOLD = ["#5b4a09", "#7d640c", "#a3830f", "#c49e14", "#ddb41a", "#f0d35a"];
const LEATHER = ["#3a2410", "#55351a", "#704622", "#8a5a2c", "#a46f3a", "#bd864b"];
const WOOD = ["#3b2610", "#553819", "#6e4a22", "#88602d", "#a27639"];
const GLASS = ["#5e7f8f", "#7fa3b3", "#a3c6d3", "#cfe6ee"];
const SAND = ["#8a6a2c", "#b38c42", "#d8b25e"];
const IRON = ["#2e3236", "#464b50", "#60666b", "#7d8388", "#9ca2a6", "#c3c8cb"];

/** Coin pouch: a drawstring sack, tied at the neck with a flared top, two coins spilled at its foot. */
const coinPouch: Scene = {
  name: "Coin pouch",
  kind: "item",
  size: [30, 26],
  scale: 0.085,
  pitch: 32,
  yaw: 35,
  offset: [0.05, 0.1],
  materials: [
    { char: "abcdef", ramp: LEATHER },
    { char: "123456", ramp: GOLD },
    { char: "uvw", ramp: ["#2a1a0c", "#5a3a1c", "#8c6034"] },
  ],
  sdf: (p) => {
    // body: a squat sack, widest low down, narrowing to the neck
    const body = sdLathe(p, (y) => {
      if (y < -0.75) return 0.0;
      const t = (y + 0.75) / 1.25; // 0 at bottom .. 1 at neck
      return 0.25 + 0.72 * Math.sin(Math.min(1, t * 1.15) * Math.PI) ** 0.6 * (1 - 0.55 * t);
    }, -0.75, 0.5);
    const neck = sdCylinder(p.map((v, i) => (i === 1 ? v - 0.55 : v)) as V3, 0.2, 0.07);
    // flared, open mouth: a hollow lip whose dark inside shows from above
    const lipOuter = sdLathe(p, (y) => 0.17 + (y - 0.6) * 0.9, 0.6, 0.82);
    const lipInner = sdLathe(p, (y) => 0.1 + (y - 0.6) * 0.9, 0.62, 1.2);
    const top = Math.max(lipOuter, -lipInner);
    const mouth = -lipInner > lipOuter - 0.002 && Math.abs(lipInner) < 0.05;
    const tie = sdTorus([p[0], p[1] - 0.55, p[2]], 0.21, 0.045);
    // coins spilled in front, lying flat
    const c1 = sdCylinder([p[0] - 0.2, p[1] + 0.7, p[2] - 0.95], 0.27, 0.09);
    const c2 = sdCylinder(rotZ([p[0] - 0.7, p[1] + 0.55, p[2] - 0.75], 35), 0.27, 0.09);
    return union({ d: Math.min(body, neck, top), m: mouth && top <= Math.min(body, neck) ? 2 : 0 }, { d: tie, m: 2 }, { d: Math.min(c1, c2), m: 1 });
  },
};

/** Hourglass: two glass bulbs with sand, between wooden end caps joined by three posts. */
const hourglass: Scene = {
  name: "Hourglass",
  kind: "item",
  size: [22, 26],
  scale: 0.085,
  pitch: 28,
  yaw: 20,
  materials: [
    { char: "abcde", ramp: WOOD },
    { char: "wxyz", ramp: GLASS },
    { char: "123", ramp: SAND },
  ],
  sdf: (p) => {
    const caps = Math.min(sdCylinder([p[0], p[1] - 0.82, p[2]], 0.62, 0.09), sdCylinder([p[0], p[1] + 0.82, p[2]], 0.62, 0.09));
    const posts = Math.min(
      ...[0, 120, 240].map((a) => { const q = rotY(p, a); return sdCylinder([q[0] - 0.5, q[1], q[2]], 0.055, 0.78); }),
    );
    const glass = sdLathe(p, (y) => 0.07 + 0.38 * Math.abs(Math.sin((y / 0.74) * (Math.PI / 2))) ** 1.4, -0.74, 0.74);
    // sand: a heap in the lower bulb and a thin stream
    const sand = Math.min(
      sdLathe(p, (y) => (0.07 + 0.38 * Math.abs(Math.sin((y / 0.74) * (Math.PI / 2))) ** 1.4) * 0.92, -0.72, -0.3),
      sdLathe(p, (y) => (0.07 + 0.38 * Math.abs(Math.sin((y / 0.74) * (Math.PI / 2))) ** 1.4) * 0.92, 0.2, 0.5),
    );
    return union({ d: Math.min(caps, posts), m: 0 }, { d: sand - 0.001, m: 2 }, { d: glass, m: 1 });
  },
};

/** Key: a round bow, long shaft and a two-toothed bit, lying diagonally (bow top right). */
const key: Scene = {
  name: "Key",
  kind: "item",
  size: [28, 26],
  scale: 0.09,
  pitch: 55,
  yaw: 0,
  materials: [{ char: "123456", ramp: GOLD }],
  sdf: (p0) => {
    const p = rotY(p0, -40); // lie along the diagonal, bow to the top right
    const bow = sdTorus(rotX([p[0] - 0.95, p[1], p[2]], 0), 0.34, 0.12);
    const shaft = sdCapsule(p, [-1.15, 0, 0], [0.62, 0, 0], 0.11);
    const bit = Math.min(sdBox([p[0] + 0.98, p[1], p[2] - 0.26], [0.09, 0.08, 0.22]), sdBox([p[0] + 0.7, p[1], p[2] - 0.2], [0.09, 0.08, 0.17]));
    const collar = sdCylinder(rotZ([p[0] - 0.55, p[1], p[2]], 90), 0.14, 0.05);
    return { d: Math.min(bow, shaft, bit, collar), m: 0 };
  },
};

/** Padlock: a chunky brass body with a keyhole and an iron shackle, turned to show its side. */
const padlock: Scene = {
  name: "Padlock",
  kind: "item",
  size: [24, 30],
  scale: 0.07,
  pitch: 22,
  yaw: 30,
  offset: [0, 0.05],
  materials: [
    { char: "123456", ramp: GOLD },
    { char: "ghijkl", ramp: IRON },
    { char: "z", ramp: ["#1a1406"] },
  ],
  sdf: (p) => {
    const body = sdBox([p[0], p[1] + 0.35, p[2]], [0.62, 0.5, 0.26], 0.08);
    // keyhole: a dark plug pressed into the front face
    const hole = Math.min(sdCylinder(rotX([p[0], p[1] + 0.22, p[2] - 0.26], 90), 0.09, 0.03), sdBox([p[0], p[1] + 0.42, p[2] - 0.26], [0.04, 0.12, 0.03]));
    // shackle: upper half of a torus standing upright, legs into the body
    const q = rotX([p[0], p[1] - 0.48, p[2]], 90);
    const shackle = Math.max(sdTorus(q, 0.4, 0.09), -p[1] + 0.42);
    const legs = Math.min(sdCylinder([p[0] - 0.4, p[1] - 0.25, p[2]], 0.09, 0.25), sdCylinder([p[0] + 0.4, p[1] - 0.25, p[2]], 0.09, 0.25));
    return union({ d: body, m: 0 }, { d: Math.min(shackle, legs), m: 1 }, { d: hole, m: 2 });
  },
};

/** Trophy: a gold cup (open, its inside showing), short stem, two loop handles and a wooden plinth. */
const trophy: Scene = {
  name: "Trophy",
  kind: "item",
  size: [28, 28],
  scale: 0.08,
  pitch: 30,
  yaw: 20,
  offset: [0, 0.05],
  materials: [
    { char: "123456", ramp: GOLD },
    { char: "abcde", ramp: WOOD },
    { char: "xyz", ramp: ["#3a2f06", "#4f400a", "#66530e"] },
  ],
  sdf: (p) => {
    const cupR = (y: number) => 0.18 + 0.47 * Math.sin(((y - 0.05) / 0.85) * (Math.PI / 2)) ** 0.7;
    const outer = sdLathe(p, cupR, 0.05, 0.9);
    const inner = sdLathe(p, (y) => cupR(y) - 0.08, 0.2, 1.2);
    const cup = Math.max(outer, -inner);
    const inside = -inner >= outer; // the hit is on the inner wall: keep it dark
    const stem = sdLathe(p, (y) => 0.09 + 0.1 * Math.abs(y + 0.25) * 2, -0.55, 0.1);
    // loop handles, overlapping the cup wall so they join it
    const handles = Math.min(
      Math.max(sdTorus(rotX([p[0] - 0.56, p[1] - 0.55, p[2]], 90), 0.2, 0.06), -(p[0] - 0.5)),
      Math.max(sdTorus(rotX([p[0] + 0.56, p[1] - 0.55, p[2]], 90), 0.2, 0.06), p[0] + 0.5),
    );
    const foot = sdLathe(p, (y) => 0.32 - (y + 0.6) * 0.6, -0.65, -0.52);
    const plinth = sdBox([p[0], p[1] + 0.82, p[2]], [0.48, 0.17, 0.48], 0.02);
    return union({ d: cup, m: inside ? 2 : 0 }, { d: Math.min(stem, handles, foot), m: 0 }, { d: plinth, m: 1 });
  },
};

/** Quest journal (tab icon): a closed leather book with a gold clasp, lying turned so its pages show. */
const questJournal: Scene = {
  name: "Quest journal (a closed book seen from above, pages showing)",
  kind: "tab",
  size: [24, 22],
  scale: 0.08,
  pitch: 34,
  yaw: 35,
  materials: [
    { char: "abcde", ramp: ["#3a1a12", "#5a2a1c", "#7a3a26", "#984a30", "#b05c3c"] },
    { char: "pqrs", ramp: ["#9a8a66", "#c2b28a", "#e0d2aa", "#f2e8c8"] },
    { char: "123456", ramp: GOLD },
  ],
  sdf: (p) => {
    const cover = Math.min(sdBox([p[0], p[1] - 0.2, p[2]], [0.95, 0.05, 0.72], 0.03), sdBox([p[0], p[1] + 0.2, p[2]], [0.95, 0.05, 0.72], 0.03), sdBox([p[0] + 0.95, p[1], p[2]], [0.06, 0.25, 0.72], 0.06));
    const pages = sdBox([p[0] + 0.02, p[1], p[2]], [0.9, 0.17, 0.68]);
    const clasp = sdBox([p[0] - 0.95, p[1], p[2]], [0.05, 0.2, 0.12]);
    const corner = Math.min(sdSphere([p[0] - 0.9, p[1] - 0.25, p[2] - 0.66], 0.08), sdSphere([p[0] - 0.9, p[1] - 0.25, p[2] + 0.66], 0.08));
    // a raised gold emblem on the cover
    const emblem = Math.max(sdBox([p[0] + 0.05, p[1] - 0.26, p[2]], [0.3, 0.025, 0.3], 0.02), -sdBox([p[0] + 0.05, p[1] - 0.26, p[2]], [0.18, 0.05, 0.18]));
    return union({ d: cover, m: 0 }, { d: pages, m: 1 }, { d: Math.min(clasp, corner, emblem), m: 2 });
  },
};


// ---------- Standard UI icons, as objects in the item camera ----------
const RED = ["#4a0c0a", "#6e1410", "#931c16", "#b8281e", "#d8402e", "#ef6a50"];
const PAPER = ["#8a7a58", "#ab9a72", "#c8b88e", "#e0d2aa", "#f2e8c8"];
const BRASS = GOLD;
const DARK = ["#121212", "#1e1e1e", "#2c2c2c", "#3a3a3a", "#4a4a4a"];
const BLUE_GLASS = ["#3a5a78", "#4f7898", "#6a96b6", "#8cb6d2", "#c2dcec"];

/** Map pin: a red teardrop marker standing on its point, with a dark hole through the head. */
const mapPin: Scene = {
  name: "Map pin",
  kind: "item",
  size: [20, 28],
  scale: 0.075,
  pitch: 15,
  yaw: 0,
  materials: [{ char: "abcdef", ramp: RED }, { char: "xyz", ramp: ["#1a0504", "#2a0a08", "#3a100c"] }],
  sdf: (p) => {
    const head = sdSphere([p[0], p[1] - 0.45, p[2]], 0.6);
    const tip = sdLathe(p, (y) => Math.max(0, (y + 1.05) * 0.52), -1.05, 0.3);
    const pin = Math.min(head, tip);
    const hole = sdCylinder(rotX([p[0], p[1] - 0.48, p[2]], 90), 0.22, 1);
    const d = Math.max(pin, -hole);
    return { d, m: -hole >= pin ? 1 : 0 };
  },
};

/** Magnifying glass: an iron-rimmed lens with a wooden handle, lying on the diagonal. */
const magnifier: Scene = {
  name: "Magnifying glass (search)",
  kind: "item",
  size: [28, 28],
  scale: 0.085,
  pitch: 50,
  yaw: 0,
  materials: [
    { char: "ghijkl", ramp: IRON },
    { char: "vwxyz", ramp: BLUE_GLASS },
    { char: "abcde", ramp: WOOD },
  ],
  sdf: (p0) => {
    const p = rotY(p0, 45); // lens to the top left, handle to the bottom right
    const rim = sdTorus([p[0] + 0.42, p[1], p[2]], 0.52, 0.1);
    const lens = sdCylinder([p[0] + 0.42, p[1], p[2]], 0.47, 0.03);
    const ferrule = sdCapsule(p, [0.1, 0, 0], [0.32, 0, 0], 0.1);
    const handle = sdCapsule(p, [0.34, 0, 0], [1.2, 0, 0], 0.13);
    return union({ d: Math.min(rim, ferrule), m: 0 }, { d: lens, m: 1 }, { d: handle, m: 2 });
  },
};

/** Envelope (mail): a sealed parchment letter with folded flaps and a red wax seal. */
const envelope: Scene = {
  name: "Envelope (mail)",
  kind: "item",
  size: [30, 24],
  scale: 0.08,
  pitch: 45,
  yaw: 20,
  materials: [
    { char: "pqrst", ramp: PAPER },
    { char: "abcdef", ramp: RED },
    { char: "klmno", ramp: ["#6e5f40", "#8a7a58", "#a8976e", "#c2b28a", "#d6c8a0"] },
  ],
  sdf: (p) => {
    const body = sdBox(p, [1.0, 0.05, 0.65], 0.02);
    // the top flap: a triangle from the back edge to a point near the middle, a shade darker
    const flap = Math.max(sdBox([p[0], p[1] - 0.075, p[2]], [0.99, 0.03, 0.64]), (p[2] - 0.2 + Math.abs(p[0]) * 0.85) / 1.31);
    const seal = sdCylinder([p[0], p[1] - 0.12, p[2] - 0.12], 0.17, 0.05);
    return union({ d: body, m: 0 }, { d: flap, m: 2 }, { d: seal, m: 1 });
  },
};

/** Calendar: a desk calendar standing upright, red header with two binding rings, a grid of days. */
const calendar: Scene = {
  name: "Calendar",
  kind: "item",
  size: [24, 26],
  scale: 0.075,
  pitch: 18,
  yaw: 28,
  materials: [
    { char: "pqrst", ramp: PAPER },
    { char: "abcdef", ramp: RED },
    { char: "ghijkl", ramp: IRON },
    { char: "mno", ramp: ["#4a3e2a", "#6a5a3e", "#8a7856"] },
  ],
  sdf: (p) => {
    const page = sdBox([p[0], p[1] + 0.15, p[2]], [0.8, 0.75, 0.08], 0.03);
    const header = sdBox([p[0], p[1] - 0.72, p[2]], [0.82, 0.22, 0.11], 0.04);
    const rings = Math.min(
      sdTorus(rotZ(rotX([p[0] - 0.4, p[1] - 0.98, p[2]], 90), 90), 0.12, 0.04),
      sdTorus(rotZ(rotX([p[0] + 0.4, p[1] - 0.98, p[2]], 90), 90), 0.12, 0.04),
    );
    // days: a 4 x 3 grid of shallow dark marks on the page front
    let days = 1e9;
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) days = Math.min(days, sdBox([p[0] - (-0.54 + c * 0.36), p[1] - (0.2 - r * 0.38), p[2] - 0.09], [0.1, 0.1, 0.02]));
    return union({ d: page, m: 0 }, { d: header, m: 1 }, { d: rings, m: 2 }, { d: days, m: 3 });
  },
};

/** Notification bell: a gold hand bell, flared at the mouth, with its clapper and a loop on top. */
const bell: Scene = {
  name: "Bell (notifications)",
  kind: "item",
  size: [26, 26],
  scale: 0.07,
  pitch: 22,
  yaw: 0,
  materials: [{ char: "123456", ramp: GOLD }, { char: "xyz", ramp: ["#2a2206", "#3d320a", "#52440e"] }],
  sdf: (p) => {
    // bell profile: flared lip, waisted sides, rounded shoulder into a dome
    const r = (y: number) => {
      const t = (y + 0.75) / 1.3; // 0 at the mouth .. 1 at the top
      if (t < 0.78) return 0.46 + 0.5 * (1 - t / 0.78) ** 4;
      const u = (t - 0.78) / 0.22;
      return 0.46 * Math.sqrt(Math.max(0, 1 - u * u));
    };
    const outer = sdLathe(p, r, -0.75, 0.55);
    const inner = sdLathe(p, (y) => Math.max(0, r(y) - 0.09), -1.2, 0.05);
    const shell = Math.max(outer, -inner);
    const crown = sdSphere([p[0], p[1] - 0.58, p[2]], 0.1);
    const loop = sdTorus(rotX([p[0], p[1] - 0.76, p[2]], 90), 0.13, 0.05);
    const clapper = sdSphere([p[0], p[1] + 0.86, p[2]], 0.15);
    return union({ d: Math.min(shell, crown, loop, clapper), m: -inner >= outer && shell < 0.01 ? 1 : 0 });
  },
};

/** Camera: a dark box camera turned to show its side, a silver lens barrel and a viewfinder. */
const camera: Scene = {
  name: "Camera",
  kind: "item",
  size: [30, 24],
  scale: 0.08,
  pitch: 22,
  yaw: 30,
  materials: [
    { char: "abcde", ramp: DARK },
    { char: "ghijkl", ramp: IRON },
    { char: "vwxyz", ramp: BLUE_GLASS },
  ],
  sdf: (p) => {
    const body = sdBox(p, [0.95, 0.55, 0.42], 0.1);
    const finder = sdBox([p[0] + 0.45, p[1] - 0.62, p[2]], [0.28, 0.12, 0.25], 0.04);
    const barrel = sdCylinder(rotX([p[0] - 0.05, p[1] + 0.02, p[2] - 0.5], 90), 0.4, 0.14);
    const glass = sdCylinder(rotX([p[0] - 0.05, p[1] + 0.02, p[2] - 0.62], 90), 0.28, 0.05);
    const button = sdCylinder([p[0] - 0.62, p[1] - 0.6, p[2]], 0.1, 0.07);
    return union({ d: body, m: 0 }, { d: Math.min(barrel, finder, button), m: 1 }, { d: glass, m: 2 });
  },
};

/** Briefcase: a brown leather case with a carry handle and two brass clasps. */
const briefcase: Scene = {
  name: "Briefcase",
  kind: "item",
  size: [30, 26],
  scale: 0.08,
  pitch: 24,
  yaw: 28,
  materials: [
    { char: "abcdef", ramp: LEATHER },
    { char: "123456", ramp: BRASS },
    { char: "uvw", ramp: ["#2a1a0c", "#3e2814", "#55381c"] },
  ],
  sdf: (p) => {
    const body = sdBox([p[0], p[1] + 0.12, p[2]], [1.0, 0.6, 0.32], 0.1);
    const seam = sdBox([p[0], p[1] - 0.22, p[2]], [1.01, 0.025, 0.33]);
    const handle = Math.max(sdTorus(rotX([p[0], p[1] - 0.62, p[2]], 90), 0.3, 0.07), -(p[1] - 0.62));
    const clasps = Math.min(sdBox([p[0] - 0.55, p[1] - 0.22, p[2] - 0.33], [0.11, 0.09, 0.04], 0.02), sdBox([p[0] + 0.55, p[1] - 0.22, p[2] - 0.33], [0.11, 0.09, 0.04], 0.02));
    void seam;
    return union({ d: body, m: 0 }, { d: handle, m: 2 }, { d: clasps, m: 1 });
  },
};

// ---------- Flat badges (symbols): extruded 2D shapes seen head-on, bevelled all round ----------
const SHIELD: [number, number][] = [[-0.9, 0.95], [0.9, 0.95], [0.9, 0.15], [0.62, -0.45], [0, -1.0], [-0.62, -0.45], [-0.9, 0.15]];
const star4 = (x: number, y: number, r = 1, w = 0.28): number =>
  sdPolygon2(x, y, [[0, r], [w, w], [r, 0], [w, -w], [0, -r], [-w, -w], [-r, 0], [-w, w]]);
const BLUE = ["#143880", "#2050a8", "#2f6ccc", "#4c8ee8", "#78b2f6", "#b4d8ff"];
const STEEL = IRON;

/** Mystic Ward (prayer): a four-point star, bevelled, with the prayer's blue glow. */
const mysticWard: Scene = {
  name: "Mystic Ward (a four-point star)",
  kind: "prayer",
  header: { outline: "#2860c8" },
  size: [26, 26],
  scale: 0.085,
  exposure: 0.72,
  pitch: 0,
  yaw: 0,
  materials: [{ char: "abcdef", ramp: BLUE }],
  sdf: (p) => ({ d: sdBadge(p, (x, y) => star4(x, y, 1.05, 0.32), 0.22, 0.2), m: 0 }),
};

/** Iron Skin (prayer): a heater shield, gold rim around a raised steel face. */
const ironSkin: Scene = {
  name: "Iron Skin (a gilded shield)",
  kind: "prayer",
  header: { outline: "#c8981e" },
  size: [24, 26],
  scale: 0.085,
  exposure: 0.72,
  pitch: 0,
  yaw: 0,
  materials: [{ char: "123456", ramp: GOLD }, { char: "ghijkl", ramp: STEEL }],
  sdf: (p) => {
    const rim = sdBadge(p, (x, y) => sdPolygon2(x, y, SHIELD), 0.2, 0.17);
    const face = sdBadge([p[0], p[1], p[2] - 0.06], (x, y) => sdPolygon2(x, y, SHIELD) + 0.24, 0.2, 0.14);
    return union({ d: rim, m: 0 }, { d: face, m: 1 });
  },
};

/** Warding (skill): a blue kite shield with a raised white ward-star. */
const warding: Scene = {
  name: "Warding (a rune-carved shield)",
  kind: "skill",
  size: [20, 22],
  scale: 0.1,
  exposure: 0.72,
  pitch: 0,
  yaw: 0,
  materials: [{ char: "abcdef", ramp: BLUE }, { char: "uvw", ramp: ["#a8c8e8", "#d8e8f8", "#ffffff"] }],
  sdf: (p) => {
    const shield = sdBadge(p, (x, y) => sdPolygon2(x, y, SHIELD), 0.2, 0.17);
    const mark = sdBadge([p[0], p[1] - 0.1, p[2] - 0.2], (x, y) => star4(x, y, 0.62, 0.14), 0.08, 0.04);
    return union({ d: shield, m: 0 }, { d: mark, m: 1 });
  },
};

// ---------- The docs site's own icons (pixel-icons/*.txt) ----------
const STONE = ["#3a3833", "#55524b", "#6f6b62", "#8a857a", "#a6a094", "#c2bcae"];
const GREEN = ["#0a4a0a", "#126a12", "#1c8c1c", "#2aae2a", "#4ccc4c", "#86ec86"];
const YELLOW = ["#7a6a00", "#a89200", "#d4bc00", "#f0dc10", "#ffff40"];
/** Object space to camera space, for a part that should face the viewer (an arrow on an object). */
const toCamera = (p: V3, yaw: number, pitch: number): V3 => rotX(rotY(p, yaw), pitch);
const arrowDown = (x: number, y: number) =>
  sdPolygon2(x, y, [[-0.16, 0.5], [0.16, 0.5], [0.16, 0.02], [0.4, 0.02], [0, -0.45], [-0.4, 0.02], [-0.16, 0.02]]);

/** Assets: a treasure chest with a rounded lid, gold bands and a lock plate. */
const chest: Scene = {
  name: "Assets (a treasure chest)",
  kind: "tab",
  size: [26, 22],
  scale: 0.085,
  pitch: 28,
  yaw: 30,
  materials: [{ char: "abcde", ramp: WOOD }, { char: "123456", ramp: GOLD }],
  sdf: (p) => {
    const body = sdBox([p[0], p[1] + 0.3, p[2]], [0.95, 0.42, 0.58], 0.04);
    const lid = Math.max(sdCylinder(rotZ([p[0], p[1] - 0.12, p[2]], 90), 0.58, 0.95), -(p[1] - 0.12));
    const bands = Math.min(
      Math.max(Math.min(body, lid) - 0.04, Math.abs(p[0] - 0.55) - 0.09),
      Math.max(Math.min(body, lid) - 0.04, Math.abs(p[0] + 0.55) - 0.09),
    );
    const lock = sdBox([p[0], p[1] - 0.05, p[2] - 0.6], [0.14, 0.17, 0.05], 0.02);
    return union({ d: Math.min(body, lid), m: 0 }, { d: Math.min(bands, lock), m: 1 });
  },
};

/** Components: three dressed stone blocks, two below and one on top. */
const blocks: Scene = {
  name: "Components (stacked stone blocks)",
  kind: "tab",
  size: [26, 22],
  scale: 0.075,
  pitch: 30,
  yaw: 14,
  exposure: 0.85,
  materials: [{ char: "ghijkl", ramp: STONE }],
  sdf: (p) => {
    const b = (x: number, y: number, z: number) => sdBox([p[0] - x, p[1] - y, p[2] - z], [0.44, 0.34, 0.44], 0.05);
    return { d: Math.min(b(-0.5, -0.38, 0), b(0.5, -0.38, 0), b(0, 0.38, 0)), m: 0 };
  },
};

/** Getting started: a quest scroll, rolled at both ends, lying turned. */
const scroll: Scene = {
  name: "Getting started (a quest scroll)",
  kind: "tab",
  size: [26, 22],
  scale: 0.085,
  pitch: 40,
  yaw: 25,
  materials: [{ char: "pqrst", ramp: PAPER }, { char: "uvw", ramp: ["#4a3a22", "#6e5838", "#8e7650"] }],
  sdf: (p) => {
    const sheet = sdBox(p, [0.62, 0.03, 0.85], 0.01);
    const rolls = Math.min(sdCylinder(rotZ([p[0], p[1] - 0.08, p[2] - 0.85], 90), 0.15, 0.72), sdCylinder(rotZ([p[0], p[1] - 0.08, p[2] + 0.85], 90), 0.15, 0.72));
    // a few lines of writing, slightly raised and dark
    let lines = 1e9;
    for (let i = 0; i < 4; i++) lines = Math.min(lines, sdBox([p[0] + (i === 3 ? 0.12 : 0), p[1] - 0.04, p[2] - (-0.45 + i * 0.3)], [i === 3 ? 0.3 : 0.42, 0.012, 0.035]));
    return union({ d: Math.min(sheet, rolls), m: 0 }, { d: lines, m: 1 });
  },
};

/** Recipes: an iron cooking pot with a dark inside and two side handles. */
const pot: Scene = {
  name: "Recipes (a cooking pot)",
  kind: "tab",
  size: [26, 22],
  scale: 0.08,
  pitch: 32,
  yaw: 0,
  materials: [{ char: "abcde", ramp: DARK }, { char: "xyz", ramp: ["#0a0a0a", "#141414", "#1e1e1e"] }, { char: "uvwq", ramp: ["#6a3a12", "#8a5018", "#b06a22", "#d08a3a"] }],
  sdf: (p) => {
    const r = (y: number) => 0.62 + 0.28 * Math.max(0, Math.sin(((Math.min(y, 0.45) + 0.6) / 1.05) * Math.PI)) ** 0.8;
    const outer = sdLathe(p, r, -0.6, 0.45);
    const inner = sdLathe(p, (y) => r(y) - 0.08, -0.4, 1);
    const shell = Math.max(outer, -inner);
    const stew = sdCylinder([p[0], p[1] - 0.2, p[2]], 0.78, 0.02);
    const handles = Math.min(sdTorus(rotX([p[0] - 0.95, p[1] - 0.28, p[2]], 90), 0.13, 0.05), sdTorus(rotX([p[0] + 0.95, p[1] - 0.28, p[2]], 90), 0.13, 0.05));
    return union({ d: Math.min(shell, handles), m: -inner >= outer ? 1 : 0 }, { d: stew, m: 2 });
  },
};

/** Free downloads: a pouch with a green arrow pointing into it, the arrow facing the viewer. */
const downloads: Scene = {
  name: "Free downloads (an arrow into a pouch)",
  kind: "item",
  size: [24, 28],
  scale: 0.085,
  pitch: 30,
  yaw: 35,
  offset: [0, 0.25],
  materials: [{ char: "abcdef", ramp: LEATHER }, { char: "uvw", ramp: ["#2a1a0c", "#5a3a1c", "#8c6034"] }, { char: "GHIJKL", ramp: GREEN }],
  sdf: (p) => {
    const body = sdLathe(p, (y) => {
      if (y < -0.75) return 0;
      const t = (y + 0.75) / 1.25;
      return 0.25 + 0.72 * Math.sin(Math.min(1, t * 1.15) * Math.PI) ** 0.6 * (1 - 0.55 * t);
    }, -0.75, 0.5);
    const lip = Math.max(sdLathe(p, (y) => 0.17 + (y - 0.6) * 0.9, 0.5, 0.75), -sdLathe(p, (y) => 0.1 + (y - 0.6) * 0.9, 0.55, 1.2));
    const tie = sdTorus([p[0], p[1] - 0.52, p[2]], 0.21, 0.045);
    const c = toCamera(p, 35, 30);
    const arrow = sdBadge([c[0], c[1] - 1.25, c[2] - 0.6], arrowDown, 0.08, 0.05);
    return union({ d: Math.min(body, lip), m: 0 }, { d: tie, m: 1 }, { d: arrow, m: 2 });
  },
};

/** Frames that resize: a stone window frame turned in perspective, a yellow resize arrow at its corner. */
const frame: Scene = {
  name: "Frames that resize (a frame and a resize arrow)",
  kind: "item",
  size: [28, 26],
  scale: 0.08,
  pitch: 20,
  yaw: 25,
  materials: [{ char: "ghijkl", ramp: STONE }, { char: "YZ12a", ramp: YELLOW }],
  sdf: (p) => {
    const outer = sdBox(p, [0.85, 0.85, 0.1], 0.03);
    const hole = sdBox(p, [0.55, 0.55, 0.3]);
    const c = toCamera(p, 25, 20);
    const diag = rotZ([c[0] - 0.8, c[1] + 0.8, c[2] - 0.35], -45);
    const arrow = sdBadge(diag, arrowDown, 0.06, 0.04);
    return union({ d: Math.max(outer, -hole), m: 0 }, { d: arrow, m: 1 });
  },
};

/** One scale knob: the magnifying glass with a gold rim. */
const scaleGlass: Scene = { ...magnifier, name: "One scale knob (a magnifying glass)", materials: [{ char: "123456", ramp: GOLD }, magnifier.materials[1], magnifier.materials[2]] };

/** Vector, not screenshots: a white quill lying on the diagonal, nib to the bottom left. */
const quill: Scene = {
  name: "Vector, not screenshots (a quill)",
  kind: "item",
  size: [28, 28],
  scale: 0.08,
  pitch: 55,
  yaw: 0,
  exposure: 0.78,
  materials: [{ char: "pqrst", ramp: ["#8a8a84", "#b0b0aa", "#d2d2cc", "#ececE6", "#ffffff"] }, { char: "uvw", ramp: ["#2a2a2a", "#4a4a44", "#6a6a62"] }],
  sdf: (p0) => {
    const p = rotY(p0, -45);
    // the vane: a flattened ellipsoid along x, cut with a slight curve
    const vane = sdEllipsoid([p[0] - 0.15, p[1], p[2] - 0.1 * (p[0] - 0.15) ** 2], [1.1, 0.06, 0.28]);
    const shaft = sdCapsule([p[0], p[1] - 0.04, p[2]], [-1.45, 0, 0], [1.2, 0, 0], 0.035);
    const nib = sdCapsule(p, [-1.55, 0, 0], [-1.3, 0, 0], 0.05);
    return union({ d: Math.max(vane, -(p[0] + 0.95)), m: 0 }, { d: shaft, m: 1 }, { d: nib, m: 1 });
  },
};


// ---------- Section icon options, round 2 (sidebar concept stones) ----------

/** Getting started A: an open quest scroll seen from above, rolls top and bottom, red wax seal. */
const scrollTopDown: Scene = {
  name: "Getting started (an open scroll, from above)",
  kind: "tab",
  size: [22, 24],
  scale: 0.085,
  pitch: 72,
  yaw: 8,
  materials: [{ char: "pqrst", ramp: PAPER }, { char: "uvw", ramp: ["#4a3a22", "#6e5838", "#8e7650"] }, { char: "RSTU", ramp: RED.slice(1, 5) }],
  sdf: (p) => {
    const sheet = sdBox(p, [0.62, 0.03, 0.78], 0.01);
    const rolls = Math.min(sdCylinder(rotZ([p[0], p[1] - 0.1, p[2] - 0.8], 90), 0.16, 0.72), sdCylinder(rotZ([p[0], p[1] - 0.1, p[2] + 0.8], 90), 0.16, 0.72));
    let lines = 1e9;
    for (let i = 0; i < 4; i++) lines = Math.min(lines, sdBox([p[0] + (i % 2 ? 0.1 : 0), p[1] - 0.04, p[2] - (-0.42 + i * 0.24)], [i % 2 ? 0.32 : 0.42, 0.012, 0.035]));
    const seal = sdCylinder([p[0] - 0.3, p[1] - 0.06, p[2] - 0.45], 0.16, 0.04);
    return union({ d: Math.min(sheet, rolls), m: 0 }, { d: lines, m: 1 }, { d: seal, m: 2 });
  },
};

/** Getting started B: a rolled scroll tied with a red ribbon, lying on the diagonal, from above. */
const scrollRolled: Scene = {
  name: "Getting started (a rolled scroll, tied)",
  kind: "tab",
  size: [24, 22],
  scale: 0.08,
  pitch: 60,
  yaw: 45,
  materials: [{ char: "pqrst", ramp: PAPER }, { char: "RSTU", ramp: RED.slice(1, 5) }],
  sdf: (p) => {
    const roll = sdCylinder(rotZ(p, 90), 0.32, 1.05);
    const end = sdCylinder(rotZ([p[0] - 1.05, p[1], p[2]], 90), 0.2, 0.03);
    const ribbon = Math.max(sdCylinder(rotZ(p, 90), 0.35, 0.1), -sdCylinder(rotZ(p, 90), 0.31, 2));
    const tail = sdBox(rotY([p[0] - 0.1, p[1] - 0.3, p[2] - 0.35], 30), [0.06, 0.02, 0.3]);
    return union({ d: Math.max(roll, -end + 0.0), m: 0 }, { d: Math.min(ribbon, tail), m: 1 });
  },
};

/** Getting started C: an unrolled scroll from straight above, rolls left and right, a few lines. */
const scrollFlat: Scene = {
  name: "Getting started (a scroll laid open)",
  kind: "tab",
  size: [26, 20],
  scale: 0.08,
  pitch: 85,
  yaw: 0,
  materials: [{ char: "pqrst", ramp: PAPER }, { char: "uvw", ramp: ["#4a3a22", "#6e5838", "#8e7650"] }],
  sdf: (p) => {
    const sheet = sdBox(p, [0.85, 0.03, 0.62], 0.01);
    const rolls = Math.min(sdCylinder([p[0] - 0.9, p[1] - 0.1, p[2]].map((v, i) => v) as V3, 0, 0), 1e9);
    const rL = sdCylinder(rotX([p[0] + 0.92, p[1] - 0.1, p[2]], 90), 0.15, 0.7);
    const rR = sdCylinder(rotX([p[0] - 0.92, p[1] - 0.1, p[2]], 90), 0.15, 0.7);
    let lines = 1e9;
    for (let i = 0; i < 4; i++) lines = Math.min(lines, sdBox([p[0] + (i === 3 ? 0.15 : 0), p[1] - 0.04, p[2] - (-0.36 + i * 0.24)], [i === 3 ? 0.4 : 0.55, 0.012, 0.035]));
    return union({ d: Math.min(sheet, rL, rR, rolls), m: 0 }, { d: lines, m: 1 });
  },
};

/** Components A: four interface tiles in a 2x2 square, one lit red (pressed), seen from above. */
const tiles: Scene = {
  name: "Components (four interface tiles)",
  kind: "tab",
  size: [24, 22],
  scale: 0.08,
  pitch: 50,
  yaw: 20,
  exposure: 0.85,
  materials: [{ char: "ghijkl", ramp: STONE }, { char: "RSTUV", ramp: RED.slice(0, 5) }],
  sdf: (p) => {
    const t = (x: number, z: number) => sdBox([p[0] - x, p[1], p[2] - z], [0.4, 0.12, 0.4], 0.06);
    return union({ d: Math.min(t(-0.46, -0.46), t(0.46, -0.46), t(-0.46, 0.46)), m: 0 }, { d: t(0.46, 0.46), m: 1 });
  },
};

/** Components B: an anvil, the thing you build parts on. */
const anvil: Scene = {
  name: "Components (an anvil)",
  kind: "tab",
  size: [26, 20],
  scale: 0.075,
  pitch: 28,
  yaw: 25,
  materials: [{ char: "abcdef", ramp: IRON }],
  sdf: (p) => {
    const top = sdBox([p[0], p[1] - 0.35, p[2]], [0.85, 0.16, 0.34], 0.03);
    const horn = sdCapsule(p, [-0.85, 0.38, 0], [-1.35, 0.42, 0], 0.13);
    const waist = sdBox([p[0], p[1] + 0.05, p[2]], [0.32, 0.26, 0.22], 0.02);
    const foot = sdBox([p[0], p[1] + 0.42, p[2]], [0.62, 0.12, 0.36], 0.03);
    return { d: Math.min(top, horn, waist, foot), m: 0 };
  },
};

/** Components C: a single dressed stone block with a gold rune inlaid on its face. */
const runeBlock: Scene = {
  name: "Components (a carved rune block)",
  kind: "tab",
  size: [22, 22],
  scale: 0.07,
  pitch: 30,
  yaw: 35,
  exposure: 0.85,
  materials: [{ char: "ghijkl", ramp: STONE }, { char: "123456", ramp: GOLD }],
  sdf: (p) => {
    const block = sdBox(p, [0.75, 0.75, 0.75], 0.08);
    // a rune on the front face: a vertical stroke and two diagonals
    const q: V3 = [p[0], p[1], p[2] - 0.76];
    const rune = Math.min(sdBox(q, [0.06, 0.45, 0.03]), sdBox(rotZ([q[0] - 0.18, q[1] - 0.15, q[2]], 40), [0.05, 0.25, 0.03]), sdBox(rotZ([q[0] - 0.18, q[1] + 0.15, q[2]], -40), [0.05, 0.25, 0.03]));
    return union({ d: block, m: 0 }, { d: rune, m: 1 });
  },
};

/** Recipes A: an open cookbook from above, a red ribbon marker. */
const cookbook: Scene = {
  name: "Recipes (an open cookbook)",
  kind: "tab",
  size: [26, 20],
  scale: 0.08,
  pitch: 55,
  yaw: 10,
  materials: [{ char: "pqrst", ramp: PAPER }, { char: "abcde", ramp: LEATHER.slice(0, 5) }, { char: "uvw", ramp: ["#4a3a22", "#6e5838", "#8e7650"] }, { char: "RST", ramp: RED.slice(2, 5) }],
  sdf: (p) => {
    const cover = sdBox([p[0], p[1] + 0.08, p[2]], [1.0, 0.05, 0.7], 0.02);
    const pageL = sdBox(rotZ([p[0] + 0.48, p[1] - 0.02, p[2]], -6), [0.48, 0.06, 0.62], 0.02);
    const pageR = sdBox(rotZ([p[0] - 0.48, p[1] - 0.02, p[2]], 6), [0.48, 0.06, 0.62], 0.02);
    let lines = 1e9;
    for (const side of [-1, 1]) for (let i = 0; i < 4; i++) lines = Math.min(lines, sdBox([p[0] - side * 0.48, p[1] - 0.09 - (side * (p[0] - side * 0.48)) * 0.1, p[2] - (-0.36 + i * 0.22)], [0.32, 0.012, 0.03]));
    const ribbon = sdBox([p[0] - 0.05, p[1] - 0.1, p[2] - 0.55], [0.05, 0.02, 0.3]);
    return union({ d: cover, m: 1 }, { d: Math.min(pageL, pageR), m: 0 }, { d: lines, m: 2 }, { d: ribbon, m: 3 });
  },
};

/** Recipes B: a stew bowl with a wooden spoon, from above at an angle. */
const stewBowl: Scene = {
  name: "Recipes (a bowl of stew and a spoon)",
  kind: "tab",
  size: [24, 20],
  scale: 0.08,
  pitch: 45,
  yaw: 20,
  materials: [{ char: "abcde", ramp: WOOD }, { char: "uvwq", ramp: ["#6a3a12", "#8a5018", "#b06a22", "#d08a3a"] }, { char: "PQRS", ramp: ["#7a5a1a", "#a07a2a", "#c89a3a", "#e8be5a"] }],
  sdf: (p) => {
    const r = (y: number) => 0.55 + 0.35 * Math.sin(((Math.min(Math.max(y, -0.4), 0.2) + 0.4) / 0.6) * (Math.PI / 2));
    const outer = sdLathe(p, r, -0.4, 0.2);
    const inner = sdLathe(p, (y) => r(y) - 0.08, -0.25, 1);
    const stew = sdCylinder([p[0], p[1] - 0.08, p[2]], 0.82, 0.02);
    const spoon = Math.min(sdCapsule(p, [0.2, 0.15, -0.1], [1.1, 0.55, -0.55], 0.06), sdEllipsoid([p[0] - 0.15, p[1] - 0.14, p[2] + 0.05], [0.2, 0.06, 0.14]));
    return union({ d: Math.max(outer, -inner), m: 0 }, { d: stew, m: 1 }, { d: spoon, m: 2 });
  },
};

/** Recipes C: a cooking range pot, brighter: a bronze cauldron with a glowing stew, side-on. */
const cauldron: Scene = {
  name: "Recipes (a bronze cauldron)",
  kind: "tab",
  size: [24, 22],
  scale: 0.085,
  pitch: 35,
  yaw: 0,
  materials: [{ char: "123456", ramp: GOLD }, { char: "xyz", ramp: ["#0a0a0a", "#141414", "#1e1e1e"] }, { char: "GHIJ", ramp: GREEN.slice(1, 5) }],
  sdf: (p) => {
    const r = (y: number) => 0.55 + 0.32 * Math.max(0, Math.sin(((Math.min(y, 0.4) + 0.55) / 0.95) * Math.PI)) ** 0.7;
    const outer = sdLathe(p, r, -0.55, 0.4);
    const inner = sdLathe(p, (y) => r(y) - 0.08, -0.35, 1);
    const stew = sdCylinder([p[0], p[1] - 0.22, p[2]], 0.74, 0.02);
    const legs = Math.min(sdCapsule(p, [0.4, -0.5, 0.3], [0.45, -0.75, 0.35], 0.06), sdCapsule(p, [-0.4, -0.5, 0.3], [-0.45, -0.75, 0.35], 0.06));
    return union({ d: Math.min(Math.max(outer, -inner), legs), m: -inner >= outer ? 1 : 0 }, { d: stew, m: 2 });
  },
};

/** Assets A: the chest with its lid open and gold coins inside. */
const chestOpen: Scene = {
  name: "Assets (an open treasure chest)",
  kind: "tab",
  size: [26, 24],
  scale: 0.08,
  pitch: 34,
  yaw: 30,
  materials: [{ char: "abcde", ramp: WOOD }, { char: "123456", ramp: GOLD }],
  sdf: (p) => {
    const body = sdBox([p[0], p[1] + 0.3, p[2]], [0.95, 0.42, 0.58], 0.04);
    const hollow = sdBox([p[0], p[1] - 0.05, p[2]], [0.85, 0.4, 0.48]);
    const lid = sdBox(rotX([p[0], p[1] - 0.35, p[2] + 0.6], -70), [0.95, 0.06, 0.55], 0.04);
    const coins = sdEllipsoid([p[0], p[1] - 0.12, p[2]], [0.82, 0.18, 0.46]);
    const bands = Math.max(sdBox([p[0], p[1] + 0.3, p[2]], [0.97, 0.44, 0.6]), Math.abs(Math.abs(p[0]) - 0.55) - 0.08);
    return union({ d: Math.min(Math.max(body, -hollow), lid), m: 0 }, { d: Math.min(coins, bands), m: 1 });
  },
};

/** Assets B: the closed chest, turned more and seen a little higher, with bigger gold bands. */
const chestHigh: Scene = {
  name: "Assets (a treasure chest, higher view)",
  kind: "tab",
  size: [26, 22],
  scale: 0.08,
  pitch: 38,
  yaw: 38,
  materials: [{ char: "abcde", ramp: WOOD }, { char: "123456", ramp: GOLD }],
  sdf: (p) => {
    const body = sdBox([p[0], p[1] + 0.3, p[2]], [0.95, 0.42, 0.58], 0.04);
    const lid = Math.max(sdCylinder(rotZ([p[0], p[1] - 0.12, p[2]], 90), 0.58, 0.95), -(p[1] - 0.12));
    const all = Math.min(body, lid);
    const bands = Math.max(all - 0.04, Math.abs(Math.abs(p[0]) - 0.6) - 0.11);
    const rim = Math.max(all - 0.04, Math.abs(p[1] - 0.12) - 0.05);
    const lock = sdBox([p[0], p[1] - 0.05, p[2] - 0.6], [0.16, 0.2, 0.06], 0.02);
    return union({ d: all, m: 0 }, { d: Math.min(bands, rim, lock), m: 1 });
  },
};


// ---------- Section icon options, round 3 ----------

/** An upright scroll: the sheet stands on the cube's front-left face (isometric), rolls top and
 *  bottom; `seal` adds a red wax seal. */
const uprightScroll = (name: string, yaw: number, seal: boolean): Scene => ({
  name,
  kind: "tab",
  size: [28, 30],
  scale: 0.085,
  pitch: 28,
  yaw,
  materials: [{ char: "pqrst", ramp: PAPER }, { char: "uvw", ramp: ["#4a3a22", "#6e5838", "#8e7650"] }, { char: "RSTU", ramp: RED.slice(1, 5) }],
  sdf: (p) => {
    const sheet = sdBox(p, [0.62, 0.8, 0.03], 0.01);
    const rolls = Math.min(sdCylinder(rotZ([p[0], p[1] - 0.82, p[2]], 90), 0.15, 0.72), sdCylinder(rotZ([p[0], p[1] + 0.82, p[2]], 90), 0.15, 0.72));
    let lines = 1e9;
    for (let i = 0; i < 4; i++) lines = Math.min(lines, sdBox([p[0] + (i % 2 ? 0.1 : 0), p[1] - (0.42 - i * 0.24), p[2] - 0.04], [i % 2 ? 0.32 : 0.42, 0.035, 0.012]));
    const wax = seal ? sdCylinder(rotX([p[0] - 0.28, p[1] + 0.5, p[2] - 0.05], 90), 0.15, 0.04) : 1e9;
    return union({ d: Math.min(sheet, rolls), m: 0 }, { d: lines, m: 1 }, { d: wax, m: 2 });
  },
});


/** Components D: three bricks, two below and one on top, offset like a wall. */
const bricks: Scene = {
  name: "Components (stacked bricks)",
  kind: "tab",
  size: [30, 26],
  scale: 0.075,
  pitch: 30,
  yaw: 30,
  materials: [{ char: "RSTUV", ramp: ["#5a2a1a", "#7a3a22", "#9a4c2c", "#b86238", "#d27c4a"] }],
  sdf: (p) => {
    const b = (x: number, y: number) => sdBox([p[0] - x, p[1] - y, p[2]], [0.48, 0.22, 0.3], 0.03);
    return { d: Math.min(b(-0.51, -0.24), b(0.51, -0.24), b(0, 0.24)), m: 0 };
  },
};

/** Components E: a hammer and a chisel crossed. */
const hammerChisel: Scene = {
  name: "Components (hammer and chisel)",
  kind: "tab",
  size: [22, 22],
  scale: 0.08,
  pitch: 20,
  yaw: 0,
  materials: [{ char: "abcde", ramp: WOOD }, { char: "fghijk", ramp: IRON }],
  sdf: (p) => {
    const handle = sdCapsule(p, [-0.7, -0.75, 0], [0.45, 0.45, 0], 0.08);
    const head = sdBox(rotZ([p[0] - 0.52, p[1] - 0.52, p[2]], 45), [0.38, 0.14, 0.14], 0.03);
    const chisel = sdCapsule(p, [0.75, -0.75, 0.15], [-0.4, 0.4, 0.15], 0.06);
    const grip = sdCapsule(p, [0.75, -0.75, 0.15], [0.35, -0.35, 0.15], 0.09);
    return union({ d: Math.min(handle, grip), m: 0 }, { d: Math.min(head, chisel), m: 1 });
  },
};

/** Components F: a small interface window: a rivet frame round a stone pane with a title bar. */
const miniWindow: Scene = {
  name: "Components (a small interface window)",
  kind: "tab",
  size: [22, 20],
  scale: 0.08,
  pitch: 28,
  yaw: 30,
  materials: [{ char: "abcdef", ramp: IRON }, { char: "ghijkl", ramp: STONE }, { char: "123456", ramp: GOLD }],
  sdf: (p) => {
    const frame = Math.max(sdBox(p, [0.85, 0.7, 0.08], 0.02), -sdBox([p[0], p[1], p[2] - 0.05], [0.72, 0.57, 0.1]));
    const pane = sdBox(p, [0.74, 0.59, 0.04]);
    const bar = sdBox([p[0], p[1] - 0.42, p[2] - 0.05], [0.55, 0.06, 0.02]);
    return union({ d: frame, m: 0 }, { d: pane, m: 1 }, { d: bar, m: 2 });
  },
};

/** Components G: a wooden crate, the parts box. */
const crate: Scene = {
  name: "Components (a wooden crate)",
  kind: "tab",
  size: [22, 22],
  scale: 0.075,
  pitch: 30,
  yaw: 35,
  materials: [{ char: "abcde", ramp: WOOD }, { char: "PQRS", ramp: ["#3b2610", "#4c3216", "#5c3e1c", "#6e4a22"] }],
  sdf: (p) => {
    const box = sdBox(p, [0.75, 0.6, 0.75], 0.03);
    const slats = Math.max(box - 0.02, Math.min(Math.abs(Math.abs(p[1]) - 0.58) - 0.06, Math.abs(Math.abs(p[0]) - 0.73) - 0.06, Math.abs(Math.abs(p[2]) - 0.73) - 0.06));
    return union({ d: box, m: 0 }, { d: slats, m: 1 });
  },
};


// ---------- Assets, round 4: chests that fit the stone ----------

/** A chest of given proportions; `open` tips the lid back to show coins. */
const chestVariant = (name: string, o: { yaw: number; pitch: number; scale: number; size: [number, number]; w: number; h: number; d: number; open?: boolean }): Scene => ({
  name,
  kind: "tab",
  size: o.size,
  scale: o.scale,
  pitch: o.pitch,
  yaw: o.yaw,
  materials: [{ char: "abcde", ramp: WOOD }, { char: "123456", ramp: GOLD }],
  sdf: (p) => {
    const body = sdBox([p[0], p[1] + o.h * 0.5, p[2]], [o.w, o.h * 0.5, o.d], 0.04);
    if (o.open) {
      const hollow = sdBox([p[0], p[1] - 0.02, p[2]], [o.w - 0.1, o.h * 0.5, o.d - 0.1]);
      const lid = sdBox(rotX([p[0], p[1] - 0.05, p[2] + o.d], -80), [o.w, o.d * 0.9, 0.06], 0.03);
      const coins = sdEllipsoid([p[0], p[1] + 0.05, p[2]], [o.w - 0.1, 0.16, o.d - 0.1]);
      const bands = Math.max(body - 0.03, Math.abs(Math.abs(p[0]) - o.w * 0.6) - 0.08);
      return union({ d: Math.min(Math.max(body, -hollow), lid), m: 0 }, { d: Math.min(coins, bands), m: 1 });
    }
    const lid = Math.max(sdCylinder(rotZ([p[0], p[1], p[2]], 90), o.d, o.w), -p[1]);
    const all = Math.min(body, lid);
    const bands = Math.max(all - 0.04, Math.abs(Math.abs(p[0]) - o.w * 0.62) - 0.1);
    const rim = Math.max(all - 0.04, Math.abs(p[1]) - 0.05);
    const lock = sdBox([p[0], p[1] - 0.04, p[2] - o.d], [0.14, 0.18, 0.05], 0.02);
    return union({ d: all, m: 0 }, { d: Math.min(bands, rim, lock), m: 1 });
  },
});

export const scenes: Record<string, Scene> = {
  "coin-pouch": coinPouch,
  hourglass,
  key,
  padlock,
  trophy,
  "quest-journal": questJournal,
  "map-pin": mapPin,
  magnifier,
  envelope,
  calendar,
  bell,
  camera,
  briefcase,
  "mystic-ward": mysticWard,
  "iron-skin": ironSkin,
  warding,
  "site-assets": chest,
  "site-components": blocks,
  "site-getting-started": scroll,
  "site-recipes": pot,
  "site-downloads": downloads,
  "site-frames": frame,
  "site-scale": scaleGlass,
  "site-vector": quill,
  "opt-gs-topdown": scrollTopDown,
  "opt-gs-rolled": scrollRolled,
  "opt-gs-flat": scrollFlat,
  "opt-c-tiles": tiles,
  "opt-c-anvil": anvil,
  "opt-c-rune-block": runeBlock,
  "opt-r-cookbook": cookbook,
  "opt-r-stew": stewBowl,
  "opt-r-cauldron": cauldron,
  "opt-a-open": chestOpen,
  "opt-a-high": chestHigh,
  "opt-a-small": { ...chestHigh, name: "Assets (a treasure chest, smaller)", size: [30, 26], scale: 0.1 },
  "opt-gs-upright": uprightScroll("Getting started (an upright scroll)", -35, false),
  "opt-gs-upright-seal": uprightScroll("Getting started (an upright scroll, sealed)", -35, true),
  "opt-gs-upright-right": uprightScroll("Getting started (an upright scroll, turned the other way)", 35, true),
  "opt-c-bricks": bricks,
  "opt-c-hammer": hammerChisel,
  "opt-c-window": miniWindow,
  "opt-c-crate": crate,
  "opt-a-front": chestVariant("Assets (a chest, front on)", { yaw: 15, pitch: 25, scale: 0.095, size: [30, 26], w: 0.95, h: 0.8, d: 0.55 }),
  "opt-a-compact": chestVariant("Assets (a compact chest)", { yaw: 35, pitch: 32, scale: 0.09, size: [30, 26], w: 0.75, h: 0.75, d: 0.55 }),
  "opt-a-open2": chestVariant("Assets (an open chest of coins)", { yaw: 25, pitch: 38, scale: 0.09, size: [30, 26], w: 0.9, h: 0.75, d: 0.55, open: true }),
  "opt-a-low": chestVariant("Assets (a low chest)", { yaw: 30, pitch: 30, scale: 0.09, size: [30, 26], w: 0.95, h: 0.6, d: 0.5 }),
};

