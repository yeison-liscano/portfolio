---
title: Functional Programming
pubDate: 2024-11-04
description:
  "A practical introduction to functional programming in Python: pure functions,
  immutability, composition, and common patterns."
tags: ["programming", "python", "functional programming"]
isDraft: false
snippet:
  language: "python"
  code: |
    from functools import reduce
    numbers = [1, 2, 3, 4]
    result = reduce(lambda acc, x: acc + x * 2, numbers, 0)
---

Functional programming (FP) is a style that models programs as transformations
of data. Instead of mutating state step by step, we build small functions and
combine them to express intent.

Python is multi-paradigm, so we can use FP ideas without writing purely
functional code all the time. In practice, this gives us readable pipelines,
testable logic, and fewer side effects.

## Why Use FP Concepts

FP principles are useful because they improve predictability.

- Pure functions are easier to test.
- Immutable data reduces accidental bugs.
- Composition helps build reusable logic.
- Stateless functions are easier to parallelize.

## Core Concepts

### Pure Functions

A pure function returns the same output for the same input and does not change
external state.

```python
def celsius_to_fahrenheit(celsius: float) -> float:
  return celsius * 9 / 5 + 32
```

No global state is modified, so the function is deterministic.

### Immutability

Immutability means creating new values instead of mutating existing ones.

```python
def add_item(items: tuple[str, ...], item: str) -> tuple[str, ...]:
  return items + (item,)
```

Using immutable structures makes data flow easier to reason about.

### Higher-Order Functions

Higher-order functions receive functions as arguments or return functions.

```python
def apply_twice(fn, value):
  return fn(fn(value))


print(apply_twice(lambda x: x + 3, 10))  # 16
```

This pattern lets us abstract behavior, not just data.

### Referential Transparency

If an expression can be replaced by its value without changing behavior, it is
referentially transparent. This simplifies debugging and refactoring.

For example, replacing `double(5)` with `10` is always safe if `double` is pure.

### Function Composition

Composition means combining small functions into larger ones.

```python
def compose(f, g):
  return lambda x: f(g(x))


strip_and_lower = compose(str.lower, str.strip)
print(strip_and_lower("  Hello  "))  # hello
```

## Useful FP Tools in Python

Python includes many features that support FP style.

### map, filter, and reduce

```python
from functools import reduce

numbers = [1, 2, 3, 4, 5]

doubled = list(map(lambda x: x * 2, numbers))
evens = list(filter(lambda x: x % 2 == 0, doubled))
total = reduce(lambda acc, x: acc + x, evens, 0)

print(doubled)  # [2, 4, 6, 8, 10]
print(evens)    # [2, 4, 6, 8, 10]
print(total)    # 30
```

List comprehensions are often more readable than `map` and `filter`, but both
approaches are valid.

### partial for Function Specialization

```python
from functools import partial


def power(base: int, exponent: int) -> int:
  return base ** exponent


square = partial(power, exponent=2)
cube = partial(power, exponent=3)

print(square(5))  # 25
print(cube(3))    # 27
```

This is close to currying and helps create reusable function variants.

## Practical Pipeline Example

Suppose we receive transactions and want the sum of valid positive amounts.

```python
from typing import Iterable


def parse_amounts(lines: Iterable[str]) -> list[float]:
  return [float(line) for line in lines if line.strip()]


def only_positive(values: Iterable[float]) -> list[float]:
  return [v for v in values if v > 0]


def total(values: Iterable[float]) -> float:
  return sum(values)


raw = ["100", "-40", "", "18.5", "-2", "7.5"]
result = total(only_positive(parse_amounts(raw)))
print(result)  # 126.0
```

Each step is small, focused, and easy to test in isolation.

## Recursion and Python

Recursion is common in FP, but Python does not optimize tail recursion. For
large inputs, iterative solutions are often safer.

Use recursion when it improves clarity, but keep Python's recursion limit in
mind.

## Common Pitfalls

- Overusing lambdas and making code harder to read.
- Forcing `reduce` when `sum` or a loop is clearer.
- Mixing pure and impure logic in the same function.
- Ignoring readability in the name of style purity.

FP is most valuable when it improves maintainability, not when it is applied as
a strict rule.

## Final Thoughts

Functional programming in Python is about disciplined data transformation. You
can gradually adopt it by writing pure helper functions, limiting mutation, and
composing operations into clear pipelines.

Used well, FP makes code easier to test, reason about, and evolve.

## References

- [HaskellWiki: Functional programming](https://wiki.haskell.org/index.php?title=Functional_programming)
- [Haskell Language](https://www.haskell.org/)
