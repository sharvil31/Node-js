Accessing filename and dirname in ES6 Modules

import.meta

It looks like import is an object and we are accessing its meta property but import.meta is a single syntax, It is not a property on a object. import.meta is itself a whole object.

There is a meta object in import.meta. Inside meta object there are filename and dirname properties. We can destructre them from import.meta

```javascript
const { filename, dirname } = import.meta;
```
