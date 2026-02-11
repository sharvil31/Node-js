# How Commands Work in Terminal

## Command Resolution Priority

When you type a command in the terminal, Bash searches for it in a specific order. Understanding this priority system helps you debug command issues and customize your shell behavior.

### Priority Levels (Highest to Lowest)

1. **Aliases**: Bash first checks if the command matches any defined aliases.
   - Example: `alias ll='ls -la'` makes `ll` execute `ls -la`

2. **Functions**: Next, it checks if the command matches any defined shell functions.
   - Functions are reusable blocks of code defined in your shell

3. **Built-ins**: Then, Bash checks if the command is a built-in shell command.
   - Examples: `cd`, `echo`, `pwd`, `export`, `source`

4. **Hash Table**: Bash checks its hash table of previously looked-up executables for quick access.
   - This cache speeds up repeated command execution

5. **Executable Files**: Finally, it searches through the directories listed in the `PATH` environment variable, in the order they appear, to find an executable file matching the command name.

---

## What Are Commands?

All commands are executable files stored somewhere in your system. When you run any command in the shell, that command's executable file is executed.

### Finding a Command's Location

You can view the actual file path of a command's executable using the `which` command:

```bash
which pwd
```

This will output something like:
```
/usr/bin/pwd
```

You can navigate to that directory and verify the executable file exists:

```bash
ls -l /usr/bin/pwd
```

---

## The `type` Command: Understanding Command Types

The `type` command is one of the most useful diagnostic tools for understanding how Bash will interpret a command. It shows you exactly what type of command you're dealing with and where it's located.

### Basic Usage

```bash
type <command>
```

### Examples of Different Command Types

**Alias:**
```bash
type ll
# Output: ll is aliased to `ls -la'
```

**Shell Function:**
```bash
type cd
# Output: cd is a shell function
```

**Built-in:**
```bash
type echo
# Output: echo is a shell builtin
```

**Executable File:**
```bash
type python
# Output: python is /usr/bin/python
```

**Hashed Command:**
```bash
type ls
# Output: ls is hashed (/bin/ls)
```

### Useful `type` Options

**Show all locations** (if command exists in multiple forms):
```bash
type -a echo
# Output:
# echo is a shell builtin
# echo is /bin/echo
```

**Show only the type** (not the path):
```bash
type -t pwd
# Output: builtin
```

Possible outputs: `alias`, `keyword`, `function`, `builtin`, `file`, or `nothing` (if not found)

**Show the path only** (similar to `which`):
```bash
type -p python
# Output: /usr/bin/python
```

### Why `type` is Better Than `which`

- `which` only shows executable files in PATH
- `type` shows aliases, functions, built-ins, **and** executables
- `type` shows exactly how Bash will interpret the command
- `type -a` reveals if multiple versions exist

**Example where `which` fails but `type` succeeds:**
```bash
which cd
# Output: (nothing - cd is not a file)

type cd
# Output: cd is a shell builtin
```

---

## The PATH Environment Variable

### Why Commands Work From Any Directory

Normally, to execute a file, you need to either:
- Navigate to the file's directory and run it with `./filename`
- Provide the full path to the file

However, commands like `pwd`, `ls`, and `python` work from any folder in your system. This is made possible by the **PATH environment variable**.

### How PATH Works

The `PATH` variable contains a list of directories where Bash looks for executable files. When you type a command:

1. Bash checks if it's an alias, function, or built-in
2. If not found, Bash searches through each directory in `PATH` (in order)
3. The first matching executable file is executed

View your current PATH:
```bash
echo $PATH
```

Output example:
```
/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
```

The directories are separated by colons (`:`).

### Adding Custom Executables to PATH

If you want any executable file to run from anywhere in your system, you need to add either:
- The file's directory to PATH, or
- The file itself to a directory already in PATH

**Example: Adding a directory to PATH**

```bash
# Temporary (current session only)
export PATH="$PATH:/path/to/your/directory"

# Permanent (add to ~/.bashrc or ~/.bash_profile)
echo 'export PATH="$PATH:/path/to/your/directory"' >> ~/.bashrc
source ~/.bashrc
```

---

## Command Hashing

### What Is the Hash Table?

Whenever you execute an executable file for the first time in a session, Bash creates a hash entry that stores:
- The command name
- The full path to the executable
- The number of times it has been executed

### Why Hashing Matters

The hash table acts as a cache, so Bash doesn't need to search through all the `PATH` directories every time you run the same command. This significantly speeds up command execution.

### Viewing and Managing the Hash Table

**View all cached commands:**
```bash
hash
```

**View a specific command's cached path:**
```bash
hash -t pwd
```

**Clear the entire hash table:**
```bash
hash -r
```

**Remove a specific command from the hash:**
```bash
hash -d pwd
```

### When Hashing Can Cause Issues

If you install a new version of a command in a different location that appears earlier in your `PATH`, the old cached version might still be used. In this case, clear the hash to force Bash to re-search:

```bash
hash -r
```

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `which <command>` | Show the path to a command's executable |
| `type <command>` | Show how a command would be interpreted (alias, function, built-in, or file) |
| `echo $PATH` | Display all directories in PATH |
| `export PATH="$PATH:/new/path"` | Add a directory to PATH |
| `hash` | Display all cached command paths |
| `hash -r` | Clear the hash table |
| `alias` | List all defined aliases |
| `unalias <name>` | Remove an alias |

---

## Summary

Understanding how Bash resolves commands helps you:
- Debug why the wrong version of a command is running
- Customize your shell with aliases and functions
- Optimize command execution through hashing
- Manage your PATH effectively

The command resolution flow is: **Aliases → Functions → Built-ins → Hash Table → PATH directories**