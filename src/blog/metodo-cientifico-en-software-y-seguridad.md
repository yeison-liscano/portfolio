---
lang: "es"
title: "Método científico aplicado al desarrollo de software y la seguridad"
pubDate: 2026-10-19
description:
  "Cómo tratar los supuestos de seguridad como hipótesis falsables: el ciclo del
  método científico en el trabajo diario, cuándo el p-value ayuda y cuándo no, y
  un registro de premisas para convertir creencias en pruebas repetibles."
tags: ["security", "statistics"]
isDraft: false
snippet:
  language: "python"
  code: |
    from scipy.stats import binomtest

    def mcnemar_exacto(a, b):
        solo_a = sum(x and not y for x, y in zip(a, b))
        solo_b = sum(y and not x for x, y in zip(a, b))
        return binomtest(solo_a, solo_a + solo_b, 0.5).pvalue
---

Palabras clave: método científico, falsabilidad, hipótesis, p-value, McNemar,
threat modeling, registro de premisas

En seguridad tomamos decisiones apoyadas en supuestos: "este servicio no es
alcanzable desde fuera de la VPC", "nuestro SAST detecta inyecciones", "el token
expira en 15 minutos". Casi nadie los verifica. La idea central de este artículo
es sencilla: **toda premisa es una hipótesis hasta que la sometes a una prueba
que podría refutarla**.

## El ciclo, traducido al trabajo diario

1. **Observación**: un comportamiento o dato concreto, como un pico de errores
   403, un hallazgo del SAST o un incidente.
2. **Hipótesis falsable**: una afirmación que puede resultar falsa. "Este
   servicio es inalcanzable desde fuera de la VPC" lo es. "Nuestra arquitectura
   es segura" no.
3. **Predicción**: si la hipótesis es cierta, qué debería pasar en una prueba
   concreta, y qué resultado la refutaría.
4. **Experimento**: un test, un fuzzing, un escaneo, un ejercicio de red team o
   un benchmark, con las variables controladas.
5. **Análisis y registro**: se documentan todos los resultados, incluidos los
   negativos y los que contradicen lo esperado.
6. **Revisión por pares**: en la práctica son el code review, la revisión del
   threat model y el postmortem sin culpables.

El criterio que separa esto de una opinión es la **falsabilidad**: una
afirmación que ningún resultado posible puede contradecir no dice nada sobre el
sistema.

## Dónde aparece en la práctica

### Threat models como conjuntos de hipótesis

