import express from 'express';
import {
  getNetworks,
  getRoutes,
  getRate,
  createSwap,
  getSwaps,
  getSwap,
  deleteSwap,
  prepareSwap,
  webhook,
} from './controller.js';

const router = express.Router();

router.get('/networks', getNetworks);
router.post('/getRoutes', getRoutes);
router.post('/getRate',getRate);
router.get('/swaps', getSwaps);
router.post('/swaps', createSwap);
router.get('/swaps/:id', getSwap);
router.delete('/swaps/:id', deleteSwap);
router.get('/prepare',prepareSwap);
router.post('/webhook', webhook);

export default router;
