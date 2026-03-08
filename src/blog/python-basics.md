---
title: Python Basics
pubDate: 2024-10-26
description: "Python is a great language for beginners and experts alike.
    Let's explore the basics of Python.
    From modules, packages, scope, and more.
    Let's dive in!"
tags: ["python"]
snippet:
  language: "python"
  code: "def outer():\n
    x = 'local'\n
    def inner():\n
        nonlocal x\n
        x = 'nonlocal'\n
    inner()\n\n
if __name__ == '__main__':\n
    outer()"
---

The simplicity of Python makes the language a great option for almost everyone
aiming to use programming in any field. This is the reason Python is widely
used in the industry, from web development, data science, machine learning,
automation, scientific computing, and more. Having a huge community, and a vast
number of libraries, Python is a great choice for beginners and experts alike.

In this post, we will explore some of the best features of Python, and how you
can use them to your advantage.

## Modules

A module is a file containing Python definitions and statements.
The file name is the module name with the suffix `.py` appended.
Within a module, the module's name (as a string) is available as the value of
the global variable `__name__`.

A module can be imported by another program to make use of its functionality.
We can define our most used functions in a module and import it,
instead of copying their definitions into different programs.

### if `__name__ == "__main__"`

You will often see this construct in Python files.
This is used to execute some code only if the file was run directly,
and not imported. That is, if the file is imported, the code is not run.
This is because when you import a module, the code in the module is executed,
just like any other script. So if we want to have some code that we only
want to run when the module is run directly, we can use this construct.

```python
def main():
    print("Running as script!")

# execute only if run as a script
if __name__ == "__main__":
    main()
```

## Packages

A package is a hierarchical file directory structure that defines a single
Python application environment that consists of modules and subpackages
and sub-subpackages, and so on.

A package must contain a special file called `__init__.py` in order for Python
to consider it as a package. This file can be left empty but we generally place
the initialization code for that package in this file.

```python
# __init__.py
# In a package directory, you would use relative imports:
# from . import module1, module2, module3
print("Package initialized!")
```

Doing this will allow us to use namespaced modules, such as
`package.module1`, `package.module2`, etc.

## Scope

Scopes are the contexts in which names are looked up.
There are four different scopes in Python: `local`, `enclosing`, `global`,
and `built-in`.

The scope of a name defines the area of the program where you can unambiguously
access that name, such as variables, functions, objects, and so on.
It is determined by the place where it is declared.

Names that are declared outside of all functions are in the `global` scope.
This means that those names can be accessed inside or outside of functions.

Names that are declared inside a function are in the `local` scope, and can only
be accessed inside that function.

The `enclosing` scope is a special scope that only exists for nested functions.
If the local scope is an inner or nested function, then the enclosing scope is
the scope of the outer or enclosing function.

The `built-in` scope is the outermost scope in Python, and it is the scope that
contains all of the built-in names in Python. The built-in scope is searched
last, after the local, enclosing, and global scopes (LEGB).

### Example Global Scope

```python
x = 10

def my_func():
    print(x)

my_func()
print(x)
```

```bash
10
10
```

### Example Local Scope

```python
def my_func():
    x_ = 10
    print(x_)

my_func()
try:
    print(x_)
except NameError as e:
    print(e)
```

```bash
10
Traceback (most recent call last):
  File "scope.py", line 7, in <module>
    print(x_)
NameError: name 'x_' is not defined
```

### Example Enclosing Scope

```python
def outer():
    x = 'local'

    def inner():
        nonlocal x
        x = 'nonlocal'
        print('inner:', x)

    inner()
    print('outer:', x)

outer()
```

```bash
inner: nonlocal
outer: nonlocal
```

Note that the `nonlocal` keyword is used to declare that `x` is not a local
variable. Hence, when we assign a value to `x` inside the nested function,
that change is reflected in the local variable in the enclosing function.

### Example Global Scope Only-read

```python
x = 10

def my_func():
    x = 20
    print(x)

my_func()
print(x)
```

```bash
20
10
```

### Example Keyword `global`

```python
x = 10

def my_func():
    global x
    x = 20
    print(x)

my_func()
print(x)
```

```bash
20
20
```

Note that the `global` keyword is used to declare that `x` is a global
variable - hence, when we assign a value to `x` inside the function,
that change is reflected when we use the value of `x` in the main block.

### Built-in Scope

These are the names in the pre-defined built-in modules. These are always
available in your Python programs.
You can see the list of built-in names by typing `dir(__builtins__)`
in the Python interpreter.

## Splat Operator `*` and Double Splat Operator `**`

Splat operator is a kind of unpacking operator (destructuring in JS).
It can be used to allow an iterable to be unpacked into positional arguments
in a function call. It can also be used to unpack an iterable into a list or
dictionary. The splat operator is represented by `*` and the double splat
operator is represented by `**`.

### Splat Operator

```python
def add(x, y):
    return x + y

numbers = [3, 5]
print(add(*numbers)) # 8
```

### Double Splat Operator

```python
def display_names(first, second):
    print(f'{first} says hello to {second}')

names = {"first": "John", "second": "Bob"}
display_names(**names) # John says hello to Bob
```

## Multiple Arguments

```python
def print_everything(*args):
    for count, thing in enumerate(args):
        print('{0}. {1}'.format(count, thing))

print_everything('apple', 'banana', 'cabbage')
```

```bash
0. apple
1. banana
2. cabbage
```

## Keyword Arguments

```python
def table_things(**kwargs):
    for name, value in kwargs.items():
        print('{0} = {1}'.format(name, value))

table_things(apple='fruit', cabbage='vegetable')
```

```bash
apple = fruit
cabbage = vegetable
```

## Unpacking Arguments

```python
def print_three_things(a, b, c):
    print('a = {0}, b = {1}, c = {2}'.format(a, b, c))

my_list = ['aardvark', 'baboon', 'cat']
print_three_things(*my_list)

my_dict = {'a': 'apple', 'b': 'banana', 'c': 'cherry'}
print_three_things(**my_dict)
```

```bash
a = aardvark, b = baboon, c = cat
a = apple, b = banana, c = cherry
```

## Positional and keyword arguments (\*args, \*\*kwargs)

```python
def func(*args, **kwargs):
    print(args)
    print(kwargs)

func(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, a=1, b=2, c=3)
```

```bash
(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
{'a': 1, 'b': 2, 'c': 3}
```
