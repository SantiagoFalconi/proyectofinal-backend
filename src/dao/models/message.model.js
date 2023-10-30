import mongoose from "mongoose";

const collection = 'messages'

const schema = mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    messages: {
        type: [
            {
                type: String,
                required: true
            }
        ]
    }
})

const messagesModel = mongoose.model(collection, schema)

export default messagesModel;