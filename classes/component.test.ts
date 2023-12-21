import { expect } from 'chai';
import sinon, { SinonSandbox, SinonStub } from 'sinon';
import supertest, { SuperTest, Test } from 'supertest';
import { app } from './server';

describe('Server Component Tests', () => {
  let request: SuperTest<Test>;
  let sandbox: SinonSandbox;
  let postStub: SinonStub, putStub: SinonStub, getStub: SinonStub, deleteStub: SinonStub;

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

  const emptyWarriorData = {};
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

  describe('Create a new warrior', () => {
    it('should create a new warrior', async () => {
      postStub.returns({
        send: sandbox.stub().resolves({ status: 201, body: warriorData }),
      });

      const res = await request.post('/warriors').send(emptyWarriorData);

      expect(res.status).to.equal(201);
      expect(res.body).to.include(warriorData);
      expect(postStub.calledOnce).to.be.true;
      expect(postStub.firstCall.args[0]).to.equal('/warriors');
      expect(postStub.firstCall.returnValue.send.calledOnce).to.be.true;
    });
  });

  describe('Get all warrior names', () => {
    it('should get all warrior names when there are 4 warriors', async () => {
      const warriorsForNames = [
        { id: 1, name: 'Warrior1' },
        { id: 2, name: 'Warrior2' },
        { id: 3, name: 'Warrior3' },
        { id: 4, name: 'Warrior4' },
      ];

      getStub.resolves({ status: 200, body: warriorsForNames });

      const res = await request.get('/warriors/names');

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array').to.have.lengthOf(4);
      expect(res.body[0].name).to.equal('Warrior1');
      expect(res.body[1].name).to.equal('Warrior2');
      expect(res.body[2].name).to.equal('Warrior3');
      expect(res.body[3].name).to.equal('Warrior4');
      expect(getStub.calledOnce).to.be.true;
      expect(getStub.firstCall.args[0]).to.equal('/warriors/names');
    });

    it('should get all warrior names when there is 1 warrior', async () => {
      const warriorsForNames = [{ id: 1, name: 'SoloWarrior' }];

      getStub.resolves({ status: 200, body: warriorsForNames });

      const res = await request.get('/warriors/names');

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array').to.have.lengthOf(1);
      expect(res.body[0].name).to.equal('SoloWarrior');
      expect(getStub.calledOnce).to.be.true;
      expect(getStub.firstCall.args[0]).to.equal('/warriors/names');
    });

    it('should get an empty array when there are 0 warriors', async () => {
      getStub.resolves({ status: 200, body: [] });

      const res = await request.get('/warriors/names');

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array').that.is.empty;
      expect(getStub.calledOnce).to.be.true;
      expect(getStub.firstCall.args[0]).to.equal('/warriors/names');
    });
  });

  describe('Check if a specific warrior is low on health', () => {
    it('should check if a specific warrior is low on health', async () => {
      const warriorIdToCheck = 123123;
      const warriorForHealthCheck = {
        id: warriorIdToCheck,
        name: 'WarriorForHealthCheck',
        isLowOnHealth: true,
      };

      getStub.resolves({ status: 200, body: warriorForHealthCheck });

      const res = await request.get(`/warriors/${warriorIdToCheck}/isLowOnHealth`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('isLowOnHealth');
      expect(res.body.isLowOnHealth).to.be.true;
      expect(getStub.calledOnce).to.be.true;
      expect(getStub.firstCall.args[0]).to.equal(`/warriors/${warriorIdToCheck}/isLowOnHealth`);
    });

    it('should handle warrior not found during health check', async () => {
      const nonexistentWarriorId = 'nonexistentId';
      getStub.resolves({ status: 404, body: { error: 'Warrior not found' } });

      const res = await request.get(`/warriors/${nonexistentWarriorId}/isLowOnHealth`);

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.equal('Warrior not found');
      expect(getStub.calledOnce).to.be.true;
      expect(getStub.firstCall.args[0]).to.equal(`/warriors/${nonexistentWarriorId}/isLowOnHealth`);
    });
  });

  describe('Check if a specific warrior can afford a purchase', () => {
    it('should check if a specific warrior can afford a purchase', async () => {
      const warriorIdToCheck = 123123;
      const purchaseCost = 50;
      const warriorForPurchase = {
        id: warriorIdToCheck,
        name: 'WarriorForPurchase',
        canAffordPurchase: true,
      };

      getStub.resolves({ status: 200, body: warriorForPurchase });

      const res = await request.get(`/warriors/${warriorIdToCheck}/canAffordPurchase/${purchaseCost}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('canAffordPurchase');
      expect(res.body.canAffordPurchase).to.be.true;
      expect(getStub.calledOnce).to.be.true;
      expect(getStub.firstCall.args[0]).to.equal(`/warriors/${warriorIdToCheck}/canAffordPurchase/${purchaseCost}`);
    });

    it('should handle warrior not found during purchase affordability check', async () => {
      const nonexistentWarriorId = 'nonexistentId';
      const purchaseCost = 50;
      getStub.resolves({ status: 404, body: { error: 'Warrior not found' } });

      const res = await request.get(`/warriors/${nonexistentWarriorId}/canAffordPurchase/${purchaseCost}`);

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.equal('Warrior not found');
      expect(getStub.calledOnce).to.be.true;
      expect(getStub.firstCall.args[0]).to.equal(`/warriors/${nonexistentWarriorId}/canAffordPurchase/${purchaseCost}`);
    });

    it('should handle insufficient funds during purchase affordability check', async () => {
      const warriorIdToCheck = 123123;
      const purchaseCost = 100;
      const warriorForPurchase = {
        id: warriorIdToCheck,
        name: 'WarriorForPurchase',
        canAffordPurchase: false,
      };

      getStub.resolves({ status: 200, body: warriorForPurchase });

      const res = await request.get(`/warriors/${warriorIdToCheck}/canAffordPurchase/${purchaseCost}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('canAffordPurchase');
      expect(res.body.canAffordPurchase).to.be.false;
      expect(getStub.calledOnce).to.be.true;
      expect(getStub.firstCall.args[0]).to.equal(`/warriors/${warriorIdToCheck}/canAffordPurchase/${purchaseCost}`);
    });
  });
  
  describe('Check special ability eligibility', () => {
    it('should check if a specific warrior is eligible for a special ability', async () => {
      const warriorIdToCheck = 123123;
      const warriorForSpecialAbility = {
        id: warriorIdToCheck,
        name: 'WarriorForSpecialAbility',
        isSpecialAbilityEligible: true,
      };
  
      getStub.resolves({ status: 200, body: warriorForSpecialAbility });
  
      const res = await request.get(`/warriors/${warriorIdToCheck}/isSpecialAbilityEligible`);
  
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('isSpecialAbilityEligible');
      expect(res.body.isSpecialAbilityEligible).to.be.true;
      expect(getStub.calledOnce).to.be.true;
      expect(getStub.firstCall.args[0]).to.equal(`/warriors/${warriorIdToCheck}/isSpecialAbilityEligible`);
    });
  
    it('should handle warrior not found during special ability eligibility check', async () => {
      const nonexistentWarriorId = 'nonexistentId';
      getStub.resolves({ status: 404, body: { error: 'Warrior not found' } });
  
      const res = await request.get(`/warriors/${nonexistentWarriorId}/isSpecialAbilityEligible`);
  
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.equal('Warrior not found');
      expect(getStub.calledOnce).to.be.true;
      expect(getStub.firstCall.args[0]).to.equal(`/warriors/${nonexistentWarriorId}/isSpecialAbilityEligible`);
    });
  });
    
  describe('Calculate total damage for a specific warrior by ID', () => {
    it('should calculate total damage for a specific warrior by ID', async () => {
      const warriorIdToRead = 123123;
      const warriorForTotalDamage = {
        id: warriorIdToRead,
        name: 'WarriorForTotalDamage',
        strength: 10,
        agility: 8,
        health: 100,
        totalDamage: 30,
      };
  
      getStub.resolves({ status: 200, body: warriorForTotalDamage });
  
      const res = await request.get(`/warriors/${warriorIdToRead}/calculateTotalDamage`);
  
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('totalDamage');
      expect(res.body.totalDamage).to.equal(30);
      expect(getStub.calledOnce).to.be.true;
      expect(getStub.firstCall.args[0]).to.equal(`/warriors/${warriorIdToRead}/calculateTotalDamage`);
    });
  
    it('should handle warrior not found during total damage calculation', async () => {
      const nonexistentWarriorId = 'nonexistentId';
      getStub.resolves({ status: 404, body: { error: 'Warrior not found' } });
  
      const res = await request.get(`/warriors/${nonexistentWarriorId}/calculateTotalDamage`);
  
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.equal('Warrior not found');
      expect(getStub.calledOnce).to.be.true;
      expect(getStub.firstCall.args[0]).to.equal(`/warriors/${nonexistentWarriorId}/calculateTotalDamage`);
    });
  });
  
  describe('Check purchase affordability for a specific warrior by ID', () => {
    it('should check if a specific warrior can afford a purchase', async () => {
      const warriorIdToCheck = 123123;
      const purchaseCost = 50;
      const warriorForPurchase = {
        id: warriorIdToCheck,
        name: 'WarriorForPurchase',
        canAffordPurchase: true,
      };
  
      getStub.resolves({ status: 200, body: warriorForPurchase });
  
      const res = await request.get(`/warriors/${warriorIdToCheck}/canAffordPurchase/${purchaseCost}`);
  
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('canAffordPurchase');
      expect(res.body.canAffordPurchase).to.be.true;
      expect(getStub.calledOnce).to.be.true;
      expect(getStub.firstCall.args[0]).to.equal(`/warriors/${warriorIdToCheck}/canAffordPurchase/${purchaseCost}`);
    });
  
    it('should handle warrior not found during purchase affordability check', async () => {
      const nonexistentWarriorId = 'nonexistentId';
      const purchaseCost = 50;
      getStub.resolves({ status: 404, body: { error: 'Warrior not found' } });
  
      const res = await request.get(`/warriors/${nonexistentWarriorId}/canAffordPurchase/${purchaseCost}`);
  
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.equal('Warrior not found');
      expect(getStub.calledOnce).to.be.true;
      expect(getStub.firstCall.args[0]).to.equal(`/warriors/${nonexistentWarriorId}/canAffordPurchase/${purchaseCost}`);
    });
  });

  describe('Read info for a specific warrior by ID', () => {
    it('should read info for a specific warrior by ID', async () => {
      const warriorIdToRead = 123123;
      const warriorDataCustom = {
        id: warriorIdToRead,
        name: 'WarriorWithInfo',
        strength: 10,
        agility: 8,
        health: 30,
        isLowOnHealth: true,
        canAffordPurchase: true,
        isCriticalHit: false,
        isSpecialAbilityEligible: true,
        totalDamage: 20,
      };
  
      getStub.resolves({ status: 200, body: warriorDataCustom });
  
      const res = await request.get(`/warriors/${warriorIdToRead}/info`);
  
      expect(res.status).to.equal(200);
      expect(res.body.id).to.equal(warriorDataCustom.id);
      expect(res.body.name).to.equal(warriorDataCustom.name);
      expect(res.body.isLowOnHealth).to.equal(warriorDataCustom.isLowOnHealth);
      expect(res.body).to.have.property('canAffordPurchase');
      expect(getStub.calledOnce).to.be.true;
      expect(getStub.firstCall.args[0]).to.equal(`/warriors/${warriorIdToRead}/info`);
    });
  
    it('should handle warrior not found during info retrieval', async () => {
      getStub.resolves({ status: 404, body: { error: 'Warrior not found' } });
  
      const res = await request.get(`/warriors/nonexistentId/info`);
  
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.equal('Warrior not found');
      expect(getStub.calledOnce).to.be.true;
      expect(getStub.firstCall.args[0]).to.equal(`/warriors/nonexistentId/info`);
    });
  });
  
  describe('Get list of warriors', () => {
    it('should handle empty list of warriors', async () => {
      getStub.resolves({ status: 200, body: [] });
  
      const res = await request.get('/warriors');
  
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array').that.is.empty;
      expect(getStub.calledOnce).to.be.true;
      expect(getStub.firstCall.args[0]).to.equal('/warriors');
    });
  
    it('should return at least 3 warriors in the response', async () => {
      const warriorsData = [
        { id: 1, name: 'Warrior1', strength: 10 },
        { id: 2, name: 'Warrior2', strength: 8 },
        { id: 3, name: 'Warrior3', strength: 12 },
      ];
  
      getStub.resolves({ status: 200, body: warriorsData });
  
      const res = await request.get('/warriors');
  
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array').that.has.length.at.least(3);
      expect(res.body[0].name).to.equal('Warrior1');
      expect(res.body[1].name).to.equal('Warrior2');
      expect(res.body[2].name).to.equal('Warrior3');
      expect(getStub.calledOnce).to.be.true;
      expect(getStub.firstCall.args[0]).to.equal('/warriors');
    });
  });

  describe('Update a specific warrior by ID', () => {
    it('should update a specific warrior by ID', async () => {
      putStub.returns({
        send: sandbox.stub().resolves({ status: 200, body: warriorData }),
      });
  
      const res = await request.put(`/warriors/${warriorDataID}`).send(warriorData);
  
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('id');
      expect(res.body.id).to.equal(warriorData.id);
      expect(res.body.name).to.equal(warriorData.name);
      expect(res.body.strength).to.equal(warriorData.strength);
      expect(res.body.health).to.equal(warriorData.health);
      expect(putStub.calledOnce).to.be.true;
      expect(putStub.firstCall.args[0]).to.equal(`/warriors/${warriorDataID}`);
      expect(putStub.firstCall.returnValue.send.calledOnce).to.be.true;
    });
  
    it('should handle warrior not found during update', async () => {
      putStub.returns({
        send: sandbox.stub().resolves({ status: 404, body: { error: 'Warrior not found' } }),
      });
  
      const res = await request.put(`/warriors/nonexistentId`).send(warriorData);
  
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.equal('Warrior not found');
      expect(putStub.calledOnce).to.be.true;
      expect(putStub.firstCall.args[0]).to.equal(`/warriors/nonexistentId`);
      expect(putStub.firstCall.returnValue.send.calledOnce).to.be.true;
    });
  });
  
  describe('Delete a specific warrior by ID', () => {
    it('should delete a specific warrior by ID', async () => {
      deleteStub.resolves({ status: 200, body: warriorData });
  
      const res = await request.delete(`/warriors/${warriorDataID}`);
  
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('id');
      expect(res.body.id).to.equal(warriorData.id);
      expect(res.body.name).to.equal(warriorData.name);
      expect(res.body.strength).to.equal(warriorData.strength);
      expect(res.body.health).to.equal(warriorData.health);
      expect(deleteStub.calledOnce).to.be.true;
      expect(deleteStub.firstCall.args[0]).to.equal(`/warriors/${warriorDataID}`);
    });
  
    it('should handle warrior not found during deletion', async () => {
      deleteStub.resolves({ status: 404, body: { error: 'Warrior not found' } });
  
      const res = await request.delete(`/warriors/nonexistentId`);
  
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.equal('Warrior not found');
      expect(deleteStub.calledOnce).to.be.true;
      expect(deleteStub.firstCall.args[0]).to.equal(`/warriors/nonexistentId`);
    });
  });
});
