# File Permissions in Windows and Linux

A comprehensive guide to understanding and managing file permissions across Windows and Linux operating systems.

## Overview

When you create a file, three fundamental permission types are assigned by default:
- **Read** (r) - View file contents
- **Write** (w) - Modify file contents
- **Execute** (x) - Run the file as a program

## Windows File Permissions

In Windows, permissions can be easily modified through the graphical interface:

1. Right-click on the file/folder
2. Select **Properties**
3. Navigate to the **Security** tab
4. Modify permissions as needed

## Linux File Permissions

Linux requires a command-line approach, accessible through WSL (Windows Subsystem for Linux) on Windows systems.

### Viewing Permissions

```bash
# View all files and folders with permissions
ls -l

# View specific file/folder permissions
ls -l [file/folder name]
```

### Understanding Permission Output

Example output:
```
-rwxr-xr-x 1 sharvil sharvil 4096 Aug 30 21:07 app.js
```

Breaking down from right to left:

| Component | Meaning |
|-----------|---------|
| `app.js` | File/folder name |
| `Aug 30 21:07` | Last modification date and time |
| `4096` | Size in bytes (directories default to 4 KB) |
| `sharvil sharvil` | Owner username and group name |
| `1` | Number of hard links |
| `-rwxr-xr-x` | Permission string (explained below) |

### Permission String Breakdown

The permission string consists of 10 characters:

```
-rwxr-xr-x
│└─┬─┘└┬┘└┬┘
│  │   │  └─── Others permissions (read, execute)
│  │   └────── Group permissions (read, execute)
│  └────────── Owner permissions (read, write, execute)
└───────────── File type (- = file, d = directory)
```

**Permission Groups:**
1. **Owner permissions** (positions 2-4): What the file owner can do
2. **Group permissions** (positions 5-7): What users in the same group can do
3. **Others permissions** (positions 8-10): What all other users can do

### Modifying Permissions with chmod

#### Symbolic Method

```bash
# Remove execute permission
chmod -x src/

# Add execute permission
chmod +x src/

# Add write permission
chmod +w src/
```

**Operators:**
- `-` : Remove permission
- `+` : Add permission
- `=` : Set exact permission

### Numeric (Octal) Method

Permissions can be represented numerically:

| Permission | Letter | Number |
|------------|--------|--------|
| Read | r | 4 |
| Write | w | 2 |
| Execute | x | 1 |

Calculate permissions by adding values:
- `rwx` = 4 + 2 + 1 = **7**
- `rw-` = 4 + 2 + 0 = **6**
- `r-x` = 4 + 0 + 1 = **5**
- `r--` = 4 + 0 + 0 = **4**

#### Viewing Numeric Permissions

```bash
stat -c "%A %a %n" app.js
```

Output example:
```
-rwxr--r-- 744 app.js
```

Where `744` means:
- **7** (rwx): Owner has read, write, and execute
- **4** (r--): Group has read only
- **4** (r--): Others have read only

#### Setting Numeric Permissions

```bash
# Give read and write to all users
chmod 666 text.txt

# Give full permissions to owner, read and execute to others
chmod 755 script.sh

# Give read and write to owner, read-only to others
chmod 644 document.txt
```

**Common Permission Combinations:**
- `777` - Full access for everyone (use cautiously!)
- `755` - Owner can do everything, others can read and execute
- `644` - Owner can read/write, others can only read
- `600` - Only owner can read/write

## Git and File Permissions

Git tracks not only file content changes but also permission changes.

### Viewing Permission Changes

```bash
git diff --summary
```

Example output:
```
mode change 100644 => 100755 text.txt
```

### Git Permission Modes

Git stores four types of file modes:

| Mode | Type | Permissions |
|------|------|-------------|
| `100644` | Normal file | Read & Write (non-executable) |
| `100755` | Executable file | Read, Write & Execute |
| `120000` | Symbolic link | Link to another file |
| `040000` | Directory | Folder/directory |

**Important Git Behavior:**
- Files **must have read permission** for Git to track them
- Git only tracks the **executable (x) permission** for the owner
- Files without read permission will not be tracked by Git

## Best Practices

1. **Principle of Least Privilege**: Only grant permissions that are absolutely necessary
2. **Avoid 777 permissions**: This gives everyone full access and is a security risk
3. **Scripts should be executable**: Use `chmod +x` or `chmod 755` for script files
4. **Sensitive files**: Use `chmod 600` for files containing passwords or keys
5. **Check before committing**: Use `git diff --summary` to review permission changes

## Quick Reference

```bash
# View permissions
ls -l filename

# Make file executable
chmod +x filename

# Set permissions numerically
chmod 755 filename

# View numeric permissions
stat -c "%A %a %n" filename

# Check Git permission changes
git diff --summary
```