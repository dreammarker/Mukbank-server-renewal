const jwt = require('jsonwebtoken');
require('dotenv').config();
import express from 'express';
export = {
  get: (req:express.Request, res:express.Response) => {
    try {
      let  token:any = req.headers;
      token = token.authorization.split(' ')[1];
      console.log(token);
      const userobj = jwt.verify(token, process.env.JWT_KEY).data;
      console.log(userobj);
      if (userobj.id) {
        res.json({
          name: userobj.nick,
          email: userobj.email,
          snsId: userobj.snsId,
          profile: userobj.userimage,
          provider: userobj.provider
        });
      } else {
        console.log('wrong');
        res.status(400).send('wrong');
      }
    } catch (err) {
      console.log(err);
      res.send('failed');
    }
  }
};
