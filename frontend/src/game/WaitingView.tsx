import { Button, Container, Typography } from '@mui/material';
import React from 'react';
import GameLogo from '../components/GameLogo';

interface WaitingViewProps {
    onGameStart: () => void;
}

const WaitingView: React.FC<WaitingViewProps> = ({ onGameStart }) => {

    return (
        <Container>
            <GameLogo />
            <Typography gutterBottom>Sobald du "Start" drückst, beginnt deine Zeit. Viel Glück!</Typography>
            <Button variant="contained" onClick={onGameStart}>Start</Button>
        </Container>
    );
};

export default WaitingView;