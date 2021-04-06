const express = require("express");
const app = express();
const path = require("path");
const contactsFile = require("./data/contacts.json");
const fse = require("fs-extra");

const PORT = process.env.PORT || 5000;

//middleware
//Read contacts file middleware
function readContactsFile(req, res, next) {
  fse.readJSON("./data/contacts.json").then((data) => {
    res.send(data.contacts);
  });
  next();
}

function saveData(req, res, next) {
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
}

//Routes
//GET route for all Contacts
app.get("/contacts", readContactsFile, (req, res) => {
  console.log("Contacts Table Updated");
});
//body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//POST route for contacts
app.post("/save", saveData, (req, res) => {
  res.send(req.body);
  console.log("Contact Added");
});

//static folder for pages
app.use(express.static(path.join(__dirname, "pages")));

app.listen(PORT, () => console.log("Server running on Port: " + PORT));
