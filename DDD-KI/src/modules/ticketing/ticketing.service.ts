// Service for selling tickets for screenings
export interface Ticket {
  id: string;
  screeningId: string;
  customerName: string;
}

export class TicketingService {
  private tickets: Ticket[] = [];

  sellTicket(ticket: Ticket) {
    this.tickets.push(ticket);
  }

  getTicketsForScreening(screeningId: string) {
    return this.tickets.filter(t => t.screeningId === screeningId);
  }
}
