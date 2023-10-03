const User = require('../models/user');
const UserToken = require('../models/userToken');
const axios = require("axios");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authSignIn = async (body, callback) => {
    const {username, password} = body;
    const url = process.env.AuthPORT+'/credential/signin';
    await UserToken.deleteOne({username: username}, err => {
        if (err) {
            callback(err)
        }
    })
    await axios.post(url, {username: username, password: password, service: "NEURONE-GM"}).then((axiosRes) => {
        User.findOne({username: axiosRes.data.username}, (err, user)=> {
            if (err) {
                callback(err)
            }
            if(!user){
                const newUser = new User({
                    username: axiosRes.data.username,
                    neuroneauth: true
                })
                newUser.save((err, user)=> {
                    if (err) {
                        callback(err)
                    }
                    const userToken = new UserToken({
                        username: axiosRes.data.username,
                        token: axiosRes.data.accessToken,
                        timestamp: new Date(),
                        expiration: 31556900000 //a year in ms
                    })
                    userToken.save(err => {
                        if (err) {
                            res.status(500).send({ message: err });
                            return;
                        }
                        callback(null, axiosRes.data)
                    })
                })
            }
            else{
                const userToken = new UserToken({
                    username: axiosRes.data.username,
                    token: axiosRes.data.accessToken,
                    timestamp: new Date(),
                    expiration: 31556900000 //a year in ms
                })
                userToken.save(err => {
                    if (err) {
                        callback(err)
                    }
                    callback(null, axiosRes.data)
                })
            }
        })
    }).catch((err) => {
        callback(err)
    });
}

const signIn = async (body, callback) => {
    //checking if username exists
    const user = await User.findOne({ username: body.username });
    if(!user) callback('Email is not found!');
    //checking password
    const validPass = await bcrypt.compare(body.password, user.password);
    if(!validPass) callback('Invalid password!');
    //create and assign a token
    else{
        const token = await jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
        callback(null, {user: user, accessToken: token});
    }
}

const authService = {
    authSignIn,
    signIn
};

module.exports = authService;