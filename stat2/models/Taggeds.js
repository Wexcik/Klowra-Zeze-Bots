const { model, Schema } = require('mongoose');

const taggedSchema = new Schema({
    id: String,
    admin: String,
    cinsiyet: String,
    date: Number
});

module.exports = model('Taggeds', taggedSchema);
