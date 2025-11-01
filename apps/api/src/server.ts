import Fastify from 'fastify';
import dotenv from 'dotenv';
import { getPrice } from '@cpt/pricing';

dotenv.config();

const app = Fastify({ logger: true });

app.get('/health', async () => ({ status: 'ok' }));

app.get('/price/:id', async (req, reply) => {
  const { id } = req.params as { id: string };
  const price = await getPrice(id, 'usd');
  if (price == null) return reply.code(404).send({ error: 'Not found' });
  return { id, currency: 'usd', price };
});

const port = Number(process.env.API_PORT || 3001);
const host = process.env.API_HOST || '0.0.0.0';

app
  .listen({ port, host })
  .then((addr) => app.log.info(`API listening on ${addr}`))
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });

