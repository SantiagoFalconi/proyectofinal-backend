export default class MessagesRepository{
    constructor(dao){
        this.dao = dao;
    }

    getMessages = async () => {
        const messages = await this.dao.getMessages();
        return messages
    }

    addMessage = async (message) => {
        await this.dao.addMessage(message);
    }
}