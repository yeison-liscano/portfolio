---
title: Dynamic Programming
pubDate: 2026-03-22
description:
  "Learn how dynamic programming works, when to use it, and how to model
  solutions using top-down memoization and bottom-up tabulation."
tags: ["programming", "dynamic programming"]
isDraft: false
snippet:
  language: "python"
  code: |
    def fib(n):
      dp = [0, 1]
      for i in range(2, n + 1):
        dp.append(dp[i - 1] + dp[i - 2])
      return dp[n]
---

Dynamic programming is a powerful technique used to solve complex problems by
breaking them down into simpler sub-problems and reusing partial results.

It is built on two ideas:

- **Optimal substructure**: the best answer for a problem can be built from the
  best answers of smaller sub-problems.
- **Overlapping sub-problems**: the same smaller problems appear repeatedly.

When both conditions hold, dynamic programming can reduce an exponential
solution into a polynomial one.

## Why Dynamic Programming Matters

Many algorithms re-compute the same values over and over. Dynamic programming
stores those intermediate results so each one is computed only once.

This often gives large performance gains:

- Time: from $O(2^n)$ to $O(n)$ or $O(n^2)$ in many classic cases.
- Space: additional memory is used to save computed states.

The key trade-off is clear: we spend memory to save time.

## A Useful Mental Model

To solve a dynamic programming problem, define the following pieces first:

1. **State**: what sub-problem are you solving?
2. **Transition**: how does one state depend on previous states?
3. **Base cases**: what states are already known?
4. **Answer**: which state represents the final solution?

If you can clearly write these four parts, implementation becomes much easier.

## Top-Down Approach (Memoization)

Top-down dynamic programming starts with the final question and recursively
solves smaller questions, caching answers as they are discovered.

### Fibonacci with Memoization

```python
from functools import lru_cache


@lru_cache(maxsize=None)
def fibonacci(n: int) -> int:
  if n <= 1:
    return n
  return fibonacci(n - 1) + fibonacci(n - 2)


print(fibonacci(10))  # 55
```

Using a cache avoids repeated calls like `fibonacci(5)` being computed many
times.

## Bottom-Up Approach (Tabulation)

Bottom-up dynamic programming starts from base cases and iteratively builds
toward the final answer.

### Fibonacci with Tabulation

```python
def fibonacci(n: int) -> int:
  if n <= 1:
    return n

  dp = [0] * (n + 1)
  dp[1] = 1

  for i in range(2, n + 1):
    dp[i] = dp[i - 1] + dp[i - 2]

  return dp[n]


print(fibonacci(10))  # 55
```

This version avoids recursion overhead and is often preferred in performance
sensitive paths.

## Space Optimization Example

Some dynamic programming transitions only depend on a few previous states. In
that case, you can store only those values.

```python
def fibonacci(n: int) -> int:
  if n <= 1:
    return n

  prev2, prev1 = 0, 1
  for _ in range(2, n + 1):
    prev2, prev1 = prev1, prev1 + prev2

  return prev1
```

This reduces space from $O(n)$ to $O(1)$.

## Another Classic Problem: Minimum Coin Change

Problem: given coin values and a target amount, find the minimum number of coins
needed to make that amount.

State definition:

- `dp[a]` = minimum number of coins to make amount `a`.

Transition:

- `dp[a] = min(dp[a], dp[a - coin] + 1)` for each valid `coin`.

```python
def min_coins(coins: list[int], amount: int) -> int:
  inf = amount + 1
  dp = [inf] * (amount + 1)
  dp[0] = 0

  for a in range(1, amount + 1):
    for coin in coins:
      if coin <= a:
        dp[a] = min(dp[a], dp[a - coin] + 1)

  return dp[amount] if dp[amount] != inf else -1


print(min_coins([1, 3, 4], 6))  # 2 (3 + 3)
```

## Common Pitfalls

- Defining the wrong state.
- Forgetting base cases.
- Missing transitions.
- Using mutable default arguments in recursive functions.
- Not checking memory usage when the state space is large.

## How to Decide If DP Applies

Ask these questions:

1. Can the problem be split into smaller versions of itself?
2. Do those smaller versions repeat?
3. Can I combine smaller optimal answers into a larger optimal answer?

If the answer is yes to all three, dynamic programming is likely a good fit.

## Final Thoughts

Dynamic programming is not one algorithm, but a way of thinking. Once you
practice state design and transitions, many hard problems become manageable and
systematic to solve.
