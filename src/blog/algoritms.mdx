---
title: Classic Algorithms Explained
pubDate: 2026-03-22
description:
  "An exploration of essential algorithms including Karatsuba multiplication,
  binary search, sorting algorithms, and graph traversal—with practical Python
  implementations and complexity analysis."
tags: ["programming", "algorithms"]
isDraft: false
snippet:
  language: "python"
  code: |
    def binary_search(arr, target):
        left, right = 0, len(arr) - 1
        while left <= right:
            mid = (left + right) // 2
            if arr[mid] == target:
                return mid
            elif arr[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        return -1
---

Let's dive into some of the most important algorithms in computer science.
Whether you're preparing for technical interviews, optimizing code, or just
curious about how software works under the hood, understanding these classics is
essential. We'll explore what each algorithm does, why it matters, and how to
implement it.

## Karatsuba Multiplication

Multiplying two numbers might seem straightforward—just use the `*` operator,
right? But when you're dealing with very large numbers (thousands or millions of
digits), the naive approach becomes inefficient. That's where Karatsuba
multiplication comes in.

### What It Does

Karatsuba multiplication is a divide-and-conquer algorithm that multiplies two
n-digit numbers faster than the grade-school method. Instead of doing a single
O(n²) multiplication, it breaks the problem into smaller pieces and recombines
them cleverly.

The key insight: to multiply two 2-digit numbers `xy` and `ab`, you can use
three multiplications instead of four:

- Instead of computing all four products from scratch, you reuse intermediate
  results
- This reduces the number of recursive multiplications needed

### Time Complexity

- **Time:** O(n^log₂(3)) ≈ O(n^1.585) — much better than O(n²) for large numbers
- **Space:** O(n) for storing intermediate results

### Python Implementation

```python
def karatsuba(x, y):
    """
    Multiply two integers using Karatsuba algorithm.

    Args:
        x, y: integers to multiply

    Returns:
        The product x * y
    """
    # Base case: small numbers, use standard multiplication
    if x < 10 or y < 10:
        return x * y

    # Determine the number of digits
    n = max(len(str(x)), len(str(y)))
    m = n // 2

    # Split the numbers
    # x = x_high * 10^m + x_low
    # y = y_high * 10^m + y_low
    x_high, x_low = divmod(x, 10**m)
    y_high, y_low = divmod(y, 10**m)

    # Recursive multiplications
    z0 = karatsuba(x_low, y_low)
    z2 = karatsuba(x_high, y_high)
    z1 = karatsuba(x_high + x_low, y_high + y_low) - z0 - z2

    # Combine results
    return z2 * (10 ** (2 * m)) + z1 * (10 ** m) + z0

# Example usage
print(karatsuba(1234, 5678))  # Output: 7006652
```

### Why It Matters

For cryptography and big integer arithmetic (common in blockchain and scientific
computing), Karatsuba provides a significant speedup. Python's native `int` type
uses algorithms like Karatsuba internally for efficient large number
multiplication.

---

## Binary Search

If you've ever searched through a sorted dictionary, you were doing binary
search in your head. This is one of the most elegant algorithms—simple to
understand, powerful in practice.

### How Binary Search Works

Binary search finds a target value in a **sorted array** by repeatedly dividing
the search interval in half. At each step, you compare the middle element to
your target and eliminate half the remaining elements.

### Binary Search Complexity

- **Time:** O(log n) — incredibly fast even for huge datasets
- **Space:** O(1) for iterative version; O(log n) for recursive (call stack)

### Binary Search in Python

```python
def binary_search(arr, target):
    """
    Find target in a sorted array.

    Args:
        arr: sorted list of comparable elements
        target: value to find

    Returns:
        Index of target if found, -1 otherwise
    """
    left, right = 0, len(arr) - 1

    while left <= right:
        mid = (left + right) // 2

        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            # Target is in the right half
            left = mid + 1
        else:
            # Target is in the left half
            right = mid - 1

    return -1  # Not found

# Example usage
numbers = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
print(binary_search(numbers, 7))   # Output: 3
print(binary_search(numbers, 10))  # Output: -1
```

### Why Binary Search Matters

Binary search is the foundation of many database and systems techniques. Any
time you need to search a sorted collection—from database indexes to finding the
insertion point in a data structure—binary search principles apply. It's O(log
n) elegance in action.

---

## Merge Sort

Merge sort is a **stable**, **divide-and-conquer** sorting algorithm that
consistently delivers O(n log n) performance, regardless of input. It's widely
used in practice and forms the basis of timsort (used in Python).

### How Merge Sort Works

Merge sort divides an array into single-element arrays (which are trivially
sorted), then merges them back together in sorted order. The merge step is where
the magic happens—combining two sorted arrays into one sorted array in linear
time.

### Merge Sort Complexity

- **Time:** O(n log n) in all cases (best, average, worst)
- **Space:** O(n) — requires extra space for merging

### Merge Sort in Python

