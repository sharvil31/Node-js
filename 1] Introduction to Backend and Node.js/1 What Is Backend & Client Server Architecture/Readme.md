# Backend & Client–Server Architecture

## Introduction

When you access anything on the internet—such as a **website, video, movie, or application**—that content is **not stored on your device**.  
It is delivered to you over a network (usually **HTTP/HTTPS**) from another computer called a **server (backend)**.

This working model is known as **Client–Server Architecture**.

---

## What Is a Server (Backend)?

A **server** (also known as **backend**) is a **computer or system** that provides **data, services, or programs** to other computers (clients) over a network.

### Responsibilities of a Server:
- Listens for incoming client requests
- Processes requests
- Communicates with databases
- Applies business logic
- Sends responses back to clients

### Examples:
- Web servers (Node.js, Django, Laravel)
- Database servers (MySQL, MongoDB)
- API servers
- File servers

➡️ A server is always **running and waiting** for client requests.

---

## What Is a Client (Frontend)?

A **client** is a **computer, device, or software application** that **requests services or data** from a server.

### Responsibilities of a Client:
- Sends requests to the server
- Displays data to the user
- Handles user interactions (clicks, forms, inputs)

### Examples:
- Web browsers (Chrome, Firefox)
- Mobile applications
- Desktop applications
- Frontend frameworks (React, Angular, Vue)

➡️ The client focuses mainly on **user experience**.

---

## How Client–Server Architecture Works

1. The client sends a request to the server (HTTP/HTTPS)
2. The server receives the request
3. The server processes the request
4. The server sends a response (HTML, JSON, video, etc.)
5. The client displays the response to the user

This request–response cycle happens **every time** you interact with a website.

---

## Real-World Analogy 🍽️

| Real World | Client–Server |
|-----------|---------------|
| Customer | Client |
| Kitchen | Server |
| Order | Request |
| Food | Response |

The customer never enters the kitchen but still receives the food.

---

## Why Client–Server Architecture Is Important

- 🔒 Better security
- ⚡ Faster processing
- 📈 Scalability
- 🛠️ Easier maintenance
- 🌍 Global accessibility

---

## Conclusion

Client–Server Architecture is the backbone of modern web applications.  
The **client** handles interaction and presentation, while the **server** handles logic, data, and processing.