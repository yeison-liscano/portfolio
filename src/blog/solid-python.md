---
title: SOLID Python
pubDate: 2026-03-22
description:
  "The five SOLID design principles applied to Python. Practical examples of
  SRP, OCP, LSP, ISP, and DIP to write cleaner, more maintainable code."
tags: ["programming", "python", "design-patterns"]
isDraft: false
snippet:
  language: "python"
  code: |
    from abc import ABC, abstractmethod
    class Animal(ABC):
        @abstractmethod
        def make_sound(self) -> str:
            pass
---

The SOLID principles are five design guidelines that help developers write code
that is more understandable, flexible, and maintainable. Coined by Robert C.
Martin, these principles form the foundation of object-oriented design and are
applicable across programming languages, including Python. This article explores
each principle with practical Python examples that demonstrate how to apply them
in real-world scenarios.

## SRP: Single Responsibility Principle

> A class should have only one reason to change.

In other words, a class should have only one responsibility or job. This
principle helps to keep classes small, focused, and maintainable. When a class
has multiple responsibilities, changes to one responsibility can inadvertently
break another, making the code harder to test and understand.

Consider a class that handles both user authentication and sending email
notifications. If the authentication logic needs to change, and the email logic
also needs to change, the class becomes a point of conflict. By separating these
concerns into distinct classes, each can evolve independently.

Here's a before-and-after example:

```python
# BEFORE: Violates SRP
class User:
    def __init__(self, email: str, password: str):
        self.email = email
        self.password = password

    def authenticate(self, provided_password: str) -> bool:
        # Authentication logic
        return self.password == provided_password

    def send_welcome_email(self):
        # Email logic mixed with user logic
        print(f"Sending welcome email to {self.email}")
        return True


# AFTER: Follows SRP
class User:
    def __init__(self, email: str, password: str):
        self.email = email
        self.password = password

    def authenticate(self, provided_password: str) -> bool:
        return self.password == provided_password


class EmailService:
    @staticmethod
    def send_welcome_email(user: User):
        print(f"Sending welcome email to {user.email}")
        return True
```

The refactored version gives each class a single, clear responsibility. User
handles authentication, while EmailService handles email operations. This makes
testing easier (you can mock the email service) and allows either responsibility
to change independently.

**Why it matters:** Single responsibility makes code easier to test, reuse, and
modify without unintended side effects.

---

## OCP: Open/Closed Principle

> Software entities should be open for extension but closed for modification.

This principle encourages designing systems so that new functionality can be
added without changing existing code. Instead of modifying a class to support
new behavior, you extend it through inheritance, composition, or abstraction.
This reduces the risk of breaking existing functionality and makes codebases
more stable.

In Python, the Open/Closed Principle is elegantly expressed through abstract
base classes (ABC) and polymorphism. By defining an interface (abstract class),
you allow different implementations to be "plugged in" without modifying the
core logic that uses them.

Consider a payment processing system that needs to support multiple payment
methods:

```python
from abc import ABC, abstractmethod


# BEFORE: Violates OCP - requires modification for each new payment type
class PaymentProcessor:
    def process(self, payment_type: str, amount: float) -> bool:
        if payment_type == "credit_card":
            return self._process_credit_card(amount)
        elif payment_type == "paypal":
            return self._process_paypal(amount)
        elif payment_type == "bitcoin":
            return self._process_bitcoin(amount)
        else:
            raise ValueError(f"Unknown payment type: {payment_type}")

    def _process_credit_card(self, amount: float) -> bool:
        print(f"Processing credit card payment of ${amount}")
        return True

    def _process_paypal(self, amount: float) -> bool:
        print(f"Processing PayPal payment of ${amount}")
        return True

    def _process_bitcoin(self, amount: float) -> bool:
        print(f"Processing Bitcoin payment of ${amount}")
        return True


# AFTER: Follows OCP - extensible without modification
class PaymentMethod(ABC):
    @abstractmethod
    def process(self, amount: float) -> bool:
        pass


class CreditCardPayment(PaymentMethod):
    def process(self, amount: float) -> bool:
        print(f"Processing credit card payment of ${amount}")
        return True


class PayPalPayment(PaymentMethod):
    def process(self, amount: float) -> bool:
        print(f"Processing PayPal payment of ${amount}")
        return True


class BitcoinPayment(PaymentMethod):
    def process(self, amount: float) -> bool:
        print(f"Processing Bitcoin payment of ${amount}")
        return True


class PaymentProcessor:
    def __init__(self, payment_method: PaymentMethod):
        self.payment_method = payment_method

    def process(self, amount: float) -> bool:
        return self.payment_method.process(amount)


# Using it:
processor = PaymentProcessor(CreditCardPayment())
processor.process(100.00)

# To add a new payment method, simply create a new class:
class ApplePayPayment(PaymentMethod):
    def process(self, amount: float) -> bool:
        print(f"Processing Apple Pay payment of ${amount}")
        return True

processor = PaymentProcessor(ApplePayPayment())
processor.process(50.00)
```

