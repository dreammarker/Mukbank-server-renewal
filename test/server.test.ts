
import request from 'supertest'
import app from '../app';
import { expect } from 'chai';
import { toUnicode } from 'punycode';

const server  = request(app);


describe('/hello GET 요청',function(){
  it('/hello',(done)=>{
    server
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
//랜덤이랑
//회원가입
//내부디비..
//그... 30 개뽑아서 랜덤하던가..
describe('/restaurant/search POST 요청',function(){
  it('/restaurant/search 요청',(done)=>{
    server
    .post('/restaurant/search')
    .send({
        "latitude": 37.528526997042,
        "longitude": 127.115585779351,
        "searchText": "네네치킨"
     })
    .end((err,res)=>{
      if(err){
        done(err);
        return;
      } 
      let result = JSON.parse(res.text);
      expect(result.length).to.equal(20); //갯수 확인
      for(let i=0;i<result.length;i++){
        expect(result[i].name.includes("네네치킨")).to.equal(true); //네네치킨 이름이 포함되있는지
        expect(typeof result[i].distance).to.equal('number');
      }
      done();
    })
  });
})

describe('/restaurant/selectFilter POST 요청',function(){
  it('/restaurant/selectFilter POST 요청',(done)=>{
    server
    .post('/restaurant/selectFilter')
    .send({
      "latitude":  37.570652,
      "longitude": 127.007307,
      "filterText": "카페, 한식"
    })
    .end((err,res)=>{
      if(err){
        done(err);
        return;
      }
      let result = JSON.parse(res.text);
      for(let i=0;i<result.length;i++){
        let check  = result[i].firstchild==='한식'||result[i].parent==='카페';
        expect(check).to.equal(true);
        expect(typeof result[i].distance).to.equal('number');
      }
      done();
    })
  })
});

describe('/restaurant/detail POST 요청',function(){
  it('/restaurant/detail POST 요청',(done)=>{
    server
    .post('/restaurant/detail')
    .send({
      "rest_id":  7460
    })
    .end((err,res)=>{
      if(err){
        done(err);
        return;
      }
      let result = JSON.parse(res.text);
      expect(typeof result.name).to.equal('string');
      expect(result.rest_id===7460).to.equal(true);
      done();
    })
    
  })
});

describe('/user/signin POST 요청', function(){

  it('/user/signin POST 요청 및 들어가는 토큰체크',(done) => {
    server
    .post('/user/signin')
    .send({
      "id":  "maria2",
      "password": "maria2"
    })
    .end((err,res) => {
      if(err){
        done(err);
        return;
      }
      let result: string = res.text;
      
      expect(result).to.equal("로그인되었습니다.");
      expect(res.header['set-cookie'][0].includes('userToken')).to.equals(true);
      done();
    });
  });
});

describe('로그아웃',function(){
  it('/user/signout',(done)=>{
    server
    .get('/user/signout')
    .end((err,res)=>{
     if(err){
       done(err);
       return;
     }
     expect(res.text).to.equal('로그아웃 되었습니다.');
     done();
    })
  })
})