import { useCallback, useEffect } from 'react';
import { useSwaps } from './hooks';
import { useNavigate } from 'react-router-dom';
import { socket } from './socket';

import {
  Grid,
  Table,
  TableContainer,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
} from '@mui/material';

export default function Swaps() {
  const { swaps, setSwaps } = useSwaps();

  const navigate = useNavigate();

  const setSelectedRow = useCallback(
    ({ id }) => {
      navigate(id);
    },
    [navigate],
  );

  const socketHandler = useCallback(
    payload => {
      setSwaps(prevSwaps => {
        return prevSwaps.map(swap => {
          if (swap.id === payload.id) {
            return { ...swap, ...payload };
          }
          return swap;
        });
      });
    },
    [setSwaps],
  );

  useEffect(() => {
    socket.on('message', socketHandler);

    return () => {
      socket.off('message', socketHandler);
    };
  }, [socketHandler]);
  const pendingStatuses = ['is_transfer_pending', 'user_transfer_pending'];
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
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>id</TableCell>
                  <TableCell align="right">to</TableCell>
                  <TableCell align="right">from</TableCell>
                  <TableCell align="right">amount</TableCell>
                  <TableCell align="right">fee</TableCell>
                  <TableCell align="right">asset</TableCell>
                  <TableCell align="right">status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {swaps &&
                  swaps.map(
                    row =>
                      row.id && (
                        <TableRow
                          onClick={() => setSelectedRow(row)}
                          key={row.id}
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                          }}>
                          <TableCell component="th" scope="row">
                            {row.id}
                          </TableCell>
                          <TableCell align="right">{row.to}</TableCell>
                          <TableCell align="right">{row.from}</TableCell>
                          <TableCell align="right">{row.amount}</TableCell>
                          <TableCell align="right">{row.fee}</TableCell>
                          <TableCell align="right">
                            {row.asset.display_name}
                          </TableCell>
                          <TableCell align="right">
                            {row.status}
                            {pendingStatuses.includes(row.status) && (
                              <CircularProgress size={10} />
                            )}
                          </TableCell>
                        </TableRow>
                      ),
                  )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
}
