# Node.js Process Object

Quick reference guide for the Node.js `process` global object.

## Properties

### Command-Line Arguments
```javascript
process.argv  // [node_path, file_path, ...args]
```

### Environment Variables
```javascript
process.env  // Object with all environment variables
```

### Process Information
```javascript
process.pid        // Current process ID
process.ppid       // Parent process ID
process.platform   // 'win32', 'darwin', 'linux', etc.
process.arch       // 'x64', 'arm', 'arm64', etc.
process.version    // Node.js version
process.versions   // All dependency versions
process.execPath   // Path to Node.js executable
```

## Methods

### Directory
```javascript
process.cwd()           // Get current working directory
process.chdir(path)     // Change working directory
```

### Memory & Performance
```javascript
process.memoryUsage()   // { rss, heapTotal, heapUsed, external }
process.uptime()        // Process uptime in seconds
process.hrtime.bigint() // High-resolution time
```

### Process Control
```javascript
process.exit([code])           // Exit (0 = success, 1 = error)
process.kill(pid, [signal])    // Send signal to process
process.emitWarning(msg, opts) // Emit custom warning
```

### Event Loop
```javascript
process.nextTick(callback)  // Run before next event loop iteration
```

## Events

```javascript
process.on('exit', (code) => {})
process.on('uncaughtException', (error) => {})
process.on('unhandledRejection', (reason, promise) => {})
process.on('warning', (warning) => {})
process.on('SIGINT', () => {})   // Ctrl+C
process.on('SIGTERM', () => {})  // Termination signal
```

## Standard Streams

```javascript
process.stdout.write('text')  // Write to stdout (no newline)
process.stderr.write('error') // Write to stderr

process.stdin.on('data', (data) => {})  // Read from stdin
```

## Best Practices

**Graceful Shutdown:**
```javascript
process.on('SIGTERM', async () => {
  await server.close();
  await db.close();
  process.exit(0);
});
```

**Error Handling:**
```javascript
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
```

**Environment Validation:**
```javascript
if (!process.env.DATABASE_URL) {
  console.error('Missing DATABASE_URL');
  process.exit(1);
}
```

## Common Patterns

**CLI Arguments:**
```javascript
const args = process.argv.slice(2);
console.log(`Command: ${args[0]}`);
```

**Environment Config:**
```javascript
const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000
};
```

**Process Info:**
```javascript
console.log(`PID: ${process.pid}`);
console.log(`Platform: ${process.platform}`);
console.log(`Node: ${process.version}`);
```

## Important Notes

- ⚠️ Avoid `process.exit()` - use graceful shutdown
- `process.kill()` sends signals, doesn't always kill
- `process.nextTick()` has priority over `setTimeout()`
- Always handle `uncaughtException` and `unhandledRejection`

## Resources

- [Node.js Process Docs](https://nodejs.org/api/process.html)