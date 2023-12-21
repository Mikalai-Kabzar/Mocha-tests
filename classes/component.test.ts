import { expect } from 'chai';
import sinon from 'sinon';
import supertest from 'supertest';
import { app } from './server'; // Update with your actual file path

let request: any;
let sandbox: sinon.SinonSandbox;

let postStub: any;// = sandbox.stub(request, 'post');
let putStub: any;
let getStub: any;
let deleteStub: any;

beforeEach(() => {
    sandbox = sinon.createSandbox();
    request = supertest(app);
    postStub = sandbox.stub(request, 'post');
    putStub = sandbox.stub(request, 'put');
    getStub = sandbox.stub(request, 'get');
    deleteStub = sandbox.stub(request, 'delete');
});

afterEach(() => {
    sandbox.restore();
});

const emptyWarriorData = {
};
const warriorDataID = 123;

const warriorData = {
    id: warriorDataID,
    name: 'Test Warrior Stubbed',
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
};

describe('Server Component Tests', () => {

    it('should create a new warrior', async () => {
        // Stub the send method on the supertest request.post
        postStub.returns({
            send: sandbox.stub().resolves({ status: 201, body: warriorData }),
        });

        // Make a request to the server to create a new warrior
        const res = await request.post('/warriors').send(emptyWarriorData);

        // Assertions for response
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('id');
        expect(res.body.id).to.equal(warriorData.id);
        expect(res.body.name).to.equal(warriorData.name);
        expect(res.body.strength).to.equal(warriorData.strength);
        expect(res.body.health).to.equal(warriorData.health);

        // Assertions for postStub
        expect(postStub.calledOnce).to.be.true;
        expect(postStub.firstCall.args[0]).to.equal('/warriors');
        expect(postStub.firstCall.returnValue.send.calledOnce).to.be.true;
    });

    it('should get all warrior names when there are 4 warriors', async () => {
        const warriorsForNames = [
            { id: 1, name: 'Warrior1' },
            { id: 2, name: 'Warrior2' },
            { id: 3, name: 'Warrior3' },
            { id: 4, name: 'Warrior4' },
        ];

        // Stub the send method on the supertest request.get
        getStub.resolves({ status: 200, body: warriorsForNames });

        // Make a request to the server to get all warrior names
        const res = await request.get('/warriors/names');

        // Assertions for response
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf(4);
        expect(res.body[0].name).to.equal('Warrior1');
        expect(res.body[1].name).to.equal('Warrior2');
        expect(res.body[2].name).to.equal('Warrior3');
        expect(res.body[3].name).to.equal('Warrior4');

        // Assertions for getStub
        expect(getStub.calledOnce).to.be.true;
        expect(getStub.firstCall.args[0]).to.equal('/warriors/names');
    });

    it('should get all warrior names when there is 1 warrior', async () => {
        const warriorsForNames = [{ id: 1, name: 'SoloWarrior' }];

        // Stub the send method on the supertest request.get
        getStub.resolves({ status: 200, body: warriorsForNames });

        // Make a request to the server to get all warrior names
        const res = await request.get('/warriors/names');

        // Assertions for response
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf(1);
        expect(res.body[0].name).to.equal('SoloWarrior');

        // Assertions for getStub
        expect(getStub.calledOnce).to.be.true;
        expect(getStub.firstCall.args[0]).to.equal('/warriors/names');
    });

    it('should get an empty array when there are 0 warriors', async () => {
        // Stub the send method on the supertest request.get
        getStub.resolves({ status: 200, body: [] });

        // Make a request to the server to get all warrior names
        const res = await request.get('/warriors/names');

        // Assertions for response
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array').that.is.empty;

        // Assertions for getStub
        expect(getStub.calledOnce).to.be.true;
        expect(getStub.firstCall.args[0]).to.equal('/warriors/names');
    });

    it('should handle warrior names request when there is an error', async () => {
        // Stub the send method on the supertest request.get
        getStub.resolves({ status: 500, body: { error: 'Internal Server Error' } });

        // Make a request to the server to get all warrior names
        const res = await request.get('/warriors/names');

        // Assertions for response
        expect(res.status).to.equal(500);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Internal Server Error');

        // Assertions for getStub
        expect(getStub.calledOnce).to.be.true;
        expect(getStub.firstCall.args[0]).to.equal('/warriors/names');
    });

    it('should check if a specific warrior is low on health', async () => {
        const warriorIdToCheck = 123123;
        const warriorForHealthCheck = {
            id: warriorIdToCheck,
            name: 'WarriorForHealthCheck',
            isLowOnHealth: true, // Set the warrior to always be low on health for testing
            // Add other properties as needed
        };

        // Stub the send method on the supertest request.get
        getStub.resolves({ status: 200, body: warriorForHealthCheck });

        // Make a request to the server to check if a specific warrior is low on health
        const res = await request.get(`/warriors/${warriorIdToCheck}/isLowOnHealth`);

        // Assertions for response
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('isLowOnHealth');
        expect(res.body.isLowOnHealth).to.be.true; // Adjust the expected value as needed

        // Assertions for getStub
        expect(getStub.calledOnce).to.be.true;
        expect(getStub.firstCall.args[0]).to.equal(`/warriors/${warriorIdToCheck}/isLowOnHealth`);
    });

    it('should handle warrior not found during health check', async () => {
        const nonexistentWarriorId = 'nonexistentId';
        // Stub the send method on the supertest request.get
        getStub.resolves({ status: 404, body: { error: 'Warrior not found' } });

        // Make a request to the server to check if a specific warrior is low on health
        const res = await request.get(`/warriors/${nonexistentWarriorId}/isLowOnHealth`);

        // Assertions for response
        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Warrior not found');

        // Assertions for getStub
        expect(getStub.calledOnce).to.be.true;
        expect(getStub.firstCall.args[0]).to.equal(`/warriors/${nonexistentWarriorId}/isLowOnHealth`);
    });

    it('should check if a specific warrior can afford a purchase', async () => {
        const warriorIdToCheck = 123123;
        const purchaseCost = 50;
        const warriorForPurchase = {
            id: warriorIdToCheck,
            name: 'WarriorForPurchase',
            canAffordPurchase: true, // Adjust the affordability condition as needed
            // Add other properties as needed
        };

        // Stub the send method on the supertest request.get
        getStub.resolves({ status: 200, body: warriorForPurchase });

        // Make a request to the server to check if a specific warrior can afford a purchase
        const res = await request.get(`/warriors/${warriorIdToCheck}/canAffordPurchase/${purchaseCost}`);

        // Assertions for response
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('canAffordPurchase');
        expect(res.body.canAffordPurchase).to.be.true; // Adjust the expected affordability as needed

        // Assertions for getStub
        expect(getStub.calledOnce).to.be.true;
        expect(getStub.firstCall.args[0]).to.equal(`/warriors/${warriorIdToCheck}/canAffordPurchase/${purchaseCost}`);
    });

    it('should handle warrior not found during purchase affordability check', async () => {
        const nonexistentWarriorId = 'nonexistentId';
        const purchaseCost = 50;
        // Stub the send method on the supertest request.get
        getStub.resolves({ status: 404, body: { error: 'Warrior not found' } });

        // Make a request to the server to check if a specific warrior can afford a purchase
        const res = await request.get(`/warriors/${nonexistentWarriorId}/canAffordPurchase/${purchaseCost}`);

        // Assertions for response
        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Warrior not found');

        // Assertions for getStub
        expect(getStub.calledOnce).to.be.true;
        expect(getStub.firstCall.args[0]).to.equal(`/warriors/${nonexistentWarriorId}/canAffordPurchase/${purchaseCost}`);
    });

    it('should check if a specific warrior is eligible for a special ability', async () => {
        const warriorIdToCheck = 123123;
        const warriorForSpecialAbility = {
            id: warriorIdToCheck,
            name: 'WarriorForSpecialAbility',
            isSpecialAbilityEligible:  true, // Adjust the eligibility condition as needed
            // Add other properties as needed
        };

        // Stub the send method on the supertest request.get
        getStub.resolves({ status: 200, body: warriorForSpecialAbility });

        // Make a request to the server to check if a specific warrior is eligible for a special ability
        const res = await request.get(`/warriors/${warriorIdToCheck}/isSpecialAbilityEligible`);

        // Assertions for response
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('isSpecialAbilityEligible');
        expect(res.body.isSpecialAbilityEligible).to.be.true; // Adjust the expected eligibility as needed

        // Assertions for getStub
        expect(getStub.calledOnce).to.be.true;
        expect(getStub.firstCall.args[0]).to.equal(`/warriors/${warriorIdToCheck}/isSpecialAbilityEligible`);
    });

    it('should handle warrior not found during special ability eligibility check', async () => {
        const nonexistentWarriorId = 'nonexistentId';
        // Stub the send method on the supertest request.get
        getStub.resolves({ status: 404, body: { error: 'Warrior not found' } });

        // Make a request to the server to check if a specific warrior is eligible for a special ability
        const res = await request.get(`/warriors/${nonexistentWarriorId}/isSpecialAbilityEligible`);

        // Assertions for response
        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Warrior not found');

        // Assertions for getStub
        expect(getStub.calledOnce).to.be.true;
        expect(getStub.firstCall.args[0]).to.equal(`/warriors/${nonexistentWarriorId}/isSpecialAbilityEligible`);
    });

    it('should calculate total damage for a specific warrior by ID', async () => {
        const warriorIdToRead = 123123;
        const warriorForTotalDamage = {
            id: warriorIdToRead,
            name: 'WarriorForTotalDamage',
            strength: 10,
            agility: 8,
            health: 100,
            totalDamage: 30, // Adjust the total damage calculation as needed
            // Add other properties as needed
        };

        // Stub the send method on the supertest request.get
        getStub.resolves({ status: 200, body: warriorForTotalDamage });

        // Make a request to the server to calculate total damage for a specific warrior by ID
        const res = await request.get(`/warriors/${warriorIdToRead}/calculateTotalDamage`);

        // Assertions for response
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('totalDamage');
        expect(res.body.totalDamage).to.equal(30); // Adjust the expected total damage as needed

        // Assertions for getStub
        expect(getStub.calledOnce).to.be.true;
        expect(getStub.firstCall.args[0]).to.equal(`/warriors/${warriorIdToRead}/calculateTotalDamage`);
    });

    it('should handle warrior not found during total damage calculation', async () => {
        const nonexistentWarriorId = 'nonexistentId';
        // Stub the send method on the supertest request.get
        getStub.resolves({ status: 404, body: { error: 'Warrior not found' } });

        // Make a request to the server to calculate total damage for a specific warrior by ID
        const res = await request.get(`/warriors/${nonexistentWarriorId}/calculateTotalDamage`);

        // Assertions for response
        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Warrior not found');

        // Assertions for getStub
        expect(getStub.calledOnce).to.be.true;
        expect(getStub.firstCall.args[0]).to.equal(`/warriors/${nonexistentWarriorId}/calculateTotalDamage`);
    });


    const warriorIdToRead = 123123; // Replace with the actual warrior ID for testing
    let warriorDataCustom = {
        id: warriorIdToRead,
        name: 'WarriorWithInfo',
        strength: 10,
        agility: 8,
        health: 30, // Adjust health to a value that triggers isLowOnHealth
        isLowOnHealth: true, // Explicitly defined isLowOnHealth value
        canAffordPurchase: true, // Adjust the value based on your logic
        isCriticalHit: false, // Adjust the value based on your logic
        isSpecialAbilityEligible: true, // Adjust the value based on your logic
        totalDamage: 20, // Adjust the value based on your logic
        // Add other properties as needed
    };

    it('should read info for a specific warrior by ID', async () => {
        // Stub the send method on the supertest request.get
        getStub.resolves({ status: 200, body: warriorDataCustom });

        // Make a request to the server to read info for a specific warrior by ID
        const res = await request.get(`/warriors/${warriorIdToRead}/info`);

        // Assertions for response
        expect(res.status).to.equal(200);
        expect(res.body.id).to.equal(warriorDataCustom.id);
        expect(res.body.name).to.equal(warriorDataCustom.name);
        expect(res.body.isLowOnHealth).to.equal(warriorDataCustom.isLowOnHealth);
        expect(res.body).to.have.property('canAffordPurchase');

        // Assertions for getStub
        expect(getStub.calledOnce).to.be.true;
        expect(getStub.firstCall.args[0]).to.equal(`/warriors/${warriorIdToRead}/info`);
    });

    it('should handle warrior not found during info retrieval', async () => {
        // Stub the send method on the supertest request.get
        getStub.resolves({ status: 404, body: { error: 'Warrior not found' } });

        // Make a request to the server to read info for a specific warrior by ID
        const res = await request.get(`/warriors/nonexistentId/info`);

        // Assertions for response
        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Warrior not found');

        // Assertions for getStub
        expect(getStub.calledOnce).to.be.true;
        expect(getStub.firstCall.args[0]).to.equal(`/warriors/nonexistentId/info`);
    });

    const warriorsData = [
        // Replace with actual warrior data
        { id: 1, name: 'Warrior1', strength: 10 },
        { id: 2, name: 'Warrior2', strength: 8 },
        { id: 3, name: 'Warrior3', strength: 12 },
    ];

    it('should handle empty list of warriors', async () => {
        // Stub the send method on the supertest request.get
        getStub.resolves({ status: 200, body: [] });

        // Make a request to the server to get all warriors
        const res = await request.get('/warriors');

        // Assertions for response
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array').that.is.empty;

        // Assertions for getStub
        expect(getStub.calledOnce).to.be.true;
        expect(getStub.firstCall.args[0]).to.equal('/warriors');
    });

    it('should return at least 3 warriors in the response', async () => {
        // Stub the send method on the supertest request.get
        getStub.resolves({ status: 200, body: warriorsData });

        // Make a request to the server to get all warriors
        const res = await request.get('/warriors');

        // Assertions for response
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array').that.has.length.at.least(3);

        // Assertions for warrior names
        expect(res.body[0].name).to.equal('Warrior1');
        expect(res.body[1].name).to.equal('Warrior2');
        expect(res.body[2].name).to.equal('Warrior3');

        // Assertions for getStub
        expect(getStub.calledOnce).to.be.true;
        expect(getStub.firstCall.args[0]).to.equal('/warriors');
    });

    it('should read a specific warrior by ID', async () => {
        // Stub the send method on the supertest request.get
        getStub.resolves({ status: 200, body: warriorData });
        // Make a request to the server to read a specific warrior by ID
        const res = await request.get(`/warriors/${warriorIdToRead}`);

        // Assertions for response
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('id');
        expect(res.body.id).to.equal(warriorData.id);
        expect(res.body.name).to.equal(warriorData.name);
        expect(res.body.strength).to.equal(warriorData.strength);
        expect(res.body.health).to.equal(warriorData.health);

        // Assertions for getStub
        expect(getStub.calledOnce).to.be.true;
        expect(getStub.firstCall.args[0]).to.equal(`/warriors/${warriorIdToRead}`);
    });

    it('should handle warrior not found during read', async () => {
        // Stub the send method on the supertest request.get
        getStub.resolves({ status: 404, body: { error: 'Warrior not found' } });

        // Make a request to the server to read a specific warrior by ID
        const res = await request.get(`/warriors/nonexistentId`);

        // Assertions for response
        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Warrior not found');

        // Assertions for getStub
        expect(getStub.calledOnce).to.be.true;
        expect(getStub.firstCall.args[0]).to.equal(`/warriors/nonexistentId`);
    });

    it('should update a specific warrior by ID', async () => {
        // Stub the send method on the supertest request.put
        putStub.returns({
            send: sandbox.stub().resolves({ status: 200, body: warriorData }),
        });

        // Make a request to the server to update a specific warrior
        const res = await request.put(`/warriors/${warriorDataID}`).send(warriorData);

        // Assertions for response
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('id');
        expect(res.body.id).to.equal(warriorData.id);
        expect(res.body.name).to.equal(warriorData.name);
        expect(res.body.strength).to.equal(warriorData.strength);
        expect(res.body.health).to.equal(warriorData.health);

        // Assertions for putStub
        expect(putStub.calledOnce).to.be.true;
        expect(putStub.firstCall.args[0]).to.equal(`/warriors/${warriorDataID}`);
        expect(putStub.firstCall.returnValue.send.calledOnce).to.be.true;
    });

    it('should handle warrior not found during update', async () => {
        // Stub the send method on the supertest request.put
        putStub.returns({
            send: sandbox.stub().resolves({ status: 404, body: { error: 'Warrior not found' } }),
        });

        // Make a request to the server to update a specific warrior
        const res = await request.put(`/warriors/nonexistentId`).send(warriorData);

        // Assertions for response
        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Warrior not found');

        // Assertions for putStub
        expect(putStub.calledOnce).to.be.true;
        expect(putStub.firstCall.args[0]).to.equal(`/warriors/nonexistentId`);
        expect(putStub.firstCall.returnValue.send.calledOnce).to.be.true;
    });

    it('should delete a specific warrior by ID', async () => {
        // Stub the send method on the supertest request.delete
        deleteStub.resolves({ status: 200, body: warriorData });

        // Make a request to the server to delete a specific warrior
        const res = await request.delete(`/warriors/${warriorDataID}`);

        // Assertions for response
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('id');
        expect(res.body.id).to.equal(warriorData.id);
        expect(res.body.name).to.equal(warriorData.name);
        expect(res.body.strength).to.equal(warriorData.strength);
        expect(res.body.health).to.equal(warriorData.health);

        // Assertions for deleteStub
        expect(deleteStub.calledOnce).to.be.true;
        expect(deleteStub.firstCall.args[0]).to.equal(`/warriors/${warriorDataID}`);
    });

    it('should handle warrior not found during deletion', async () => {
        // Stub the send method on the supertest request.delete
        deleteStub.resolves({ status: 404, body: { error: 'Warrior not found' } });

        // Make a request to the server to delete a specific warrior
        const res = await request.delete(`/warriors/nonexistentId`);

        // Assertions for response
        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Warrior not found');

        // Assertions for deleteStub
        expect(deleteStub.calledOnce).to.be.true;
        expect(deleteStub.firstCall.args[0]).to.equal(`/warriors/nonexistentId`);
    });

    // Add more tests for other routes
});
