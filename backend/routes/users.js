import express, { response } from "express";
import initKnex from "knex";
import knexConfig from "../knexfile.js";

const router = express.Router();
const knex = initKnex(knexConfig.development);


router.get('/', async (request, response) => {
    try {
        const users = await knex('users').select('*');
        const formatUsers = users.map(user => {
            const output = {
                id: `${user.id}`,
                first_name: `${user.f_name}`,
                last_name: `${user.l_name}`,
                username: `${user.username}`
            };
            return output
        });
        response.status(200).json(formatUsers)
    } catch(error) {
        console.error(`Error getting users: ${error}`);
        response.status(500).json({ message: 'Failed', error: error.message });
    };
});

router.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;

        const user = await knex('users')
            .where({ id: id})
            .select('id', 'f_name', 'l_name', 'username')
            .first();
        if (!user) {
            return response.status(404).json({ message: `User id: ${id} not found` });
        };

        const foundUser = {
            id: user.id,
            first_name: user.f_name,
            last_name: user.l_name,
            username: user.username
        };
        response.status(200).json(foundUser)
    } catch(error) {
        console.error(`Error getting user: ${error}`);
        response.status(500).json({ message: 'Failed to retrieve user' });
    };
});

router.post('/', async (request, response) => {
    try{
        const {f_name, l_name, username, password} = request.body;

        if(!f_name || !l_name || !username || !password) {
            response.status(400).json({message: "All fields are required." })
        };

        const [newUser] = await knex('users')
            .insert({
                f_name,
                l_name,
                username,
                password
            })
            .returning(['id', 'f_name', "l_name", "username"]);

        const formatNewUser = {
            id: newUser.id,
            first_name: newUser.f_name,
            last_name: newUser.l_name,
            username: newUser.username
        };

        response.status(201).json(formatNewUser);
    } catch(error) {
        console.error(`Error creating user: ${error}`);
        if (error.code === '23505') {
            return response.status(409).json({ message: 'Username already exists' });
        }
        res.status(500).json({ message: 'Failed to create user' });
    };
});

router.patch('/:id', async (request, response) => {
    try {
        const { id } = request.params
        const { f_name, l_name, username, password } = request.body

        const updates = {};
        if (f_name !== undefined) {
            updates.f_name = f_name
        };
        if (l_name !== undefined) {
            updates.l_name = l_name
        };
        if (username !== undefined) {
            updates.username = username
        };
        if (password !== undefined) {
            updates.password = password
        };
        if(Object.keys(updates).length === 0) {
            return response.status(400).json({ message: "Please provide at least one field to update" });
        };

        const [dbResultForUserUpdate] = await knex('users')
            .where({ id: id })
            .update(updates)
            .returning(['id', 'f_name', 'l_name', 'username']);
        if (!dbResultForUserUpdate) {
            return response.status(404).json({ message: `User with id: ${id} not found.` });
        };

        const updatedUser = {
            id: dbResultForUserUpdate.id,
            first_name: dbResultForUserUpdate.f_name,
            last_name: dbResultForUserUpdate.l_name,
            username: dbResultForUserUpdate.username
        };
        response.status(200).json(updatedUser)
    } catch(error) {
        console.error(`Error updating user: ${error}`);
        // PostgreSQL error code 23505 is for unique constraint violation
        if (error.code === '23505') {
            return response.status(409).json({ message: 'Username already exists' });
        }
        response.status(500).json({ message: 'Failed to update user' });
    };
});

router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;

        const dbDeleteActionOnUser = await knex('users')
            .where({ id: id })
            .del();
        if (dbDeleteActionOnUser === 0) {
            return response.status(404).json({ message: `User with id: ${id} not found.` });
        };
        response.status(200).json({ message: `User id: ${id} deleted`})
    } catch(error) {
        console.error(`Error deleting user: ${error}`);
        // PostgreSQL error code 23503 is for a foreign key violation
        if (error.code === '23503') {
            return response.status(409).json({ message: 'Cannot delete user while items are still assigned to user.' });
        };
        response.status(500).json({ message: 'Failed to delete user' });
    };
});

export default router;