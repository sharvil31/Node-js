const fileInput = document.getElementById("fileInput");

fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];

  console.log(file.size);

  const reader = new FileReader();
  reader.addEventListener("load", function (e) {
    const arrayBuffer = e.target.result;
    console.log(arrayBuffer);
    console.log(
      [...new Uint8Array(arrayBuffer)]
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(" "),
    );
  });

  reader.readAsArrayBuffer(file);
});
