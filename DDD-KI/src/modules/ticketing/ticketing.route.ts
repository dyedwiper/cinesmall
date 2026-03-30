import { Hono } from 'hono';
import { TicketingService, Ticket } from './ticketing.service';

const ticketing = new TicketingService();
export const ticketingRoute = new Hono();

ticketingRoute.post('/tickets', async (c) => {
  const ticket = await c.req.json();
  ticketing.sellTicket(ticket as Ticket);
  return c.json({ success: true });
});

ticketingRoute.get('/tickets/:screeningId', (c) => {
  return c.json(ticketing.getTicketsForScreening(c.req.param('screeningId')));
});
