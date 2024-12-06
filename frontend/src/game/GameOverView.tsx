import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, List, ListItem, Typography } from '@mui/material';
import React, { useState } from 'react';
import { CorrectGuess } from '../domain/PlayerSession';
import CorrectStationGuesses from './CorrectStationGuesses';

type GameOverViewProps = {
    correctGuesses: CorrectGuess[]
    onRestart: () => void
}

const GameOverView: React.FC<GameOverViewProps> = ({ correctGuesses, onRestart }) => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleConfirmRestart = () => {
        setOpen(false);
        onRestart();
    };

    return (
        <>
            <Typography textAlign={'center'} variant={'h4'}>Zeit abgelaufen!</Typography>
            <List>
                <ListItem>
                    <Typography variant='h6'>Du hast {correctGuesses.length} Haltestellen korrekt erraten 🎉</Typography>
                </ListItem>
                <ListItem>
                    <CorrectStationGuesses correctGuesses={correctGuesses} highlightNew={false} />
                </ListItem>
                <ListItem>
                    <Button onClick={handleClickOpen} variant='contained'>Nochmal spielen</Button>
                </ListItem>
            </List>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>Neues Spiel starten?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bist du sicher, dass du ein neues Spiel starten möchtest? Dein letzets Ergebnis wird nicht gespeichert.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="outlined" color="warning">
                        Abbrechen
                    </Button>
                    <Button onClick={handleConfirmRestart} variant="outlined" color="primary">
                        Bestätigen
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default GameOverView;