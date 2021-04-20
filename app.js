//jshint esversion:6
//jshint esversion:8

// const { JSDOM } = require("jsdom");
// const { window } = new JSDOM("");
// const $ = require("jquery")(window);

// const jsdom = require('jsdom');
// const dom = new jsdom.JSDOM("");
// const jquery = require('jquery')(dom.window);

// import $ from 'jquery';
// window.jquery = window.$ = $;
// $(selector).hide();

const express = require("express");
const https = require("https");
const request = require("request");
const mailChimp = require("@mailchimp/mailchimp_marketing");
const app = express();

app.use(express.static("public"));

app.use(express.urlencoded({
    extended: true
}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/public/static/signup.html");
});

mailChimp.setConfig({
    apiKey: "0cad88a317afa6bc2ac798231c9785a1-us1",
    server: "us1",
});

app.post("/", function(req, res){
    const run = async () => {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const password = req.body.password;
    
        const response = await mailChimp.lists.batchListMembers("5e154365e8", {
            members: [
                {   
                    email_address: email,
                    status: "subscribed",
                    merge_fields: {
                        FNAME: firstName,
                        LNAME: lastName,
                        PASSWORD: password
                    }
                }
            ],
        });

        if(response.total_created === 0){
            console.log(response.errors[0].error);
        }
        console.log(response.total_created);
        console.log("Name: " + firstName + " " + lastName);
        console.log("E-mail: " + email);
        console.log("Password: " + password);
        console.log(res.statusCode);

        if(response.total_created === 0){
            res.sendFile(__dirname + "/public/static/failure.html");
        }else{
            if(res.statusCode === 200){
                res.sendFile(__dirname + "/public/static/success.html");    
            }else{
                res.sendFile(__dirname + "/public/static/failure.html");
            }
        }
    };
      
    run();
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

//API KEY: 0cad88a317afa6bc2ac798231c9785a1-us1
//LIST ID: 5e154365e8