exports vs module.exports in common.js

when we do:

```javascript
console.log(module.exports === exports)
```
Then the result comes true. But there are lot of differences between these two.

example:

```javascript
const user = {
    name: "Sharvil Amburle",
    age: 22,
    address: {
        city: "Badlapur",
        state: "Maharashtra",
    },
    hobbies: ["Reading", "Coding", "Cricket"],
};

let address = user.address

console.log(user.address === address);

address.pinCode = 415713;
address.country = "India";

console.log(address);
console.log(user.address);
```
In above example, we add values in address but the values will also be added in user object address because values as well as reference of user.address also get assigned to address variable. Means address is pointing to same loacation as user.address in memory. So when we change address then user.address will also get changed.

This same logic also applies on "module.exports === exports".
