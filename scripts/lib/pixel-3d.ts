// First-pass generator for 3D pixel icons (items, and objects on tab icons). Item sprites in the game
// are renders of 3D models: seen from above (~35°), turned ~45°, faces flat-shaded and curved surfaces
// smoothly shaded, outlined in #000001 with no drop shadow. Drawing that by hand in a text grid is
// guesswork, so this ray-marches a small scene of signed-distance shapes with that camera, lights it
// from the top left, and snaps each pixel to its material's palette ramp. It writes the result as a
// normal pixel-icon .txt grid, which is then refined by hand (the grid stays the source of truth).
//
// The renderer and shape helpers; the CLI is scripts/pixel-3d.ts and scenes are in
// scripts/pixel-3d-scenes.ts.

export type V3 = [number, number, number];
export type Material = { char: string; ramp: string[] }; // ramp: dark → light hex colours
export type Hit = { d: number; m: number }; // distance, material index
export type Scene = {
  name: string;
  kind: string;
  materials: Material[];
  /** Signed distance in object space; y is up. */
  sdf: (p: V3) => Hit;
  /** Grid size in pixels (art only; the build adds the outline). */
  size: [number, number];
  /** World units per pixel. */
  scale: number;
  /** Camera turn around the vertical axis and tilt down, degrees (default 45 / 35). */
  yaw?: number;
  pitch?: number;
  /** Shift the view in world units (x right, y up), to centre the art. */
  offset?: [number, number];
  /** Light direction in camera space (x right, y up, z toward the viewer). */
  light?: V3;
  ambient?: number;
  /** "form" (default): frontal light, surfaces darken as they turn away from the viewer and a
   *  small highlight sits where the surface faces the light, like the game's renders (bands follow
   *  the form). "directional": plain top-left Lambert, which gives diagonal light/dark splits; use
   *  sparingly. */
  shading?: "form" | "directional";
  /** Scales the light before it's snapped to the ramp (default 1). Below 1 puts a flat face
   *  toward the middle of its ramp, leaving the top tones for the lit rim. */
  exposure?: number;
  header?: Record<string, string>;
};

// ---------- vector + SDF helpers (exported for scenes) ----------
export const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const len = (a: V3) => Math.hypot(a[0], a[1], a[2]);
export const norm = (a: V3): V3 => { const l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
export const rotY = (p: V3, deg: number): V3 => { const r = (deg * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r); return [c * p[0] + s * p[2], p[1], -s * p[0] + c * p[2]]; };
export const rotX = (p: V3, deg: number): V3 => { const r = (deg * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r); return [p[0], c * p[1] - s * p[2], s * p[1] + c * p[2]]; };
export const rotZ = (p: V3, deg: number): V3 => { const r = (deg * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r); return [c * p[0] - s * p[1], s * p[0] + c * p[1], p[2]]; };

export const sdBox = (p: V3, b: V3, r = 0) => {
  const q: V3 = [Math.abs(p[0]) - b[0] + r, Math.abs(p[1]) - b[1] + r, Math.abs(p[2]) - b[2] + r];
  return len([Math.max(q[0], 0), Math.max(q[1], 0), Math.max(q[2], 0)]) + Math.min(Math.max(q[0], q[1], q[2]), 0) - r;
};
export const sdSphere = (p: V3, r: number) => len(p) - r;
export const sdEllipsoid = (p: V3, r: V3) => { const k0 = len([p[0] / r[0], p[1] / r[1], p[2] / r[2]]); const k1 = len([p[0] / (r[0] * r[0]), p[1] / (r[1] * r[1]), p[2] / (r[2] * r[2])]); return (k0 * (k0 - 1)) / (k1 || 1e-9); };
/** Torus in the xz plane: major radius R, tube radius r. */
export const sdTorus = (p: V3, R: number, r: number) => Math.hypot(Math.hypot(p[0], p[2]) - R, p[1]) - r;
/** Capped cylinder along y. */
export const sdCylinder = (p: V3, r: number, h: number) => { const dx = Math.hypot(p[0], p[2]) - r, dy = Math.abs(p[1]) - h; return Math.min(Math.max(dx, dy), 0) + Math.hypot(Math.max(dx, 0), Math.max(dy, 0)); };
export const sdCapsule = (p: V3, a: V3, b: V3, r: number) => { const pa = sub(p, a), ba = sub(b, a); const h = Math.max(0, Math.min(1, dot(pa, ba) / dot(ba, ba))); return len(sub(pa, [ba[0] * h, ba[1] * h, ba[2] * h])) - r; };
/** Solid of revolution around y: radius(y) for y in [y0, y1]. Approximate (fine for icons). */
export const sdLathe = (p: V3, radius: (y: number) => number, y0: number, y1: number) => {
  const yc = Math.max(y0, Math.min(y1, p[1]));
  const dr = Math.hypot(p[0], p[2]) - radius(yc);
  const dy = p[1] < y0 ? y0 - p[1] : p[1] > y1 ? p[1] - y1 : 0;
  return dy > 0 ? Math.hypot(Math.max(dr, 0), dy) : dr * 0.7;
};
/** Signed distance to a 2D polygon (x, y points, either winding). */
export const sdPolygon2 = (x: number, y: number, pts: [number, number][]) => {
  let d = Infinity, sign = 1;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [ax, ay] = pts[j], [bx, by] = pts[i];
    const ex = bx - ax, ey = by - ay, wx = x - ax, wy = y - ay;
    const t = Math.max(0, Math.min(1, (wx * ex + wy * ey) / (ex * ex + ey * ey)));
    d = Math.min(d, Math.hypot(wx - ex * t, wy - ey * t));
    if ((ay > y) !== (by > y) && x < (ex * (y - ay)) / ey + ax) sign = -sign;
  }
  return sign * d;
};
/**
 * A flat badge: a 2D shape (signed distance in x, y) extruded `depth` toward the viewer with its
 * edges rounded by `bevel`. Seen head-on (pitch 0, yaw 0) with form shading, the face is flat and
 * the rim catches the light all round: the game's bevel, not a diagonal split.
 */
