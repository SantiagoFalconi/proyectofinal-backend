import fs from 'fs/promises'

export class ProductMemoryMgr {
    constructor(path) {
        this.id = 0;
        this.path = path;
        this.products = [];
    }

    async loadProducts(){
        const json = await fs.readFile(this.path, 'utf-8');
        if (!json) {
            await this.saveProducts();
        } else {
            const products = JSON.parse(json);
            if (products.length > 0){
                this.products = products;
                this.id = this.products[this.products.length - 1].id; 
            }
        }    
    }

    async saveProducts(){
        const json = JSON.stringify(this.products, null, 2)
        await fs.writeFile(this.path, json)
    }

    async addProduct(newProduct){
        await this.loadProducts();
        const {title, description, code, price, status, stock, category, thumbails} = newProduct;
        if (title && description && code && price && status && stock && category){
            this.validateTypeof(title, description, code, price, status, stock, category);
            const existCode = this.products.some(product => product.code === code)
            if (existCode){
                throw new Error("Code already exists");
            } else {
                this.products.push({ id: ++this.id, title, description, price, thumbails, code, stock});
                await this.saveProducts();
            }
        } else {
            throw new Error("Missing fields");
        }  
    }

    async getProducts(){
        await this.loadProducts();
        return this.products;
    }

    async getProductById(id){
        await this.loadProducts();
        const productID = this.products.find(product => product.id === parseInt(id));
        if (productID){
            return productID;
        } else {
            throw new Error("Product Not Found")
        }
    }

    async updateProduct(id, data){
        await this.loadProducts();
        const indexID = this.products.findIndex(product => product.id === parseInt(id));
        if (indexID !== -1){
            this.products[indexID] = {
                ...this.products[indexID], 
                ...data 
            }
            await this.saveProducts();
            return ("Updated Product")
        } else {
            throw new Error("Not Found")
        }
    }

    async deleteProduct(id){
        await this.loadProducts();
        const existID = this.products.findIndex(product => product.id === parseInt(id));
        if (existID !== -1){
            this.products.splice(existID, 1)
            await this.saveProducts()
            return ("Removed Product")
        } else {
            throw new Error("Not Found")
        }
    }

    validateTypeof(title, description, code, price, status, stock, category){
        if ( 
            typeof title        !== "string" || 
            typeof description  !== "string" || 
            typeof code         !== "string" || 
            typeof category     !== "string"
        ){
            throw new Error("Verify that title, description, code or category are of type string")
        }
        if ( 
            typeof price !== "number" || 
            typeof stock !== "number"
        ){
            throw new Error("Verify that price or stock are of type number")
        }
        if ( typeof status !== "boolean"){
            this.products[indexID].status = true;
        }
    }
} 