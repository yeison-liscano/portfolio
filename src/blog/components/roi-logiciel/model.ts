export const initialCosts = 30_000;
export const plannedBenefits = 45_000;

export const evaluate = (costs: number, realization: number) => {
  const benefits = (plannedBenefits * realization) / 100;
  return {
    benefits,
    net: benefits - costs,
    roi: ((benefits - costs) / costs) * 100,
  };
};

export const money = (value: number) =>
  value.toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });

export const percent = (value: number) =>
  `${value.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %`;
