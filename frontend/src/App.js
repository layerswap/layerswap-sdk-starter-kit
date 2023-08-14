'use client';
import { useState } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Grid,
} from '@mui/material';

import { useCurrencies, useNetworks, useQuote, useCreateSwap } from './hooks';

export default function App() {
  const { sources, destinations } = useNetworks();
  const { quote, getQuote } = useQuote();
  const { currencies, updateCurrencies } = useCurrencies();
  const { createSwap } = useCreateSwap();
  const [destination, setDestination] = useState('');
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [sourceCurrency, setSourceCurrency] = useState('');
  const [destinationCurrency, setDestinationCurrency] = useState('');

  const [address, setAddress] = useState('');

  const navigate = useNavigate();

  const handleSourceChange = event => {
    updateCurrencies({
      sourceFilterBy: event.target.value,
      destFilterBy: destination,
      sources,
      destinations,
    });
    setSource(event.target.value);
    if (
      event.target.value &&
      destination &&
      sourceCurrency &&
      destinationCurrency
    ) {
      getQuote({
        source: event.target.value,
        destination,
        sourceAsset: sourceCurrency,
        destinationAsset: destinationCurrency,
        refuel: true,
      });
    }
  };

  const handleDestinationChange = event => {
    updateCurrencies({
      sourceFilterBy: source,
      destFilterBy: event.target.value,
      sources,
      destinations,
    });
    setDestination(event.target.value);
    if (source && event.target.value && sourceCurrency && destinationCurrency) {
      getQuote({
        source: event.target.value,
        destination,
        sourceAsset: sourceCurrency,
        destinationAsset: destinationCurrency,
        refuel: true,
      });
    }
  };

  const handleAmountChange = event => {
    setAmount(event.target.value);
  };

  const showMin = () => {
    setAmount(quote?.min_amount || 0);
  };

  const showMax = () => {
    setAmount(quote?.max_amount || 0);
  };

  const handleSourceCurrencyChange = event => {
    setSourceCurrency(event.target.value);
    if (source && destination && event.target.value && destinationCurrency) {
      getQuote({
        source,
        destination,
        sourceAsset: event.target.value,
        destinationAsset: destinationCurrency,
        refuel: true,
      });
    }
  };

  const handleDestinationCurrencyChange = event => {
    setDestinationCurrency(event.target.value);
    if (source && destination && event.target.value && sourceCurrency) {
      getQuote({
        source,
        destination,
        sourceAsset: sourceCurrency,
        destinationAsset: event.target.value,
        refuel: true,
      });
    }
  };

  const handleAddressChange = event => {
    setAddress(event.target.value);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    const { id } = await createSwap({
      source,
      destination,
      amount: +amount,
      destinationAddress: address,
      sourceAsset: sourceCurrency,
      destinationAsset : destinationCurrency,
      refuel: false,
    });
    navigate(`/swaps/${id}`);
  };
  return (
    <>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: '100vh' }}>
        <Grid item xs={3}>
          <form onSubmit={handleSubmit}>
            <Grid container direction={'column'} spacing={2}>
              <Grid item>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => {
                      navigate('/swaps');
                    }}>
                    Swaps List
                  </Button>
                </div>
              </Grid>
              <Grid item>
                <FormControl fullWidth>
                  <InputLabel id="source-label">Source</InputLabel>
                  <Select
                    labelId="source-label"
                    id="source"
                    value={source}
                    label="Source"
                    onChange={handleSourceChange}>
                    {sources.map(({ logo, display_name, name }, index) => (
                      <MenuItem key={index} value={name}>
                        {display_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item>
                <FormControl fullWidth>
                  <InputLabel id="destination-label">Destination</InputLabel>
                  <Select
                    labelId="destination-label"
                    id="destination"
                    value={destination}
                    label="Destination"
                    onChange={handleDestinationChange}>
                    {destinations.map(({ logo, display_name, name }, index) => (
                      <MenuItem key={index} value={name}>
                        {display_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item>
                <TextField
                  label="Amount"
                  value={amount}
                  onChange={handleAmountChange}
                />
                <FormControl style={{ minWidth: 80 }}>
                  <InputLabel id="source-select-label">
                    Source Currency
                  </InputLabel>
                  <Select
                    labelId="source-select-label"
                    id="source-currency-select"
                    value={sourceCurrency}
                    onChange={handleSourceCurrencyChange}>
                    {currencies.map(({ logo, display_name, name }, index) => (
                      <MenuItem key={index} value={name}>
                        {display_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl style={{ minWidth: 80 }}>
                  <InputLabel id="currency-select-label">
                    Desination Currency
                  </InputLabel>
                  <Select
                    labelId="destination-select-label"
                    id="destination-currency-select"
                    value={destinationCurrency}
                    onChange={handleDestinationCurrencyChange}>
                    {currencies.map(({ logo, display_name, name }, index) => (
                      <MenuItem key={index} value={name}>
                        {display_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={showMin}>
                    min
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={showMax}>
                    max
                  </Button>
                  {quote?.min_amount && quote?.max_amount && (
                    <p style={{ margin: '0 2px' }}>
                      Range: {quote.min_amount} - {quote.max_amount}
                    </p>
                  )}
                </div>
                {quote?.fee_amount && <p>Fee: {quote.fee_amount}</p>}
              </Grid>
              <Grid item>
                <TextField
                  fullWidth
                  label="Address"
                  value={address}
                  onChange={handleAddressChange}
                />
              </Grid>
              <Grid item>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  type="submit">
                  Swap
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </>
  );
}
