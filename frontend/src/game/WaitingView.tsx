import { Button, Typography } from '@mui/material';
import React from 'react';

interface WaitingViewProps {
    onGameStart: () => void;
}

const WaitingView: React.FC<WaitingViewProps> = ({onGameStart}) => {

    return (
        <>
            <Typography>Sobald du auf "Start" drückst, beginnt deine Zeit. Viel Glück!</Typography>
            <Button onClick={onGameStart}>Start</Button>
        </>
    );
};

export default WaitingView;