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
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('name', 'Test Warrior');
        expect(response.body).to.have.property('strength', 8);
        expect(response.body).to.have.property('health', 100);
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
        expect(response.body).to.have.property('id', 1);
        expect(response.body).to.have.property('name');
        expect(response.body).to.have.property('strength');
        // Add more assertions based on your response structure
    });

    it('should return 404 when getting a non-existing warrior by ID', async () => {
        const response = await request(app).get('/warriors/999'); // Assuming ID 999 does not exist

        expect(response.status).to.equal(404);
        expect(response.body).to.have.property('error', 'Warrior not found');
    });

    it('should update an existing warrior by ID', async () => {
        // Assuming there is a warrior with ID 1 created in a previous test
        const response = await request(app)
            .put('/warriors/1')
            .send({
                // Update the warrior attributes as needed
                strength: 9,
                health: 120,
            });

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('id', 1);
        expect(response.body).to.have.property('strength', 9);
        expect(response.body).to.have.property('health', 120);
        // Add more assertions based on your response structure
    });

    it('should return 404 when updating a non-existing warrior by ID', async () => {
        const response = await request(app)
            .put('/warriors/999') // Assuming ID 999 does not exist
            .send({
                // Update the warrior attributes as needed
                strength: 9,
                health: 120,
            });

        expect(response.status).to.equal(404);
        expect(response.body).to.have.property('error', 'Warrior not found');
    });

    it('should delete an existing warrior by ID', async () => {
        // Assuming there is a warrior with ID 1 created in a previous test
        const response = await request(app).delete('/warriors/1');

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('id', 1);
        // Add more assertions based on your response structure
    });

    it('should return 404 when deleting a non-existing warrior by ID', async () => {
        const response = await request(app).delete('/warriors/999'); // Assuming ID 999 does not exist

        expect(response.status).to.equal(404);
        expect(response.body).to.have.property('error', 'Warrior not found');
    });

    it('should return all names of existing warriors', async () => {
        // Create at least 3 warriors
        const warriorIds: number[] = [];
    
        for (let i = 0; i < 3; i++) {
            const response = await request(app)
                .post('/warriors')
                .send({
                    id: i + 1,
                    name: `Warrior${i + 1}`,
                    // Include other attributes as needed
                });
    
            warriorIds.push(response.body.id);
        }
    
        // // Make a request to get all names
         const response = await request(app).get('/warriors/names');
    
         expect(response.status).to.equal(200);
         expect(response.body).to.be.an('array').that.includes.members(['Warrior1', 'Warrior2', 'Warrior3']);
        // Add more assertions based on your response structure
    });

    it('should return all names of existing warriors', async () => {
        // Create at least 3 warriors
        const warriorIds: number[] = [];
    
        for (let i = 0; i < 3; i++) {
            const response = await request(app)
                .post('/warriors')
                .send({
                    id: i + 1,
                    name: `Warrior${i + 1}`,
                    // Include other attributes as needed
                });
    
            warriorIds.push(response.body.id);
        }
    
        // // Make a request to get all names
         const response = await request(app).get('/warriors/names');
    
         expect(response.status).to.equal(200);
         expect(response.body).to.be.an('array').that.includes.members(['Warrior1', 'Warrior2', 'Warrior3']);
        // Add more assertions based on your response structure
    });
    // Add more integration tests for update and delete operations
});
