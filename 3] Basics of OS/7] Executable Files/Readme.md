# Executable Files Guide

## What Are Executable Files?

Files containing programs that your computer can run directly. When you double-click them, the operating system loads and executes the instructions.

## Common File Types

**Windows:** `.exe`, `.bat`, `.msi`  
**macOS:** `.app`, `.dmg`  
**Linux:** No extension (uses executable permissions)

Examples:
- chrome.exe
- node.exe

## How They Work

1. Operating system reads the file
2. Loads code into memory
3. CPU executes the instructions

## Security Warning

⚠️ Executable files can harm your system. Only run files from trusted sources.

**Best Practices:**
- Use antivirus software
- Don't open email attachments from unknown senders
- Verify file sources before running

## Creating Executables with Node.js (pkg)

Package your Node.js app into a standalone executable.

### Installation
```bash
npm install -g pkg
```

### Basic Usage
```bash
# Create executable for all platforms
pkg app.js

# Specific platform
pkg app.js --targets node18-win-x64
pkg app.js --targets node18-linux-x64
pkg app.js --targets node18-macos-x64
```

### Configure in package.json
```json
{
  "name": "my-app",
  "bin": "app.js",
  "scripts": {
    "build": "pkg ."
  },
  "pkg": {
    "targets": ["node18-win-x64", "node18-linux-x64"],
    "outputPath": "dist"
  }
}
```

Run: `npm run build`

### Advantages
- Works without Node.js installed
- Single file distribution
- Cross-platform builds
- Bundles all dependencies

### Limitations
- Larger file size
- Some dynamic require() may not work

## Making Files Executable (Linux/macOS)

```bash
chmod +x filename
./filename
```

## Other Tools

**Traditional compilers:** gcc, g++ (C/C++)  
**Node.js alternatives:** nexe, electron-builder