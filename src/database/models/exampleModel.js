import mongoose from 'mongoose';

const exampleSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true,
    },
    username: {
        type: String,
        required: true,
    },
    joinedAt: {
        type: Date,
        default: Date.now,
    },
    roles: {
        type: [String],
        default: [],
    },
}, {
    timestamps: true,
});

export default mongoose.model('ExampleUser', exampleSchema);
