import express  from 'express';
import {Request, Response} from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fs from 'fs';
import helmet from 'helmet';
var hpp = require('hpp');
var morgan = require('morgan');
var path = require('path');
var passport = require('passport');
var logger = require('./logger');
//* router
var helloRouter = require('./routes/hello');
var restaurantRouter = require('./routes/restaurant');
var userRouter = require('./routes/user');
var app = express();
app.set('port', process.env.PORT || 5001);
if (process.env.NODE_ENV === 'production') {
    var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
    app.use(morgan('combined', { stream: accessLogStream }));
    app.use(helmet());
    app.use(hpp());
}
else {
    app.use(morgan('dev'));
}
app.use(cors());
app.use(cors({
    origin: 'http://localhost:19001',
    methods: 'GET, POST, DELETE, PATCH, OPTIONS',
    credentials: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use('/hello', helloRouter);
app.use('/restaurant', restaurantRouter);
app.use('/user', userRouter);
app.get('/logout', function (req : Request, res :Response) {
    res.clearCookie('loginobj');
    res.redirect('/');
});
app.use(function (req, res, next) {
    var err = {
        status: 404
    };
    err.status = 404;
    logger.info('404 error');
    next(err);
});
// eslint-disable-next-line
app.use(function (err :any, req :Request, res : Response, next :any) {
    res.status(err.status || 500);
    logger.error(err.message);
    var sendMessage;
    if (err.status === 404) {
        sendMessage = '<h1>404 찾으시는 페이지가 없습니다</h1>';
    }
    else {
        sendMessage = '<h1>서버 에러</h1>';
    }
    var message = req.app.get('env') === 'development' ? err.message : sendMessage;
    res.send(message);
});
app.listen(app.get('port'), function () {
    // eslint-disable-next-line no-console
    console.log("server listen on " + app.get('port') + "...");
});

export = app;
