
const buttons = document.querySelectorAll("button");
const checkboxes = document.querySelectorAll('input[type="checkbox"]');

buttons.forEach((button) => {
  button.addEventListener("click", async () => {
    const id = button.dataset.id;

    const response = await fetch(`http://localhost:4000/todos/${id}`, {
      method: "DELETE",
    });
    await response.json();
    window.location.reload();
  });
});

checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", async (event) => {
      const { id, title } = checkbox.dataset;

      try {
        const response = await fetch(`/todos/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            completed: event.target.checked,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update todo");
        }

        window.location.reload();
      } catch (error) {
        console.error(error);
        alert("Could not update todo.");
      }
    });
  });

