import express, { request, response } from "express";
import cors from "cors";
import initKnex from "knex";
import knexConfig from "./knexfile.js";
import usersRouter from "./routes/users.js";
import itemsRouter from "./routes/items.js"

const knex = initKnex(knexConfig.development)
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({
    origin: "http://localhost:5173",
}));
app.use(express.json())
app.use('/users', usersRouter)
app.use('/items', itemsRouter)

app.get('/', (request, response) => response.send('No endpoints available on this page...'));

app.listen(PORT, () => console.log(`App listening on http://localhost:${PORT}`));