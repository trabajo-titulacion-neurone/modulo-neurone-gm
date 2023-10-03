//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const Challenge = require('../models/challenge');
const Action = require('../models/action');
const User = require("../models/user");
const Application = require("../models/application");
const UserToken = require("../models/userToken");

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
let should = chai.should();


chai.use(chaiHttp);
//Our parent block
describe('Challenges',  () => {//Before start test we crete a fake User and App
    before( async () => {
        await Application.deleteMany({});
        await UserToken.deleteMany({});
        await User.deleteMany({});
        testUser = new User({username: 'usertest', email: 'test@email.com'});
        await testUser.save();
        newApplication = new Application({name: 'test', code: 'test', description: 'sample', focus: true, owner: testUser.username});
        await newApplication.save();
        newUserToken = new UserToken({username: testUser.username, token: "token", timestamp: new Date(), expiration: 1000000});
        await newUserToken.save();
    })
    beforeEach((done) => { //Before each test we empty the database
        Action.deleteMany({}, (err) => {
            Challenge.deleteMany({}, (err) => {
                done();
             });
         });
    });
/*
  * Test the /GET route
  */
  describe('/GET challenge', () => {
      it('it should GET all the challenges', (done) => {
        chai.request(app)
            .get('/api/'+'test'+'/challenges')
            .set({'x-access-token':'token'})
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.data.should.be.a('array');
                  res.body.data.length.should.be.eql(0);
                  res.body.ok.should.be.a('boolean');
                  res.body.ok.should.be.eql(true);
              done();
            });
      });
  });

  /*
  * Test the /POST route
  */
  describe('/POST challenge', () => {
      it('it should not POST a challenge with missing fields', (done) => {
          let challenge = {
              name: "challenge 1",
              description: "sample"
          }
            chai.request(app)
            .post('/api/'+'test'+'/challenges')
            .set({'x-access-token':'token'})
            .send(challenge)
            .end((err, res) => {
                  res.should.have.status(400);
                  res.text.should.be.a('string');
                  res.text.should.be.eql('Write all the fields');
              done();
            });
      });

      it('it should POST a challenge', (done) => {
        const action = new Action({name: "action1", description: "description1", code: "test_action_action1", repeatable: true, app_code: "test"});
            action.save((err, action) => {
                let challenge = {
                    name: "challenge 1",
                    description: "sample",
                    start_date: "2020/09/18", 
                    end_date: "2020/09/20",
                    actions_required: [{action_code: action.code, times_required: 1}]
                }
                chai.request(app)
                .post('/api/'+'test'+'/challenges')
                .set({'x-access-token':'token'})
                .send(challenge)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.challenge.should.be.a('object');
                    res.body.ok.should.be.a('boolean');
                    res.body.ok.should.be.eql(true);
                    res.body.challenge.should.have.property('name');
                    res.body.challenge.should.have.property('code');
                    res.body.challenge.should.have.property('description');
                    res.body.challenge.should.have.property('start_date');
                    res.body.challenge.should.have.property('end_date');
                    res.body.challenge.should.have.property('actions_required');
                    done();
                });
            })
      });
      /*
      it('it should not POST a challenge with with a action that does not exist', (done) => {
          chai.request(app)
          .post('/api/'+'test'+'/challenges')
          .set({'x-access-token':'token'})
          .send({
            name: "challenge 1",
            description: "sample",
            start_date: "2020/09/18", 
            end_date: "2020/09/20",
            actions_required: [{action_code: "code", times_required: 1}]
            })
          .end((err, res) => {
              console.log(err)
                res.should.have.status(400);
                res.text.should.be.a('string');
            done();
          });
    });*/

    });

    /*
    * Test the /PUT/:code route
    */
    describe('/PUT/:code challenge', () => {
        it('it should UPDATE an challenge given the code', (done) => {
            const action = new Action({name: "action1", description: "description1", code: "test_action_action1", repeatable: true, app_code: "test"});
            action.save((err, action) => {
                let challenge = new Challenge({
                    name: "challenge 1",
                    code: "test_challenge_challenge1",
                    app_code: "test",
                    description: "sample",
                    start_date: "2020/09/18", 
                    end_date: "2020/09/20",
                    actions_required: [{action: action._id, times_required: 1}]
                })
                challenge.save((err, challenge) => {
                    chai.request(app)
                    .put('/api/'+'test'+'/challenges/'+challenge.code)
                    .send({name: "challenge 2", code: "test_challenge_challenge2", description: "no sample", start_date: "2020/09/28", end_date: "2020/09/30"})
                    .set({'x-access-token':'token'})
                    .end((err, res) => {
                            res.should.have.status(200);
                            res.body.data.should.be.a('object');
                            res.body.ok.should.be.a('boolean');
                            res.body.ok.should.be.eql(true);
                            res.body.data.name.should.be.eql('challenge 2');
                            res.body.data.code.should.be.eql('test_challenge_challenge2');
                            res.body.data.description.should.be.eql('no sample');
                        done();
                    });
                });
            })
        });
    });

  /*
  * Test the /DELETE/:id route
  */
  describe('/DELETE/:code challenge', () => {
    it('it should DELETE an challenge given the code', (done) => {
        const action = new Action({name: "action1", description: "description1", code: "test_action_action1", repeatable: true, app_code: "test"});
            action.save((err, action) => {
                let challenge = new Challenge({
                    name: "challenge 1",
                    code: "test_challenge_challenge1",
                    app_code: "test",
                    description: "sample",
                    start_date: "2020/09/18", 
                    end_date: "2020/09/20",
                    actions_required: [{action: action._id, times_required: 1}]
                })
                challenge.save((err, challenge) => {
                chai.request(app)
                .delete('/api/'+'test'+'/challenges/'+challenge.code)
                .set({'x-access-token':'token'})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.be.a('object');
                    res.body.ok.should.be.a('boolean');
                    res.body.ok.should.be.eql(true);
                    res.body.data.should.have.property('ok').eql(1);
                    res.body.data.should.have.property('n').eql(1);
                    done();
                });
            });
        })
    });
    });
});
