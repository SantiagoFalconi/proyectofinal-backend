export const generateProductErrorInfo = (product) => {
    return `One or more properties were incomplete or not valid.
    List of required properties:
    * title: needs to be a String, recieved ${product.newProduct.title}
    * description: needs to be a String, recieved ${product.newProduct.description}
    * price: needs to be a Number, recieved ${product.newProduct.price}
    * status: needs to be a Boolean, recieved ${product.newProduct.status}
    * code: needs to be a String, recieved ${product.newProduct.code}
    * stock: needs to be a Number, recieved ${product.newProduct.stock}
    * category: needs to be a String, recieved ${product.newProduct.category}`
}