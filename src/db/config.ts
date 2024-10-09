import neo4j, { Driver, Session, Result } from 'neo4j-driver';
import config from 'config';

const uri: string = config.get<string>('dbHost');
const user: string = config.get<string>('dbUser');
const password: string = config.get<string>('dbPass');

const driver: Driver = neo4j.driver(uri, neo4j.auth.basic(user, password), {
    maxConnectionLifetime: 3 * 60 * 60 * 1000,
    maxConnectionPoolSize: 50,
    connectionAcquisitionTimeout: 2 * 60 * 1000,
    disableLosslessIntegers: true,
});

export async function executeCypherQuery(statement: string, params: Record<string, any> = {}): Promise<Result> {
    const session: Session = driver.session();
    try {
        const result = await session.run(statement, params);
        return result;
    } catch (error) {
        console.error(`Error executing Cypher query: ${statement}`, { error });
        throw error;
    } finally {
        await session.close();
    }
}

export function closeDriver(): Promise<void> {
    return driver.close();
}