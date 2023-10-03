//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const Point = require('../models/point');
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
describe('Points',  () => {//Before start test we crete a fake User and App
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
        Point.deleteMany({}, (err) => {
            done();
         });
    });
/*
  * Test the /GET route
  */
  describe('/GET point', () => {
      it('it should GET all the points', (done) => {
        chai.request(app)
            .get('/api/'+'test'+'/points')
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
  describe('/POST point', () => {
      it('it should not POST a point with missing field', (done) => {
          let point = {
              name: "Experience",
          }
            chai.request(app)
            .post('/api/'+'test'+'/points')
            .set({'x-access-token':'token'})
            .send(point)
            .end((err, res) => {
                  res.should.have.status(400);
                  res.text.should.be.a('string');
                  res.text.should.be.eql('Write all the fields');
              done();
            });
      });
      it('it should POST a point', (done) => {
            let point = {
                name: "experience",
                abbreviation: "EXP",
                initial_points: 1,
                max_points: -1,
                daily_max: -1,
                is_default: true,
                hidden: true
            }
            chai.request(app)
            .post('/api/'+'test'+'/points')
            .set({'x-access-token':'token'})
            .send(point)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.data.should.be.a('object');
                res.body.ok.should.be.a('boolean');
                res.body.ok.should.be.eql(true);
                res.body.data.should.have.property('name');
                res.body.data.should.have.property('abbreviation');
                res.body.data.should.have.property('initial_points');
                res.body.data.should.have.property('max_points');
                res.body.data.should.have.property('app_code');
                res.body.data.should.have.property('daily_max');
                res.body.data.should.have.property('initial_points');
                res.body.data.should.have.property('is_default');
                res.body.data.should.have.property('hidden');
                res.body.data.should.have.property('code');
              done();
            });
      });
    });

    /*
    * Test the /PUT/:code route
    */
    describe('/PUT/:code point', () => {
        it('it should UPDATE a point given the code', (done) => {
            const point = new Point({
                name: "experience",
                abbreviation: "EXP",
                app_code: "test",
                initial_points: 0,
                max_points: -1,
                daily_max: -1,
                is_default: true,
                hidden: true,
                code: "test_point_exp"
            });
            point.save((err, point) => {
                chai.request(app)
                .put('/api/'+'test'+'/points/'+point.code)
                .send({name: "credit",
                    abbreviation: "CRE",
                    initial_points: 100,
                    max_points: -1,
                    daily_max: -1,
                    is_default: false,
                    hidden: false,
                    code: "test_point_cre"})
                .set({'x-access-token':'token'})
                .end((err, res) => {
                        res.should.have.status(200);
                        res.body.data.should.be.a('object');
                        res.body.ok.should.be.a('boolean');
                        res.body.ok.should.be.eql(true);
                        res.body.data.name.should.be.eql('credit');
                        res.body.data.abbreviation.should.be.eql('CRE');
                        res.body.data.initial_points.should.be.eql(100);
                        res.body.data.max_points.should.be.eql(-1);
                        res.body.data.daily_max.should.be.eql(-1);
                        res.body.data.is_default.should.be.eql(false);
                        res.body.data.hidden.should.be.eql(false);
                        res.body.data.code.should.be.eql("test_point_cre");
                    done();
                });
            });
        });
    });

  /*
  * Test the /DELETE/:id route
  */
  describe('/DELETE/:code point', () => {
    it('it should DELETE a point given the code', (done) => {
        const point = new Point({
            name: "experience",
            abbreviation: "EXP",
            app_code: "test",
            initial_points: 0,
            max_points: -1,
            daily_max: -1,
            is_default: true,
            hidden: true,
            code: "test_point_exp"
        });
        point.save((err, point) => {
              chai.request(app)
              .delete('/api/'+'test'+'/points/'+point.code)
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

});