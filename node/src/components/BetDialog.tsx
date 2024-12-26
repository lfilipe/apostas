import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Slide,
  Select,
  MenuItem,
  FormControl,
  Chip,
  Stack,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { Match } from '../types';
import { forwardRef } from 'react';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CloseIcon from '@mui/icons-material/Close';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface BetDialogProps {
  open: boolean;
  match: Match | null;
  onClose: () => void;
  onSubmit: (homeScore: number, awayScore: number) => Promise<void>;
}

const scores = Array.from({ length: 16 }, (_, i) => i);

export function BetDialog({ open, match, onClose, onSubmit }: BetDialogProps) {
  const [homeScore, setHomeScore] = useState<number>(0);
  const [awayScore, setAwayScore] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!match) return;
    
    setSubmitting(true);
    try {
      await onSubmit(homeScore, awayScore);
    } catch (error) {
      console.error('Erro ao enviar aposta:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!match) return null;

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      aria-describedby="bet-dialog-description"
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          Fazer Aposta
        </Typography>
        <IconButton
          aria-label="fechar"
          onClick={onClose}
          sx={{
            color: 'inherit',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          align="center"
          gutterBottom
          sx={{ mb: 3 }}
        >
          {new Date(match.matchDateTime).toLocaleString('pt-BR', {
            dateStyle: 'long',
            timeStyle: 'short',
          })}
        </Typography>

        {match.odds && (
          <Stack 
            direction="row" 
            spacing={1.5} 
            justifyContent="center" 
            sx={{ mb: 4 }}
          >
            <Chip
              icon={<EmojiEventsIcon />}
              label={`Vitória ${match.homeTeam}: ${match.odds.homeWin.toFixed(2)}`}
              variant="outlined"
              color="primary"
              sx={{ 
                px: 1,
                '& .MuiChip-icon': {
                  color: 'primary.main',
                },
              }}
            />
            <Chip
              icon={<EmojiEventsIcon />}
              label={`Empate: ${match.odds.draw.toFixed(2)}`}
              variant="outlined"
              color="primary"
              sx={{ 
                px: 1,
                '& .MuiChip-icon': {
                  color: 'primary.main',
                },
              }}
            />
            <Chip
              icon={<EmojiEventsIcon />}
              label={`Vitória ${match.awayTeam}: ${match.odds.awayWin.toFixed(2)}`}
              variant="outlined"
              color="primary"
              sx={{ 
                px: 1,
                '& .MuiChip-icon': {
                  color: 'primary.main',
                },
              }}
            />
          </Stack>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: 2, 
                fontWeight: 'bold',
                color: 'text.primary',
              }}
            >
              {match.homeTeam}
            </Typography>
            <FormControl fullWidth>
              <Select
                value={homeScore}
                onChange={(e) => setHomeScore(Number(e.target.value))}
                sx={{
                  '.MuiSelect-select': {
                    py: 1.5,
                    textAlign: 'center',
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                    borderWidth: 2,
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: 300,
                      '& .MuiMenuItem-root': {
                        justifyContent: 'center',
                        fontSize: '1.25rem',
                        py: 1.5,
                      },
                    },
                  },
                }}
              >
                {scores.map((score) => (
                  <MenuItem key={score} value={score}>
                    {score}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Typography 
            variant="h4" 
            sx={{ 
              color: 'text.secondary',
              fontWeight: 'bold',
              userSelect: 'none',
            }}
          >
            X
          </Typography>

          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: 2, 
                fontWeight: 'bold',
                color: 'text.primary',
              }}
            >
              {match.awayTeam}
            </Typography>
            <FormControl fullWidth>
              <Select
                value={awayScore}
                onChange={(e) => setAwayScore(Number(e.target.value))}
                sx={{
                  '.MuiSelect-select': {
                    py: 1.5,
                    textAlign: 'center',
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                    borderWidth: 2,
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: 300,
                      '& .MuiMenuItem-root': {
                        justifyContent: 'center',
                        fontSize: '1.25rem',
                        py: 1.5,
                      },
                    },
                  },
                }}
              >
                {scores.map((score) => (
                  <MenuItem key={score} value={score}>
                    {score}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions 
        sx={{ 
          px: 3, 
          pb: 3, 
          pt: 2,
          gap: 2,
        }}
      >
        <Button 
          onClick={onClose} 
          disabled={submitting}
          variant="outlined"
          color="inherit"
          sx={{ 
            flex: 1,
            py: 1.5,
            borderRadius: 1,
            fontWeight: 'bold',
            borderColor: 'divider',
            color: 'text.primary',
            '&:hover': {
              borderColor: 'text.primary',
              bgcolor: 'action.hover',
            },
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting}
          sx={{ 
            flex: 1,
            py: 1.5,
            borderRadius: 1,
            fontWeight: 'bold',
          }}
        >
          {submitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Confirmar Aposta'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 