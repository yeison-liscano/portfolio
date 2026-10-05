/**
 * Greedy coloring of the crown graph (K4,4 minus a perfect matching) in a
 * chosen vertex order. Shared by the server render and the browser script
 * of ColoracionVoraz.
 */

export const LADO_A = ["a1", "a2", "a3", "a4"];
export const LADO_B = ["b1", "b2", "b3", "b4"];

/** ai and bj are adjacent exactly when i and j differ. */
export const ARISTAS_CORONA: [string, string][] = LADO_A.flatMap((a, i) =>
  LADO_B.filter((_, j) => i !== j).map((b): [string, string] => [a, b]),
);

export const ORDENES: { id: string; nombre: string; orden: string[] }[] = [
  {
    id: "intercalado",
    nombre: "a1, b1, a2, b2, …",
    orden: ["a1", "b1", "a2", "b2", "a3", "b3", "a4", "b4"],
  },
  {
    id: "por-lados",
    nombre: "a1, a2, a3, a4, b1, …",
    orden: [...LADO_A, ...LADO_B],
  },
];

const vecinos = (v: string): string[] =>
  ARISTAS_CORONA.flatMap(([x, y]) => (x === v ? [y] : y === v ? [x] : []));

/** Each vertex, in order, takes the smallest color its neighbors lack. */
export const voraz = (orden: string[]): Record<string, number> => {
  const color: Record<string, number> = {};
  orden.forEach((v) => {
    const usados = new Set(vecinos(v).map((u) => color[u]));
    let c = 1;
    while (usados.has(c)) c += 1;
    color[v] = c;
  });
  return color;
};

export const totalColores = (color: Record<string, number>): number =>
  new Set(Object.values(color)).size;
