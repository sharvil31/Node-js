# Thenable Objects in JavaScript

## 1. What Are Thenable Objects?

A **Thenable** is any JavaScript object or function that has a callable `.then()` method.

In simple words, an object is called thenable if it provides a `then()` method that allows it to behave like a Promise.

Thenables are important because JavaScript Promises can work with them, even if they are not actual native Promise instances.

### Example

```javascript
const thenable = {
  then: function (resolve, reject) {
    resolve("Hello from Thenable!");
  },
};
```

In this example:

- `thenable` is a normal JavaScript object.
- It contains a `then()` method.
- The `then()` method accepts `resolve` and `reject` callbacks.
- Calling `resolve()` fulfills the operation.

Although this is not a native Promise, it behaves similarly to one.

---

## 2. Understanding the Thenable Structure

A thenable generally implements a `then()` method that accepts two callback functions:

```javascript
then(resolve, reject) {
    // Perform an operation

    resolve(value); // Successfully completed

    // OR

    reject(error); // Operation failed
}
```

### Parameters

| Parameter | Description                                      |
| --------- | ------------------------------------------------ |
| `resolve` | Callback used to indicate successful completion. |
| `reject`  | Callback used to indicate failure.               |

These callbacks are provided by the Promise mechanism when it interacts with the thenable.

---

## 3. How Does a Thenable Work with Promises?

JavaScript provides a mechanism called the **Promise Resolution Procedure**.

When you pass a thenable to `Promise.resolve()`, JavaScript checks whether the object has a callable `.then()` method.

If it does, the Promise adopts the eventual state of that thenable.

### Example

```javascript
const thenable = {
  then: function (resolve, reject) {
    resolve("Operation successful!");
  },
};

Promise.resolve(thenable).then((result) => {
  console.log(result);
});
```

**Output:**

```text
Operation successful!
```

### Explanation

1. `Promise.resolve()` receives the thenable object.
2. JavaScript identifies its callable `then()` method.
3. The thenable's `then()` method is invoked.
4. The `resolve()` callback is called.
5. The resulting Promise fulfills with the resolved value.

Even though the original object is not a Promise, `Promise.resolve()` creates a native Promise that adopts its behavior.

---

## 4. Difference Between Promise and Thenable

| Feature                   | Promise                      | Thenable                                   |
| ------------------------- | ---------------------------- | ------------------------------------------ |
| Definition                | Built-in JavaScript object   | Any object with a callable `then()` method |
| `.then()`                 | Available                    | Available                                  |
| `.catch()`                | Available                    | Not necessarily                            |
| `.finally()`              | Available                    | Not necessarily                            |
| Internal states           | Pending, fulfilled, rejected | No required internal state                 |
| Native JavaScript support | Built-in                     | Interoperates with Promises                |
| `async/await` support     | Yes                          | Yes                                        |

**Important:**

- Every native Promise is thenable.
- Not every thenable is a native Promise.

A thenable only needs to implement a callable `then()` method to participate in Promise interoperability.

---

## 5. Thenable with Async/Await

One interesting feature of JavaScript is that `async/await` also supports thenable objects.

You do not need to provide an actual Promise to use `await`.

### Example

```javascript
const thenable = {
  then: function (resolve, reject) {
    resolve("Data received successfully!");
  },
};

async function getData() {
  const result = await thenable;

  console.log(result);
}

getData();
```

**Output:**

```text
Data received successfully!
```

### Explanation

When JavaScript encounters:

```javascript
const result = await thenable;
```

It checks whether the value is a thenable.

If it has a callable `then()` method, JavaScript uses that method to determine when the operation completes.

The execution of the async function continues after the thenable fulfills or rejects.

---

## 6. Thenable with setTimeout

Thenables can also represent asynchronous operations.

### Example

```javascript
const thenable = {
  then: function (resolve, reject) {
    setTimeout(() => {
      resolve("Data loaded after 2 seconds!");
    }, 2000);
  },
};

async function fetchData() {
  console.log("Fetching data...");

  const result = await thenable;

  console.log(result);
}

fetchData();
```

