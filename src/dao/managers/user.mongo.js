import UserModel from "../models/user.model.js";

export class UserMongoMgr{
    async getAll(){
        try {
            const users = await UserModel.find().lean()
            return users
        } catch (error) {
            throw error
        }
    }

    async getUserByEmail(email){
        try {
            const user = await UserModel.findOne({email: email})
            return user
        } catch (error) {
            throw error
        }
    }

    async getInactiveUsers(time){
        try {
            const users = await UserModel.find({
                last_connection: {
                    $lt: new Date(time)   
                }
            })
            return users
        } catch (error) {
            throw error
        }
    }

    async getUserById(id){
        try {
            const user = await UserModel.findOne({_id: id})
            return user
        } catch (error) {
            throw error
        }
    }

    async addCartToUser(cid, email){
        try {
            const user = await UserModel.findOneAndUpdate(
                {email: email},
                {$set: { cart: cid }},
                {new: true }
            );
            return user
        } catch (error) {
            throw error
        }
    }

    async updateUser(email, data){
        try {
            const result = await UserModel.updateOne({email: email}, data)
            return {message: `The user was updated successfully`, status: result}
        } catch (error) {
            throw error
        }
    }

    async deleteUser(id){
        try {
            const result = await UserModel.deleteOne({_id: id})
            return result
        } catch (error) {
            throw error
        }
    }

    async deleteInactiveUsers(time){
        try {
            const result = await UserModel.deleteMany({
                last_connection: {
                    $lt: new Date(time)
                }
            })
            return result
        } catch (error) {
            throw error
        }
    }

    async setLastConnection(email){
        try {
            await UserModel.updateOne(
                {email: email},
                {$set: { last_connection: new Date()}}
            );
        } catch (error) {
            throw error
        }
    }

    async updateUserDocuments(id, files){
        try {
            const user = await this.getUserById(id)
            const documents = user.documents || []
            const newDocuments = [
                ...documents,
                 ...files.map(file => ({name: file.originalname, reference: file.path}))]
            return await UserModel.updateOne({ documents: newDocuments})
        } catch (error) {
            throw error
        }
    }
}