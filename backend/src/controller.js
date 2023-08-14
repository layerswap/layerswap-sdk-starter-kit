import axios from 'axios';
import { prodHost, apiKey, webhookSecret } from '../env.dev.js';
import { Swaps } from './model.js';
import { Webhook } from 'svix';
import { buffer } from 'micro';

const getNetworks = async (req, res) => {
  try {
    const response = await axios.get(`${prodHost}/api/public/networks`, {
      headers: {
        accept: `application/json'`,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data });
  }
};

const getQuote = async (req, res) => {
  const { source, destination, sourceAsset, destinationAsset, refuel } =
    req.body;

  try {
    const response = await axios.post(
      `${prodHost}/api/public/quote`,
      {
        source,
        destination,
        source_asset: sourceAsset,
        destination_asset: destinationAsset,
        refuel,
      },
      {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );
    res.json(response.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data });
  }
};

const createSwap = async (req, res) => {
  const {
    source,
    destination,
    amount,
    sourceAsset,
    destinationAsset,
    sourceAddress,
    destinationAddress,
    refuel,
    referenceId,
  } = req.body;
  try {
    let response = await axios.post(
      `${prodHost}/api/private/swaps`,
      {
        source,
        destination,
        amount,
        source_asset: sourceAsset,
        destination_asset: destinationAsset,
        source_address: sourceAddress,
        destination_address: destinationAddress,
        refuel,
        reference_id: referenceId,
      },
      {
        headers: {
          'X-LS-APIKEY': apiKey,
          'Content-Type': 'application/json',
        },
      },
    );
    if (response.data.data) {
      await Swaps.create({
        swapId: response.data.data.swap_id,
      });
      const result = await axios.get(
        `${prodHost}/api/private/swaps/${response.data.data.swap_id}`,
        {
          headers: {
            'X-LS-APIKEY': apiKey,
          },
        },
      );
      res.json(result.data);
    }
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data });
  }
};

const getSwaps = async (req, res) => {
  try {
    let swaps = await Swaps.findAll({
      attributes: ['swapId'],
      raw: true,
    });
    const responses = await Promise.all(
      swaps.map(({ swapId }) => {
        return axios.get(`${prodHost}/api/private/swaps/${swapId}`, {
          headers: {
            'X-LS-APIKEY': apiKey,
          },
        });
      }),
    );
    swaps = responses.map(({ data }) => data.data || data.error);
    res.json(swaps);
  } catch (error) {
    res.status(500).json({ error: error.response.data });
  }
};

const getSwap = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${prodHost}/api/private/swaps/${id}`, {
      headers: {
        'X-LS-APIKEY': apiKey,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data });
  }
};

const deleteSwap = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.delete(`${prodHost}/api/private/swaps/${id}`, {
      headers: {
        'X-LS-APIKEY': apiKey,
      },
    });
    if (response.data) {
      const result = await axios.get(`${prodHost}/api/private/swaps/${id}`, {
        headers: {
          'X-LS-APIKEY': apiKey,
        },
      });
      res.json(result.data.data);
    }
  } catch (error) {
    res.status(400).json({ error: error.response?.data });
  }
};

const webhook = async (req, res) => {
  const payload = req.body;
  const headers = req.headers;
  const io = req.io;
  const wh = new Webhook(webhookSecret);
  let msg;
  try {
    // Convert to string as payload should be string or buffer
    msg = wh.verify(JSON.stringify(payload), headers);
    io.emit('message', msg);
  } catch (err) {
    return res.status(400).json({});
  }
  res.json({});
};

export {
  getNetworks,
  getQuote,
  createSwap,
  getSwaps,
  getSwap,
  deleteSwap,
  webhook,
};
