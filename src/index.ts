import { serve } from '@hono/node-server';
import { Hono } from 'hono';

import { serverConfig, logger } from './config';

const app = new Hono();

app.get('/', (c) => {
	return c.text('Hello Hono!');
});

const port = serverConfig.PORT as number;
logger.info(`Server is running on port ${port}`);

serve({
	fetch: app.fetch,
	port
});
