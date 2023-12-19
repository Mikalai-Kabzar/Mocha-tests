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
export { app };
// CRUD Routes

// GET all warrior names
app.get('/warriors/names', (req: Request, res: Response) => {
    const warriorNames = warriors.map((warrior) => warrior.name);
    res.json(warriorNames);
});

// Create a new warrior
app.post('/warriors', (req: Request, res: Response) => {
    const { id, name, strength, agility, intellect, luck, health, attack, attackSpeed, criticalChance, criticalFactor, money } = req.body;

    const newWarrior = new Warrior(
        id,
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
