const express = require("express");
const data = require("./data");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
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

// MONGO DB STARTS HERE

//MONGOOSE => It is a library that helps to connect to the MongoDB database and perform operations on the database. (ODM => Object Data Modelling)

//SCHEMA => It is a blueprint of the database. It defines the structure of the database.

// MODEL => It is a constructor function that takes the schema and creates an instance of the document. It represents the collection in the database.

mongoose
  .connect(
    "mongodb+srv://rwtshivay:rwtshivay@cluster0.d7a1m.mongodb.net/sample_mflix?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true, // to avoid deprecated warning
      useUnifiedTopology: true, // enable new connection management engine
    }
  )
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((error) => {
    console.log("Connection failed!", error);
  });

//SCHEMA => It is a blueprint of the database. It defines the structure of the database.

const moviesSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId, // mongo db will automatically create an id for the document. // object id is a data type in mongodb that is used to store the unique identifier of the document.
  title: String,
  director: String,
  genre: [String],
  year: Number,
});

// Model => It is a constructor function that takes the schema and creates an instance of the document. It represents the collection in the database. COMPILED VERSION OF SCHEMA

const Movies = mongoose.model("Movies", moviesSchema); // Movies is the name of the collection in the database.

app.get("/movies", (req, res) => {
  try {
    Movies.find()
      .limit(10)
      .then((result) => {
        // using limit to get only 10 documents from the database.
        res.status(200).send(result);
      });
  } catch (error) {
    res.status(500).send(error);
  }
});


// IT IS A PAGINATION API
// IT IS USED TO FETCH THE DATA FROM THE DATABASE IN PAGINATION MANNER
app.get("/api/movies", (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    // const limit = parseInt(req.query.limit) || 10;
    const limit = 10;

    // console.log(page, limit);
    const startIndex = (page - 1) * limit; // value of startindex will be 0

    Movies.find() // FIND THE DOCUMENTS FROM THE DATABASE
      .skip(startIndex) // SKIP THE DOCUMENTS FROM THE DATABASE. // SKIP THE DATA BEFORE THE START INDEX
      .limit(limit) // IT IS USED TO LIMIT THE NUMBER OF DOCUMENTS TO BE FETCHED FROM THE DATABASE.
      .then((result) => {
        res
          .status(200) // STATUS CODE 200 MEANS SUCCESS
          .send(result); // SENDING THE RESPONSE FROM THE SERVER
      });
  } catch (error) {}

  // EXAMPLE

  // PAGE = 1
  // START INDEX = (1-1)*10 = 0 // WE NEED TO START GIVING THE DATA FROM 0 INDEX TO 9
  // 0 I START AND  BECAUSE LIMIT IS 10 SO IT WILL GIVE THE DATA UNTIL 9 INDEX start= 0 and limit = 10

  // PAGE = 2
  // START INDEX = (2 - 1) * 10 = 10 // WE NEED TO START GIVING THE DATA FROM 10 INDEX TO 19
  // 10 I START AND  BECAUSE LIMIT IS 10 SO IT WILL GIVE THE DATA UNTIL 19 INDEX

  // PAGE = 3
  // START INDEX = (3 - 1) * 10 = 20 // WE NEED TO START GIVING THE DATA FROM 20 INDEX TO 29
  // 20 I START AND  BECAUSE LIMIT IS 10 SO IT WILL GIVE THE DATA UNTIL 29 INDEX
});










// start the server and listen on the port.
app.listen(port, () => {
  // console.log(`Example app listening at http://localhost:${port}`);
  // console.log(`Server is running on port`, data);
});
