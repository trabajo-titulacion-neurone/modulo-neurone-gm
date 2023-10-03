//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const Player = require('../models/player');
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
describe('Players',  () => {//Before start test we crete a fake User and App
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
        Player.deleteMany({}, (err) => {
            done();
         });
    });
/*
  * Test the /GET route
  */
  describe('/GET player', () => {
      it('it should GET all the players', (done) => {
        chai.request(app)
            .get('/api/'+'test'+'/players')
            .set({'x-access-token':'token'})
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.players.should.be.a('array');
                  res.body.players.length.should.be.eql(0);
                  res.body.ok.should.be.a('boolean');
                  res.body.ok.should.be.eql(true);
              done();
            });
      });
  });

  /*
  * Test the /POST route
  */
  describe('/POST player', () => {
      it('it should not POST a player without name field', (done) => {
          let player = {
              last_name: "Perez",
              sourceId: "12345"
          }
            chai.request(app)
            .post('/api/'+'test'+'/players')
            .set({'x-access-token':'token'})
            .send(player)
            .end((err, res) => {
                  res.should.have.status(400);
                  res.text.should.be.a('string');
                  res.text.should.be.eql('Write all the fields');
              done();
            });
      });
      it('it should POST an player', (done) => {
        let player = {
            name: "Juan",
            last_name: "Perez",
            sourceId: "12345"
        }
            chai.request(app)
            .post('/api/'+'test'+'/players')
            .set({'x-access-token':'token'})
            .send(player)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.data.should.be.a('object');
                res.body.ok.should.be.a('boolean');
                res.body.ok.should.be.eql(true);
                res.body.data.should.have.property('name');
                res.body.data.should.have.property('last_name');
                res.body.data.should.have.property('sourceId');
                res.body.data.should.have.property('app_code');
              done();
            });
      });
    });

    /*
    * Test the /PUT/:code route
    */
    describe('/PUT/:code player', () => {
        it('it should UPDATE a player given the code', (done) => {
            let player = new Player({
                app_code: "test",
                code: "test_player_Juan",
                name: "Juan",
                last_name: "Perez",
                sourceId: "12345"
            })
            player.save((err, player) => {
                chai.request(app)
                .put('/api/'+'test'+'/players/'+player.code)
                .send({name: "José",
                    last_name: "González",
                    sourceId: "98765",
                    code: "test_player_Jose"})
                .set({'x-access-token':'token'})
                .end((err, res) => {
                        res.should.have.status(200);
                        res.body.data.should.be.a('object');
                        res.body.ok.should.be.a('boolean');
                        res.body.ok.should.be.eql(true);
                        res.body.data.name.should.be.eql('José');
                        res.body.data.last_name.should.be.eql('González');
                        res.body.data.code.should.be.eql('test_player_Jose');
                        res.body.data.sourceId.should.be.eql('98765');
                    done();
                });
            });
        });
    });

  /*
  * Test the /DELETE/:id route
  */
  describe('/DELETE/:code player', () => {
    it('it should DELETE a player given the code', (done) => {
        let player = new Player({
            app_code: "test",
            code: "test_player_Juan",
            name: "Juan",
            last_name: "Perez",
            sourceId: "12345"
        })
        player.save((err, player) => {
              chai.request(app)
              .delete('/api/'+'test'+'/players/'+player.code)
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
    * Test the /GET/:code/completed-challenges route
    */
   describe('/GET/:code/completed-challenges player', () => {
    it('it should GET a player completed challenges of given code', (done) => {
        let player = new Player({
            app_code: "test",
            code: "test_player_Juan",
            name: "Juan",
            last_name: "Perez",
            sourceId: "12345"
        })
        player.save((err, player) => {
            chai.request(app)
            .get('/api/'+'test'+'/players/'+player.code+'/completed-challenges')
            .set({'x-access-token':'token'})
            .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.be.a('array');
                    res.body.ok.should.be.a('boolean');
                    res.body.ok.should.be.eql(true);
                    res.body.data.length.should.be.eql(0);
                done();
            });
        });
     });  
    });

     /*
    * Test the /GET/:code/player-points route
    */
   describe('/GET/:code/player-points player', () => {
    it('it should GET a player points of given code', (done) => {
        let player = new Player({
            app_code: "test",
            code: "test_player_Juan",
            name: "Juan",
            last_name: "Perez",
            sourceId: "12345"
        })
        player.save((err, player) => {
            chai.request(app)
            .get('/api/'+'test'+'/players/'+player.code+'/player-points')
            .set({'x-access-token':'token'})
            .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.be.a('array');
                    res.body.ok.should.be.a('boolean');
                    res.body.ok.should.be.eql(true);
                    res.body.data.length.should.be.eql(0);
                done();
            });
        });
     });  
    });

      /*
    * Test the /GET/:code/badges route
    */
   describe('/GET/:code/badges player', () => {
    it('it should GET a player badges of given code', (done) => {
        let player = new Player({
            app_code: "test",
            code: "test_player_Juan",
            name: "Juan",
            last_name: "Perez",
            sourceId: "12345"
        })
        player.save((err, player) => {
            chai.request(app)
            .get('/api/'+'test'+'/players/'+player.code+'/badges')
            .set({'x-access-token':'token'})
            .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.be.a('array');
                    res.body.ok.should.be.a('boolean');
                    res.body.ok.should.be.eql(true);
                    res.body.data.length.should.be.eql(0);
                done();
            });
        });
     });  
    });

      /*
    * Test the /GET/:code/player-levels route
    */
   describe('/GET/:code/player-levels player', () => {
    it('it should GET a player levels of given code', (done) => {
        let player = new Player({
            app_code: "test",
            code: "test_player_Juan",
            name: "Juan",
            last_name: "Perez",
            sourceId: "12345"
        })
        player.save((err, player) => {
            chai.request(app)
            .get('/api/'+'test'+'/players/'+player.code+'/player-levels')
            .set({'x-access-token':'token'})
            .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.be.a('array');
                    res.body.ok.should.be.a('boolean');
                    res.body.ok.should.be.eql(true);
                    res.body.data.length.should.be.eql(0);
                done();
            });
        });
     });  
    });

});