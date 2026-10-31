import React from "react";
import Layout from "./Layout";

export default function ({ todos }) {
  return (
    <Layout title="Todo App">
      <form action="/todos" method="post">
        <input type="text" name="title" required />
        <button>Add Todo</button>
      </form>
      <ul>
        {todos.reverse().map(({ title, completed, _id }) => (
          <li key={_id.toString()}>
            <input
              type="checkbox"
              defaultChecked={completed}
              name="check"
              data-id={_id.toString()}
              data-title={title}
            />
            <span
              style={{ textDecoration: completed ? "line-through" : "none" }}
            >
              {title}
            </span>{" "}
            <button data-id={_id.toString()}>Delete</button>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
