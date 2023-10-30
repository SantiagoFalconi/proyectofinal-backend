import ticketModel from "../models/tickets.model.js"

export class ticketMongoMgr{
    constructor(){}

    async createTicket(newTicket){
        try {
            const ticket = await ticketModel.create(newTicket)
            return ticket
        } catch (error) {
            throw new Error(error.message)
        }
    }
}