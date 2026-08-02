const response = await fetch("http://192.168.0.100:4000");

const data = await response.text();

console.log(data);

// for await (const chunk of response.body) console.log(chunk);