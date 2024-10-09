import { Hono, Context } from 'hono';

import { executeCypherQuery } from '../../db/config';
import formatResponse from '../../utils/formatResponse';

const userRouter = new Hono();

userRouter.post('/', async (c: Context) => {
    const { id, name, email } = await c.req.json();

    if (!id || id < 1 || !name || !email) {
        return c.text('Invalid Inputs', 400);
    }

    const query = `CREATE (n:Users {id:${id}, name:${name}, email:${email}}) RETURN n`;
    const params = {
        id: parseInt(id, 10),
        name,
        email
    };

    try {
        const resultObj = await executeCypherQuery(query, params);
        const result = formatResponse(resultObj);
        return c.json(result);
    } catch (error) {
        return c.text(`Error executing query: ${error}`, 500);
    }
});

userRouter.get('/', async (c: Context) => {
    const query = 'MATCH (n:Users) RETURN n LIMIT 100';
    const params = {};

    try {
        const resultObj = await executeCypherQuery(query, params);
        const result = formatResponse(resultObj);
        return c.json(result);
    } catch (error) {
        return c.text(`Error executing query: ${error}`, 500);
    }
});

userRouter.get('/:id', async (c: Context) => {
    const { id } = c.req.param();

    if (!id || parseInt(id, 10) < 1) {
        return c.text('Invalid ID', 400);
    }

    const query = `MATCH (n:Users {id: ${id}}) RETURN n LIMIT 100`;
    const params = { id: parseInt(id, 10) };

    try {
        const resultObj = await executeCypherQuery(query, params);
        const result = formatResponse(resultObj);
        return c.json(result);
    } catch (error) {
        return c.text(`Error executing query: ${error}`, 500);
    }
});

userRouter.patch('/:id', async (c: Context) => {
    const { id } = c.req.param();
    const { name, email } = await c.req.json();

    let strName = name ? ` n.name = '${name}' ` : '';
    let strEmail = email ? ` n.email = '${email}' ` : '';
    if (strName && strEmail) {
        strEmail = ',' + strEmail;
    }

    if (!id || parseInt(id, 10) < 1) {
        return c.text('Invalid ID', 400);
    }

    const query = `MATCH (n:Users {id: ${id}}) SET ${strName} ${strEmail} RETURN n`;
    const params = { id: parseInt(id, 10) };

    try {
        const resultObj = await executeCypherQuery(query, params);
        const result = formatResponse(resultObj);
        return c.json(result);
    } catch (error) {
        return c.text(`Error executing query: ${error}`, 500);
    }
});

userRouter.delete('/:id', async (c: Context) => {
    const { id } = c.req.param();

    if (!id || parseInt(id, 10) < 1) {
        return c.text('Invalid ID', 400);
    }

    const query = `MATCH (n:Users {id: ${id}}) DELETE n`;
    const params = { id: parseInt(id, 10) };

    try {
        await executeCypherQuery(query, params);
        return c.text('Delete success');
    } catch (error) {
        return c.text(`Error executing query: ${error}`, 500);
    }
});

export default userRouter;