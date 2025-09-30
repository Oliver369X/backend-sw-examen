import 'dotenv/config';
import express, { Application } from 'express';
import cors from 'cors';

import usuarioRoutes from './routes/usuario.routes';

import salaRoutes from './routes/sala.routes';
import authRoutes from './routes/authRoutes';
import aiRoutes from './routes/ai.routes';

const app: Application = express();

app.use(cors());
// Aumentar el límite para JSON payloads y URL-encoded payloads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/usuarios', usuarioRoutes);

app.use('/api/salas', salaRoutes);
app.use('/auth', authRoutes);
app.use('/api/ai', aiRoutes);

// Rutas (se agregarán después)
// app.use('/api/auth', require('./routes/auth.routes'));

export default app;
