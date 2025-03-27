const express = require("express");
const app = express();

const port = process.env.port || 8000;

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.get("/login", (req, res) => {
  res.send("Hello user, login!");
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
