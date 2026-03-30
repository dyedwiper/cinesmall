import { Hono } from 'hono';
import { WeekPlanningService, Screening, Advertisement } from './weekplanning.service';

const weekPlanning = new WeekPlanningService();
export const weekplanningRoute = new Hono();

weekplanningRoute.get('/schedule', (c) => {
  return c.json(weekPlanning.getSchedule());
});

weekplanningRoute.post('/schedule/screening', async (c) => {
  const body = await c.req.json();
  weekPlanning.addScreening(body as Screening);
  return c.json({ success: true });
});

weekplanningRoute.delete('/schedule/screening/:id', (c) => {
  weekPlanning.removeScreening(c.req.param('id'));
  return c.json({ success: true });
});

weekplanningRoute.post('/schedule/screening/:id/advertisement', async (c) => {
  const ad = await c.req.json();
  weekPlanning.addAdvertisement(c.req.param('id'), ad as Advertisement);
  return c.json({ success: true });
});

weekplanningRoute.delete('/schedule/screening/:id/advertisement/:adId', (c) => {
  weekPlanning.removeAdvertisement(c.req.param('id'), c.req.param('adId'));
  return c.json({ success: true });
});