```python
def merge_sort(arr):
    """
    Sort array using merge sort algorithm.

    Args:
        arr: list to sort

    Returns:
        Sorted list
    """
    if len(arr) <= 1:
        return arr

    # Divide
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])

    # Conquer (merge)
    return merge(left, right)

def merge(left, right):
    """
    Merge two sorted lists into one sorted list.
    """
    result = []
    i = j = 0

    # Compare elements from left and right, add smaller
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    # Add remaining elements
    result.extend(left[i:])
    result.extend(right[j:])

    return result

# Example usage
data = [38, 27, 43, 3, 9, 82, 10]
print(merge_sort(data))  # Output: [3, 9, 10, 27, 38, 43, 82]
```

### Why Merge Sort Matters

Merge sort's consistent O(n log n) performance and stability (equal elements
maintain relative order) make it ideal for:

- Sorting linked lists (no random access needed)
- External sorting (sorting data larger than RAM)
- Any scenario where worst-case guarantee matters

---

## Quicksort

Quicksort is the practical workhorse of sorting algorithms. While its worst-case
is O(n²), its average O(n log n) performance and in-place sorting make it the
default choice in many languages.

### How Quicksort Works

Quicksort uses **divide-and-conquer** by selecting a pivot element and
partitioning the array around it. Elements smaller than the pivot go left;
larger go right. Recursively sort each partition.

### Quicksort Complexity

- **Time:** O(n log n) average; O(n²) worst case (poor pivot selection)
- **Space:** O(log n) average (call stack); O(n) worst case

### Quicksort in Python

```python
def quicksort(arr):
    """
    Sort array using quicksort algorithm (in-place variant).

    Args:
        arr: list to sort

    Returns:
        Sorted list
    """
    if len(arr) <= 1:
        return arr

    # Choose pivot (using middle element for better average case)
    pivot = arr[len(arr) // 2]

    # Partition into three groups
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]

    # Recursively sort and combine
    return quicksort(left) + middle + quicksort(right)

def quicksort_inplace(arr, low=0, high=None):
    """
    In-place variant of quicksort (more memory efficient).

    Args:
        arr: list to sort
        low, high: subarray boundaries
    """
    if high is None:
        high = len(arr) - 1

    if low < high:
        # Partition and get pivot position
        pivot_index = partition(arr, low, high)
        # Recursively sort left and right
        quicksort_inplace(arr, low, pivot_index - 1)
        quicksort_inplace(arr, pivot_index + 1, high)

    return arr

def partition(arr, low, high):
    """Partition array around pivot."""
    pivot = arr[high]
    i = low - 1

    for j in range(low, high):
        if arr[j] < pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]

    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

# Example usage
data = [64, 34, 25, 12, 22, 11, 90]
print(quicksort(data))  # Output: [11, 12, 22, 25, 34, 64, 90]
```

### Why Quicksort Matters

Quicksort's in-place sorting and cache efficiency make it the standard in
production systems. Most modern languages use quicksort or variants (timsort,
introsort) as their default sorting algorithm. Understanding the partition step
is crucial for many interview questions.

---

## Breadth-First Search (BFS)

Breadth-First Search is a graph traversal algorithm that explores all vertices
at distance k before exploring vertices at distance k+1. It's essential for
finding shortest paths, connected components, and level-order traversals.

Given the depth of BFS and graph algorithms in general, we've covered this
thoroughly in our
**[dedicated graphs and graph algorithms article](/blog/graphs)**, including
implementation, applications, and comparison with Depth-First Search.

BFS is a foundation for more advanced techniques like Dijkstra's algorithm
(shortest path), level-order tree traversal, and multi-source shortest path
problems.

---

## When to Use Each Algorithm

| Algorithm         | Best For                                      | Key Advantage                    |
| ----------------- | --------------------------------------------- | -------------------------------- |
| **Karatsuba**     | Very large integer multiplication             | Faster than naive O(n²) approach |
| **Binary Search** | Searching sorted data                         | Logarithmic O(log n) complexity  |
| **Merge Sort**    | Need consistent O(n log n); stability matters | Guaranteed performance, stable   |
| **Quicksort**     | General-purpose sorting                       | Fast average case, in-place      |
| **BFS**           | Shortest paths, level-order exploration       | Explores by distance layers      |

---

## References

- **Introduction to Algorithms (CLRS)** — Cormen, Leiserson, Rivest, Stein. MIT
  Press. The definitive algorithms textbook covering all these algorithms in
  depth.

- **Khan Academy: Algorithms Course** —
  <https://www.khanacademy.org/computing/computer-science/algorithms>. Free,
  interactive explanations of classic algorithms with visualizations.

- **Python Documentation: Time Complexity** —
  <https://wiki.python.org/moin/TimeComplexity>. Official Python performance
  characteristics for built-in data structures and operations.

- **Visualgo: Algorithm Visualizer** — <https://visualgo.net/>. Interactive
  visualizations of sorting, searching, and graph algorithms in action.

- **Big-O Cheat Sheet** — <https://www.bigocheatsheet.com/>. Quick reference for
  time and space complexity of common algorithms.
