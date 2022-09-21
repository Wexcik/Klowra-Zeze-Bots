const { model, Schema } = require('mongoose');

const staffSchema = new Schema({
    id: String,
    admin: String,
    cinsiyet: String,
    date: Number
});

module.exports = model('Staffs', staffSchema);
