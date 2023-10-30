import ticketDTO from '../dao/dtos/ticket.dto.js'
import uniqid from 'uniqid'

export const ticketProcess = (email, successProducts) => {
    const code = uniqid()
    const date = new Date()
    const totalAmount = successProducts.reduce((total, product) => total + product.amount * product.quantity, 0)  
    const dataTicket = {code, date, totalAmount, email}
    const ticket = new ticketDTO(dataTicket)
    return ticket
}