export default class UsersRepository{
    constructor(dao){
        this.dao = dao;
    }

    getAll = async() => {
        const users = await this.dao.getAll();
        return users
    }

    getUserByEmail = async (email) => {
        const user = await this.dao.getUserByEmail(email);
        return user
    }

    getInactiveUsers = async (time) => {
        const users = await this.dao.getInactiveUsers(time);
        return users
    }

    getUserById = async (id) => {
        return await this.dao.getUserById(id);
    }

    addCartToUser = async (cid, email) => {
        return await this.dao.addCartToUser(cid, email);
    }

    updateUser = async (email, data) => {
        return await this.dao.updateUser(email, data);
    }

    deleteUser = async (id) => {
        return await this.dao.deleteUser(id)
    }

    deleteInactiveUsers = async (time) => {
        return await this.dao.deleteInactiveUsers(time)
    }

    setLastConnection = async (email) => {
        return await this.dao.setLastConnection(email)
    }

    updateUserDocuments = async (id, files) => {
        return await this.dao.updateUserDocuments(id, files)
    }
}