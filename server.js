var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var objectId = require("mongodb").ObjectId;

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = 8080;

app.listen(port);

var db = new mongodb.Db(
  "instagram",
  new mongodb.Server("localhost", 27017, {}),
  {}
);

console.log("Servidor online!");

app.get("/", function (req, res) {
  res.send({ msg: "Olá" });
});

app.post("/api", function (req, res) {
  var dados = req.body;

  db.open(function (err, mongoclient) {
    mongoclient.collection("postagens", function (err, collection) {
      collection.insert(dados, function (err, records) {
        if (err) {
          res.json(err);
        } else {
          res.json(records);
        }
        mongoclient.close();
      });
    });
  });
});

app.get("/api", function (req, res) {
  db.open(function (err, mongoclient) {
    mongoclient.collection("postagens", function (err, collection) {
      collection.find().toArray(function (err, results) {
        if (err) {
          res.json(err);
        } else {
          res.json(results);
        }
        mongoclient.close();
      });
    });
  });
});

app.get("/api/:id", function (req, res) {
  db.open(function (err, mongoclient) {
    mongoclient.collection("postagens", function (err, collection) {
      collection.find(objectId(req.params.id)).toArray(function (err, results) {
        if (err) {
          res.json(err);
        } else {
          res.json(results);
        }
        mongoclient.close();
      });
    });
  });
});
