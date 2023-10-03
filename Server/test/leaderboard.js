//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const Leaderboard = require('../models/leaderboard');
const User = require("../models/user");
const Action = require("../models/action")
const Application = require("../models/application");
const UserToken = require("../models/userToken");

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
let should = chai.should();


chai.use(chaiHttp);
//Our parent block
describe('Leaderboards',  () => {//Before start test we crete a fake User and App
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
        Leaderboard.deleteMany({}, (err) => {
            Action.deleteMany({}, (err) => {
                done();
            })
         });
    });
/*
  * Test the /GET route
  */
  describe('/GET leaderboard', () => {
      it('it should GET all the leaderboards', (done) => {
        chai.request(app)
            .get('/api/'+'test'+'/leaderboards')
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
  describe('/POST leaderboard', () => {
      it('it should not POST a leaderboard with missing field', (done) => {
          let leaderboard = {
              name: "Table1",
          }
            chai.request(app)
            .post('/api/'+'test'+'/leaderboards')
            .set({'x-access-token':'token'})
            .send(leaderboard)
            .end((err, res) => {
                  res.should.have.status(400);
                  res.text.should.be.a('string');
                  res.text.should.be.eql('Write all the fields');
              done();
            });
      });
      it('it should POST a leaderboard', (done) => {
            const action = new Action({name: "action1", description: "description1", code: "test_action_action1", repeatable: true, app_code: "test"});
            action.save((err, action)=> {
                let leaderboard = {
                    name: "Table 1",
                    parameter: "actions",
                    element_code: action.code
                }
                chai.request(app)
                .post('/api/'+'test'+'/leaderboards')
                .set({'x-access-token':'token'})
                .send(leaderboard)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.be.a('object');
                    res.body.ok.should.be.a('boolean');
                    res.body.ok.should.be.eql(true);
                    res.body.data.should.have.property('name');
                    res.body.data.should.have.property('parameter');
                    res.body.data.should.have.property('element_code');
                    res.body.data.should.have.property('code');
                    res.body.data.should.have.property('app_code');
                done();
                });
            })
      });
    });

    /*
    * Test the /PUT/:code route
    */
    describe('/PUT/:code leaderboard', () => {
        it('it should UPDATE an leaderboard given the code', (done) => {
            const action = new Action({name: "action1", description: "description1", code: "test_action_action1", repeatable: true, app_code: "test"});
            action.save((err, action)=> {
                let leaderboard = new Leaderboard({
                    name: "Table 1",
                    parameter: "actions",
                    element_code: action.code,
                    app_code: "test",
                    code: "test_leaderboard_table1"
                });
                leaderboard.save((err, leaderboard) =>{
                    chai.request(app)
                    .put('/api/'+'test'+'/leaderboards/'+leaderboard.code)
                    .send({ name: "Table 2",
                            code: "test_leaderboard_table2"})
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
                })
            })
        });
    });

  /*
  * Test the /DELETE/:id route
  */
  describe('/DELETE/:code leaderboard', () => {
    it('it should DELETE an leaderboard given the code', (done) => {
        const action = new Action({name: "action1", description: "description1", code: "test_action_action1", repeatable: true, app_code: "test"});
            action.save((err, action)=> {
                let leaderboard = new Leaderboard({
                    name: "Table 1",
                    parameter: "actions",
                    element_code: action.code,
                    app_code: "test",
                    code: "test_leaderboard_table1"
                });
                leaderboard.save((err, leaderboard) =>{
                    chai.request(app)
                    .delete('/api/'+'test'+'/leaderboards/'+leaderboard.code)
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
                })
            })
    });
    });

});