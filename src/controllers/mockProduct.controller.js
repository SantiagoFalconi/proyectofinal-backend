import { mockProducts } from '../utils/mocks.js'

export const generateProducts = (req, res) => {
    try {
        const products = []
        for(let i = 0; i < 50; i++){
            products.push(mockProducts())
        }
        res.send(products)
    } catch (error) {
        req.logger.fatal(error)
        res.status(404).send({error: error.message})
    }
    
}