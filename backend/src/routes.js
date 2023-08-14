import express from 'express';
import {
  getNetworks,
  getQuote,
  createSwap,
  getSwaps,
  getSwap,
  deleteSwap,
  webhook,
} from './controller.js';

const router = express.Router();

router.get('/networks', getNetworks);
router.post('/quote', getQuote);
router.get('/swaps', getSwaps);
router.post('/swaps', createSwap);
router.get('/swaps/:id', getSwap);
router.delete('/swaps/:id', deleteSwap);
router.post('/webhook', webhook);

export default router;
