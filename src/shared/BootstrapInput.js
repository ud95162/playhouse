import {alpha, InputBase, styled} from "@mui/material";

const BootstrapInput = styled(InputBase)(({ theme, error }) => ({
    '& .MuiInputBase-input': {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: '#ffffff',
        border: '1px solid',
        borderColor: error ? '#FF5733' : '#E0E3E7',
        fontSize: 16,
        width: '100%',
        padding: '10px 12px',
        transition: theme.transitions.create(['border-color', 'background-color', 'box-shadow']),
        '&:focus': {
            boxShadow: `${alpha(error ? '#FF5733' : '#fe5e15', 0.25)} 0 0 0 0.2rem`,
            borderColor: error ? '#FF5733' : '#fe5e15',
        },
    },
}));

export default  BootstrapInput;