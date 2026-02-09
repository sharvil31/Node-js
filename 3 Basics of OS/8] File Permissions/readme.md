File Permissions in Windows and Linux

When you create any file, by default three types of permissions are allowed - Read, Write and execute. We can modify these permissions in the file's "properties > security" settings in Windows.

In Linux we dont get "properties > security" settings. We need to use WSL which allows us to use Linux in Windows. We need to type commands manually.

ls -l - Command to see all files and folders permissions
ls -l [file/folder name] - Command to see a particular file/folder permissions

After running this command we will see all the files/folders permissions.

Example: -rwx-r-r--r-- 1 sharvil sharvil 4096 Aug 30 21:07 app.js

Lets understand from last - 

- app.js - Name of the file/folder.

- Aug 30 21:07 - Date and time on which file was last updated.

- 4096 - Size of the file (in bytes). Whenever a folder is created in Unix OS, by default 4 KB space is allocated to it to store that directory's information. Even if you add multiple files in it this size won't change.

- sharvil sharvil - first one is user name and second one is group name. Group is by default created on every file/folder creation.

- 1 - No of Hardlinks.

- -rwxr-xr-x: If there is dash(-) at start means it is a file. If there is "d" at start means it is a folder/directory.

- rwx: Read, Write, Execute means we can read, edit and execute this file


- first 3 permissions group "rwx" says that user sharvil can read, write and execute this file.

- The next 3 permissions group "r-x" says other users in sharvil group can only read and execute this file. Here write is dashed means They don't have permission to modify the file.

- the final 3 permissions group "r-x" says that any user who is not the owner and not in any group also, can read and execute this file, but cannot modify it.

```bash
chmode -x src/
```

chmode: change mode
"-" :  remove permission 
"+" : add permission 
x : permission name
src/ : file/folder name

this command by default will give read(r) and execute(x) permission to all three users and write(w) permission to owner only.
