const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a role name'],
        unique: true
    },
    description: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Role', RoleSchema);
