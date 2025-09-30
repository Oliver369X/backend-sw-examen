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

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'API Diagramador UML funcionando correctamente',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/salas', salaRoutes);
app.use('/auth', authRoutes);
app.use('/api/ai', aiRoutes);

export default app;
