import express from 'express'
require('dotenv').config();
//회원가입..
export = {
    get : (req : express.Request, res :express.Response) => {
     //쿠키를 삭제한다.
     res.clearCookie('userToken');
     res.send('로그아웃 되었습니다.')
    }
}