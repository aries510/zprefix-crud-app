import express from "express";
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
        console.log(`Error: ${error}`);
        response.status(500).json({ message: 'Failed', error: error.message });
    };
    // response.status(200);
    // knex('users')
    //     .select('*')
    //     .then(users => {
    //         var usersList = users.map(user => {
    //             const output = {
    //                 First_Name: `${user.f_name}`,
    //                 Last_Name: `${user.l_name}`
    //             }
    //             return output
    //         });
    //         response.json(usersList)
    //     })
});

export default router;