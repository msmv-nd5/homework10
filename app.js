const express = require("express");
const bodyParser = require("body-parser");
var {ObjectId} = require('mongodb');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const rtAPIv1 = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended": true}));

MongoClient.connect("mongodb://localhost:27017/test", function(err, db) {
  db.collection('phonebook', function(err, collection) {

            rtAPIv1.get("/users/", function(req, res) {
                collection.find().toArray((err, result) => {
                 res.send(result);
                });
            });

            rtAPIv1.post("/users/", function(req, res) {
                let user = new User(req.body.firstname, req.body.lastname, req.body.phone);
                    collection.insert(user, (err, result) => {
                 res.send(result);
                });
            });

            rtAPIv1.delete("/users/:id", function(req, res) {
                collection.remove({"_id": ObjectId(req.params.id)}, (err, result) => {
                  res.send(result);
                  });     
            });

            rtAPIv1.put("/users/:id", function(req, res) {
                let user = new User(req.query.firstname, req.query.lastname, req.query.phone);
                collection.update({"_id": ObjectId(req.params.id)}, user, (err, result) => {
                  res.send(result);
                  });  
            });

            rtAPIv1.get("/users/:query", function(req, res) {
                collection.find({
                        "$or": [{
                            "firstname": req.params.query
                        }, {
                            "lastname": req.params.query
                        }, {
                            "phone": req.params.query
                        }]
                }).toArray((err, result) => {
                 res.send(result);
                });
            });
    
});
});



app.use("/api/v1", rtAPIv1);
app.listen(3000);

class User {
    constructor(firstname, lastname, phone) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.phone = phone;
    }
}