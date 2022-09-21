const mongoose = require("mongoose");

const RLSchema = mongoose.Schema({
    Id: { type: String, default: null },
    Logs: { type: Array, default: [] }
});

module.exports = mongoose.model('RolLogs', RLSchema);