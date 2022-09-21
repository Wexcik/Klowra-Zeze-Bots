const { model, Schema } = require("mongoose");

const schema = new Schema({
    id: String,
    points: { type: Number, default: 0 },
    invites: { type: Number, default: 0 },
    inviter: { type: String, default: 0 },
    voices: { type: Object, default: {} },
    messages: { type: Object, default: {} },
    addedPoint: { type: Object, default: 0 },
    updateRoleDate: Number,
});

module.exports = model("Users", schema);
