//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const Level = require('../models/level');
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
describe('Levels',  () => {//Before start test we crete a fake User and App
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
            Level.deleteMany({}, (err) => {
                done();
             });
         });
    });
/*
  * Test the /GET route
  */
  describe('/GET level', () => {
      it('it should GET all the levels', (done) => {
        chai.request(app)
            .get('/api/'+'test'+'/levels')
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
  describe('/POST level', () => {
      it('it should not POST a level without point_code field', (done) => {
          let level = {
              name: "level 1",
              description: "sample",
              point_threshold: 100
          }
            chai.request(app)
            .post('/api/'+'test'+'/levels')
            .set({'x-access-token':'token'})
            .send(level)
            .end((err, res) => {
                  res.should.have.status(400);
                  res.text.should.be.a('string');
                  res.text.should.be.eql('Write all the fields');
              done();
            });
      });
      it('it should not POST a level with with a point that does not exist', (done) => {
        let level = {
            name: "level 1",
            description: "sample",
            point_threshold: 100, 
            point_required: "point"
        }
          chai.request(app)
          .post('/api/'+'test'+'/levels')
          .set({'x-access-token':'token'})
          .send(level)
          .end((err, res) => {
                res.should.have.status(400);
                res.text.should.be.a('string');
                res.text.should.be.eql("Failed! Point specified doesn't exist!");
            done();
          });
     });
      it('it should POST a level', (done) => {
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
                let level = {
                    name: "level 1",
                    description: "sample",
                    point_threshold: 100, 
                    point_required: point.code
                }
                chai.request(app)
                .post('/api/'+'test'+'/levels')
                .set({'x-access-token':'token'})
                .send(level)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.be.a('object');
                    res.body.ok.should.be.a('boolean');
                    res.body.ok.should.be.eql(true);
                    res.body.data.should.have.property('name');
                    res.body.data.should.have.property('code');
                    res.body.data.should.have.property('description');
                    res.body.data.should.have.property('point_threshold');
                    res.body.data.should.have.property('point_required');
                    res.body.data.should.have.property('app_code');
                    done();
                });
            })
      });
    });

    /*
    * Test the /PUT/:code route
    */
    describe('/PUT/:code level', () => {
        it('it should UPDATE an level given the code', (done) => {
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
                let level = new Level({
                    name: "level 1",
                    code: "test_level_lvl1",
                    description: "sample",
                    point_threshold: 100, 
                    point_required: point._id,
                    app_code: "test"
                });
                level.save((err, level) => {
                    chai.request(app)
                    .put('/api/'+'test'+'/levels/'+level.code)
                    .send({name: "level 2", code: "test_level_lvl2", description: "no sample", point_threshold: 200})
                    .set({'x-access-token':'token'})
                    .end((err, res) => {
                            res.should.have.status(200);
                            res.body.data.should.be.a('object');
                            res.body.ok.should.be.a('boolean');
                            res.body.ok.should.be.eql(true);
                            res.body.data.name.should.be.eql('level 2');
                            res.body.data.code.should.be.eql('test_level_lvl2');
                            res.body.data.description.should.be.eql('no sample');
                            res.body.data.point_threshold.should.be.eql(200);
                        done();
                    });
                });
            })
        });
    });

  /*
  * Test the /DELETE/:id route
  */
  describe('/DELETE/:code level', () => {
    it('it should DELETE an level given the code', (done) => {
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
            let level = new Level({
                name: "level 1",
                code: "test_level_lvl1",
                description: "sample",
                point_threshold: 100, 
                point_required: point._id,
                app_code: "test"
            });
            level.save((err, level) => {
                chai.request(app)
                .delete('/api/'+'test'+'/levels/'+level.code)
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
