# NPX Searching Steps

npx searches for a file and executes it.

Steps to how npx searches file -

### Step 1 

- Searches for package.json in current working directory.
- Searches for "name" key in json file.
- Searches for "bin" key.

### Step 2

- Searches for "node_modules\.bin\hello" folder in node modules in current working directory and executes it.

### Step 3

Searches for file in global folder, where we globally install packages.

### Step 4

Searches for package in npm-cache/_npx folder.

### Step 5

Searches for package in npm registery, Prmopts to install it, if user allows then installs it and run it.