var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Favorites = require('../models/favorites');
var Verify = require('./verify');

var favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
    Favorites.findOne({"postedBy": req.decoded._id})
        .populate('postedBy')
        .populate('dishes')
        .exec(function (err, favorite) {
        if (err) throw err;
        res.json(favorite);
    });
})


.post(Verify.verifyOrdinaryUser, function(req, res, next) {
    Favorites.findOne({"postedBy" : req.decoded._id}, function(err, favorite) {
        if (err) throw err;
        if (favorite == null) {
            Favorites.create({"postedBy" : req.decoded._id}, function(err, favorite) {
                if (err) throw err;
                console.log('New favorite created!');
                favorite.dishes.push(req.body._id);
                favorite.save(function(err, favorite) {
                    if (err) throw err;
                var id = favorite._id;

                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                console.log('Favorite created!');
                res.end('Added the favorite dish with id: ' + id);
                });
            });
        } else {
            for (i = 0; i < favorite.dishes.length; i++) {
                if (favorite.dishes[i] == req.body._id) {
                    var err = new Error('Dish already exists in favorites!');
                    err.status = 401;
                    return next(err);
                }
            }
            favorite.dishes.push(req.body._id);
            favorite.save(function(err, favorite) {
                if (err) throw err;
                var id = favorite._id;

                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                console.log('Favorite created!');
                res.end('Added the favorite dish with id: ' + id);
            });
        }
    });
})


.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
    Favorites.remove({"postedBy": req.decoded._id}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

favoriteRouter.route('/:dishId')

.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
    Favorites.findOne({postedBy:req.decoded._id}, function (err, favorite) {
        if(err) throw err;
        for(var i = 0; i < favorite.dishes.length; i++) {
            if(favorite.dishes[i] == req.params.dishId) {
                favorite.dishes.splice(i,1);
                break;
            }
        }
        favorite.save(function (err, favorite) {
            if(err) throw err;
            res.json(favorite);
        })
    })
});


module.exports = favoriteRouter;



