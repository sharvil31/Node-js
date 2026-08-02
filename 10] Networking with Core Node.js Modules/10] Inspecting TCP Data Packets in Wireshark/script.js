const response = await fetch("http://192.168.0.100:4000");

console.log({ response });

// const data = await response.text();

// console.log(data);

const decoder = new TextDecoder()
for await (const chunk of response.body) {
    // console.log(JSON.parse(decoder.decode(chunk)));
    console.log(chunk);
}