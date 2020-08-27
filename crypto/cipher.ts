import crypto from 'crypto';
require('dotenv').config();
// 암호화
export  =  (password:string) => { 
    var shasum = crypto.createHmac("sha256", String(process.env.SALT))
    .update(password)
    .digest("hex"); //암호화..
    return shasum;
}