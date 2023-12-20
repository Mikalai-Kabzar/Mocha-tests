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

const emptyPostWarriorData = {
};

const postWarriorData = {
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

const getWarriorData = {
    id: 123,
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

const warriorIdToUpdate = 123123;

const updatedWarriorData = {
    id: warriorIdToUpdate,
    name: 'Updated Warrior',
    strength: 10,
    agility: 8,
    intellect: 6,
    luck: 7,
    health: 120,
    attack: 15,
    attackSpeed: 2.0,
    criticalChance: 0.2,
    criticalFactor: 2.5,
    money: 75,
};

const warriorIdToDelete = 1234;

const deletedWarriorData = {
    id: warriorIdToDelete,
    name: 'Deleted Warrior',
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
            send: sandbox.stub().resolves({ status: 201, body: getWarriorData }),
        });

        // Make a request to the server to create a new warrior
        const res = await request.post('/warriors').send(emptyPostWarriorData);

        // Assertions for response
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('id');
        expect(res.body.id).to.equal(getWarriorData.id);
        expect(res.body.name).to.equal(getWarriorData.name);
        expect(res.body.strength).to.equal(getWarriorData.strength);
        expect(res.body.health).to.equal(getWarriorData.health);

        // Assertions for postStub
        expect(postStub.calledOnce).to.be.true;
        expect(postStub.firstCall.args[0]).to.equal('/warriors');
        expect(postStub.firstCall.returnValue.send.calledOnce).to.be.true;
    });

    it('should update a specific warrior by ID', async () => {
        // Stub the send method on the supertest request.put
        putStub.returns({
            send: sandbox.stub().resolves({ status: 200, body: updatedWarriorData }),
        });

        // Make a request to the server to update a specific warrior
        const res = await request.put(`/warriors/${warriorIdToUpdate}`).send(updatedWarriorData);

        // Assertions for response
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('id');
        expect(res.body.id).to.equal(updatedWarriorData.id);
        expect(res.body.name).to.equal(updatedWarriorData.name);
        expect(res.body.strength).to.equal(updatedWarriorData.strength);
        expect(res.body.health).to.equal(updatedWarriorData.health);

        // Assertions for putStub
        expect(putStub.calledOnce).to.be.true;
        expect(putStub.firstCall.args[0]).to.equal(`/warriors/${warriorIdToUpdate}`);
        expect(putStub.firstCall.returnValue.send.calledOnce).to.be.true;
    });

    it('should handle warrior not found during update', async () => {
        // Stub the send method on the supertest request.put
        putStub.returns({
            send: sandbox.stub().resolves({ status: 404, body: { error: 'Warrior not found' } }),
        });

        // Make a request to the server to update a specific warrior
        const res = await request.put(`/warriors/nonexistentId`).send(updatedWarriorData);

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
        deleteStub.resolves({ status: 200, body: deletedWarriorData });

        // Make a request to the server to delete a specific warrior
        const res = await request.delete(`/warriors/${warriorIdToDelete}`);

        // Assertions for response
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('id');
        expect(res.body.id).to.equal(deletedWarriorData.id);
        expect(res.body.name).to.equal(deletedWarriorData.name);
        expect(res.body.strength).to.equal(deletedWarriorData.strength);
        expect(res.body.health).to.equal(deletedWarriorData.health);

        // Assertions for deleteStub
        expect(deleteStub.calledOnce).to.be.true;
        expect(deleteStub.firstCall.args[0]).to.equal(`/warriors/${warriorIdToDelete}`);
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
