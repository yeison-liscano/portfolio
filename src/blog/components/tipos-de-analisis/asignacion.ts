/**
 * Coupon allocation for the running example of the post on the four types
 * of analytics. Shared by the server render and the browser script of
 * AsignacionCupones.
 *
 * Each segment carries what the earlier phases produced: `riesgo` comes from
 * the predictive model and `efecto` from the A/B test. The prescriptive step
 * chooses how many coupons each segment gets within a budget.
 */

export interface Segmento {
  nombre: string;
  /** Customers in the segment. */
  clientes: number;
  /** Predicted probability of leaving in the next 90 days. */
  riesgo: number;
  /** Drop in that probability when the customer gets a coupon. */
  efecto: number;
  /** Margin kept for each customer who stays. */
  valor: number;
}

export const COSTO_CUPON = 5;

export const SEGMENTOS: Segmento[] = [
  {
    nombre: "Queja reciente",
    clientes: 200,
    riesgo: 0.4,
    efecto: 0.15,
    valor: 150,
  },
  {
    nombre: "Nuevos sin 2.ª compra",
    clientes: 400,
    riesgo: 0.35,
    efecto: 0.08,
    valor: 90,
  },
  {
    nombre: "Inactivos 60+ días",
    clientes: 300,
    riesgo: 0.6,
    efecto: 0.02,
    valor: 100,
  },
  {
    nombre: "Sensibles al precio",
    clientes: 350,
    riesgo: 0.25,
    efecto: 0.1,
    valor: 80,
  },
  {
    nombre: "Mayoristas",
    clientes: 150,
    riesgo: 0.15,
    efecto: 0.04,
    valor: 400,
  },
  {
    nombre: "Frecuentes satisfechos",
    clientes: 500,
    riesgo: 0.05,
    efecto: 0.004,
    valor: 160,
  },
];

export type Estrategia = "optima" | "riesgo";

export const PRESUPUESTO_MAX =
  SEGMENTOS.reduce((sum, s) => sum + s.clientes, 0) * COSTO_CUPON;

/** Margin protected by one coupon, minus what the coupon costs. */
export const netoPorCupon = (s: Segmento): number =>
  s.efecto * s.valor - COSTO_CUPON;

export interface Resultado {
  /** Coupons per segment, in the order of SEGMENTOS. */
  cupones: number[];
  costo: number;
  retenidos: number;
  margen: number;
  neto: number;
}

/**
 * "optima" solves the linear program max Σ k_i · neto_i subject to
 * Σ k_i · costo ≤ presupuesto and 0 ≤ k_i ≤ clientes_i. Every coupon costs the
 * same, so filling segments by net benefit per coupon, and skipping those
 * where it is not positive, is optimal (fractional knapsack).
 * "riesgo" spends the budget on the highest predicted risk first.
 */
export const asignar = (
  presupuesto: number,
  estrategia: Estrategia,
): Resultado => {
  const indices = SEGMENTOS.map((_, i) => i);
  const orden =
    estrategia === "optima"
      ? indices
          .filter((i) => netoPorCupon(SEGMENTOS[i]) > 0)
          .sort(
            (a, b) => netoPorCupon(SEGMENTOS[b]) - netoPorCupon(SEGMENTOS[a]),
          )
      : indices.sort((a, b) => SEGMENTOS[b].riesgo - SEGMENTOS[a].riesgo);

  const { cupones } = orden.reduce(
    (acc, i) => {
      const k = Math.min(SEGMENTOS[i].clientes, acc.restante / COSTO_CUPON);
      const cupones = [...acc.cupones];
      cupones[i] = k;
      return { restante: acc.restante - k * COSTO_CUPON, cupones };
    },
    { restante: presupuesto, cupones: SEGMENTOS.map(() => 0) },
  );

  const retenidos = cupones.reduce(
    (sum, k, i) => sum + k * SEGMENTOS[i].efecto,
    0,
  );
  const margen = cupones.reduce(
    (sum, k, i) => sum + k * SEGMENTOS[i].efecto * SEGMENTOS[i].valor,
    0,
  );
  const costo = cupones.reduce((sum, k) => sum + k * COSTO_CUPON, 0);
  return { cupones, costo, retenidos, margen, neto: margen - costo };
};

/**
 * Spanish digit grouping (RAE): four-digit numbers stay together (2500);
 * longer ones group by threes with a non-breaking space (12 580).
 */
export const miles = (value: number): string => {
  const digits = Math.round(value).toString();
  return digits.length <= 4
    ? digits
    : digits.replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0");
};

export const dinero = (value: number): string =>
  value < 0 ? `−$${miles(-value)}` : `$${miles(value)}`;

export const porcentaje = (value: number): string =>
  `${Math.round(value * 100)} %`;
