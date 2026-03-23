---
title: Graphs Theory
pubDate: 2026-03-22
description:
  "An introduction to graph theory. From the Königsberg bridge problem to BFS,
  DFS, and practical graph representations in Python."
tags: ["programming", "algorithms"]
isDraft: true
snippet:
  language: "python"
  code: |
    # Adjacency list representation
    graph = {
        'A': ['B', 'C'],
        'B': ['A', 'D'],
        'C': ['A', 'D'],
        'D': ['B', 'C']
    }
---

## The Königsberg Bridge Problem

The Königsberg bridge problem is a famous problem in graph theory that was
solved by the Swiss mathematician Leonhard Euler in 1736. The problem is named
after the city of Königsberg, which is now Kaliningrad, Russia. The city is
located on the Pregel River and is divided into four landmasses by the river and
its two tributaries. The city had seven bridges that connected the landmasses.

The problem asked a deceptively simple question: Is it possible to take a walk
through the city that crosses each bridge exactly once and returns to the
starting point?

Euler approached this problem by abstracting away the geographical details and
representing it mathematically. He thought of the four landmasses as vertices
(or nodes) and the seven bridges as edges connecting these vertices. This
abstraction transformed a geography problem into what we now call a graph theory
problem.

Euler proved that no such walk exists by analyzing the degree of each vertex—the
number of edges connected to it. He showed that for such an Eulerian circuit to
exist, every vertex must have an even degree. In Königsberg, all four landmasses
had odd degrees, making the desired walk impossible. This elegant proof not only
solved the puzzle but also birthed an entirely new field of mathematics: graph
theory, originally called "geometry of position."

## What is a Graph?

A graph is a mathematical structure that consists of a set of vertices (also
called nodes) and a set of edges that connect the vertices. More formally:

**A graph G = (V, E)** where:

- **V** is a finite set of vertices
- **E** is a set of edges, where each edge connects two vertices

Graphs are used to model relationships between objects or entities in various
fields, including computer science, mathematics, social sciences, biology, and
more. You can think of them as a collection of points (vertices) connected by
lines (edges)—non-linear data structures that excel at representing complex
relationships.

Graphs are everywhere in the real world. Social networks represent people as
vertices and friendships as edges. Maps use vertices for cities and edges for
roads. Computer networks use vertices for devices and edges for connections.
Understanding graphs and how to work with them is essential for any programmer.

## Types of Graphs

Graphs come in many varieties, each suited for different types of problems.
Understanding these distinctions is crucial for choosing the right graph
representation and algorithm for your use case.

### Directed vs. Undirected Graphs

An **undirected graph** has edges with no direction. If there's an edge between
vertex A and vertex B, you can traverse from A to B and from B to A. Social
networks where friendship is mutual are typically modeled as undirected graphs.

A **directed graph** (or digraph) has edges with a direction associated with
them, often represented by arrows. An edge from A to B means you can go from A
to B, but not necessarily from B to A. Following someone on Twitter creates a
directed graph because following is not necessarily mutual.

### Weighted vs. Unweighted Graphs

An **unweighted graph** treats all edges as equal. Each edge simply indicates a
connection between two vertices.

A **weighted graph** assigns a numerical value (weight) to each edge. These
weights might represent costs, distances, capacities, or any other relevant
metric. Road networks are typically weighted graphs where edge weights represent
distances or travel times between cities.

### Cyclic vs. Acyclic Graphs

A **cyclic graph** contains one or more cycles—paths that start and end at the
same vertex without repeating any edge. Most real-world graphs contain cycles.

An **acyclic graph** contains no cycles. A special type of acyclic graph is a
**Directed Acyclic Graph (DAG)**, which is extremely useful in practice. DAGs
are used to represent dependencies, task scheduling, and causal relationships.

## Graph Representations

There are several ways to represent a graph in code. The choice of
representation depends on the graph's characteristics (dense vs. sparse) and the
operations you need to perform.

### Adjacency Matrix

An adjacency matrix is a 2D array where each cell (i, j) indicates whether
there's an edge between vertex i and vertex j. For unweighted graphs, the value
is typically 1 (edge exists) or 0 (no edge). For weighted graphs, the cell
contains the weight.

