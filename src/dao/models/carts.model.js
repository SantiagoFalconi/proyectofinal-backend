import mongoose from "mongoose";

const collection = 'carts'

const schema = mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products'
                },
                quantity: {
                    type: Number,
                    default: 0,
                    min: 0
                }
            }
        ],
        default: []
    }
});

const cartsModel = mongoose.model(collection, schema);

export default cartsModel;