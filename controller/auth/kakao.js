const jwt = require('jsonwebtoken');
require('dotenv').config();
const { user } = require('../../models');
const axios = require('axios');

module.exports = {
  access: (req, res) => {
    let code = req.query.code;
    console.log(req.query.code);
    axios
      .post({
        method: 'post',
        url: 'https://kauth.kakao.com/oauth/token',
        data: {
          grant_type: 'authorization_code',
          client_id: process.env.KAKAO_CLIEND_ID,
          redirect_uri: 'http://localhost:5001/auth/kakao/callack',
          code: code
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
      })
      .then(reuslt => {
        console.log(reuslt);
        // res.send(reuslt);
      });
  },
  get: (req, res) => {
    console.log('req user~~~', req.user);
    const token = jwt.sign(
      {
        data: req.user
      },
      process.env.JWT_KEY,
      { expiresIn: 60000 }
    );

    console.log('token...', token);
    res.cookie('jwt', token);
    res.json({ token });
  },
  callback: (req, res) => {
    console.log(req.body);
    res.send('');
  },

  signin: async (req, res) => {
    console.log(req.body);
    let nick = req.body.nick;
    let email = req.body.email;
    let snsid = req.body.snsId;
    let provider = 'kakao';
    let userimage = req.body.userimage;

    let userobject = {};
    userobject['email'] = email;
    userobject['snsid'] = snsid;
    userobject['provider'] = 'kakao';
    userobject['userimage'] = userimage;
    userobject['nick'] = nick;
    console.log(userobject);
    let exUser = await user.findOne({
      where: {
        nick: nick,
        snsId: snsid,
        provider: provider,
        email: email
      }
    });

    if (exUser) {
    } else {
      exUser = await user.create({
        nick: nick,
        snsId: snsid,
        email: email,
        provider: provider,
        userimage: userimage
      });
    }

    if (!exUser) {
      res.status(400);
      res.send('loginFailed');
    }
    console.log(exUser.dataValues);

    const token = jwt.sign(
      {
        data: exUser.dataValues
      },
      process.env.JWT_KEY,
      { expiresIn: '24h' } // default는 ms 입니다.
    );
    // res.cookie('loginobj', token);
    res.json({ jwt: token });
  }
};

// const jwt = require('jsonwebtoken');
// require('dotenv').config();
// module.exports = {
//   signin: async (req, res) => {
//     console.log(req.body);
//     let nick = req.body.nick;
//     let email = req.body.email;
//     let snsid = req.body.snsId;
//     let provider = 'kakao';
//     let userimage = req.body.userimage;

//     let userobject = {};
//     userobject['email'] = email;
//     userobject['snsid'] = snsid;
//     userobject['provider'] = 'google';
//     userobject['userimage'] = userimage;
//     userobject['nick'] = nick;
//     console.log(userobject);
//     let exUser = await user.findOne({
//       where: {
//         nick: nick,
//         snsId: snsid,
//         provider: provider,
//         email: email
//       }
//     });

//     if (exUser) {
//     } else {
//       exUser = await user.create({
//         nick: nick,
//         snsId: snsid,
//         email: email,
//         provider: provider,
//         userimage: userimage
//       });
//     }

//     if (!exUser) {
//       res.status(400);
//       res.send('loginFailed');
//     }
//     console.log(exUser.dataValues);

//     const token = jwt.sign(
//       {
//         data: exUser.dataValues
//       },
//       process.env.JWT_KEY,
//       { expiresIn: '24h' } // default는 ms 입니다.
//     );
//     // res.cookie('loginobj', token);
//     res.json({ jwt: token });
//   }
// };
