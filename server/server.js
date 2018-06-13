var
    express = require("express"),
    app = express(),

    bodyParser = require('body-parser'),
    cors = require('cors'),

    server = require('http').createServer(app),
    io = require('socket.io')(server),
    socketListener = require('./sockets/base'),

    DB = require('./dao/db'),
    DB_URL = 'mongodb://localhost:27017/OCS';

socketListener(io);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({limit: '5mb'}));
app.use(cors());

DB.connect(DB_URL).then(
    function(dbObj) {
        console.log('Connected to DB');
        app.use(function(req, res, next) {
            req.DB = dbObj;
            next();
        });

        app.use('/user/', require('./routes/user'));
        app.use('/catalog/', require('./routes/catalog'));
        app.use('/cart/', require('./routes/cart'));
        app.use('/branch/', require('./routes/branch'));
        app.use('/message/', require('./routes/message'));
    },

    function (err) {
        console.log('Failed to connect to DB');
        throw err;
    });

var port = process.env.PORT || 3000;
server.listen(port, function () {
    console.log('Server starting on ' + port);
});
