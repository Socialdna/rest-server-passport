var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');

var Leadership = require('../models/leadership');

var leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.get(function (req, res, next) {
    Leadership.find((req.query), function (err, leadership) {
        if (err) next(err);
        res.json(leadership);
    });
})

.post(Verify.verifyOrdinaryUser, Verify.verifyAdminUser, function (req, res, next) {
    Leadership.create(req.body, function (err, leadership) {
        if (err) next(err);
        console.log('Leader created!');
        var id = leadership._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the leader with id: ' + id);
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdminUser, function (req, res, next) {
    Leadership.remove({}, function (err, resp) {
        if (err) next(err);
        res.json(resp);
    });
});

leaderRouter.route('/:leaderId')
.get(function (req, res, next) {
    Leadership.findById(req.params.leaderId, function (err, leadership) {
        if (err) next(err);
        res.json(leadership);
    });
})

.put(Verify.verifyOrdinaryUser, Verify.verifyAdminUser, function (req, res, next) {
    Leadership.findByIdAndUpdate(req.params.leaderId, {
        $set: req.body
    }, {
        new: true
    }, function (err, leadership) {
        if (err) next(err);
        res.json(leadership);
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdminUser, function (req, res, next) {
    Leadership.findByIdAndRemove(req.params.leaderId, function (err, resp) {
        if (err) next(err);
        res.json(resp);
    });
});


module.exports = leaderRouter;
