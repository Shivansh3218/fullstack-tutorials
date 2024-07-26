const express = require("express");
const data = require("./data.json");
const cors = require("cors");
const app = express(); // creates a instance of express. APp is used to handle requests and responses, routing, server configuration.
const port = 3000;
// this is a route handler. It is a function that is executed when a request is made to the specified path.


app.use(cors());

app.get("/", (req, res) => {
res.send("Please switch to /api/data to get the data");
});

// Routes are defined using app.get() method. It takes two arguments, the path and the route handler.
app.get("/api/data", (req, res) => {
res.send(data);
});

// start the server and listen on the port.
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
