import chai from 'chai'
import supertest from 'supertest'
import { ProductMongoMgr } from '../dao/mongo/product.mongo.js'
import { CartMongoMgr } from '../dao/mongo/cart.mongo.js'

const product_mgr = new ProductMongoMgr()
const cart_mgr = new CartMongoMgr()
const expect = chai.expect
const requester = supertest(`http://localhost:8080`)

const getProductId = async () => {
    const newProduct = {
        title: 'campera',
        description: 'campera abrigada',
        price: 15000,
        status: true,
        code: '1010',
        stock: 2,
        category: 'campera',
        owner: { role: 'user', createdBy: 'sf@gmail.com' }
    }

    const product = await product_mgr.addProduct(newProduct)
    return product._id.toString()
}

describe('Testing Router Carts', () => {
    let AdminSession;
    let cart_id;


    before('login and set cookie', async () => {
        const mockUser = {
            email: "prueba@gmail.com",
            password: "geccia",
        }

        let loginRes;
        loginRes = await requester.post('/api/session/login').send(mockUser)
        AdminSession = loginRes.headers['set-cookie'][0].split(';')[0].split('=')[1]
    })

    it('POST /api/carts -- Debe crear un carrito vacio', async () => {
        const { _body, statusCode } = await requester.post('/api/carts').set('Cookie',[`coderCookieToken=${AdminSession}`])
        cart_id = _body.userUpdated.cart

        expect(statusCode).to.equal(201)
        expect(_body).to.have.property('status').that.is.an('string')
        expect(_body).to.have.property('message').that.is.an('object')
        expect(_body.message).to.have.property('products').that.is.an('array').that.is.empty
        expect(_body).to.have.property('userUpdated').that.is.an('object')
    })

    
    it('POST /api/carts/:cid/product/:pid -- No debe agregar un producto a el carrito si es un administrador', async () => {
        const prod_id = await getProductId()        
        const result = await requester.post(`/api/carts/${cart_id}/product/${prod_id}`).set('Cookie',[`coderCookieToken=${AdminSession}`])
        
        expect(result.statusCode).to.be.eql(403)
        expect(result.text).to.contain('No tiene permisos')
    })
    
    it('POST /api/carts -- Debe obtener los carritos', async () => {
        const result = await requester.post(`/api/carts`).set('Cookie',[`coderCookieToken=${AdminSession}`])

        expect(result.statusCode).to.equal(201)
        expect(result._body).to.be.an('object').to.have.property('status') 
        expect(result._body).to.be.an('object').to.have.property('message')
        expect(result._body).to.be.an('object').to.have.property('userUpdated')
    })

    after('Delete Cart', async () => {
        const prod_to_delete = await product_mgr.getProductByCode('1010')
        await product_mgr.deleteProduct(prod_to_delete._id)
        await cart_mgr.deleteCart(cart_id)
    })
})