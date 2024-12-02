import { List, ListItem, ListItemText } from '@mui/material';
import React from 'react';

interface StationListProps {
    names: string[];
}

const StationList: React.FC<StationListProps> = ({ names: stations }) => {
    return (
        <div>
            <List>
                {stations.map((station, index) => (
                    <ListItem key={index}>
                        <ListItemText primary={station} />
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default StationList;