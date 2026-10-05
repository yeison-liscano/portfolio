/**
 * Classifies a vertex sequence in the example graph of part IV as a path,
 * circuit, simple or not, using the definitions in the post. Shared by the
 * server render and the browser script of CaminoExplorer.
 */

export const VERTICES_CAMINO = ["a", "b", "c", "d", "e", "f"];

export const ARISTAS_CAMINO: [string, string][] = [
  ["a", "b"],
  ["b", "c"],
  ["a", "d"],
  ["a", "e"],
  ["d", "c"],
  ["b", "e"],
  ["c", "f"],
  ["d", "e"],
  ["e", "f"],
];

export const EJEMPLOS = [
  ["a", "d", "c", "f", "e"],
  ["d", "e", "c", "a"],
  ["b", "c", "f", "e", "b"],
  ["a", "b", "e", "d", "a", "b"],
];

/** The data-edge key the drawing uses for the edge {u, v}, if it exists. */
export const claveArista = (u: string, v: string): string | null => {
  const arista = ARISTAS_CAMINO.find(
    ([x, y]) => (x === u && y === v) || (x === v && y === u),
  );
  return arista ? `${arista[0]}-${arista[1]}` : null;
};

export interface Clasificacion {
  texto: string;
  /** data-edge keys of the edges walked before any invalid step. */
  aristas: string[];
}

export const clasificar = (secuencia: string[]): Clasificacion => {
  if (secuencia.length === 0) {
    return { texto: "Elige un vértice para empezar.", aristas: [] };
  }
  const n = secuencia.length - 1;
  if (n === 0) {
    return {
      texto: `Camino de longitud 0: solo el vértice ${secuencia[0]}.`,
      aristas: [],
    };
  }
  const aristas: string[] = [];
  for (let i = 1; i <= n; i += 1) {
    const [u, v] = [secuencia[i - 1], secuencia[i]];
    const clave = claveArista(u, v);
    if (!clave) {
      return {
        texto: `No es un camino: {${u}, ${v}} no es una arista del grafo.`,
        aristas,
      };
    }
    aristas.push(clave);
  }
  const repetida = aristas.find((clave, i) => aristas.indexOf(clave) !== i);
  const cerrado = secuencia[0] === secuencia[n];
  const tipo = cerrado ? "Circuito" : "Camino";
  const extremos = cerrado
    ? `que empieza y termina en ${secuencia[0]}`
    : `de ${secuencia[0]} a ${secuencia[n]}`;
  if (repetida) {
    const [x, y] = repetida.split("-");
    return {
      texto: `${tipo} de longitud ${n} ${extremos}, no simple: repite la arista {${x}, ${y}}.`,
      aristas,
    };
  }
  return { texto: `${tipo} simple de longitud ${n} ${extremos}.`, aristas };
};
