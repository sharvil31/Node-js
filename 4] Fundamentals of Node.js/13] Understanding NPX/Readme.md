# NPX Searching Steps

npx searches for a file and executes it.

Steps to how npx searches file -

### Step 1 

- Searches for package.json in current working directory.
- Searches for "name" key in json file.
- Searches for "bin" key.

### Step 2

- Searches for "node_modules\.bin\hello" folder in node modules in current working directory.