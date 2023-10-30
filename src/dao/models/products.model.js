import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const collection = 'products'

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    owner: {
        createdBy: {
            type: String,
            required: true
        },
        role: {
            type: String,
            default: 'admin'
        }
    }
})

schema.plugin(mongoosePaginate);
const productsModel = mongoose.model(collection, schema);

export default productsModel;