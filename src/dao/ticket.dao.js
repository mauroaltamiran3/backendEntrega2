import Ticket from '../models/Ticket.js';

export const createTicket = async (ticketData) => {
  return await Ticket.create(ticketData);
};