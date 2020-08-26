
import request from 'supertest'
import app from '../app';
import { expect } from 'chai';

describe('/hello GET 요청',function(){
  it('/hello',(done)=>{
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
//랜덤이랑
//회원가입
//내부디비..
//그... 30 개뽑아서 랜덤하던가..
describe('/restaurant/search POST 요청',function(){
  it('/restaurant/search 요청',(done)=>{
    request(app)
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
    request(app)
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
})

describe('/restaurant/detail POST 요청',function(){
  it('/restaurant/detail POST 요청',(done)=>{
    request(app)
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
})

