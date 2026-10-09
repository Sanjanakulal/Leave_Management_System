import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();

    const [formdata, setFormdata] = useState({
        email: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);

    const handlechange = (e) => {
        setFormdata({
            ...formdata,
            [e.target.name]: e.target.value
        });
    };

    const handlelogin = async (e) => {
        e.preventDefault();

        if (!formdata.email.trim() || !formdata.password) {
            alert('Please enter your email and password');
            return;
        }

        try {
            setLoading(true);

            const res = await axios.post(
                'http://localhost:5000/employee/login',
                formdata
            );

            localStorage.setItem('EmployeeToken', res.data.token);
            localStorage.setItem('EmployeeName', res.data.name);
            localStorage.setItem('EmployeeId', res.data.employeeId);
            localStorage.setItem('MongoEmployeeId', res.data.id);
            localStorage.setItem('LeaveBalance', res.data.leaveBalance);

            alert('Login successful');

            
            navigate('/EmployeeDashboard');
        } catch (error) {
            console.error('Login error:', error);

            alert(
                error.response?.data?.message ||
                'Login failed. Please check your credentials.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#020617',
                p: 2
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    width: '100%',
                    maxWidth: 380,
                    p: 3,
                    borderRadius: '16px',
                    background: '#0f172a',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 700,
                        textAlign: 'center',
                        color: '#fff'
                    }}
                >
                    Employee Login
                </Typography>

                <Typography
                    sx={{
                        textAlign: 'center',
                        mb: 2.5,
                        fontSize: '13px',
                        color: '#94a3b8'
                    }}
                >
                    Sign in to manage your leaves
                </Typography>

                <Box component="form" onSubmit={handlelogin}>
                    <TextField
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formdata.email}
                        onChange={handlechange}
                        required
                        fullWidth
                        size="small"
                        autoComplete="email"
                        sx={inputStyle}
                    />

                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        value={formdata.password}
                        onChange={handlechange}
                        required
                        fullWidth
                        size="small"
                        autoComplete="current-password"
                        sx={{ ...inputStyle, mb: 2 }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading}
                        sx={{
                            py: 1.1,
                            borderRadius: '999px',
                            fontWeight: 600,
                            textTransform: 'none',
                            backgroundColor: '#2563eb',
                            '&:hover': {
                                backgroundColor: '#1d4ed8'
                            }
                        }}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>
                </Box>

                <Typography
                    sx={{
                        textAlign: 'center',
                        mt: 2,
                        fontSize: '13px',
                        color: '#94a3b8'
                    }}
                >
                    Don't have an account?{' '}
                    <Box
                        component="span"
                        onClick={() => navigate('/Register')}
                        sx={{
                            color: '#60a5fa',
                            cursor: 'pointer',
                            fontWeight: 600
                        }}
                    >
                        Register
                    </Box>
                </Typography>
            </Paper>
        </Box>
    );
}

const inputStyle = {
    mb: 1.6,
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        backgroundColor: '#020617',
        color: '#fff',
        '& fieldset': {
            borderColor: '#1e293b'
        },
        '&:hover fieldset': {
            borderColor: '#2563eb'
        },
        '&.Mui-focused fieldset': {
            borderColor: '#2563eb'
        },
        '& input:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 100px #020617 inset',
            WebkitTextFillColor: '#ffffff'
        }
    },
    '& .MuiInputLabel-root': {
        color: '#64748b',
        fontSize: '0.85rem',
        '&.Mui-focused': {
            color: '#60a5fa'
        }
    },
    '& .MuiInputBase-input': {
        color: '#fff',
        fontSize: '0.9rem'
    }
};