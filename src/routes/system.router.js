import { Router } from 'express';

const router = Router();

router.get('/api/system/info', (req, res) => {
  const info = {
    pid: process.pid,
    plataforma: process.platform,
    versionNode: process.version,
    usoMemoria: process.memoryUsage(),
    pathEjecucion: process.cwd(),
    argumentos: process.argv.slice(2),
    carpetaProyecto: process.argv[1],
  };

  res.json({ status: 'success', info });
});

export default router;