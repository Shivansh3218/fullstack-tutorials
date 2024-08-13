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
  // console.log(req);
  res.send("Please switch to /api/data to get the data");
});

// Routes are defined using app.get() method. It takes two arguments, the path and the route handler.
app.get("/users", (req, res) => {
  res.send(data);
});

// get request for a specific user

// app.get("/users/:id", (req, res) => {
//   // this :id is a route parameter. It is a placeholder for the actual value that will be passed in the request. Dynamic route
//   const id = req.params.id; // this is how you access the route parameter in express.
//   console.log(id);
//   const user = data.find((user) => user.id == id); // find the user with the specified id.
//   console.log(user);
//   res.status(200).send(user); // send the user as response.
// });


app.get("/users/:userName", (req, res) => {
  // this :id is a route parameter. It is a placeholder for the actual value that will be passed in the request. Dynamic route
  const userName = req.params.userName; // this is how you access the route parameter in express.
  console.log(userName, "user   name");
  const user = data.find((user) => user.first_name === userName); // find the user with the specified id.
  console.log(user, " user");
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




app.put("/users/:userId", (req, res) => {
  const id = req.params.userId; // Get the user ID from the route parameter
  const updatedUser = req.body; // Get the updated data from the request body

  const userIndex = data.findIndex((user) => user.id == id); // Find the index of the user in the data array
  if (userIndex !== -1) {
    data[userIndex] = { ...data[userIndex], ...updatedUser }; // Update the user data
//
//     id: 1,
//     email: "george.bluth@reqres.in",
//     first_name: "George",
//     last_name: "Bluth",
 //     avatar: "https://reqres.in/img/faces/1-image.jpg",
  //    "email": "asdasdasdasth@reqres.in",
  // "first_name": "Shivasnhj",
  // "last_name": "Shivansh",
  // "avatar": "https://reqres.in/img/faces/1-image.jpg"
    


    res.status(200).send(data[userIndex]); // Send the updated user as a response
  } else {
    res.status(404).send({ message: "User not found" }); // If user not found, send 404
  }
});




app.delete("/users/:userId", (req, res) => {
  const id = req.params.userId; // Get the user ID from the route parameter

  const userIndex = data.findIndex((user) => user.id == id); // Find the index of the user in the data array

  // if id = 2 to user index will be 1 it will be -1 if only the user is not present in the data array else it will be the index of the user in the data array
  
  if (userIndex !== -1) {
    const deletedUser = data.splice(userIndex, 1); // Remove the user from the array
    res.status(200).send(deletedUser); // Send the deleted user as a response
  } else {
    res.status(404).send({ message: "User not found" }); // If user not found, send 404
  }
});







// start the server and listen on the port.
app.listen(port, () => {
  // console.log(`Example app listening at http://localhost:${port}`);
  // console.log(`Server is running on port`, data);
});
