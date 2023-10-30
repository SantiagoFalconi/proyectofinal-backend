export default class Pass_recoverRepository{
    constructor(dao){
        this.dao = dao;
    }

    sendEmail = async (email) => {
        return await this.dao.sendEmail(email);
    }
}