**Output:**

```text
Fetching data...
Data loaded after 2 seconds!
```

### Explanation

1. `fetchData()` starts executing.
2. The message `Fetching data...` is printed.
3. JavaScript encounters `await thenable`.
4. The thenable schedules a callback using `setTimeout()`.
5. After two seconds, `resolve()` is called.
6. The async function resumes and prints the result.

This demonstrates how a custom thenable can represent an asynchronous operation.

---

## 7. Creating a Custom Thenable

We can create our own thenable object by implementing a `then()` method.

### Example

```javascript
const customThenable = {
  then(resolve, reject) {
    const success = true;

    if (success) {
      resolve("Task completed!");
    } else {
      reject("Something went wrong!");
    }
  },
};

customThenable.then(
  (result) => console.log(result),
  (error) => console.log(error),
);
```

**Output:**

```text
Task completed!
```

### Important Observation

The custom thenable does not automatically provide:

- `.catch()`
- `.finally()`
- Promise states
- Promise chaining behavior

It only implements the `then()` method.

However, we can pass it to `Promise.resolve()` to obtain a native Promise interface.

---

## 8. Checking Whether an Object Is a Promise

We can use the `instanceof` operator to check whether an object is an instance of the native Promise constructor.

### Example

```javascript
const promise = Promise.resolve("Hello");

const thenable = {
  then(resolve) {
    resolve("Hello");
  },
};

console.log(promise instanceof Promise); // true
console.log(thenable instanceof Promise); // false
```

**Output:**

```text
true
false
```

### Explanation

The `instanceof Promise` check identifies native Promise instances belonging to the current JavaScript realm.

It does not identify all thenables or even every Promise created in another JavaScript realm.

---

## 9. Thenable Error Handling

A thenable can also reject an operation.

### Example

```javascript
const thenable = {
  then(resolve, reject) {
    reject(new Error("Something went wrong!"));
  },
};

Promise.resolve(thenable)
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error.message);
  });
```

**Output:**

```text
Something went wrong!
```

### Explanation

1. `Promise.resolve()` receives the thenable.
2. The thenable invokes `reject()`.
3. The resulting Promise becomes rejected.
4. The `.catch()` method handles the error.

Notice that `.catch()` is available because `Promise.resolve()` returns a native Promise, not because the original thenable provides it.

---

## 10. Important Rules of Thenables

### Rule 1: Every Promise Is Thenable

Every native Promise has a callable `.then()` method.

```javascript
const promise = Promise.resolve(100);

console.log(typeof promise.then);

// function
```

### Rule 2: Every Thenable Is Not a Promise

```javascript
const obj = {
  then() {},
};

console.log(obj instanceof Promise);

// false
```

### Rule 3: Promise.resolve() Adopts Thenable Behavior

```javascript
const obj = {
  then(resolve) {
    resolve(100);
  },
};

Promise.resolve(obj).then((result) => {
  console.log(result);
});
```

**Output:**

```text
100
```

### Rule 4: Async/Await Supports Thenables

```javascript
const obj = {
  then(resolve) {
    resolve("Success");
  },
};

async function test() {
  const result = await obj;

  console.log(result);
}

test();
```

**Output:**

```text
Success
```

### Rule 5: Thenables Can Be Synchronous or Asynchronous

Their `then()` implementation determines when the callbacks are invoked.

```javascript
// Synchronous thenable implementation
const syncThenable = {
  then(resolve) {
    resolve("Synchronous operation");
  },
};

// Asynchronous thenable implementation
const asyncThenable = {
  then(resolve) {
    setTimeout(() => {
      resolve("Asynchronous operation");
    }, 1000);
  },
};
```

Note that Promise resolution and `await` continuation follow JavaScript's Promise scheduling rules, even if a custom thenable invokes its callback synchronously.

---

## 11. Promise Resolution and Thenable Assimilation

**Thenable assimilation** means adopting the behavior and eventual state of another thenable.

When a Promise resolves with another Promise or thenable, JavaScript does not simply store that object as its fulfillment value. Instead, it adopts its eventual outcome.

