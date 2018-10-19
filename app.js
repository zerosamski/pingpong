//requiring modules
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const Sequelize = require('sequelize');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
var robin  = require('roundrobin');

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
    },
    points: {
        type: Sequelize.INTEGER
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
            runnerup: false,
            points: 0
        })
    })

    Players.findAll({
        where: {
            haslost: false
        }
    })
    .then((players) => {
        if (req.body.mode === "singles") {
            res.redirect("/rounds")
        } else if (req.body.mode === "roundrobin") {
            res.redirect("/roundrobin")
        } else {
            res.send("error")
        }
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
            console.log("/////////////////////////////////")
            console.log(req.body[player.name])
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
        .then(()=> {
            setTimeout(() => {
                res.redirect("/rounds")
                }, 400)
            })
    .catch(error => {
            console.log(error)
        })
})

//roundrobin
app.get("/roundrobin", (req, res) => {
    let namearray = []
    let amountplayers;
    Players.findAll()
    .then((players) => {
        amountplayers = players.length
        players.forEach(function(player) {
            namearray.push(player.name)
        })
    })
    .then(() => {
        return robin(amountplayers, namearray)
    })
    .then((result) => {
        console.log(result)
        res.render("roundrobin", {robin: result})
    })  
})

//roundrobinresults
app.post("/roundrobinresults", (req, res) => {
   console.log(req.body)
   Players.findAll()
   .then((players) => {
       players.forEach(function(player) {
           let wins = 0
           for (var i = 0; i < req.body[player.name].length; i++) {
               if (req.body[player.name][i] == "W") {
                   wins += 1
                   //console logs to slow program down
                   console.log("++++++++++++++++++++++++")
                   console.log(req.body[player.name])
                   console.log(wins)
                   console.log("found an eleven!")
                   Players.update({
                       points: wins
                       }, {
                           where: {
                               name: player.name
                           }
                       })
                   }
           }
       })
   })
   .then(()=> {
       setTimeout(() => {
           res.redirect("/roundrobinwinner")
           }, 400)
       })
   .catch(error => {
           console.log(error)
       })
   })


app.get('/roundrobinwinner', (req, res) => {
    Players.findAll({
        order: [
            ['points', 'DESC']]
        })
    .then((players) => {
        res.render("winnerroundrobin", {players: players})
    })
})

//displaysfinalresult
app.get("/finalresult", (req, res) => {
    Players.findAll({
        where: {
                haslost: false
            }
    })
    .then((players) => {
        res.render("winner", {players: players})
    })    
}) 


app.listen(3000, () => {
    console.log("Server is listening on port 3000")
})

