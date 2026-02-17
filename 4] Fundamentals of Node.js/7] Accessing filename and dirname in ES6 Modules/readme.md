Accessing filename and dirname in ES6 Modules

import.meta

It looks like import is an object and we are accessing its meta property but import.meta is a single syntax, It is not a property on a object. import.meta is itself a whole object.

There is a meta object in import.meta. Inside meta object there are filename and dirname properties. We can destructre them from import.meta

```javascript
const { filename, dirname } = import.meta;
```
You can add any property in import.meta object and can access it.

```javascript
import.meta.a = "Sharvil";
const { filename, dirname, a } = import.meta;
console.log(dirname); // Sharvil
```
Some people do "console.log(process.cwd())" to get current directory path. But it does'nt work for all cases. Beacuse process.cwd only gives path to from which directory Node.js process has executed. Means if you are in another folder and execute a file by giving a path without going inside that folder then process.cwd() will only give path to the directory you are executing a file from. It will remove path of the file which you executes

example:

suppose you are in "4] Fundamentals of Node.js" directory and you give a path "cd 7] Accessing filename and dirname in ES6 Modules\app.js" then both will give different outputs -

import.meta.dirname gives always whole path

```bash
C:\Users\SHARVIL AMBURLE\Documents\node-js\4] Fundamentals of Node.js\7] Accessing filename and dirname in ES6 Modules
```

process.cwd() removes current directory of your code beacuse you executed command from "4] Fundamentals of Node.js" directory

```bash
C:\Users\SHARVIL AMBURLE\Documents\node-js\4] Fundamentals of Node.js\
```

If we change directory with

```bash
process.chdir("./src")
```
then in this case also process.cwd() will give path to ".src" folder like this -

```bash
C:\Users\SHARVIL AMBURLE
\Documents\node-js\4] Fundamentals of Node.js\7] Accessing filename and dirname in ES6 Modules\src 
```