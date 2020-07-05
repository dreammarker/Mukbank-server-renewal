const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fs = require('fs');
const helmet = require('helmet');
const hpp = require('hpp');
const morgan = require('morgan');
const path = require('path');
const passport = require('passport');
const logger = require('./logger');
const { sequelize } = require('./models');

//* router
const helloRouter = require('./routes/hello');
const authRouter = require('./routes/auth');
const passportConfig = require('./passport');
const restaurantRouter = require('./routes/restaurant');
const userRouter = require('./routes/user');

const app = express();
sequelize.sync();
passportConfig(passport);
app.set('port', process.env.PORT || 5001);

if (process.env.NODE_ENV === 'production') {
  const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    { flags: 'a' }
  );
  app.use(morgan('combined', { stream: accessLogStream }));
  app.use(helmet());
  app.use(hpp());
} else {
  app.use(morgan('dev'));
}

// app.use(cors());
app.use(
  cors({
    origin: 'http://localhost:19001', // 19000 ~ 19010
    methods: 'GET, POST, DELETE, PATCH, OPTIONS',
    credentials: true
  })
);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());

app.use('/hello', helloRouter);
app.use('/auth', authRouter);
app.use('/restaurant', restaurantRouter);
app.use('/user', userRouter);

app.get('/logout', function(req, res) {
  res.clearCookie('loginobj');
  res.redirect('/');
});

app.use((req, res, next) => {
  const err = new Error('404 NOT FOUND');
  err.status = 404;
  logger.info('404 error');
  next(err);
});

// eslint-disable-next-line
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  logger.error(err.message);

  let sendMessage;
  if (err.status === 404) {
    sendMessage = '<h1>404 찾으시는 페이지가 없습니다</h1>';
  } else {
    sendMessage = '<h1>서버 에러</h1>';
  }

  const message =
    req.app.get('env') === 'development' ? err.message : sendMessage;
  res.send(message);
});

app.listen(app.get('port'), () => {
  // eslint-disable-next-line no-console
  console.log(`server listen on ${app.get('port')}...`);
});
