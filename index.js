const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;


app.listen(PORT, function(err) {
    if(err) {
        console.log(`Error :: ${err} occured while starting the server in index.js!`);
    }
    console.log(`Server is up and running on port ${PORT}`);
});