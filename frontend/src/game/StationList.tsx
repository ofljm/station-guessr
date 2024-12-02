import { List, ListItem, ListItemText } from '@mui/material';
import React, { useEffect, useState } from 'react';
import './StationList.css';

interface StationListProps {
    names: string[];
}

const StationList: React.FC<StationListProps> = ({ names }) => {
    const [highlightedStation, setHighlightedStation] = useState<string | null>(null);

    useEffect(() => {
        console.log('Highlighting', names[names && names.length - 1]);
        setHighlightedStation(names[names && names.length - 1] ?? '');
        const timer = setTimeout(() => {
            setHighlightedStation(null);
        }, 1000);
        return () => clearTimeout(timer);
    }, [names]);

    return (
        <>
            <List>
                {names.map((station, index) => (
                    <ListItem
                        key={index}
                        className={station === highlightedStation ? 'highlight' : ''}
                    >
                        <ListItemText primary={station} />
                    </ListItem>
                ))}
            </List>
        </>
    );
};

export default StationList;