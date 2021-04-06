const express = require("express");
const app = express();
const path = require("path");
const contactsFile = require("./data/contacts.json");
const fse = require("fs-extra");

const PORT = process.env.PORT || 5000;

//middleware

//body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//middleware for /contacts
app.use("/contacts", (req, res, next) => {
  fse.readJSON("./data/contacts.json").then((data) => {
    res.send(data.contacts);
  });
});

//save middleware
app.use("/save", (req, res, next) => {
  const newContact = {
    name: req.body.name,
    phone: req.body.phone,
  };

  fse
    .readJson("./data/contacts.json")
    .then((data) => {
      data.contacts.push(newContact);
      //console.log(data);

      fse.writeFile("./data/contacts.json", JSON.stringify(data, null, 2));
    })
    .catch((err) => {
      console.error(err);
    });

  next();
});

//Routes
//GET route for all Contacts
app.get("/contacts", (req, res) => {
  res.json(contactsFile);
});

//POST route for contacts ajax call\
app.post("/save", (req, res) => {
  res.send(req.body);
});

//static folder for pages
app.use(express.static(path.join(__dirname, "pages")));

app.listen(PORT, () => console.log("Server running on Port: " + PORT));
