var
    express = require("express"),
    app = express(),

    bodyParser = require('body-parser'),
    cors = require('cors'),

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({limit: '5mb'}));
app.use(cors());

var port = process.env.PORT || 3000;
server.listen(port, function () {
    console.log('Server starting on ' + port);
});
