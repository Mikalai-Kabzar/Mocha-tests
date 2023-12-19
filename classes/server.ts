import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { Warrior } from './Warrior'; // Assuming the Warrior class is in a separate file
import { Server } from 'http';

const app = express();
const port = 3000;
let server: Server;
// Middleware to parse JSON requests
app.use(bodyParser.json());

// Sample in-memory database
const warriors: Warrior[] = [];
export { app, Server };
// CRUD Routes

// GET all warrior names
app.get('/warriors/names', (req: Request, res: Response) => {
    const warriorNames = warriors.map((warrior) => warrior.name);
    res.json(warriorNames);
});

// Check if a warrior is low on health
app.get('/warriors/:id/isLowOnHealth', (req: Request, res: Response) => {
    const warriorId = parseInt(req.params.id, 10);
    const foundWarrior = warriors.find((warrior) => warrior.id === warriorId);

    if (foundWarrior) {
        const isLowOnHealth = foundWarrior.isLowOnHealth();
        res.json({ isLowOnHealth });
    } else {
        res.status(404).json({ error: 'Warrior not found' });
    }
});

// Check if a warrior can afford a purchase
app.get('/warriors/:id/canAffordPurchase/:cost', (req: Request, res: Response) => {
    const warriorId = parseInt(req.params.id, 10);
    const cost = parseInt(req.params.cost, 10);

    const foundWarrior = warriors.find((warrior) => warrior.id === warriorId);

    if (foundWarrior) {
        const canAffordPurchase = foundWarrior.canAffordPurchase(cost);
        res.json({ canAffordPurchase });
    } else {
        res.status(404).json({ error: 'Warrior not found' });
    }
});

// Check if a warrior is eligible for a special ability
app.get('/warriors/:id/isSpecialAbilityEligible', (req: Request, res: Response) => {
    const warriorId = parseInt(req.params.id, 10);
    const foundWarrior = warriors.find((warrior) => warrior.id === warriorId);

    if (foundWarrior) {
        const isSpecialAbilityEligible = foundWarrior.isSpecialAbilityEligible();
        res.json({ isSpecialAbilityEligible });
    } else {
        res.status(404).json({ error: 'Warrior not found' });
    }
});

// Calculate total damage for a warrior
app.get('/warriors/:id/calculateTotalDamage', (req: Request, res: Response) => {
    const warriorId = parseInt(req.params.id, 10);
    const foundWarrior = warriors.find((warrior) => warrior.id === warriorId);

    if (foundWarrior) {
        const totalDamage = foundWarrior.calculateTotalDamage();
        res.json({ totalDamage });
    } else {
        res.status(404).json({ error: 'Warrior not found' });
    }
});

app.get('/warriors/:id/info', (req: Request, res: Response) => {
    const warriorId = parseInt(req.params.id, 10);
    const foundWarrior = warriors.find((warrior) => warrior.id === warriorId);

    if (foundWarrior) {
        const info = {
            id: foundWarrior.id,
            name: foundWarrior.name,
            isLowOnHealth: foundWarrior.isLowOnHealth(),
            canAffordPurchase: foundWarrior.canAffordPurchase(100), // Adjust the cost as needed
            isCriticalHit: foundWarrior.isCriticalHit(),
            isSpecialAbilityEligible: foundWarrior.isSpecialAbilityEligible(),
            totalDamage: foundWarrior.calculateTotalDamage(),
            
            // Add more properties as needed
        };
        res.json(info);
    } else {
        res.status(404).json({ error: 'Warrior not found' });
    }
});

// Create a new warrior
app.post('/warriors', (req: Request, res: Response) => {
    const { name, strength, agility, intellect, luck, health, attack, attackSpeed, criticalChance, criticalFactor, money } = req.body;

    // Generate a new ID based on the last ID in the list
    const newId = warriors.length > 0 ? warriors[warriors.length - 1].id + 1 : 1;

    const newWarrior = new Warrior(
        newId,
        name,
        strength,
        agility,
        intellect,
        luck,
        health,
        attack,
        attackSpeed,
        criticalChance,
        criticalFactor,
        money
    );

    warriors.push(newWarrior);

    res.status(201).json(newWarrior);
});

// Read all warriors
app.get('/warriors', (req: Request, res: Response) => {
    res.json(warriors);
});

// Read a specific warrior by ID
app.get('/warriors/:id', (req: Request, res: Response) => {
    const warriorId = parseInt(req.params.id, 10);
    const foundWarrior = warriors.find((warrior) => warrior.id === warriorId);

    if (foundWarrior) {
        res.json(foundWarrior);
    } else {
        res.status(404).json({ error: 'Warrior not found' });
    }
});

// Update a specific warrior by ID
app.put('/warriors/:id', (req: Request, res: Response) => {
    const warriorId = parseInt(req.params.id, 10);
    const updatedWarriorIndex = warriors.findIndex((warrior) => warrior.id === warriorId);

    if (updatedWarriorIndex !== -1) {
        const updatedWarrior = { ...warriors[updatedWarriorIndex], ...req.body };
        warriors[updatedWarriorIndex] = updatedWarrior;

        res.json(updatedWarrior);
    } else {
        res.status(404).json({ error: 'Warrior not found' });
    }
});

// Delete a specific warrior by ID
app.delete('/warriors/:id', (req: Request, res: Response) => {
    const warriorId = parseInt(req.params.id, 10);
    const deletedWarriorIndex = warriors.findIndex((warrior) => warrior.id === warriorId);

    if (deletedWarriorIndex !== -1) {
        const deletedWarrior = warriors.splice(deletedWarriorIndex, 1)[0];
        res.json(deletedWarrior);
    } else {
        res.status(404).json({ error: 'Warrior not found' });
    }
});

// Start the server
export function startServer(port: number = 3000): void {
    //stopServer();
    server = app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

// Stop the server
export function stopServer(): void {
        server.close();
}