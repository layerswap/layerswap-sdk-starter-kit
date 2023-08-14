import { useGetSwap, useSwaps } from './hooks';
import {
  Grid,
  Avatar,
  Typography,
  Paper,
  Button,
  CircularProgress,
} from '@mui/material';
import { useState, useEffect, useCallback } from 'react';
import { socket } from './socket';
import { css } from '@emotion/react';

const classes = {
  root: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px;
  `,
  logo: css`
    width: 80px;
    height: 80px;
    margin-bottom: 8px;
  `,
  subtitle: css`
    margin-bottom: 5px;
  `,
};

export default function Swap() {
  const { swap, setSwap } = useGetSwap();
  const { cancelSwap } = useSwaps();

  const [jsonDisplay, setJsonDisplay] = useState(false);
  const [jsonData, setJsonData] = useState(null);

  const socketHandler = useCallback(
    payload => {
      setSwap(payload);
    },
    [setSwap],
  );

  useEffect(() => {
    socket.on('message', data => {
      socketHandler(data);
    });

    return () => {
      socket.off('message');
    };
  }, [socketHandler]);

  const showJSON = () => {
    if (jsonDisplay) {
      setJsonDisplay(false);
      setJsonData(null);
    } else {
      setJsonDisplay(true);
      setJsonData(JSON.stringify(swap, null, 2));
    }
  };

  const getCancelSwap = async () => {
    setSwap(await cancelSwap());
  };
  const pendingStatuses = ['is_transfer_pending', 'user_transfer_pending'];
  return (
    <>
      {swap.id && (
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          sx={{ minHeight: '100vh' }}>
          <Grid item xs={3}>
            <Paper css={classes.root}>
              <Avatar
                css={classes.logo}
                alt={swap.from_network.display_name}
                src={swap.from_network.logo}
              />
              <Typography variant="subtitle1" css={classes.subtitle}>
                Status: {swap.status}{' '}
                {pendingStatuses.includes(swap.status) && (
                  <CircularProgress size={10} />
                )}
              </Typography>
              <Typography variant="h6">
                {swap.from_network.display_name}
              </Typography>
              <Typography variant="subtitle1" css={classes.subtitle}>
                From: {swap.from}
              </Typography>
              <Typography variant="subtitle1" css={classes.subtitle}>
                To: {swap.to}
              </Typography>
              <Typography variant="subtitle1" css={classes.subtitle}>
                Amount: {swap.amount}
              </Typography>
              <Typography variant="subtitle1" css={classes.subtitle}>
                Fee: {swap.fee}
              </Typography>
              <Avatar
                css={classes.logo}
                alt={swap.to_network.display_name}
                src={swap.to_network.logo}
              />
              <Typography variant="h6">
                {swap.to_network.display_name}
              </Typography>
              <Typography variant="subtitle1" css={classes.subtitle}>
                Asset: {swap.asset.name}
              </Typography>
              <Typography variant="subtitle1" css={classes.subtitle}>
                Source Address: {swap.source_address}
              </Typography>
              <Typography variant="subtitle1" css={classes.subtitle}>
                Destination Address: {swap.to_address}
              </Typography>
              <Typography variant="subtitle1" css={classes.subtitle}>
                Deposit Address: {swap.deposit_address}
              </Typography>
              <Typography variant="subtitle1" css={classes.subtitle}>
                Reference ID: {swap.reference_id}
              </Typography>
              <Typography variant="subtitle1" css={classes.subtitle}>
                App Name: {swap.app_name}
              </Typography>
            </Paper>
            <Grid item>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                onClick={showJSON}>
                Show JSON
              </Button>
            </Grid>
            <Grid item>
              {jsonDisplay && (
                <Paper css={classes.root}>
                  <Typography variant="body1">
                    <pre>{jsonData}</pre>
                  </Typography>
                </Paper>
              )}{' '}
            </Grid>
          </Grid>
          <Grid item>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              onClick={getCancelSwap}>
              Cancel swap
            </Button>
          </Grid>
        </Grid>
      )}
    </>
  );
}
