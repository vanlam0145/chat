const express = require('express');
const bodyParse = require('body-parser');
const ejs = require('ejs');
const http = require('http');
const https = require('https');
const fs = require('fs');
const cookieParse = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const container = require('./container');
const passport = require('passport');
const socketIO = require('socket.io');
const { Users } = require('./helpers/UsersClass');

container.resolve(function (users, _, admin, home, group) {
    const app = SetupExpress();

    function SetupExpress() {
        const app = express();
        const port = process.env.PORT || 3000;

        const server = http.createServer(app);

        const secureIO = socketIO(server);
        mongoose
            .connect(
                "mongodb+srv://cross:123xyz@cluster0-lstqi.mongodb.net/chat?retryWrites=true",
                { useNewUrlParser: true }
            )
            .then(() => console.log("MongoDB successfully connected"))
            .catch(err => console.log(err)
            );
        // app.set('port', port);
        // app.set('secPort', port + 443);
        // var option = {
        //     key: fs.readFileSync('config/private.key'),
        //     cert: fs.readFileSync('config/certificate.pem'),
        // }
        // const secureServer = https.createServer(option, app);
        // secureServer.listen(app.get('secPort'), () => {
        //     console.log(`Secure server listening on port`, app.get('secPort'))
        // })
        server.listen(port, function () {
            console.log(`server run on port : 3000!!!`);
        })
        ConfigureExpress(app);
        require('./socket/groupchat')(secureIO, Users);
        require('./socket/friend')(secureIO);
        const router = require('express-promise-router')();
        users.SetRouting(router);
        admin.SetRouting(router);
        home.SetRouting(router);
        group.SetRouting(router);
        app.use(router);

    }

    function ConfigureExpress(app) {
        require('./passport/passport-local');
        require('./passport/passport-facebook');
        require('./passport/passport-google');

        app.use(express.static('public'));
        app.set('view engine', 'ejs');
        app.use(cookieParse());
        app.use(bodyParse.json());
        app.use(bodyParse.urlencoded({ extended: true }));

        // app.use(validator);
        app.use(session({
            secret: 'mykey',
            resave: true,
            store: new mongoStore({ mongooseConnection: mongoose.connection })
        }))
        app.use(flash());

        app.use(passport.initialize());
        app.use(passport.session());
        app.locals._ = _;
    }
})