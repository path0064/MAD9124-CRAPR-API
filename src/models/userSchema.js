const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        googleId: {
            type: String,
            required: true,
            unique: true
        },

        createAt: {
            type: Date,
            required: true,
            default: Date.now
        },

        updatedAt: {
            type: Date,
            required: true,
            default: Date.now
        }
    }
)

const User = mongoose.model("User", userSchema);

module.exports = User;