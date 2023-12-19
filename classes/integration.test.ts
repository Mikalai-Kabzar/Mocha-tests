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

    it('should check if a warrior is low on health', async () => {
        // Assuming you have a warrior with ID 1 (created in a previous test)
        const warriorId = 1;
        const response = await request(app).get(`/warriors/${warriorId}/isLowOnHealth`);

        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('isLowOnHealth');
    });

    it('should check if a warrior is eligible for a special ability', async () => {
        // Assuming you have a warrior with ID 1 (created in a previous test)
        const warriorId = 1;
        const response = await request(app).get(`/warriors/${warriorId}/isSpecialAbilityEligible`);

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('isSpecialAbilityEligible');
    });

    it('should get information about a specific warrior using all functions', async () => {
        // Create a new warrior with specific attributes
        const newWarriorData = {
            name: 'New Warrior',
            strength: 8,
            agility: 6,
            intellect: 4,
            luck: 5,
            health: 40,
            attack: 15,
            attackSpeed: 1.5,
            criticalChance: 0.2,
            criticalFactor: 2.0,
            money: 100,
        };
    
        const createResponse = await request(app).
        post('/warriors').
        send(newWarriorData);
    
        // Assuming the creation was successful, proceed with the test
        expect(createResponse.status).to.equal(201);
        const warriorId = createResponse.body.id;
        // Get information about the specific warrior using all functions
        const response = await request(app).get(`/warriors/${warriorId}/info`);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('isLowOnHealth').to.be.a('boolean');
        expect(response.body).to.have.property('canAffordPurchase').to.be.a('boolean');
        expect(response.body).to.have.property('isSpecialAbilityEligible').to.be.a('boolean');
        expect(response.body).to.have.property('isCriticalHit').to.be.a('boolean');
        expect(response.body).to.have.property('totalDamage').to.be.a('number');
    
        // Add assertions for particular values of properties
        expect(response.body.isLowOnHealth).to.equal(newWarriorData.health < 30);
        expect(response.body.canAffordPurchase).to.equal(newWarriorData.money >= 100); // Adjust the cost as needed
        expect(response.body.isSpecialAbilityEligible).to.equal(
            newWarriorData.strength > 7 && newWarriorData.agility > 5 && newWarriorData.intellect > 3
        );
        expect(response.body.totalDamage).to.equal(newWarriorData.attack);
    });

    it('should return 404 for information about a non-existing warrior', async () => {
        const nonExistingWarriorId = 999;
        const response = await request(app).get(`/warriors/${nonExistingWarriorId}/info`);

        expect(response.status).to.equal(404);
        expect(response.body).to.deep.equal({ error: 'Warrior not found' });
    });

    it('should check if a warrior is low on health (not found)', async () => {
        const nonExistentWarriorId = 999; // Assuming there is no warrior with ID 999

        const response = await request(app).get(`/warriors/${nonExistentWarriorId}/isLowOnHealth`);

        expect(response.status).to.equal(404);
        expect(response.body).to.have.property('error').that.equals('Warrior not found');
    });

    it('should check if a warrior can afford a purchase (warrior found and can afford)', async () => {
        // Create a new warrior with sufficient money
        const newWarriorData = {
            name: 'Affordable Warrior',
            money: 100,
        };

        const createResponse = await request(app).post('/warriors').send(newWarriorData);
        const warriorId = createResponse.body.id;

        const cost = 50; // Cost that the warrior can afford

        const response = await request(app).get(`/warriors/${warriorId}/canAffordPurchase/${cost}`);

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('canAffordPurchase').that.equals(true);
    });

    it('should check if a warrior can afford a purchase (warrior found but cannot afford)', async () => {
        // Create a new warrior with insufficient money
        const newWarriorData = {
            name: 'Expensive Warrior',
            money: 10,
        };

        const createResponse = await request(app).post('/warriors').send(newWarriorData);
        const warriorId = createResponse.body.id;

        const cost = 50; // Cost that the warrior cannot afford

        const response = await request(app).get(`/warriors/${warriorId}/canAffordPurchase/${cost}`);

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('canAffordPurchase').that.equals(false);
    });

    it('should check if a warrior can afford a purchase (warrior not found)', async () => {
        const nonExistentWarriorId = 999; // Assuming there is no warrior with ID 999
        const cost = 50;

        const response = await request(app).get(`/warriors/${nonExistentWarriorId}/canAffordPurchase/${cost}`);

        expect(response.status).to.equal(404);
        expect(response.body).to.have.property('error').that.equals('Warrior not found');
    });


    it('should check if a warrior is eligible for a special ability (warrior found and eligible)', async () => {
        // Create a new warrior with attributes making it eligible for special ability
        const newWarriorData = {
            name: 'Eligible Warrior',
            strength: 8,
            agility: 6,
            intellect: 4,
        };

        const createResponse = await request(app).post('/warriors').send(newWarriorData);
        const warriorId = createResponse.body.id;

        const response = await request(app).get(`/warriors/${warriorId}/isSpecialAbilityEligible`);

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('isSpecialAbilityEligible').that.equals(true);
    });

    it('should check if a warrior is eligible for a special ability (warrior found but not eligible)', async () => {
        // Create a new warrior with attributes making it not eligible for special ability
        const newWarriorData = {
            name: 'Non-Eligible Warrior',
            strength: 5,
            agility: 4,
            intellect: 3,
        };

        const createResponse = await request(app).post('/warriors').send(newWarriorData);
        const warriorId = createResponse.body.id;

        const response = await request(app).get(`/warriors/${warriorId}/isSpecialAbilityEligible`);

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('isSpecialAbilityEligible').that.equals(false);
    });

    it('should check if a warrior is eligible for a special ability (warrior not found)', async () => {
        const nonExistentWarriorId = 999; // Assuming there is no warrior with ID 999

        const response = await request(app).get(`/warriors/${nonExistentWarriorId}/isSpecialAbilityEligible`);

        expect(response.status).to.equal(404);
        expect(response.body).to.have.property('error').that.equals('Warrior not found');
    });

    it('should calculate total damage for a warrior (warrior found)', async () => {
        // Create a new warrior with specific attributes
        const newWarriorData = {
            name: 'Damage Warrior',
            attack: 20,
            criticalChance: 0.3,
            criticalFactor: 2.0,
        };

        const createResponse = await request(app).post('/warriors').send(newWarriorData);
        const warriorId = createResponse.body.id;

        const response = await request(app).get(`/warriors/${warriorId}/calculateTotalDamage`);

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('totalDamage').that.is.a('number');
        // Add more assertions based on your implementation and expected values
    });

    it('should calculate total damage for a warrior (warrior not found)', async () => {
        const nonExistentWarriorId = 999; // Assuming there is no warrior with ID 999

        const response = await request(app).get(`/warriors/${nonExistentWarriorId}/calculateTotalDamage`);

        expect(response.status).to.equal(404);
        expect(response.body).to.have.property('error').that.equals('Warrior not found');
    });



    // Add more integration tests for update and delete operations
});
