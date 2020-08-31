import express from 'express'
const jwt = require('jsonwebtoken');
require('dotenv').config();
//회원가입..
export = {
    get : async (req : express.Request, res :express.Response)=>{
        let token = req.cookies.userToken;
        if(token){
            const userobj = await jwt.verify(token, (process.env.JWT))
            res.send({token: true, data : userobj})
        }
        else{
            res.send({token : false})
        }
    }
}