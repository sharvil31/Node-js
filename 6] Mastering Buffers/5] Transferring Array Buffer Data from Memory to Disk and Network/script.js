fetch("http://localhost:3000/")
  .then((response) =>
    // response.text(),
    response.arrayBuffer(),
  )
  .then((data) => {
//     const uint8Array = new Uint8Array(data);
   const decoder = new TextDecoder("utf-8");
   console.log(decoder.decode(data))
//    console.log(decoder.decode(uint8Array))
    // console.log(uint8Array);
    // console.log(data)
  });