**Advantages:**

- Fast lookup: O(1) to check if edge (i, j) exists
- Simple to implement
- Efficient for dense graphs

**Disadvantages:**

- Uses O(V²) space regardless of the number of edges
- Inefficient for sparse graphs (mostly empty matrix)

**Python example:**

```python
# Adjacency matrix for an undirected graph with 4 vertices
# Vertices labeled 0, 1, 2, 3
adjacency_matrix = [
    [0, 1, 1, 0],  # Vertex 0 connects to 1, 2
    [1, 0, 0, 1],  # Vertex 1 connects to 0, 3
    [1, 0, 0, 1],  # Vertex 2 connects to 0, 3
    [0, 1, 1, 0]   # Vertex 3 connects to 1, 2
]

# Check if there's an edge between vertex 0 and 1
has_edge = adjacency_matrix[0][1] == 1  # True

# For a weighted graph:
weighted_matrix = [
    [0, 5, 3, 0],
    [5, 0, 0, 2],
    [3, 0, 0, 1],
    [0, 2, 1, 0]
]
```

### Adjacency List

An adjacency list represents a graph as a collection where each vertex is
associated with a list of its neighboring vertices. This is the most common
representation for sparse graphs.

**Advantages:**

- Uses O(V + E) space, efficient for sparse graphs
- Fast iteration over neighbors of a vertex
- More intuitive for many algorithms

**Disadvantages:**

- Checking if a specific edge exists requires iterating through the neighbor
  list: O(degree of vertex)

**Python example:**

```python
# Adjacency list using a dictionary
# Keys are vertices, values are lists of neighbors
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D'],
    'C': ['A', 'D'],
    'D': ['B', 'C']
}

# For a weighted graph, use tuples or dictionaries:
weighted_graph = {
    'A': [('B', 5), ('C', 3)],
    'B': [('A', 5), ('D', 2)],
    'C': [('A', 3), ('D', 1)],
    'D': [('B', 2), ('C', 1)]
}

# Using a dictionary of dictionaries for weights:
weighted_graph_alt = {
    'A': {'B': 5, 'C': 3},
    'B': {'A': 5, 'D': 2},
    'C': {'A': 3, 'D': 1},
    'D': {'B': 2, 'C': 1}
}

# Iterate over neighbors of vertex 'A'
for neighbor in graph['A']:
    print(neighbor)  # B, C

# Check if A has an edge to B
has_edge = 'B' in graph['A']  # True
```

## Graph Traversal Algorithms

Traversing a graph means visiting all or some vertices in a systematic way. Two
fundamental traversal algorithms are breadth-first search and depth-first
search.

### Breadth-First Search (BFS)

Breadth-first search explores a graph level by level. Starting from a source
vertex, it visits all immediate neighbors before moving to their neighbors. BFS
uses a queue data structure and is particularly useful for finding shortest
paths in unweighted graphs.

**Key characteristics:**

- Explores vertices in order of distance from the source
- Guarantees shortest path in unweighted graphs
- Time complexity: O(V + E)
- Space complexity: O(V)

**Python implementation:**

```python
from collections import deque

def bfs(graph, start):
    """
    Perform breadth-first search starting from a given vertex.

    Args:
        graph: Adjacency list representation
        start: Starting vertex

    Returns:
        List of vertices in BFS order
    """
    visited = set()
    queue = deque([start])
    visited.add(start)
    result = []

    while queue:
        vertex = queue.popleft()
        result.append(vertex)

        # Visit all unvisited neighbors
        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

    return result

# Example usage
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E']
}

print(bfs(graph, 'A'))  # Output: ['A', 'B', 'C', 'D', 'E', 'F']
```

BFS is ideal for:

- Finding shortest paths in unweighted graphs
- Social network analysis (degrees of separation)
- Level-order traversal of trees
- Checking bipartiteness of a graph

### Depth-First Search (DFS)

Depth-first search explores a graph by going as deep as possible along each
branch before backtracking. DFS uses a stack data structure (often implemented
through recursion) and is useful for detecting cycles, topological sorting, and
finding connected components.

**Key characteristics:**

- Explores deeply into the graph before backtracking
- Can detect cycles in directed graphs
- Time complexity: O(V + E)
- Space complexity: O(V) for recursion stack

