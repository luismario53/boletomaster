import express from 'express'
import { extraerToken } from '../middleware/proxyAuth.js'

import auth from './authApi.js'
import usuarios from './usuariosApi.js'
import merch from './merchApi.js'
import eventos from './eventosApi.js'
import galeria from './galeriaApi.js'
import ordenes from './ordenesApi.js'

const router = express.Router()

// middleware
router.use(extraerToken)

router.use('/auth', auth)
router.use('/usuarios', usuarios)
router.use('/merch', merch)
router.use('/eventos', eventos)
router.use('/galeria', galeria)
router.use('/ordenes', ordenes)


router.get("/live", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default router;