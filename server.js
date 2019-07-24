const express = require("express");
const mongojs = require("mongojs");

var app = express();

app.use(express.static("public"));

const dbUrl = "headlines";
const collections = ["nyt"];
