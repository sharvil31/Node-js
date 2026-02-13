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