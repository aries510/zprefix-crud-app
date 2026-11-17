import express from "express";
import cors from "cors";

const app = express();
const PORT = 8080;

app.use(cors({
    origin: "http://localhost:5173",
}));
app.use(express.json())

app.get('/', (request, response) => response.send('No endpoints available on this page'))

app.listen(PORT, () => console.log(`App listening on http://localhost:${PORT}`))