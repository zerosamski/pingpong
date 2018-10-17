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

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  storage: "./session.postgres",
  host: process.env.DB_HOST,
  dialect: 'postgres',
  operatorsAliases: false
})

sequelize.sync({force: true}).then(() => {
})

const Players = sequelize.define('players', {
    name: {
        type: Sequelize.STRING
    },
    haslost: {
        type: Sequelize.BOOLEAN
    },
    lastround: {
        type: Sequelize.INTEGER
    },
    winner: {
        type: Sequelize.BOOLEAN
    },
    runnerup: {
        type: Sequelize.BOOLEAN
    }
});

//routes

//homepages
app.get("/", (req, res) => {

}) 

//about+contact
app.get("/aboutcontact", (req, res) => {

}) 

//create new tournament
app.get("/newtournament", (req, res) => {
    res.render("newtournament")
}) 

//enter names of players
app.post("/newtournament", (req, res) => {
    let playerinput = req.body.playernames
    let players = playerinput.replace(/\r\n/g, "\r").replace(/\n/g, "\r").split(/\r/)

    players.forEach(function(player) {
        Players.create({
            name: player,
            haslost: false,
            lastround: 0,
            winner: false,
            runnerup: false
        })
    })

    Players.findAll({
        where: {
            haslost: false
        }
    })
    .then((players) => {
        res.redirect("/rounds")
    })
}) 

//displays rounds of the tournament
app.get("/rounds", (req, res) => {
    Players.findAll({
        where: {
            haslost: false
        }
    })
    .then((players) => {
        if (players.length === 1 ) {
            res.redirect("/finalresult")
        } else {

    Players.findAll({
        where: {
            haslost: false
        }
    })
    .then((players) => {
        players.forEach(function(player) {
            Players.update({
                lastround: player.lastround + 1
                }, { 
                    where: {
                        name: player.name
                    }
                })
            })
        })
    .then(() => {
        return Players.findAll({
            where: {
                haslost: false
            },
            order: sequelize.random()
        })
    .then((result) => {
        res.render("rounds", {players: result})
        })
        .catch(error => {
            console.log(error)
        })
    })
    }
    }) 
})

//random shit trick
app.post("/rounds", (req, res) => {
    Players.findAll({
        where: {
            haslost: false
        }
    })
    .then((players) => {
        players.forEach(function(player) {
            if (req.body[player.name] !== "on") {
                Players.update({
                    haslost: true
                    }, { 
                        where: {
                            name: player.name
                        }
                    })
                }
            })
        })
    .then(()=> res.redirect("/rounds"))
    .catch(error => {
            console.log(error)
        })
})

//displaysfinalresult
app.get("/finalresult", (req, res) => {
    res.send("This is the winner page yo")
    
}) 


app.listen(3000, () => {
    console.log("Server is listening on port 3000")
})

