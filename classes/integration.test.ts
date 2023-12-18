import { expect } from 'chai';
import request from 'supertest';
import { app, startServer, stopServer } from './server'; // Update the import path based on your server file location

describe('Integration Tests', () => {

    // Start the server before running tests
    before(() => {
        startServer();
    });

    // Stop the server after running tests
    after(() => {
        stopServer();
    });

    it('should create a new warrior', async () => {
        const response = await request(app)
            .post('/warriors')
            .send({
                id: 1,
                name: 'Test Warrior',
                strength: 8,
                agility: 6,
                intellect: 4,
                luck: 5,
                health: 100,
                attack: 10,
                attackSpeed: 1.5,
                criticalChance: 0.1,
                criticalFactor: 2,
                money: 50,
            });

        expect(response.status).to.equal(201);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('id');
        // Add more assertions based on your response structure 
    });

    it('should get all warriors', async () => {
        const response = await request(app).get('/warriors');

        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
        // Add more assertions based on your response structure
    });

    it('should get a specific warrior by ID', async () => {
        // Assuming you have a warrior with ID 1 (created in the first test)
        const response = await request(app).get('/warriors/1');

        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('object');
        // Add more assertions based on your response structure
    });

    // Add more integration tests for update and delete operations
});