export const sdBadge = (p: V3, sd2: (x: number, y: number) => number, depth: number, bevel: number) => {
  const d2 = sd2(p[0], p[1]) + bevel;
  const dz = Math.abs(p[2]) - depth + bevel;
  return Math.min(Math.max(d2, dz), 0) + Math.hypot(Math.max(d2, 0), Math.max(dz, 0)) - bevel;
};
export const union = (...hs: Hit[]): Hit => hs.reduce((a, b) => (b.d < a.d ? b : a));
export const subtract = (a: Hit, d: number): Hit => ({ d: Math.max(a.d, -d), m: a.m });

// ---------- renderer ----------
export function render(scene: Scene): string[] {
  const [W, H] = scene.size;
  const yaw = scene.yaw ?? 45, pitch = scene.pitch ?? 35;
  const shading = scene.shading ?? "form";
  const light = norm(scene.light ?? (shading === "form" ? [-0.25, 0.55, 0.8] : [-0.55, 0.75, 0.45]));
  const ambient = scene.ambient ?? 0.35;
  const [ox, oy] = scene.offset ?? [0, 0];
  // camera space → object space: undo the tilt, then the turn
  const toObj = (p: V3): V3 => rotY(rotX(p, -pitch), -yaw);
  const toCam = (n: V3): V3 => rotX(rotY(n, yaw), pitch);
  const rows: string[] = [];
  for (let j = 0; j < H; j++) {
    let row = "";
    for (let i = 0; i < W; i++) {
      const u = (i + 0.5 - W / 2) * scene.scale + ox;
      const v = (H / 2 - j - 0.5) * scene.scale + oy;
      let t = -20, hit: Hit | null = null, p: V3 = [0, 0, 0];
      for (let k = 0; k < 400 && t < 20; k++) {
        p = toObj([u, v, -t]);
        const h = scene.sdf(p);
        if (h.d < 0.002) { hit = h; break; }
        t += Math.max(h.d * 0.8, 0.002);
      }
      if (!hit) { row += "."; continue; }
      const e = 0.002;
      const n = norm([
        scene.sdf(add(p, [e, 0, 0])).d - scene.sdf(sub(p, [e, 0, 0])).d,
        scene.sdf(add(p, [0, e, 0])).d - scene.sdf(sub(p, [0, e, 0])).d,
        scene.sdf(add(p, [0, 0, e])).d - scene.sdf(sub(p, [0, 0, e])).d,
      ]);
      const nc = toCam(n);
      let lum: number;
      if (shading === "form") {
        // diffuse, scaled by how much the surface faces the viewer (edges fall off on every side),
        // plus a tight highlight
        const diffuse = Math.max(0, dot(nc, light));
        const facing = Math.max(0, nc[2]);
        const h = norm(add(light, [0, 0, 1]));
        const spec = Math.max(0, dot(nc, h)) ** 24;
        lum = Math.min(1, ambient * (0.6 + 0.4 * facing) + (1 - ambient) * diffuse * (0.55 + 0.45 * facing) + 0.35 * spec);
      } else {
        lum = Math.min(1, ambient + (1 - ambient) * Math.max(0, dot(nc, light)));
      }
      lum = Math.min(1, lum * (scene.exposure ?? 1));
      const mat = scene.materials[hit.m];
      const idx = Math.min(mat.ramp.length - 1, Math.floor(lum * mat.ramp.length));
      row += mat.char[idx] ?? mat.char[0];
    }
    rows.push(row.replace(/\.+$/, ""));
  }
  // trim empty rows top and bottom
  while (rows.length && !rows[0]) rows.shift();
  while (rows.length && !rows[rows.length - 1]) rows.pop();
  // trim common leading dots
  const lead = Math.min(...rows.filter(Boolean).map((r) => r.match(/^\.*/)![0].length));
  return rows.map((r) => r.slice(lead));
}

export function toTxt(scene: Scene, grid: string[]): string {
  const head = [`name: ${scene.name}`, `kind: ${scene.kind}`, ...Object.entries(scene.header ?? {}).map(([k, v]) => `${k}: ${v}`)];
  const pal = scene.materials.flatMap((m) => m.ramp.map((c, i) => `${m.char[i]} ${c}`));
  return [...head, ...pal, "---", ...grid].join("\n") + "\n";
}

