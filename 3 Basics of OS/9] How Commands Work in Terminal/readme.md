How Commands Work in Terminal

Priority levels of cheking commands

- Alias: Bash first checks if the command matches any defined aliases.

- Functions: Next, it checks if command matches any defined shell functions.

- Built-ins: Then, Bash checks if the command is a built-in shell command (like cd, echo, pwd etc.).

- Hash Table: Bash checks its hash table of previously looked-up executables to quickly locate executables.

- Executable Files: Finally, it searches thruogh the directories listed in the PATH environment variable, in the order they appear, to find an executable file matching the command name.

All commands are nothing but executable files. When we run any command in shell then that command's executable file runs. We can actually see the command's executable file.

```bash
which pwd
```
Here, pwd is a command and which will give the file path of command's executable file. We can go to that path and check for command's executable file. It will be listed there

We know that to access any file we need to go to that file's destination path. But these commands runs from any folder in our system. How that works?.