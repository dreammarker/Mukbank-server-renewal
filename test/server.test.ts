
import request from 'supertest'
import app from '../app';
import { expect } from 'chai';
describe('GET 요청',function(){
  it('/hello 요청',(done)=>{
    request(app)
    .get('/hello')
    .end((err,res)=>{
       if(err){
           done(err);
           return;
       }
       expect(res.text).to.equal("hello world~");
       done();
    })
});
});