import { Hono, Context } from 'hono';

import { executeCypherQuery } from '../../db/config';
import formatResponse from '../../utils/formatResponse';

const app = new Hono();

app.post('/add', async (c: Context) => {
    const { source, destination } = await c.req.json();

    if (!source || source < 1 || !destination || destination < 1) {
        return c.text('Invalid Inputs', 400);
    }

    const query = `MATCH (n:Users {id:${source}}), (f:Users {id:${destination}}) CREATE (n)-[:FRIEND]->(f) RETURN n`;
    const params = { source, destination };

    try {
        const resultObj = await executeCypherQuery(query, params);
        const result = formatResponse(resultObj);
        return c.text(`Friends relation created successfully: ${result}`);
    } catch (error) {
        return c.text(`Error executing query: ${error}`);
    }
});

app.get('/list/:id', async (c: Context) => {
    const id = parseInt(c.req.param('id'));

    if (isNaN(id) || id < 1) {
        return c.text('Invalid ID', 400);
    }

    const query = `MATCH (n:Users {id: ${id}})-[:FRIEND]-(f) RETURN f LIMIT 100`;
    const params = { id };

    try {
        const resultObj = await executeCypherQuery(query, params);
        const result = formatResponse(resultObj);
        return c.json(result);
    } catch (error) {
        return c.text(`Error executing query: ${error}`);
    }
});

app.post('/delete', async (c: Context) => {
    const { source, destination } = await c.req.json();

    if (!source || source < 1 || !destination || destination < 1) {
        return c.text('Invalid Inputs', 400);
    }

    const query = `MATCH (n:Users {id:${source}})-[r:FRIEND]-(f:Users {id:${destination}}) DELETE r`;
    const params = { source, destination };

    try {
        const resultObj = await executeCypherQuery(query, params);
        return c.text(`Friends relation deleted successfully: ${resultObj}`);
    } catch (error) {
        return c.text(`Error executing query: ${error}`);
    }
});

export default app;