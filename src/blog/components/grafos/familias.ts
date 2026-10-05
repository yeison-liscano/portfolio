/**
 * Special families of simple graphs (K_n, C_n, W_n, Q_n): drawing, degrees
 * and bipartition. Pure functions shared by the server render and the
 * browser script of FamiliasExplorer.
 */

export type Familia = "K" | "C" | "W" | "Q";

export const FAMILIAS: { id: Familia; nombre: string }[] = [
  { id: "K", nombre: "Completo Kₙ" },
  { id: "C", nombre: "Ciclo Cₙ" },
  { id: "W", nombre: "Rueda Wₙ" },
  { id: "Q", nombre: "Hipercubo Qₙ" },
];

export const RANGOS: Record<Familia, { min: number; max: number }> = {
  K: { min: 1, max: 8 },
  C: { min: 3, max: 10 },
  W: { min: 3, max: 10 },
  Q: { min: 1, max: 4 },
};

export const ANCHO = 320;
export const ALTO = 250;
const CX = ANCHO / 2;
const CY = 122;
const RADIO = 100;

interface Punto {
  x: number;
  y: number;
  etiqueta?: string;
}

interface Dibujo {
  puntos: Punto[];
  aristas: [number, number][];
  /** Side (0 or 1) of each vertex in a bipartition, or null. */
  parte: number[] | null;
  razon: string;
}

const SUB = "₀₁₂₃₄₅₆₇₈₉";
const subindice = (n: number): string =>
  String(n)
    .split("")
    .map((d) => SUB[Number(d)])
    .join("");

export const nombre = (f: Familia, n: number): string => `${f}${subindice(n)}`;

const circulo = (n: number): Punto[] =>
  Array.from({ length: n }, (_, i) => {
    const t = -Math.PI / 2 + (2 * Math.PI * i) / n;
    return { x: CX + RADIO * Math.cos(t), y: CY + RADIO * Math.sin(t) };
  });

const popcount = (value: number): number =>
  value.toString(2).replace(/0/g, "").length;

const hipercubo = (n: number): Dibujo => {
  const vectores = [
    [1, 0],
    [0, 1],
    [0.42, -0.42],
    [1.75, 0.3],
  ];
  const total = 2 ** n;
  const crudos = Array.from({ length: total }, (_, v) => {
    let x = 0;
    let y = 0;
    for (let bit = 0; bit < n; bit += 1) {
      if (v & (1 << bit)) {
        x += vectores[bit][0];
        y += vectores[bit][1];
      }
    }
    return { x, y };
  });
  const xs = crudos.map((p) => p.x);
  const ys = crudos.map((p) => p.y);
  const [minX, maxX] = [Math.min(...xs), Math.max(...xs)];
  const [minY, maxY] = [Math.min(...ys), Math.max(...ys)];
  const escala = Math.min(
    130,
    (ANCHO - 90) / (maxX - minX || 1),
    (ALTO - 80) / (maxY - minY || 1),
  );
  const mx = (minX + maxX) / 2;
  const my = (minY + maxY) / 2;
  const puntos = crudos.map((p, v) => ({
    x: CX + (p.x - mx) * escala,
    y: CY + (p.y - my) * escala,
    etiqueta: n > 3 ? undefined : v.toString(2).padStart(n, "0"),
  }));
  const aristas: [number, number][] = [];
  for (let u = 0; u < total; u += 1) {
    for (let bit = 0; bit < n; bit += 1) {
      const v = u ^ (1 << bit);
      if (u < v) aristas.push([u, v]);
    }
  }
  return {
    puntos,
    aristas,
    parte: puntos.map((_, v) => popcount(v) % 2),
    razon: "las cadenas con un número par de unos forman un lado",
  };
};

export const construir = (f: Familia, n: number): Dibujo => {
  if (f === "Q") return hipercubo(n);
  if (f === "K") {
    const puntos = n === 1 ? [{ x: CX, y: CY }] : circulo(n);
    const aristas: [number, number][] = [];
    for (let i = 0; i < n; i += 1) {
      for (let j = i + 1; j < n; j += 1) aristas.push([i, j]);
    }
    const bip = n <= 2;
    return {
      puntos,
      aristas,
      parte: bip ? puntos.map((_, i) => i % 2) : null,
      razon: bip
        ? "cada arista une los dos lados"
        : "tres vértices cualesquiera forman un triángulo",
    };
  }
  const borde = circulo(n);
  const ciclo: [number, number][] = borde.map((_, i) => [i, (i + 1) % n]);
  if (f === "C") {
    const par = n % 2 === 0;
    return {
      puntos: borde,
      aristas: ciclo,
      parte: par ? borde.map((_, i) => i % 2) : null,
      razon: par
        ? "los vértices se alternan entre los dos lados"
        : "el propio ciclo tiene longitud impar",
    };
  }
  return {
    puntos: [...borde, { x: CX, y: CY }],
    aristas: [...ciclo, ...borde.map((_, i): [number, number] => [n, i])],
    parte: null,
    razon: "el centro y dos vecinos del borde forman un triángulo",
  };
};

export interface Resumen {
  nombre: string;
  vertices: number;
  aristas: number;
  grados: string;
  suma: string;
  bipartito: string;
}

export const resumir = (f: Familia, n: number): Resumen => {
  const dibujo = construir(f, n);
  const grados = dibujo.puntos.map(() => 0);
  dibujo.aristas.forEach(([u, v]) => {
    grados[u] += 1;
    grados[v] += 1;
  });
  const cuenta = new Map<number, number>();
  grados.forEach((g) => cuenta.set(g, (cuenta.get(g) ?? 0) + 1));
  const partes = [...cuenta.entries()]
    .sort(([a], [b]) => a - b)
    .map(([g, veces]) =>
      veces === 1
        ? `1 vértice de grado ${g}`
        : `${veces} vértices de grado ${g}`,
    );
  const suma = grados.reduce((total, g) => total + g, 0);
  const e = dibujo.aristas.length;
  return {
    nombre: nombre(f, n),
    vertices: dibujo.puntos.length,
    aristas: e,
    grados: partes.join(" y "),
    suma: `${suma} = 2 · ${e}`,
    bipartito: `${dibujo.parte ? "Sí" : "No"}: ${dibujo.razon}`,
  };
};

const r1 = (value: number): string => value.toFixed(1);

/** SVG markup (edges, then vertices) for the inside of the drawing. */
export const marcado = (f: Familia, n: number): string => {
  const { puntos, aristas, parte } = construir(f, n);
  const lineas = aristas
    .map(
      ([u, v]) =>
        `<line class="fam-arista" x1="${r1(puntos[u].x)}" y1="${r1(puntos[u].y)}" x2="${r1(puntos[v].x)}" y2="${r1(puntos[v].y)}"></line>`,
    )
    .join("");
  const nodos = puntos
    .map((p, i) => {
      const lado = parte ? ` data-lado="${parte[i]}"` : "";
      const circulo = `<circle class="fam-nodo"${lado} cx="${r1(p.x)}" cy="${r1(p.y)}" r="5.5"></circle>`;
      if (!p.etiqueta) return circulo;
      const dx = p.x - CX;
      const dy = p.y - CY;
      const largo = Math.hypot(dx, dy) || 1;
      const tx = p.x + (dx / largo) * 18;
      const ty = p.y + (dy / largo) * 16;
      return `${circulo}<text class="fam-etiqueta" x="${r1(tx)}" y="${r1(ty)}">${p.etiqueta}</text>`;
    })
    .join("");
  return lineas + nodos;
};
