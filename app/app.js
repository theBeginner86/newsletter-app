//jshint esversion:8

const express = require("express");
const https = require("https");
const request = require("request");
const MongoClient = require("mongodb").MongoClient;
const app = express();

app.use(express.static("public"));

app.use(express.urlencoded({
    extended: true
}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/public/static/signup.html");
});

app.post("/", function(req, res){
    // const run = async () => {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const password = req.body.password;

        const newUser = {
            firstName,
            lastName,
            email,
            password
        };
    
        MongoClient.connect('mongodb://admin:pass@mongodb', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        async function(err, client){
            if (err){
                console.log(err);
                res.redirect("/failure");
            } 

            // console.log(client.db);
            let db = client.db("user-account");
            console.log("DB successfully connected!!!");
            try {
                
                db.collection("users").insertOne(newUser, function(err, result){
                    if (err) throw err;

                    client.close();
                    res.redirect("/success");
                });
                console.log("User successfully updated or inserted.....");
                console.log("New User Details: \n", newUser);
                
            } catch (e) {
                console.log(e);
                res.redirect("/failure");
            }
        });
    // };
    // run();
});

app.get("/success", function(req, res){
    res.sendFile(__dirname + "/public/static/success.html"); 
});

app.get("/failure", function(req, res){
    res.sendFile(__dirname + "/public/static/failure.html");
});

app.post("/success", function(req, res){
    res.redirect("/");
});
  

app.post("/failure", function(req, res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Server running at 3000");
});
