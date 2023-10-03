//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
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
describe('Actions',  () => {//Before start test we crete a fake User and App
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
            done();
         });
    });
/*
  * Test the /GET route
  */
  describe('/GET action', () => {
      it('it should GET all the actions', (done) => {
        chai.request(app)
            .get('/api/'+'test'+'/actions')
            .set({'x-access-token':'token'})
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.actions.should.be.a('array');
                  res.body.actions.length.should.be.eql(0);
                  res.body.ok.should.be.a('boolean');
                  res.body.ok.should.be.eql(true);
              done();
            });
      });
  });

  /*
  * Test the /POST route
  */
  describe('/POST action', () => {
      it('it should not POST a action without name field', (done) => {
          let action = {
              description: "do something",
              repeatable: false
          }
            chai.request(app)
            .post('/api/'+'test'+'/actions')
            .set({'x-access-token':'token'})
            .send(action)
            .end((err, res) => {
                  res.should.have.status(400);
                  res.text.should.be.a('string');
                  res.text.should.be.eql('Write all the fields');
              done();
            });
      });
      it('it should POST an action', (done) => {
        let action = {
            name: "task",
            description: "do something",
            repeatable: true
        }
            chai.request(app)
            .post('/api/'+'test'+'/actions')
            .set({'x-access-token':'token'})
            .send(action)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.data.should.be.a('object');
                res.body.ok.should.be.a('boolean');
                res.body.ok.should.be.eql(true);
                res.body.data.should.have.property('name');
                res.body.data.should.have.property('code');
                res.body.data.should.have.property('repeatable');
                res.body.data.should.have.property('description');
                res.body.data.should.have.property('app_code');
              done();
            });
      });
    });

    /*
    * Test the /PUT/:code route
    */
    describe('/PUT/:code action', () => {
        it('it should UPDATE an action given the code', (done) => {
            let action = new Action({
                name: "task",
                app_code: "test",
                code: "test_action_task",
                description: "do something",
                repeatable: true
            })
            action.save((err, action) => {
                chai.request(app)
                .put('/api/'+'test'+'/actions/'+action.code)
                .send({name: "task2", code: "test_action_task2", description: "do nothing", repeatable: false})
                .set({'x-access-token':'token'})
                .end((err, res) => {
                        res.should.have.status(200);
                        res.body.data.should.be.a('object');
                        res.body.ok.should.be.a('boolean');
                        res.body.ok.should.be.eql(true);
                        res.body.data.name.should.be.eql('task2');
                        res.body.data.code.should.be.eql('test_action_task2');
                        res.body.data.description.should.be.eql('do nothing');
                        res.body.data.repeatable.should.be.eql(false);
                    done();
                });
            });
        });
    });

  /*
  * Test the /DELETE/:id route
  */
  describe('/DELETE/:code action', () => {
    it('it should DELETE an action given the code', (done) => {
        let action = new Action({
            name: "task",
            app_code: "test",
            code: "test_action_task",
            description: "do something",
            repeatable: true
        })
        action.save((err, action) => {
              chai.request(app)
              .delete('/api/'+'test'+'/actions/'+action.code)
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
    });
    });

    /*
  * Test the /GET route
  */
  describe('/GET/:code action', () => {
    it('it should GET all the actions', (done) => {
      chai.request(app)
          .get('/api/'+'test'+'/actions')
          .set({'x-access-token':'token'})
          .end((err, res) => {
            res.should.have.status(200);
            res.body.actions.should.be.a('array');
            res.body.actions.length.should.be.eql(0);
            res.body.ok.should.be.a('boolean');
            res.body.ok.should.be.eql(true);
            done();
          });
    });
});

});