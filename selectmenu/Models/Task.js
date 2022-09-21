const { model, Schema } = require("mongoose");

const schema = new Schema({
    id: String,
    voices: Object,
    invites: Object,
    messages: Object,
    registers: Object,
    taskInvites: Number,
    taskRegisters: Number,
    taskMessages: Number,
    taskVoices: Number,
    startTime: Number
});

module.exports = model("Tasks", schema);
