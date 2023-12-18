import { expect } from 'chai';
//import { sinon } from 'sinon';
var sinon = require("sinon");
import 'mocha';
import { Warrior } from './Warrior'; // Adjust the import path based on your project structure

describe('Warrior Class', () => {
    let myWarrior: Warrior;

    beforeEach(() => {
        myWarrior = new Warrior(1, "Warrior1", 8, 6, 4, 5, 100, 10, 1.5, 0.1, 2, 50);
    });

    it('should correctly check if the warrior is low on health', () => {
        expect(myWarrior.isLowOnHealth()).to.be.false; // Assuming initial health is not below 30
        myWarrior.health = 20;
        expect(myWarrior.isLowOnHealth()).to.be.true;
    });

    it('should correctly check if the warrior can afford a purchase', () => {
        expect(myWarrior.canAffordPurchase(30)).to.be.true;
        expect(myWarrior.canAffordPurchase(60)).to.be.false;
    });

    it('should correctly check if a critical hit occurs', () => {
        // Stub Math.random to always return a value < 0.1 for the purpose of the test
        const randomStub = sinon.stub(Math, 'random').returns(0.05);
        expect(myWarrior.isCriticalHit()).to.be.true;

        // Restore the original Math.random function
        randomStub.restore();
    });

    it('should correctly calculate total damage', () => {
        // Stub isCriticalHit method to always return true for the purpose of the test
        const isCriticalHitStub = sinon.stub(myWarrior, 'isCriticalHit').returns(true);
        expect(myWarrior.calculateTotalDamage()).to.equal(20); // Assuming critical factor is 2

        // Restore the original isCriticalHit method
        isCriticalHitStub.restore();
    });

    it('should correctly check if the warrior is eligible for a special ability', () => {
        expect(myWarrior.isSpecialAbilityEligible()).to.be.true;
        myWarrior.strength = 5;
        expect(myWarrior.isSpecialAbilityEligible()).to.be.false;
    });

    it('should correctly calculate total damage with critical hits', () => {
        // Stub isCriticalHit method to always return true for testing purposes
        myWarrior.isCriticalHit = () => true;

        // Calculate expected total damage considering the critical factor
        const expectedTotalDamage = myWarrior.attack * myWarrior.criticalFactor;

        // Call the calculateTotalDamage method
        const actualTotalDamage = myWarrior.calculateTotalDamage();

        // Check if the total damage is equal to the expected total damage
        expect(actualTotalDamage).to.equal(expectedTotalDamage);
    });

    it('should correctly calculate total damage without critical hits', () => {
        // Stub isCriticalHit method to always return false for testing purposes
        myWarrior.isCriticalHit = () => false;

        // Call the calculateTotalDamage method
        const actualTotalDamage = myWarrior.calculateTotalDamage();

        // Check if the total damage is equal to the base attack value
        expect(actualTotalDamage).to.equal(myWarrior.attack);
    });

    it('should correctly calculate total damage with critical hits', () => {
        // Stub isCriticalHit method to always return true for testing purposes
        const isCriticalHitStub = sinon.stub(myWarrior, 'isCriticalHit').returns(true);

        // Calculate expected total damage considering the critical factor
        const expectedTotalDamage = myWarrior.attack * myWarrior.criticalFactor;

        // Call the calculateTotalDamage method
        const actualTotalDamage = myWarrior.calculateTotalDamage();

        // Check if the total damage is equal to the expected total damage
        expect(actualTotalDamage).to.equal(expectedTotalDamage);

        // Restore the original method to avoid affecting other tests
        isCriticalHitStub.restore();
    });

    it('should correctly calculate total damage without critical hits', () => {
        // Stub isCriticalHit method to always return false for testing purposes
        const isCriticalHitStub = sinon.stub(myWarrior, 'isCriticalHit').returns(false);

        // Call the calculateTotalDamage method
        const actualTotalDamage = myWarrior.calculateTotalDamage();

        // Check if the total damage is equal to the base attack value
        expect(actualTotalDamage).to.equal(myWarrior.attack);

        // Restore the original method to avoid affecting other tests
        isCriticalHitStub.restore();
    });

    // Add more tests as needed
});