**Python implementation (recursive):**

```python
def dfs_recursive(graph, vertex, visited=None):
    """
    Perform depth-first search using recursion.

    Args:
        graph: Adjacency list representation
        vertex: Current vertex to visit
        visited: Set of already visited vertices

    Returns:
        List of vertices in DFS order
    """
    if visited is None:
        visited = set()

    visited.add(vertex)
    result = [vertex]

    for neighbor in graph[vertex]:
        if neighbor not in visited:
            result.extend(dfs_recursive(graph, neighbor, visited))

    return result

# Iterative implementation using a stack
def dfs_iterative(graph, start):
    """
    Perform depth-first search using iteration.

    Args:
        graph: Adjacency list representation
        start: Starting vertex

    Returns:
        List of vertices in DFS order
    """
    visited = set()
    stack = [start]
    result = []

    while stack:
        vertex = stack.pop()
        if vertex not in visited:
            visited.add(vertex)
            result.append(vertex)
            # Add neighbors to stack (in reverse for expected order)
            stack.extend(reversed(graph[vertex]))

    return result

# Example usage
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E']
}

print(dfs_recursive(graph, 'A'))  # Output: ['A', 'B', 'D', 'E', 'F', 'C']
print(dfs_iterative(graph, 'A'))  # Output: ['A', 'B', 'D', 'E', 'F', 'C']
```

DFS is ideal for:

- Detecting cycles in graphs
- Finding connected components
- Topological sorting of DAGs
- Solving maze problems
- Checking graph connectivity

## Common Graph Problems

### Shortest Path

The shortest path problem asks: What is the minimum-cost path between two
vertices? For unweighted graphs, BFS solves this optimally. For weighted graphs
(with non-negative weights), Dijkstra's algorithm is the standard solution. For
graphs with negative weights, the Bellman-Ford algorithm is required.

### Cycle Detection

Detecting whether a graph contains cycles is fundamental in many applications.
For undirected graphs, DFS can detect cycles by checking if we reach an
already-visited vertex (other than the parent). For directed graphs, we track
vertices in the current recursion path to detect back edges that indicate
cycles.

### Topological Sort

A topological sort is an ordering of vertices in a directed acyclic graph such
that for every directed edge (u, v), u comes before v in the ordering. This is
invaluable for dependency resolution, build systems, and task scheduling.
DFS-based approaches can compute topological sorts efficiently.

## Practical Applications

Graphs are not just theoretical constructs—they power real-world systems:

**Social Networks**: Vertices represent people, edges represent relationships.
Graph algorithms identify communities, suggest friends, and analyze influence
spreading.

**Maps and Routing**: Vertices are locations, weighted edges are distances or
travel times. Shortest path algorithms like Dijkstra's power navigation systems.

**Dependency Resolution**: Build systems and package managers use DAGs to
represent dependencies. Topological sorting ensures correct build order and
detects circular dependencies.

**Recommendation Systems**: User-item graphs model preferences. Graph algorithms
identify similar users or items.

**Computer Networks**: Routers and links form a graph. Algorithms optimize
routing and detect network failures.

**Flight Networks**: Airports and flights form a weighted graph. Shortest path
algorithms find cheap or quick routes.

## Conclusion

Graphs are a fundamental data structure in computer science, with applications
spanning from social networks to compiler design. Understanding graph
representations and fundamental algorithms like BFS and DFS is essential for
solving complex problems efficiently.

Whether you're building a social network, routing packets through a network,
resolving dependencies in a build system, or analyzing relationships in data,
graphs provide an elegant mathematical model. Mastering graph theory opens doors
to solving problems that might otherwise seem impossibly complex.

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009).
  _Introduction to Algorithms_ (3rd ed.). MIT Press.
- TED-Ed. "How the Königsberg bridge problem changed mathematics."
  <https://ed.ted.com/lessons/how-the-konigsberg-bridge-problem-changed-mathematics-dan-van-der-vieren>
- NetworkX Python library documentation. <https://networkx.org/>
- Rosen, K. H. (2018). _Discrete Mathematics and Its Applications_ (8th ed.).
  McGraw-Hill.
