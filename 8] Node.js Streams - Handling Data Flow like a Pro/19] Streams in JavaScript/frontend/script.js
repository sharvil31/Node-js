const input = document.querySelector("input");

input.addEventListener("change", () => {
  const file = input.files[0];
  const readStream = file.stream();
  const reader = readStream.getReader();
  const result = await reader.read()
  console.log(result);
  const result = await reader.read()
  console.log(result2);
});