The refactored version is closed for modification—the PaymentProcessor class
doesn't change when you add new payment methods—and open for extension through
the PaymentMethod abstraction. This follows the Strategy pattern, a classic way
to implement OCP.

**Why it matters:** Open/Closed Principle reduces regression risks and allows
your codebase to grow without constant refactoring of existing code.

---

## LSP: Liskov Substitution Principle

> Subtypes must be substitutable for their base types without breaking the
> application.

This principle ensures that derived classes can be used in place of their base
classes without causing errors or unexpected behavior. If a function expects a
base class, passing a derived class should work seamlessly. Violating LSP
typically results in type checking or conditional logic that defeats the purpose
of polymorphism.

A classic example involves geometric shapes. While a square is technically a
rectangle mathematically, in object-oriented design, if Rectangle allows
independent width and height changes but Square requires them to be equal,
substituting a Square for a Rectangle will cause problems.

```python
# BEFORE: Violates LSP
class Rectangle:
    def __init__(self, width: float, height: float):
        self._width = width
        self._height = height

    def set_width(self, width: float):
        self._width = width

    def set_height(self, height: float):
        self._height = height

    def get_area(self) -> float:
        return self._width * self._height


class Square(Rectangle):
    def set_width(self, width: float):
        self._width = width
        self._height = width  # Enforce square property

    def set_height(self, height: float):
        self._width = height
        self._height = height  # Enforce square property


# This breaks LSP:
def calculate_area(shape: Rectangle) -> float:
    shape.set_width(5)
    shape.set_height(4)
    expected_area = 20
    actual_area = shape.get_area()
    assert actual_area == expected_area  # This fails if shape is a Square!
    return actual_area


# AFTER: Follows LSP
from abc import ABC, abstractmethod


class Shape(ABC):
    @abstractmethod
    def get_area(self) -> float:
        pass


class Rectangle(Shape):
    def __init__(self, width: float, height: float):
        self._width = width
        self._height = height

    def set_width(self, width: float):
        self._width = width

    def set_height(self, height: float):
        self._height = height

    def get_area(self) -> float:
        return self._width * self._height


class Square(Shape):
    def __init__(self, side: float):
        self._side = side

    def set_side(self, side: float):
        self._side = side

    def get_area(self) -> float:
        return self._side ** 2


def calculate_area(shape: Shape) -> float:
    area = shape.get_area()
    return area


# Now both can be used safely:
rect = Rectangle(5, 4)
rect.set_width(5)
rect.set_height(4)
assert rect.get_area() == 20

square = Square(5)
square.set_side(5)
assert square.get_area() == 25
```

In the corrected version, Rectangle and Square are both concrete implementations
of Shape. They don't try to substitute for each other inappropriately; each is
designed to work correctly with its own interface. This allows polymorphic usage
without breaking contracts.

**Why it matters:** LSP ensures that inheritance hierarchies are logically sound
and that polymorphism works as intended without surprises.

---

## ISP: Interface Segregation Principle

> Clients should not depend on interfaces they do not use.

This principle suggests creating many focused, client-specific interfaces rather
than one monolithic interface. If a class is forced to implement methods it
doesn't need, the implementation becomes bloated and changes in unrelated
methods can affect unrelated clients.

In Python, this is best expressed using abstract base classes (ABC) or Protocols
that define narrow, specific contracts. Each implementation only depends on the
methods it actually uses.

```python
# BEFORE: Violates ISP
from abc import ABC, abstractmethod


class Worker(ABC):
    @abstractmethod
    def work(self):
        pass

    @abstractmethod
    def eat_lunch(self):
        pass


class HumanWorker(Worker):
    def work(self):
        print("Human working...")

    def eat_lunch(self):
        print("Human eating lunch...")


class RobotWorker(Worker):
    def work(self):
        print("Robot working...")

    def eat_lunch(self):
        # Robots don't eat! But they're forced to implement this.
        raise NotImplementedError("Robots don't eat")


# AFTER: Follows ISP
class Workable(ABC):
    @abstractmethod
    def work(self):
        pass


class Eatable(ABC):
    @abstractmethod
    def eat_lunch(self):
        pass


class HumanWorker(Workable, Eatable):
    def work(self):
        print("Human working...")

    def eat_lunch(self):
        print("Human eating lunch...")


class RobotWorker(Workable):
    def work(self):
        print("Robot working...")
    # No need to implement eat_lunch


# Using them:
def start_work(worker: Workable):
    worker.work()


def lunch_break(eater: Eatable):
    eater.eat_lunch()


human = HumanWorker()
start_work(human)
lunch_break(human)

robot = RobotWorker()
start_work(robot)
# lunch_break(robot)  # Type error - robot is not Eatable, which is correct!
```

