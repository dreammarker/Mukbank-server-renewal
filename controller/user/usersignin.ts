import express from 'express'
import pdkdf2 from '../../crypto/cipher'
import func from '../func/idCheck';
const { user } = require('../../models');
//회원가입..
export = {
    post : async (req : express.Request, res :express.Response)=>{
      let id  =  req.body.id ; 
      let password   =  req.body.password;
      password = pdkdf2(password);

      let idcheck = await func.idCheck(id);
      if(!idcheck){
        res.send('없는 아이디거나 잘못된 비밀번호 입니다.')
      }
      else{
        let userData = await user.findOne({
          where : {
            identity : id,
            password: password
          }
           }).then(
            (result:any) => result.dataValues
          )
         console.log(userData)
        if(userData){
          res.send('로그인되었습니다.');
        }
        else {
          res.send('없는 아이디거나 잘못된 비밀번호 입니다.');
        }
      }
    }
}