---
lang: "es"
title: "Método científico aplicado al desarrollo de software y la seguridad"
pubDate: 2026-10-19
description:
  "Cómo tratar los supuestos de seguridad como hipótesis falsables: el ciclo del
  método científico en el trabajo diario, sus límites y un registro de premisas
  para convertir creencias en pruebas repetibles."
tags: ["security", "programming"]
isDraft: false
snippet:
  language: "python"
  code: |
    def test_token_expira_a_los_15_minutos():
        token = emitir_token(ttl_segundos=900)
        reloj.avanzar(segundos=901)
        assert api.get("/me", token=token).status == 401
---

Palabras clave: método científico, falsabilidad, hipótesis, threat modeling,
registro de premisas

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
fallar. El test del inicio de este artículo es exactamente eso: la hipótesis "el
token expira a los 15 minutos" escrita de forma que pueda ser refutada.

### Medir las herramientas en lugar de creerles

"Nuestro SAST detecta inyecciones" es una afirmación empírica. Para evaluarla
puedes sembrar vulnerabilidades conocidas en un corpus de prueba y comprobar
cuáles detecta la herramienta y cuáles no. Lo que no detecta es información
valiosa sobre sus límites.

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

### Un contraejemplo vale más que mil confirmaciones

Algunas afirmaciones de seguridad son deterministas: "este endpoint es
alcanzable sin autenticación" se confirma o se refuta con un solo caso. Una
prueba de concepto que funciona basta. Es la idea de falsación de Popper
aplicada directamente: ninguna cantidad de pruebas favorables demuestra que el
sistema es seguro, pero un solo caso adverso demuestra que no lo es.

## Límites que conviene recordar

- **Las pruebas refutan, no demuestran.** Como señaló Dijkstra, probar un
  programa puede mostrar que hay errores, nunca que no los hay. La conclusión
  legítima es "no encontramos evidencia de X con este método", no "X no existe".
- **El adversario se adapta.** El sistema no es estacionario: lo que fue cierto
  ayer puede dejar de serlo cuando el atacante cambia de táctica, así que las
  hipótesis necesitan revalidarse de forma continua.
- **Goodhart.** Cuando una métrica se vuelve objetivo, deja de ser buena
  métrica. "Número de vulnerabilidades cerradas" es el ejemplo clásico.
- **Sesgo de confirmación.** Es el riesgo principal. La mejor defensa es
  escribir la hipótesis, la predicción y el criterio de refutación **antes** de
  ejecutar la prueba, para no ajustarlos después de ver el resultado.

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

El método científico es un marco simple: formular hipótesis falsables, predecir
qué debería ocurrir, ponerlas a prueba, registrar todos los resultados y
someterlos a revisión. Aplicado a la seguridad, convierte los supuestos
implícitos en pruebas repetibles. Lo que importa es el hábito: escribir qué
esperas, qué te haría cambiar de opinión, y buscar activamente esa evidencia.
