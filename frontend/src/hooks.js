import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { API_URL } from './constants';

const useNetworks = () => {
  const [sources, setSources] = useState([]);
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: response } = await axios.get(`${API_URL}/networks`);
        if (response.error) {
          console.log('error getting networks', response.error);
        } else {
          setSources(response.data);
          setDestinations(response.data);
        }
      } catch (error) {
        console.log('error getting networks', error);
      }
    };

    fetchData();
  }, []);

  return {
    sources,
    destinations,
  };
};

const useRate = () => {
  const [rate, setRate] = useState({});
  const getRate = async body => {
    try {
      const { data: response } = await axios.post(`${API_URL}/getRate`, body);
      
      if (response.error) {
        console.log('error getting rate', response.error);
      } else {
        setRate(response.data);
      }
    } catch (error) {
      console.log('error getting rate', error);
    }
  };
  return {
    rate,
    getRate,
  };
};

const useCreateSwap = () => {
  const createSwap = async body => {
    try {
      const { data: response } = await axios.post(`${API_URL}/swaps`, body);

      if (response.error) {
        console.log('error creating swap', response.error);
      } else {
        return response.data;
      }
    } catch (error) {
      console.log('error creating swap', error);
    }
  };

  return {
    createSwap,
  };
};

const useGetSwap = () => {
  const [swap, setSwap] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const getSwap = async () => {
      try {
        const { data: response } = await axios.get(`${API_URL}/swaps/${id}`);
        if (response.error) {
          console.log('error getting swap', response.error);
        } else {
          setSwap(response.data);
        }
      } catch (error) {
        console.log('error getting swap', error);
      }
    };

    getSwap();
  }, [id]);

  return {
    swap,
    setSwap,
  };
};

const useSwaps = () => {
  const [swaps, setSwaps] = useState([]);

  useEffect(() => {
    const getSwaps = async () => {
      try {
        const { data: response } = await axios.get(`${API_URL}/swaps`);
        setSwaps(response);
      } catch (error) {
        console.log('error getting networks', error);
      }
    };

    getSwaps();
  }, []);

  const { id } = useParams();
  const cancelSwap = async () => {
    try {
      const { data: response } = await axios.delete(`${API_URL}/swaps/${id}`);
      if (response.error) {
        console.log('error deleting swap by id', response.error);
      } else {
        return response;
      }
    } catch (error) {
      console.log('error deleting swap by id', error);
    }
  };

  return {
    swaps,
    setSwaps,
    cancelSwap,
  };
};

const useCurrencies = () => {
  const [currencies, setCurrencies] = useState([]);

  const updateCurrencies = ({
    sourceFilterBy,
    destFilterBy,
    sources,
    destinations,
  }) => {
    const sourceCurrencies = getCurrencies(sourceFilterBy, sources);
    const destCurrencies = getCurrencies(destFilterBy, destinations);
    const intersectCurrencies = sourceCurrencies.filter(n =>
      destCurrencies.some(n2 => n.name === n2.name),
    );
    setCurrencies(intersectCurrencies);
  };

  const getCurrencies = (filterBy, data) => {
    const currencies = [];
    if (filterBy) {
      const foundData = data.find(source => source.name === filterBy);
      if (foundData) {
        foundData.currencies.forEach(asset => {
            if (currencies.findIndex(item => item.name === asset.name) === -1) {
              currencies.push(asset);
            }
          });
      }
    }
    return currencies;
  };

  return {
    currencies,
    updateCurrencies,
  };
};

const useWebHook = () => {};

export {
  useNetworks,
  useRate,
  useCreateSwap,
  useCurrencies,
  useGetSwap,
  useSwaps,
  useWebHook,
};
