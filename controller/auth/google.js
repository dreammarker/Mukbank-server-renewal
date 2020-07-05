const jwt = require('jsonwebtoken');
require('dotenv').config();
const { user } = require('../../models');
module.exports = {
  signin: async (req, res) => {
    console.log(req.body);
    let nick = req.body.nick;
    let email = req.body.email;
    let snsid = req.body.snsId;
    let provider = 'google';
    let userimage = req.body.userimage;

    let userobject = {};
    userobject['email'] = email;
    userobject['snsid'] = snsid;
    userobject['provider'] = 'google';
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
      { expiresIn: 60000 }
    );
    res.cookie('loginobj', token);
    res.send();
  }
};
