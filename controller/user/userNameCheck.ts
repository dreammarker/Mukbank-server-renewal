import express from 'express'
import func from '../func/DuCheck';
//아이디 중복체크
export = {
    post : async (req : express.Request, res :express.Response)=>{
      let name  =  req.body.name ; 
      let idcheck = await func.NameCheck(name);
      let object:any = {};
      if(idcheck){
        object["name"] = name;
        object["oberlap"] = true;
        let objstr = JSON.stringify(object)
        res.status(409).send(objstr);
      }
      else{
        object["name"] = name;
        object["oberlap"] = false;
        let objstr = JSON.stringify(object)
        res.status(200).send(objstr);
      }
    }
}