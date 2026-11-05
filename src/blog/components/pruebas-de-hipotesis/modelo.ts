// Caso didáctico compartido por las dos figuras. El post reproduce el cálculo.
export const nControl = 900;
export const nCupon = 900;
export const abandonosControl = 252;
export const abandonosCupon = 198;
export const pControl = abandonosControl / nControl;
export const pCupon = abandonosCupon / nCupon;
export const diferencia = pControl - pCupon;
export const agrupada =
  (abandonosControl + abandonosCupon) / (nControl + nCupon);
export const errorNulo = Math.sqrt(
  agrupada * (1 - agrupada) * (1 / nControl + 1 / nCupon),
);
export const z = diferencia / errorNulo;
export const estimationError = Math.sqrt(
  (pControl * (1 - pControl)) / nControl + (pCupon * (1 - pCupon)) / nCupon,
);
export const margen = 1.959963984540054 * estimationError;
export const inferior = diferencia - margen;
export const superior = diferencia + margen;
export const formato = (valor: number, decimales = 2) =>
  valor.toFixed(decimales).replace(".", ",");
