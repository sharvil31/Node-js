const input = document.querySelector("input");

const decoder = new TextDecoder();
input.addEventListener("change", async () => {
  const file = input.files[0];
  const readStream = file.stream();
  // const reader = readStream.getReader();

  // while (true) {
  //   const { done, value } = await reader.read();
  //   if (done) break;
  //   console.log(value);
  // }

  for await (const chunk of readStream) {
    console.log(chunk);
  }

  // console.log(decoder.decode(result.value));

  // const result2 = await reader.read()
  // console.log(decoder.decode(result2.value));

  // const result3 = await reader.read()
  // console.log(decoder.decode(result3.value));

  // const result4 = await reader.read()
  // console.log(decoder.decode(result4.value));
});
