// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;


// create a schema
var promotionsSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ''
    },
    featured: {
        type: Boolean,
        default: false
    },
    price: {
        type: Currency,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

// the schema is useless so far
// we need to create a model using it
var Promotions = mongoose.model('Promotion', promotionsSchema);

// make this available to our Node applications
module.exports = Promotions;