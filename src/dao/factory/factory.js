import { CartMongoMgr } from '../managers/cart.mongo.js'
import { ProductMongoMgr } from '../managers/product.mongo.js';
import { CartMemoryMgr } from '../filesystem/cart.memory.js';
import { ProductMemoryMgr } from '../filesystem/product.memory.js'
import { MessageMongoMgr } from '../managers/messages.mongo.js'
import { UserMongoMgr } from '../managers/user.mongo.js';
import { pass_recover_mongo } from '../managers/pass.recover.mongo.js';
import env from '../../config/config.js'

export default class DaoFactory {
    constructor(){}

    static getCartDao(){
        const dao = env.PERSISTANCE || 'mongo';
        switch(dao){
            case 'mongo':
                return new CartMongoMgr();
            case 'memory':
                return new CartMemoryMgr();
            default:
                return new CartMongoMgr();
        }
    }

    static getProductDao(){
        const dao = env.PERSISTANCE || 'mongo';
        switch(dao){
            case 'mongo':
                return new ProductMongoMgr();
            case 'memory':
                return new ProductMemoryMgr();
            default:
                return new ProductMongoMgr();
        }
    }

    static getUserDao(){
        const dao = env.PERSISTANCE || 'mongo';
        switch(dao){
            case 'mongo':
                return new UserMongoMgr();
            case 'memory':
                return new UserMemoryMgr();
            default:
                return new UserMongoMgr();
        }
    }

    static getMessageDao(){
        const dao = env.PERSISTANCE || 'mongo';
        switch(dao){
            case 'mongo':
                return new MessageMongoMgr();
            case 'memory':
                return new MessageMemoryMgr();
            default:
                return new MessageMongoMgr();
        }
    }

    static getPassRecover(){
        const dao = env.PERSISTANCE || 'mongo';
        switch(dao){
            case 'mongo':
                return new pass_recover_mongo();
            case 'memory':
                return new pass_recover_memory();
            default:
                return new pass_recover_mongo();
        }
    }
}