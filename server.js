import express from 'express';

import cors from 'cors';

import userRoutes from './routes/userRoutes.js';

const app = express();

app.use(cors());

app.use(express.json());

app.use(

  '/users',

  userRoutes

);

app.listen(3000, () => {

  console.log(

    'Servidor rodando'

  );

});