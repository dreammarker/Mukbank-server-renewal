import express from 'express'
import pdkdf2 from '../../crypto/cipher'
import func from '../func/DuCheck';
const { user } = require('../../models');
//회원가입..
export = {
    post : async (req : express.Request, res :express.Response)=>{
      let id  =  req.body.id ; 
      let nickname = req.body.nickname;
      let password   =  req.body.password;
      password = pdkdf2(password);

      let idcheck = await func.idCheck(id);
      if(idcheck){
        res.send('이미 가입된 아이디 입니다.')
      }
      else{
        user.create({
            identity : id,
            nick : nickname,
            password: password
          }).then(()=>{
              res.send("가입이 성공적으로 이루어졌습니다.")
          })
      }
    }
}