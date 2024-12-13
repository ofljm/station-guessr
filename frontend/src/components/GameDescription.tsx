import { Typography } from '@mui/material';
import React from 'react';

const GameDescription: React.FC = () => {
    return (
        <>
            <Typography textAlign="center" variant="h4" gutterBottom>
                Wie gut kennst du den S-Bahn Verkehr in der Umgebung?
            </Typography>
            <Typography variant="body1" gutterBottom>
                Gleich hast du 10 Minuten Zeit, so viele S-Bahn Haltestellen im RMV Gebiet wie möglich zu erraten.
            </Typography>
            <Typography variant="body2" gutterBottom>
                Das Gebiet enthält Frankfurt, Darmstadt, Hanau, Offenbach, Wiesbaden, Mainz und alles dazwischen.
            </Typography>
        </>
    );
};

export default GameDescription;