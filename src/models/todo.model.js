const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    todo: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    done: {
        type: Boolean,
        default: false,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Todo', TodoSchema);
