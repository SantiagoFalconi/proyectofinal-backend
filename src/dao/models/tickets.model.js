import mongoose from "mongoose";

const collection = 'tickets'

const schema = mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    purchase_datetime: {
        type: Date,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    purchaser: {
        type: String,
        required: true,
    }
});

const ticketModel = mongoose.model(collection, schema);

export default ticketModel;