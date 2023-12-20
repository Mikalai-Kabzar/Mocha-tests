import { expect } from 'chai';
import sinon from 'sinon';
import supertest from 'supertest';
import { app, startServer, stopServer } from './server'; // Update with your actual file path
const warriorData1 = {
    id: 1,
    name: 'Test Warrior1',
    strength: 81,
    agility: 61,
    intellect: 41,
    luck: 15,
    health: 1010,
    attack: 110,
    attackSpeed: 11.5,
    criticalChance: 1.1,
    criticalFactor: 21,
    money: 501,
};
describe('Server Component Tests', () => {
    let server: any; // Update the type based on your actual server type
    let request: any;
    let sandbox: sinon.SinonSandbox;

    before(async () => {
        server = await startServer(3000);
    });

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        request = supertest(app);
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(async () => {
        await stopServer();
    });

    it('should create a new warrior', async () => {
        const warriorData = {
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
        };

        // Stub the supertest request.post method
        const postStub = sandbox.stub(request, 'post');

        // Stub the send method on the supertest request.post
        postStub.returns({
            send: sandbox.stub().resolves({ status: 201, body: warriorData }),
            expect: sandbox.stub().resolves({ status: 501, body: warriorData }),
        });

        // Make a request to the server to create a new warrior
        const res = await request.post('/warriors').send(warriorData);

        // Assertions for response
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('id');
        expect(res.body.name).to.equal('Test Warrior');
        expect(res.body.strength).to.equal(8);
        expect(res.body.health).to.equal(100);

        // Assertions for postStub
        expect(postStub.calledOnce).to.be.true;
        expect(postStub.firstCall.args[0]).to.equal('/warriors');
        expect(postStub.firstCall.returnValue.send.calledOnce).to.be.true;
        expect(postStub.firstCall.returnValue.expect.statusCode).to.equal('220');
    });

    // Add more tests for other routes
});
