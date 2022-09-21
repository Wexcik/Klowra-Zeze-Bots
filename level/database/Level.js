const { Schema, model } = require('mongoose');

const levelSchema = new Schema({
    id: String,
    messageLevel: { type: Number, default: 0 },
    messageRequiredXP: { type: Number, default: 100 },
    messageCurrentXP: { type: Number, default: 0 },
    voiceLevel: { type: Number, default: 0 },
    voiceRequiredXP: { type: Number, default: 100 },
    voiceCurrentXP: { type: Number, default: 0 },
    inviteLevel: { type: Number, default: 0 },
    inviteRequiredXP: { type: Number, default: 100 },
    inviteCurrentXP: { type: Number, default: 0 },
});

module.exports = model('Levels', levelSchema);
