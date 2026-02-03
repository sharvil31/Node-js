# Understanding Files, Folders, and the Path System in OS

Operating Systems organize data using a structured **file system** consisting of files, directories, and links. Understanding how this system works is essential for developers and system users.

---

## File Types in Unix/Linux

In Unix-based systems, file types are represented using symbols:

- `-` → Regular file  
- `d` → Directory (folder)  
- `l` → Symbolic link (symlink)

You can see these using:
```bash
ls -l
```
---

## Symbolic links(Symlinks)

Symbolic links act like shortcuts. They make programs believe a file or folder exists at a specific location, even though it actually lives somewhere else.

 ### Why Use Symlinks?

- Save disk space

- Move large files without breaking software

- Maintain backward compatibility

## Real-World Example: Running Out of Disk Space

Imagine your C: Drive is full because your game "SuperHero" is taking up 100GB in C:\Games\SuperHero. You have a new, empty D: Drive.

### The Problem: 
If you simply move the folder to D:\Games\SuperHero, the game launcher will crash because it's still looking for files on the C: drive.

### The Solution:
- Move the folder to the D: drive.
- Create a Symbolic Link at the original location (C:\Games\SuperHero) that points to the new location (D:\Games\SuperHero).
- The Result: The game launcher "looks" at the C: drive, sees the symlink, and is automatically redirected to the D: drive. - It thinks the files are still on C:, so it runs perfectly without any extra configuration. 

---

## Some common navigation commands

- pwd: Print working directory. Displays your current location in the file system as an absolute path.
- ls: Lists files and directories in the current directory (or a specified one).
- cd: Change directory. Used to move into a different folder. e.g. cd /home/user/Documents
- mkdir: Make directory. Creates a new directory/folder. e.g. mkdir new_project
- cd . : Stays in the current directory (the single dot refers to the current directory).
- cd .. : Moves up one level to the parent directory.
- cd ~ : Moves directly to your home directory, regardless of your current location.
- cd - : Switches to the previous directory you were in.
- cd / : Moves to the root directory of the entire file system. 

---

## Paths in the File System 

There are two types of paths - absolute path and relative path

- Absolute Path: A full path starting from the root directory (/), e.g., C:/users/sharvil/OneDrive/Documents.

- Relative Path: A path starting from your current location, e.g., cd Documents if you are currently in /home/user.

- Tab Completion: Pressing the [Tab] key while typing a command or path will auto-complete the name, which helps prevent typos and speeds up navigation

---

## File Management Commands

While not strictly "navigation," these commands are used constantly in the same context as moving around the file system: 

- cp : Copies files or directories (cp -r is needed for directories).
- mv : Moves files or directories (can also be used to rename them).
- rm : Removes (deletes) files (rm -r is needed for directories; use with caution as there is no trash bin in the shell).
- cat : Displays the contents of a text file in the terminal. 
---