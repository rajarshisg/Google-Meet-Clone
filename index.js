const express = require('express');
const app = express();
const server = require('http').Server(app);
const PORT = process.env.PORT || 8000;


app.set('view engine', 'ejs');
app.set('views', './views');
app.get('/', function(req, res) {
    return res.render('room');
})


server.listen(PORT, function(err) {
    if(err) {
        console.log(`Error :: ${err} occured while starting the server in index.js!`);
    }
    console.log(`Server is up and running on port ${PORT}`);
});