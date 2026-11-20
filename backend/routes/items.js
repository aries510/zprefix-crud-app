import express from "express";
import initKnex from "knex";
import knexConfig from "../knexfile.js";

const router = express.Router();
const knex = initKnex(knexConfig.development);


router.get('/', async (request, response) => {
    try {
        const items = await knex('items').select('*');
        response.status(200).json(items)
    } catch(error) {
        console.log(`Error: ${error}`)
        response.status(500).json({ message: 'Failed', error: error.message });
    };
});

export default router;