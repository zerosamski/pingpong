//requiring modules
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const Sequelize = require('sequelize');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

//configuring modules
app = express();
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))
app.use(fileUpload());

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  storage: "./session.postgres",
  host: process.env.DB_HOST,
  dialect: 'postgres',
  operatorsAliases: false
})

sequelize.sync({force: false}).then(() => {
})

//routes

//homepages
app.get("/", (req, res) => {

}) 

//about+contact
app.get("aboutcontact", (req, res) => {

}) 

//create new tournament
app.get("newtournament", (req, res) => {

}) 

//enter names of players
app.post("newtournament", (req, res) => {
    let playerinput = req.body.playernames
    let players = playerinput.spit("\n")

    players.forEach(function(player) {
        Players.create({
            name: player,
            haslost: false,
            lastround: 1,
            winner: false,
            runnerup: false
        })
    })

    Players.findAll({
        where {
            haslost: false
        }
    })
    .then((players) => {
        res.render("rounds", {players: players})
    })
}) 

//displays rounds of the tournament
app.get("rounds", (req, res) => {

}) 

//random shit trick
app.post("rounds", (req, res) => {

}) 

//displaysfinalresult
app.get("finalresult", (req, res) => {

}) 


