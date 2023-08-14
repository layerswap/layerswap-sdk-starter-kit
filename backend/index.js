import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

import { allowedOrigin, port } from './env.dev.js';
import { sequelize } from './src/model.js';
import router from './src/routes.js';

const corsOptions = {
  origin: allowedOrigin,
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
};

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: corsOptions,
});

io.on('connection', socket => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(express.json());
app.use(helmet());
app.use(
  cors({
    origin: allowedOrigin,
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
  }),
);

app.use('/api', router);

await sequelize.sync();

server.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
