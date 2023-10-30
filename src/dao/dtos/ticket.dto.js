export default class ticketDTO {
    constructor(ticket){
        this.code = ticket.code
        this.purchase_datetime = ticket.date
        this.amount = ticket.totalAmount
        this.purchaser = ticket.email
    }
}