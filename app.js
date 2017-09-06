var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
 
var app = express();

var jsonParser = bodyParser.json();
 
app.use(express.static(__dirname + "/public"));

// get all users
app.get("/api/users", function(req, res){
      
    var content = fs.readFileSync("users.json", "utf8");
    var users = JSON.parse(content);
    res.send(users);
});

// get one user by id
app.get("/api/users/:id", function(req, res){
      
    var id = req.params.id; // getting id
    var content = fs.readFileSync("users.json", "utf8");
    var users = JSON.parse(content);
    var user = null;
    // searching user in array by id
    for(var i=0; i<users.length; i++){
        if(users[i].id==id){
            user = users[i];
            break;
        }
    }
    // sending user
    if(user){
        res.send(user);
    }
    else{
        res.status(404).send();
    }
});

// getting sended data
app.post("/api/users", jsonParser, function (req, res) {
     
    if(!req.body) return res.sendStatus(400);
     
    var userName = req.body.name;
    var userAge = req.body.age;
    var user = {name: userName, age: userAge};
     
    var data = fs.readFileSync("users.json", "utf8");
    var users = JSON.parse(data);
     
    // finding the bigest id
    var id = Math.max.apply(Math,users.map(function(u){return u.id;}))
    user.id = id+1;
    // add user in array
    users.push(user);
    var data = JSON.stringify(users);
    // rewrite file with newdata
    fs.writeFileSync("users.json", data);
    res.send(user);
});

 // deleting user by id
app.delete("/api/users/:id", function(req, res){
      
    var id = req.params.id;
    var data = fs.readFileSync("users.json", "utf8");
    var users = JSON.parse(data);
    var index = -1;
    // searching for user by id
    for(var i=0; i<users.length; i++){
        if(users[i].id==id){
            index=i;
            break;
        }
    }
    if(index > -1){
        // deleting user
        var user = users.splice(index, 1)[0];
        var data = JSON.stringify(users);
        fs.writeFileSync("users.json", data);
        
        res.send(user);
    }
    else {
        res.status(404).send();
    }
});

// changing user
app.put("/api/users", jsonParser, function(req, res){
      
    if(!req.body) return res.sendStatus(400);
     
    var userId = req.body.id;
    var userName = req.body.name;
    var userAge = req.body.age;
     
    var data = fs.readFileSync("users.json", "utf8");
    var users = JSON.parse(data);
    var user;

    for(var i=0; i<users.length; i++){
        if(users[i].id==userId){
            user = users[i];
            break;
        }
    }
    // rewriting user
    if(user) {
        user.age = userAge;
        user.name = userName;
        var data = JSON.stringify(users);
        fs.writeFileSync("users.json", data);
        res.send(user);
    }
    else {
        res.status(404).send(user);
    }
});
  
app.listen(3000, function(){
    console.log("Server is running on port 3000");
});