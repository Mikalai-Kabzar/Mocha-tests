export class Warrior {
    id: number;
    name: string;
    strength: number;
    agility: number;
    intellect: number;
    luck: number;
    health: number;
    attack: number;
    attackSpeed: number;
    criticalChance: number;
    criticalFactor: number;
    money: number;

    constructor(
        id: number,
        name: string,
        strength: number,
        agility: number,
        intellect: number,
        luck: number,
        health: number,
        attack: number,
        attackSpeed: number,
        criticalChance: number,
        criticalFactor: number,
        money: number
    ) {
        this.id = id;
        this.name = name;
        this.strength = strength;
        this.agility = agility;
        this.intellect = intellect;
        this.luck = luck;
        this.health = health;
        this.attack = attack;
        this.attackSpeed = attackSpeed;
        this.criticalChance = criticalChance;
        this.criticalFactor = criticalFactor;
        this.money = money;
    }

    isLowOnHealth(): boolean {
        return this.health < 30; 
    }

    canAffordPurchase(cost: number): boolean {
        return this.money >= cost;
    }

    isCriticalHit(): boolean {
        return Math.random() < this.criticalChance;
    }

    calculateTotalDamage(): number {
        let totalDamage = this.attack;
        if (this.isCriticalHit()) {
            totalDamage *= this.criticalFactor;
        }
        return totalDamage;
    }

    isSpecialAbilityEligible(): boolean {
        return this.strength > 7 && this.agility > 5 && this.intellect > 3;
    } 
}
