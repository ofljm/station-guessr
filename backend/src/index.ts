import cors from 'cors';
import express from 'express';
import routes from './api'; // Adjust the path as necessary

const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = ['https://station-guessr-frontend.onrender.com', 'http://localhost:5173'];

const options: cors.CorsOptions = {
  origin: allowedOrigins
};

app.use(cors(options));
app.use(express.json());
app.use('/', routes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
