import express, { response } from "express";
import initKnex from "knex";
import knexConfig from "../knexfile.js";

const router = express.Router();
const knex = initKnex(knexConfig.development);

const itemFormat = (row) => ({
    id: row.item_id,
    name: row.item_name,
    description: row.description,
    qty: Number(row.qty),
    owner: {
        id: row.user_id,
        first_name: row.f_name,
        last_name: row.l_name
    }
});

router.get('/', async (request, response) => {
    try {
        const rows = await knex('items')
            .leftJoin('users', 'items.user_id', 'users.id')
            .select(
                'items.id as item_id',
                'items.name as item_name',
                'items.description',
                'items.qty',
                'users.id as user_id',
                'users.f_name',
                'users.l_name'
            );

        const items = rows.map(itemFormat)
        response.status(200).json(items)
    } catch(error) {
        console.error(`Error getting items: ${error}`)
        response.status(500).json({ message: 'Failed to get items' });
    };
});

router.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;

        const row = await knex('items')
            .leftJoin('users', 'items.user_id', 'users.id')
            .where('items.id', id)
            .select(
                'items.id as item_id',
                'items.name as item_name',
                'items.description',
                'items.qty',
                'users.id as user_id',
                'users.f_name',
                'users.l_name'
            )
            .first();
        if (!row) {
            return response.status(404).json({ message: `Item id: ${id} not found` });
        };
        response.status(200).json(itemFormat(row))
    } catch(error) {
        console.error(`Error getting item: ${error}`);
        response.status(500).json({ message: 'Failed to get item' });
    };
});

router.post('/', async (request, response) => {
    try {
        const { user_id, name, description, qty } = request.body;

        if (!user_id || !name) {
            response.status(400).json({ message: "Name and user fields are required." })
        };

        const [newItem] = await knex('items')
            .insert({
                user_id,
                name,
                description: description || '',
                qty: qty || 1
            })
            .returning('*');

    const owner = await knex('users')
            .where({ id: newItem.user_id })
            .select('f_name', 'l_name')
            .first();

    response.status(201).json({
        id: newItem.id,
        name: newItem.name,
        description: newItem.description,
        qty: Number(newItem.qty),
        owner: {
            id: owner.id,
            first_name: owner.f_name,
            last_name: owner.l_name
        }
    });
    } catch(error) {
        console.error(`Error creating item: ${error}`);
        if (error.code === '23503') {
            return response.status(404).json({ message: 'User does not exist' });
        }
        res.status(500).json({ message: 'Failed to create item' });
    };
});

router.patch('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const { user_id, name,  description, qty } = request.body;

        const updates = {};
        if (user_id !== undefined) {
            updates.user_id = user_id
        };
        if (name !== undefined) {
            updates.name = name
        };
        if (description !== undefined) {
            updates.description = description
        };
        if (qty !== undefined) {
            updates.qty = qty
        };

        if (Object.keys(updates).length === 0) {
            return response.status(400).json({ message: 'Provide at least one field to update.' });
        };

        const dbItemUpdateAction = await knex('items')
            .where({ id: id })
            .update(updates)
            .returning('*');

        if (!dbItemUpdateAction) {
            return response.status(404).json({ message: `Item id: ${id} not found` })
        };

        const owner = await knex('users')
            .where({ id: dbItemUpdateAction.user_id })
            .select('f_name', 'l_name')
            .first();

        response.status(200).json({
            id: dbItemUpdateAction.id,
            name: dbItemUpdateAction.name,
            description: dbItemUpdateAction.description,
            qty: dbItemUpdateAction.qty,
            owner: {
                id: owner.id,
                first_name: owner.f_name,
                last_name: owner.l_name
            }
        });
    } catch(error) {
        console.error(`Error updating item: ${error}`);
        if (error.code === '23503') {
            return response.status(404).json({ message: 'User does not exist' });
        };
        response.status(500).json({ message: 'Failed to update item' });
    };
});

router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;

        const dbItemDeletion = await knex('items')
            .where({ id: id })
            .del();

        if (dbItemDeletion === 0) {
            return response.status(404).json({ message: `Item id: ${id} not found.` });
        };
        response.status(200).json({ message: `Item id: ${id} deleted successfully.` });
    } catch(error) {
        console.error('Error deleing item:', error);
        response.status(500).json({ message: 'Failed to delete item' });
    };
});

export default router;