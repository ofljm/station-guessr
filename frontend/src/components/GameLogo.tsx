import { Container } from '@mui/material';
import React from 'react';

const GameLogo: React.FC = () => {
    return (
        <Container
            component={"img"}
            sx={{
                display: 'flex',
                maxWidth: { xs: '80%', sm: '50%' },
                marginBottom: 2
            }}
            src="/stationGuessr.png" alt="StationGuessr Logo"
        >
        </Container>
    );
};

export default GameLogo;