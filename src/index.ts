import { serve } from '@hono/node-server';
import { Hono } from 'hono';

import { serverConfig, logger } from './config';
import apiRouter from './routes';

const app = new Hono();

app.route('/api', apiRouter);

const port = serverConfig.PORT as number;
logger.info(`Server is running on port ${port}`);

serve({
	fetch: app.fetch,
	port
});
