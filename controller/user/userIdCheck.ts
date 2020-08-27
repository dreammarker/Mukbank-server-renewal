import express from 'express'
import func from '../func/idCheck';
//아이디 중복체크
export = {
    post : async (req : express.Request, res :express.Response)=>{
      let id  =  req.body.id ; 
      let idcheck = await func.idCheck(id);
      if(idcheck){
        res.send('중복된 아이디 입니다.');
      }
      else{
       res.send('중복되지 않은 아이디 입니다.');
      }
    }
}