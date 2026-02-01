# Understanding Environment Variables

Environment Variables (env variables) are key–value pairs used by the operating system and applications to control behavior at runtime.

They help configure applications without changing source code.

---

## Types of Environment Variables

There are **three main categories** of environment variables:

### 1. System-Specific Environment Variables

- Defined at the system level.
- Available to all users and all processes.
- Lowest priority among env variables.

---

### 2. User-Specific Environment Variables

- Defined for a specific user.
- Available to all processes started by that user.
- Higher priority than system-level variables.

---

### 3. Process-Specific Environment Variables

- Defined for a specific process.
- Exist only during the lifetime of that process.
- Highest priority among all env levels.

---

## Creating Environment Variables

To create a **temporary environment variable**, use:

```bash
export VARIABLE_NAME=value
```

- This variable is available only in the current terminal session.

- The variable is deleted when the terminal is closed.

---

## Environment Variables and Processes

- When a child process is created, it automatically inherits all environment variables from the parent process.

- A parent process can control which environment variables are passed to the child process.

---

## Accessing Environment Variables

Environment variables can be accessed using:

```bash
$VARIABLE_NAME
```

This is the same syntax used to access other shell variables.

---

## Permanent Environment Variables

To create permanent environment variables, define them in the .bashrc file:

```bash
export VARIABLE_NAME=value
```

- These variables are loaded every time a new terminal session starts.

- After modifying .bashrc, apply the changes using:

```bash
source ~/.bashrc
```

---

## Creating, Updating and deleting Environment Variables for whole system

### Create

```bash
setx VARIABLE_NAME "value"
```

- Accessible throughout the system.

- With same command you can update the variable value also by changing "value"

### delete (Powershell)

```powershell
REG delete HKCU\Environment /F /V VARIABLE_NAME
```
---

## using Node.js

### You can also create, update, and delete environment variables using Node.js with the exec function.

---

## Priority Order of Environment Variables

If the same environment variable exists at multiple levels, the priority order is:

1. Process-level (highest priority)

2. User-level

3. System-level (lowest priority)

### Example

- If a variable exists at system, user, and process levels, the process-level value will be used.

- If a variable exists at system and user levels, the user-level value will be used.

---

### Summary

- Environment variables are used to configure applications and processes.

- They can be temporary or permanent.

- Child processes inherit environment variables from parent processes.

- Process-level variables override user and system variables.

- Understanding environment variables is essential for backend development, DevOps, and system programming.

---
