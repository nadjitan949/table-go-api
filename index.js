const express = require("express")
const app = express()
require("dotenv").config()
const port = process.env.PORT || 5000

app.get("/", (req, res) => {
    try {

        res.json({message: "Salut"})
        
    } catch (error) {
        console.log(error)
    }
})

app.listen(port, () => {
    try {
        console.log(`Serveur en ligne sur http://localhost:${port}`)
    } catch (error) {
        console.log('Erreur survenus')
    }
})