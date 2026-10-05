/**
 * Geometry and data types shared by the "Teoría de grafos" figures.
 *
 * Coordinates are viewBox units relative to a panel's origin. Everything here
 * is pure so the same code runs at build time and in the browser.
 */

export type NodeStyle = "circle" | "dot";

export interface Point {
  x: number;
  y: number;
}

export interface GraphNode extends Point {
  id: string;
  /** Text in the circle (circle style) or beside the dot. Defaults to id. */
  label?: string;
  /** Offset of an outside label (dot style) or note from the centre. */
  dx?: number;
  dy?: number;
  anchor?: "start" | "middle" | "end";
  /** Small secondary text near the node, such as its degree. */
  note?: string;
  noteDx?: number;
  noteDy?: number;
  noteAnchor?: "start" | "middle" | "end";
  /** Accent: the node the figure's claim hinges on. */
  hl?: boolean;
  /** Drawn dashed and muted: a vertex that was removed. */
  ghost?: boolean;
  /** Stepper step that introduces this node. */
  step?: number;
  /** Categorical color 1 to 4, for colorings. */
  fill?: number;
  /**
   * Step through a ring around the node instead of the node itself, so the
   * label stays readable before its step.
   */
  ring?: boolean;
}

export interface GraphEdge {
  a: string;
  b: string;
  /** Directed from a to b. */
  dir?: boolean;
  /** Peak distance of the curve from the straight line, in px. */
  bend?: number;
  /** For a loop (a === b): direction in degrees, 0 = right, -90 = up. */
  loop?: number;
  /** Weight or label drawn on the edge. */
  w?: string | number;
  /** Moves the weight label sideways from the edge, in px. */
  wShift?: number;
  hl?: boolean;
  ghost?: boolean;
  step?: number;
  /** Route through these points with straight segments (overrides bend). */
  via?: Point[];
  /** Wide translucent band drawn under other edges, e.g. a path or tree. */
  halo?: boolean;
}

export interface FreeLabel {
  x: number;
  y: number;
  text: string;
  anchor?: "start" | "middle" | "end";
  hl?: boolean;
}

export interface Panel {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  title?: string;
  titleX?: number;
  titleY?: number;
  nodeStyle?: NodeStyle;
  nodes: GraphNode[];
  edges: GraphEdge[];
  /** Free text such as column headings, in muted mono. */
  labels?: FreeLabel[];
}

export const nodeRadius = (style: NodeStyle): number =>
  style === "circle" ? 13 : 4.5;

const round = (value: number): number => Math.round(value * 10) / 10;
const toRad = (degrees: number): number => (degrees * Math.PI) / 180;

const polar = (origin: Point, radius: number, degrees: number): Point => ({
  x: origin.x + radius * Math.cos(toRad(degrees)),
  y: origin.y + radius * Math.sin(toRad(degrees)),
});

const unit = (from: Point, to: Point): Point => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy) || 1;
  return { x: dx / length, y: dy / length };
};

const pt = (p: Point): string => `${round(p.x)},${round(p.y)}`;

export interface EdgeGeometry {
  /** SVG path data. */
  d: string;
  /** Where a weight label sits. */
  lx: number;
  ly: number;
}

/** Path for an edge between two node centres, trimmed to the node radius. */
export const edgeGeometry = (
  a: Point,
  b: Point,
  edge: GraphEdge,
  radius: number,
): EdgeGeometry => {
  if (edge.a === edge.b) {
    const angle = edge.loop ?? -90;
    const reach = radius + 34;
    const start = polar(a, radius, angle - 30);
    const end = polar(a, radius, angle + 30);
    const c1 = polar(a, reach, angle - 45);
    const c2 = polar(a, reach, angle + 45);
    const peak = 0.2165 * radius + 0.53 * reach;
    const label = polar(a, peak + 10, angle);
    return {
      d: `M${pt(start)} C${pt(c1)} ${pt(c2)} ${pt(end)}`,
      lx: round(label.x),
      ly: round(label.y),
    };
  }

  if (edge.via && edge.via.length > 0) {
    const first = edge.via[0];
    const last = edge.via[edge.via.length - 1];
    const startDir = unit(a, first);
    const endDir = unit(b, last);
    const endRadius = edge.dir ? radius + 1.5 : radius;
    const start = {
      x: a.x + startDir.x * radius,
      y: a.y + startDir.y * radius,
    };
    const end = {
      x: b.x + endDir.x * endRadius,
      y: b.y + endDir.y * endRadius,
    };
    const middle = edge.via[Math.floor(edge.via.length / 2)];
    return {
      d: `M${pt(start)} ${edge.via.map((p) => `L${pt(p)}`).join(" ")} L${pt(end)}`,
      lx: round(middle.x),
      ly: round(middle.y),
    };
  }

  const u = unit(a, b);
  const normal = { x: -u.y, y: u.x };
  const bend = edge.bend ?? 0;
  const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  const control = {
    x: mid.x + normal.x * bend * 2,
    y: mid.y + normal.y * bend * 2,
  };
  const startDir = bend ? unit(a, control) : u;
  const endDir = bend ? unit(b, control) : { x: -u.x, y: -u.y };
  const endRadius = edge.dir ? radius + 1.5 : radius;
  const start = {
    x: a.x + startDir.x * radius,
    y: a.y + startDir.y * radius,
  };
  const end = {
    x: b.x + endDir.x * endRadius,
    y: b.y + endDir.y * endRadius,
  };
  const shift = bend + (edge.wShift ?? 0);
  return {
    d: bend
      ? `M${pt(start)} Q${pt(control)} ${pt(end)}`
      : `M${pt(start)} L${pt(end)}`,
    lx: round(mid.x + normal.x * shift),
    ly: round(mid.y + normal.y * shift),
  };
};

/** n points on a circle, starting at `start` degrees (-90 = top). */
export const polygon = (
  n: number,
  cx: number,
  cy: number,
  radius: number,
  start = -90,
): Point[] =>
  Array.from({ length: n }, (_, i) => {
    const p = polar({ x: cx, y: cy }, radius, start + (360 * i) / n);
    return { x: round(p.x), y: round(p.y) };
  });

/** Nodes with the given ids placed on a circle. */
export const ring = (
  ids: string[],
  cx: number,
  cy: number,
  radius: number,
  start = -90,
): GraphNode[] =>
  polygon(ids.length, cx, cy, radius, start).map((p, i) => ({
    id: ids[i],
    ...p,
  }));

/** Every pair of ids, as undirected edges. */
export const allPairs = (ids: string[]): GraphEdge[] =>
  ids.flatMap((a, i) => ids.slice(i + 1).map((b) => ({ a, b })));

/** Consecutive ids joined in a closed cycle. */
export const cycleEdges = (ids: string[]): GraphEdge[] =>
  ids.map((a, i) => ({ a, b: ids[(i + 1) % ids.length] }));
