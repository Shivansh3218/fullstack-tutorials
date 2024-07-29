const express = require("express");
const data = require("./data");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express(); // creates a instance of express. APp is used to handle requests and responses, routing, server configuration.
const port = 3000;
// this is a route handler. It is a function that is executed when a request is made to the specified path.

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Please switch to /api/data to get the data");
});

// Routes are defined using app.get() method. It takes two arguments, the path and the route handler.
app.get("/users", (req, res) => {
  res.send(data);
});

// get request for a specific user

app.get("/users/:userId", (req, res) => {
  // this :id is a route parameter. It is a placeholder for the actual value that will be passed in the request. Dynamic route
  const id = req.params.userId; // this is how you access the route parameter in express.
  console.log(id);
  const user = data.find((user) => user.id == id); // find the user with the specified id.
  console.log(user);
  res.status(200).send(user); // send the user as response.
});

app.post("/users", (req, res) => {
  const newUser = req.body;
  console.log(newUser);
  // const id = data.length;
  // console.log(id);

  const modififiedUser = { ...newUser, id: data.length + 1 };
  console.log(modififiedUser);
  data.push(modififiedUser);
  res.status(201).send(modififiedUser);
});

// start the server and listen on the port.
app.listen(port, () => {
  // console.log(`Example app listening at http://localhost:${port}`);
  // console.log(`Server is running on port`, data);
});