By segregating the Worker interface into smaller, focused interfaces (Workable
and Eatable), each class only implements what it needs. This prevents robot
implementations from being forced to handle eating, and it makes the code's
intent clearer.

**Why it matters:** Interface Segregation keeps implementations lean and
prevents classes from being burdened with methods they don't use.

---

## DIP: Dependency Inversion Principle

> High-level modules should depend on abstractions, not low-level modules. Both
> should depend on abstractions.

This principle reverses the typical dependency direction in traditional layered
architectures. Instead of high-level business logic depending on low-level
utility classes, both depend on shared abstractions. This reduces coupling and
makes swapping implementations easier, especially for testing.

Dependency injection is the primary technique for implementing DIP in Python.
Rather than a class creating its own dependencies, they're provided (injected)
from outside.

```python
# BEFORE: Violates DIP
class EmailService:
    def send(self, email: str, message: str):
        print(f"Sending email to {email}: {message}")


class SMSService:
    def send(self, phone: str, message: str):
        print(f"Sending SMS to {phone}: {message}")


class Notifier:
    def __init__(self):
        # High-level module depends directly on low-level modules
        self.email_service = EmailService()
        self.sms_service = SMSService()

    def notify_user(self, user_type: str, contact: str, message: str):
        if user_type == "email":
            self.email_service.send(contact, message)
        elif user_type == "sms":
            self.sms_service.send(contact, message)


# AFTER: Follows DIP
from abc import ABC, abstractmethod


class NotificationService(ABC):
    @abstractmethod
    def send(self, contact: str, message: str):
        pass


class EmailService(NotificationService):
    def send(self, email: str, message: str):
        print(f"Sending email to {email}: {message}")


class SMSService(NotificationService):
    def send(self, phone: str, message: str):
        print(f"Sending SMS to {phone}: {message}")


class PushNotificationService(NotificationService):
    def send(self, device_id: str, message: str):
        print(f"Sending push notification to {device_id}: {message}")


class Notifier:
    def __init__(self, service: NotificationService):
        # Depend on abstraction, not concrete class
        self.service = service

    def notify_user(self, contact: str, message: str):
        self.service.send(contact, message)


# Using it:
email_notifier = Notifier(EmailService())
email_notifier.notify_user("user@example.com", "Hello!")

sms_notifier = Notifier(SMSService())
sms_notifier.notify_user("+1234567890", "Hello!")

push_notifier = Notifier(PushNotificationService())
push_notifier.notify_user("device123", "Hello!")


# Testing is now easy - inject a mock:
class MockNotificationService(NotificationService):
    def __init__(self):
        self.messages = []

    def send(self, contact: str, message: str):
        self.messages.append((contact, message))


mock_service = MockNotificationService()
test_notifier = Notifier(mock_service)
test_notifier.notify_user("test@example.com", "Test message")
assert len(mock_service.messages) == 1
```

The refactored version inverts dependencies. The Notifier class (high-level
module) doesn't create or depend on concrete EmailService or SMSService;
instead, it depends on the NotificationService abstraction. This allows you to
inject any NotificationService implementation, making the code flexible and
testable.

**Why it matters:** Dependency Inversion decouples high-level business logic
from low-level implementation details, making your code more testable, flexible,
and resilient to change.

---

## Applying SOLID Together

These five principles work best as a cohesive set. A project that follows all of
them tends to be:

- **Modular**: Each class has a clear, focused purpose (SRP).
- **Extensible**: New features can be added without modifying existing code
  (OCP).
- **Predictable**: Derived classes behave as their base classes expect (LSP).
- **Focused**: Classes only depend on methods they use (ISP).
- **Decoupled**: High-level logic doesn't depend on implementation details
  (DIP).

While strict adherence to SOLID isn't always necessary for small scripts or
prototypes, investing in these principles early pays dividends in larger,
evolving codebases. Python's flexibility and support for abstractions (ABC,
Protocols, duck typing) make implementing SOLID principles straightforward.

---

## References

- Python Software Foundation. "abc — Abstract Base Classes." Python
  Documentation. <https://docs.python.org/3/library/abc.html>
- Curso de Patrones de Diseño y SOLID en Python. Platzi.
  <https://platzi.com/cursos/solid-python/>
