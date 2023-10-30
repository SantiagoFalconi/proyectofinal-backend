import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const userCollection = 'User'

const schema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    dob: {
        type: Date,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts',
        required: false
    },
    role: {
        type: String,
        required: true,
        default: 'user'
    },
    documents: [{
        name: String,
        reference: String
    }],
    last_connection: {
        type: Date,
        required: false
    }
})

schema.plugin(mongoosePaginate);
const UserModel = mongoose.model(userCollection, schema);

export default UserModel;