### Example

```javascript
const thenable = {
  then(resolve) {
    resolve("Final Result");
  },
};

const promise = new Promise((resolve) => {
  resolve(thenable);
});

promise.then((result) => {
  console.log(result);
});
```

**Output:**

```text
Final Result
```

Here, the Promise adopts the result of the thenable.

This behavior makes different Promise-like implementations interoperable.

---

## 12. Real-World Use Cases

Thenables are useful in several situations.

### 1. Third-Party Libraries

Some third-party libraries implement their own asynchronous objects with a `then()` method.

These objects can work with native Promises and `async/await`.

### 2. Custom Asynchronous Abstractions

Developers can create custom objects that represent asynchronous operations.

### 3. Promise Interoperability

Thenables allow different asynchronous libraries to work together without requiring every library to return native Promises.

### 4. Database Libraries

Some database libraries expose Promise-compatible query objects.

For example, Mongoose queries are thenable.

```javascript
const query = User.findOne({ email: "test@example.com" });

console.log(typeof query.then);

// function
```

A Mongoose query can be awaited:

```javascript
const user = await User.findOne({
  email: "test@example.com",
});
```

Mongoose queries are thenables, but they are not native Promises. Calling `.then()` executes the query, and queries should generally not be executed multiple times.

---

## 13. Interview Questions and Answers

### Q1. What is a thenable in JavaScript?

A thenable is any JavaScript object or function that contains a callable `then()` method. It can be used with `Promise.resolve()` and `async/await`.

### Q2. Is every thenable a Promise?

No. A Promise is thenable, but a thenable does not necessarily have to be a native Promise.

### Q3. Can we use async/await with thenable objects?

Yes. JavaScript's `await` supports thenables by waiting for their fulfillment or rejection.

### Q4. What happens when we pass a thenable to Promise.resolve()?

JavaScript checks its callable `then()` method and adopts the thenable's eventual state.

### Q5. How can you check whether an object is a native Promise?

```javascript
console.log(obj instanceof Promise);
```

This checks whether the object is an instance of the current realm's Promise constructor.

### Q6. What is thenable assimilation?

Thenable assimilation is the process through which a Promise adopts the eventual fulfillment or rejection of another Promise or thenable.

### Q7. Can a thenable have a catch() method?

Yes, a custom thenable can implement a `catch()` method, but it is not required. The only required feature for thenability is a callable `then()` method.

### Q8. Why are thenables useful?

They allow custom asynchronous objects and third-party libraries to integrate with native JavaScript Promises and async/await.

### Q9. Are Mongoose queries Promises?

Mongoose queries are thenables, not native Promises. They support `.then()` and can be awaited, but they have additional query-specific behavior.

### Q10. What happens if a thenable calls reject()?

The Promise adopting that thenable becomes rejected, and its rejection can be handled using `.catch()`.

---

## 14. Quick Summary

| Concept               | Explanation                                               |
| --------------------- | --------------------------------------------------------- |
| Thenable              | Object with a callable `then()` method                    |
| Promise               | Built-in JavaScript asynchronous object                   |
| `Promise.resolve()`   | Converts a value or adopts a thenable's state             |
| `await`               | Waits for a Promise or thenable                           |
| Thenable assimilation | Adopting another thenable's eventual state                |
| `instanceof Promise`  | Checks for a native Promise instance in the current realm |

### Remember

- Every native Promise is thenable.
- Every thenable is not a native Promise.
- A thenable must have a callable `then()` method.
- `Promise.resolve()` can adopt a thenable.
- `async/await` supports thenable objects.
- Mongoose queries are a practical real-world example of thenables.

---

## 15. Key Takeaway

A **Thenable** is an object that provides a `then()` method, allowing it to participate in JavaScript's Promise ecosystem.

Understanding thenables helps you understand how JavaScript handles asynchronous operations and how libraries such as Mongoose integrate with native Promises.

**The most important concept to remember:**

> JavaScript does not require an actual Promise to use `await`. Any object with a callable `then()` method can participate in Promise-based asynchronous operations.
