import { expect } from 'chai';
import sinon, { SinonStub } from 'sinon';
import supertest from 'supertest';
import { app, startServer, stopServer } from './server'; // Update with your actual file path

describe('Server Component Tests', () => {
    let server: any; // Update the type based on your actual server type
    let request: any;
    let sandbox: sinon.SinonSandbox;
    let getWarriorsStub: SinonStub;
    let postWarriorStub: SinonStub;
    let getWarriorStub: SinonStub;

    before(async () => {
        server = await startServer(3000);
         request = supertest(app);
        getWarriorsStub = sandbox.stub(app, 'get');
        postWarriorStub = sandbox.stub(app, 'post');
        getWarriorStub = sandbox.stub(app, 'get');       
    });

    beforeEach(() => {
        sandbox = sinon.createSandbox();

    });

    afterEach(() => {
        sandbox.restore();
    });

    after(async () => {
        await stopServer();
    });

    it('should get all warrior names', async () => {
        getWarriorsStub.withArgs('/warriors/names').resolves({ body: [] });

        const res = await request.get('/warriors/names').expect(200);

        expect(res.body).to.be.an('array');

        // Assertions for stub calls
        expect(getWarriorsStub.calledOnce).to.be.true;
        expect(getWarriorsStub.calledWith('/warriors/names')).to.be.true;
    });

    it('should create a new warrior', async () => {
        const warriorData = {
            name: 'New Warrior',
            strength: 10,
            // Include other properties as needed
        };

        postWarriorStub.withArgs('/warriors').resolves({ body: warriorData });

        const res = await request.post('/warriors').send(warriorData).expect(201);

        expect(res.body).to.have.property('id');
        expect(res.body.name).to.equal(warriorData.name);

        // Assertions for stub calls
        expect(postWarriorStub.calledOnce).to.be.true;
        expect(postWarriorStub.calledWith('/warriors')).to.be.true;
    });

    // Add more tests for other routes

    it('should handle warrior not found', async () => {
        const warriorId = 999;

        getWarriorStub.withArgs(`/warriors/${warriorId}`).resolves({ status: 404, body: { error: 'Warrior not found' } });

        const res = await request.get(`/warriors/${warriorId}`).expect(404);

        expect(res.body.error).to.equal('Warrior not found');

        // Assertions for stub calls
        expect(getWarriorStub.calledOnce).to.be.true;
        expect(getWarriorStub.calledWith(`/warriors/${warriorId}`)).to.be.true;
    });
});
