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
expira en 15 minutos". Si no los verificamos, pueden convertirse en puntos
ciegos. La idea central de este artículo es sencilla: **toda premisa es una
hipótesis hasta que la sometes a una prueba que podría refutarla**.

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
afirmación empírica que ningún resultado posible puede contradecir no ofrece un
criterio de prueba. Los requisitos normativos y las propiedades demostradas
formalmente se evalúan de otras maneras.

## Dónde aparece en la práctica

### Threat models como conjuntos de hipótesis

Muchos supuestos de un threat model ("el atacante no tiene acceso al bucket",
"el token expira en 15 minutos") pueden convertirse en una verificación
automática sobre la infraestructura o en un test en el pipeline de CI. Así el
modelo deja de ser un documento que envejece y pasa a ser una batería de pruebas
que puede fallar. El test del inicio de este artículo es exactamente eso: la
hipótesis "el token expira a los 15 minutos" escrita de forma que pueda ser
refutada.

### Medir las herramientas en lugar de creerles

"Nuestro SAST detecta inyecciones" es una afirmación empírica. Para evaluarla
puedes sembrar vulnerabilidades conocidas en un corpus de prueba y comprobar
cuáles detecta la herramienta y cuáles no. Lo que no detecta es información
valiosa sobre sus límites.

### Cambios con línea base

Antes de afirmar que una mitigación redujo el riesgo, compara contra un
baseline. Una línea base ayuda a interpretar el cambio, pero una comparación
antes/después no basta para establecer causalidad: el tiempo medio de
remediación pudo bajar porque cambió el equipo, no porque cambió el proceso.

### Postmortems y reproducibilidad

Un postmortem sólido formula hipótesis causales y busca evidencia que las
desmienta, en lugar de quedarse con la primera explicación plausible. Una prueba
de concepto reproducible fortalece la evidencia, pero un incidente también puede
establecerse con registros, trazas o evidencia forense aunque no sea posible
repetirlo. Hay que documentar la incertidumbre restante.

### Un contraejemplo vale más que mil confirmaciones

Una afirmación universal como «este endpoint nunca acepta peticiones sin
autenticación» queda refutada por una petición no autenticada que sí funciona.
En cambio, una petición rechazada no prueba que ningún otro intento pueda
funcionar. El contraejemplo demuestra que esa propiedad concreta falla en las
condiciones probadas; no clasifica toda la seguridad del sistema.

## Límites que conviene recordar

- **Una batería finita de pruebas no suele demostrar ausencia de errores.** La
  conclusión debe limitarse a las condiciones evaluadas. Las verificaciones
  exhaustivas de modelos finitos y las pruebas formales pueden demostrar
  propiedades dentro de sus modelos y supuestos.
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

| Afirmación                        | Impacto si es falsa | Evidencia actual         | Resultado que la refutaría                |
| --------------------------------- | ------------------- | ------------------------ | ----------------------------------------- |
| El bucket no es accesible público | Alto                | Revisión manual hace 6 m | Leer el bucket sin autorización           |
| El token expira en 15 minutos     | Medio               | Configuración leída      | Obtener acceso con un token vencido       |
| El SAST detecta inyecciones SQL   | Alto                | Ninguna                  | Omitir una inyección del corpus de prueba |

Prioriza las filas de alto impacto y baja evidencia, y conviértelas en pruebas
repetibles que corran de forma continua. Cada vez que una falle, habrás
aprendido algo que una creencia sin verificar nunca te habría dicho.

## Resumen

El método científico es un marco simple: formular hipótesis falsables, predecir
qué debería ocurrir, ponerlas a prueba, registrar todos los resultados y
someterlos a revisión. Aplicado a la seguridad, convierte los supuestos
implícitos en pruebas repetibles. Lo que importa es el hábito: escribir qué
esperas, qué te haría cambiar de opinión, y buscar activamente esa evidencia.
