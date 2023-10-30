import EError from './enums.js'

export default (error, req, res, next) => {
    switch(error.code){
        case EError.INVALID_TYPES_ERROR:
            res.status(400).send({status: 'error', error: error.message})
            break;
        default:
            res.status(500).send({status: 'error', error: 'Internal Server Error'})
    }
}