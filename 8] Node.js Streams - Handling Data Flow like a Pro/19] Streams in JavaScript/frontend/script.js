const input = document.querySelector("input");

input.addEventListener("change", () => {
  const file = input.files[0];
  console.log(file);
});
