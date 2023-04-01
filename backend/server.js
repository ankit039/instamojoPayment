const express = require("express");
const app = express();
const mongoose = require("mongoose");
var bodyParser = require('body-parser');
var cors = require("cors");

require("dotenv").config();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.PORT == undefined) {
  //cors connection
  console.log("Localhost Cors Applied");
  var whitelist = [
    "http://localhost:3000",
    "http://localhost:4000"
  ];
  var corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        console.log(origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
  };
} else {
  //cors connections
  console.log("Heroku Cors Applied");
  var whitelist = ["https://instamojo.com","https://instafronend.onrender.com","http://localhost:3000","https://instapayfrontend.netlify.app"];
  var corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        console.log(origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
  };
}

//mongo connection
const connect = mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

connect.then(
  (dbx) => {
    console.log("Mongo DB is connected correctly");
  },
  (err) => {
    console.log(err);
  }
);

//define routes
const apiRouter = require("./routes/apiRoute");
app.use("/api", cors(corsOptions), apiRouter);
app.listen(port, () =>
  console.log(`Server listening at http://localhost:${port}`)
);
