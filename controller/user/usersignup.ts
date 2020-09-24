import express from 'express';
import pdkdf2 from '../../crypto/cipher';
import func from '../func/DuCheck';
const { user } = require('../../models');
//회원가입..
export = {
  post: async (req: express.Request, res: express.Response) => {
    let id = req.body.id;
    let nickname = req.body.nickname;
    let password = req.body.password;
    password = pdkdf2(password);

    let idcheck = await func.idCheck(id);
    let NameCheck = await func.NameCheck(nickname);
    if (idcheck && NameCheck) {
      let object: any = { id: false, nickname: false };
      object = JSON.stringify(object);
      res.send(object);
    }

    if (idcheck) {
      let object: any = { id: false, nickname: true };
      object = JSON.stringify(object);
      res.send(object);
    } else if (NameCheck) {
      let object: any = { id: true, nickname: false };
      object = JSON.stringify(object);
      res.send(object);
    } else {
      user
        .create({
          identity: id,
          nick: nickname,
          password: password
        })
        .then(() => {
          let object: any = { id: true, nickname: true };
          object = JSON.stringify(object);
          res.send(object);
        });
    }
  }
};
