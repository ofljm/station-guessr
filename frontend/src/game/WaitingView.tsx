import { Box, Button, Container, Typography } from '@mui/material';
import React from 'react';

interface WaitingViewProps {
    onGameStart: () => void;
}

const WaitingView: React.FC<WaitingViewProps> = ({onGameStart}) => {

    return (
        <Box display="flex" justifyContent="center">
            <Container maxWidth={'sm'} style={{ textAlign: 'center' }}>
                <Typography gutterBottom>Sobald du "Start" drückst, beginnt deine Zeit. Viel Glück!</Typography>
                <Button variant="contained" onClick={onGameStart}>Start</Button>
            </Container>
        </Box>
    );
};

export default WaitingView;