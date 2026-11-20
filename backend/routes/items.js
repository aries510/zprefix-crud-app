import express from "express";
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

export default router;