Cada supuesto de un threat model ("el atacante no tiene acceso al bucket", "el
token expira en 15 minutos") puede convertirse en una verificación automática
sobre la infraestructura o en un test en el pipeline de CI. Así el modelo deja
de ser un documento que envejece y pasa a ser una batería de pruebas que puede
fallar.

### Medir las herramientas en lugar de creerles

"Nuestro SAST detecta inyecciones" es una afirmación empírica. Para evaluarla
puedes sembrar vulnerabilidades conocidas en un corpus de prueba y medir el
recall y la tasa de falsos positivos de cada herramienta.

### Cambios con línea base

Antes de afirmar que una mitigación redujo el riesgo, compara contra un
baseline. Sin esa comparación se confunde correlación con causalidad: el tiempo
medio de remediación pudo bajar porque cambió el equipo, no porque cambió el
proceso.

### Postmortems y reproducibilidad

Un postmortem sólido formula hipótesis causales y busca evidencia que las
desmienta, en lugar de quedarse con la primera explicación plausible. Y un
hallazgo que no puedes reproducir con una prueba de concepto mínima no está
establecido todavía.

## ¿Entra el p-value en juego?

Sí, pero solo en una parte del trabajo. El p-value es la probabilidad de
observar datos al menos tan extremos como los tuyos **si la hipótesis nula fuera
cierta**. No es la probabilidad de que tu hipótesis sea verdadera ni de que el
resultado sea "casualidad". Ese malentendido es el más común.

### Cuándo sí aplica

Aplica cuando hay variabilidad y muestreo, y necesitas distinguir señal de
ruido:

- **Comparar herramientas** sobre el mismo corpus de vulnerabilidades.
- **Medir una mitigación**: si bajó el tiempo medio de remediación o fue
  variación normal entre sprints.
- **Detección de anomalías**: la nula es "este tráfico se comporta como la línea
  base".
- **Benchmarks y tests intermitentes**: separar un cambio real de rendimiento
  del ruido de ejecución.

### Cuándo no aplica

- **Afirmaciones deterministas**: "este endpoint es alcanzable sin
  autenticación" se confirma o se refuta con un solo caso. Una prueba de
  concepto que funciona vale más que cualquier estadística. Es la falsación de
  Popper, sin p-values.
- **El adversario no muestrea al azar**: un atacante busca precisamente el caso
  raro, así que el supuesto de datos aleatorios bajo la nula suele romperse.

### Ejemplo: comparar dos SAST con McNemar

Siembras 40 vulnerabilidades y ejecutas ambas herramientas sobre las mismas.
Como las muestras están pareadas, lo que importa son los casos **discordantes**:
los que detecta una herramienta y la otra no. El test exacto de McNemar es un
binomial sobre esos casos.

```python
from scipy.stats import binomtest


def mcnemar_exacto(a: list[bool], b: list[bool]) -> float:
    """p-value bilateral; a[i] y b[i] indican si cada SAST detectó la vuln i."""
    solo_a = sum(x and not y for x, y in zip(a, b))
    solo_b = sum(y and not x for x, y in zip(a, b))
    return binomtest(solo_a, solo_a + solo_b, 0.5).pvalue
```

Con estos resultados hipotéticos, A detecta 31 de 40 y B detecta 22. Hay 12
casos que solo detecta A y 3 que solo detecta B, así que el p-value exacto es
`2 * P(X >= 12)` con `X ~ Binomial(15, 0.5)`, que da aproximadamente 0.035. Con
α = 0.05 hay evidencia de que la diferencia no es ruido. Dos advertencias: son
datos inventados para ilustrar el cálculo, y 40 vulnerabilidades sembradas por
una sola persona es un corpus pequeño y sesgado hacia lo que esa persona
imaginó.

## Cero hallazgos: la regla del tres

Si ejecutas 300 pruebas independientes y no encuentras nada, no puedes concluir
que la tasa de fallo es cero. Con la **regla del tres**, el límite superior al
95 % de confianza es aproximadamente `3 / n`, es decir, cerca de 1 %. Es una
forma honesta de decir "no encontramos evidencia con este método" en lugar de
"está limpio".

## Trampas frecuentes

1. **Comparaciones múltiples**: si corres 40 reglas o escáneres y reportas el
   que dio p < 0.05, probablemente sea un falso positivo. Se corrige con
   Bonferroni o controlando la tasa de falsos descubrimientos (FDR).
2. **Significancia no es relevancia**: con muestras enormes, diferencias
   triviales salen significativas. Reporta el tamaño del efecto y el intervalo
   de confianza, no solo el p-value.
3. **Independencia violada**: las vulnerabilidades se agrupan por módulo y por
   autor. Tratarlas como independientes infla la confianza.
4. **Falacia de la tasa base**: con sensibilidad de 99 %, tasa de falsos
   positivos de 1 % y una prevalencia de un ataque por cada 10 000 eventos, la
   probabilidad de que una alerta sea real es de apenas 1 %. Es el teorema de
   Bayes, y es donde un enfoque bayesiano suele encajar mejor con la evaluación
   de riesgo que el frecuentista.
5. **P-hacking**: decidir el análisis después de ver los datos. Se evita
   escribiendo la hipótesis, la predicción y el criterio de refutación **antes**
   de ejecutar la prueba.

## Límites que conviene recordar

- **Las pruebas refutan, no demuestran.** Como señaló Dijkstra, probar un
  programa puede mostrar que hay errores, nunca que no los hay. La conclusión
  legítima es "no encontramos evidencia de X con este método".
- **El adversario se adapta.** El sistema no es estacionario: lo que fue cierto
  ayer puede dejar de serlo cuando el atacante cambia de táctica.
- **Goodhart.** Cuando una métrica se vuelve objetivo, deja de ser buena
  métrica. "Número de vulnerabilidades cerradas" es el ejemplo clásico.
- **Sesgo de confirmación.** Es el riesgo principal, y la mejor defensa es el
  registro previo de predicciones.

## Un método práctico para empezar: el registro de premisas

Crea una tabla con tus supuestos de seguridad y cuatro columnas:

| Afirmación                        | Impacto si es falsa | Evidencia actual         | Prueba que la refutaría                       |
| --------------------------------- | ------------------- | ------------------------ | --------------------------------------------- |
| El bucket no es accesible público | Alto                | Revisión manual hace 6 m | Test automático en CI con credenciales vacías |
| El token expira en 15 minutos     | Medio               | Configuración leída      | Usar un token vencido y esperar un rechazo    |
| El SAST detecta inyecciones SQL   | Alto                | Ninguna                  | Corpus con vulnerabilidades sembradas         |

Prioriza las filas de alto impacto y baja evidencia, y conviértelas en pruebas
repetibles que corran de forma continua. Cada vez que una falle, habrás
aprendido algo que una creencia sin verificar nunca te habría dicho.

## Resumen

El método científico es el marco general: hipótesis falsable, predicción,
experimento y revisión. La estadística, incluido el p-value, es la herramienta
para el subconjunto de preguntas donde hay ruido. Para lo determinista basta un
contraejemplo, y para lo adversarial hay que desconfiar de los supuestos
estadísticos. Lo que importa es el hábito: escribir qué esperas, qué te haría
cambiar de opinión, y buscar activamente esa evidencia.
