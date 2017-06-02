var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');

var Promotions = require('../models/promotions');

var promoRouter = express.Router();
promoRouter.use(bodyParser.json());

promoRouter.route('/')
.get(function (req, res, next) {
    Promotions.find((req.query), function (err, promotions) {
        if (err) next(err);
        res.json(promotions);
    });
})

.post(Verify.verifyOrdinaryUser, Verify.verifyAdminUser, function (req, res, next) {
    Promotions.create(req.body, function (err, promotions) {
        if (err) next(err);
        console.log('Promotion created!');
        var id = promotions._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the promotion with id: ' + id);
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdminUser, function (req, res, next) {
    Promotions.remove({}, function (err, resp) {
        if (err) next(err);
        res.json(resp);
    });
});

promoRouter.route('/:promoId')
.get(function (req, res, next) {
    Promotions.findById(req.params.promoId, function (err, promotions) {
        if (err) next(err);
        res.json(promotions);
    });
})

.put(Verify.verifyOrdinaryUser, Verify.verifyAdminUser, function (req, res, next) {
    Promotions.findByIdAndUpdate(req.params.promoId, {
        $set: req.body
    }, {
        new: true
    }, function (err, promotions) {
        if (err) next(err);
        res.json(promotions);
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdminUser, function (req, res, next) {
    Promotions.findByIdAndRemove(req.params.promoId, function (err, resp) {        if (err) next(err);
        res.json(resp);
    });
});


module.exports = promoRouter;
