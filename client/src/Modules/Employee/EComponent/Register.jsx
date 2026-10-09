import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const navigate = useNavigate();

    const [formdata, setFormdata] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
    });

    const [loading, setLoading] = useState(false);

    const handlechange = (e) => {
        setFormdata({
            ...formdata,
            [e.target.name]: e.target.value
        });
    };

    const handleregister = async (e) => {
        e.preventDefault();

        if (
            !formdata.name.trim() ||
            !formdata.email.trim() ||
            !formdata.password ||
            !formdata.confirmPassword
        ) {
            alert('Please fill in all required fields');
            return;
        }

        if (formdata.password.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }

        if (formdata.password !== formdata.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            setLoading(true);

            const { confirmPassword, ...employeeData } = formdata;

            const res = await axios.post(
                'http://localhost:5000/employee/register',
                employeeData
            );

            alert(res.data.message || 'Registration successful');
            navigate('/Login');
        } catch (error) {
            console.error('Registration error:', error);

            alert(
                error.response?.data?.message ||
                'Registration failed. Please try again.'
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
                    Employee Registration
                </Typography>

                <Typography
                    sx={{
                        textAlign: 'center',
                        mb: 2.5,
                        fontSize: '13px',
                        color: '#94a3b8'
                    }}
                >
                    Create your employee account
                </Typography>

                <Box component="form" onSubmit={handleregister}>
                    <TextField
                        label="Full Name"
                        name="name"
                        value={formdata.name}
                        onChange={handlechange}
                        required
                        fullWidth
                        size="small"
                        autoComplete="name"
                        sx={inputStyle}
                    />

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
                        autoComplete="new-password"
                        inputProps={{ minLength: 6 }}
                        sx={inputStyle}
                    />

                    <TextField
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        value={formdata.confirmPassword}
                        onChange={handlechange}
                        required
                        fullWidth
                        size="small"
                        autoComplete="new-password"
                        sx={inputStyle}
                    />

                    <TextField
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        value={formdata.phone}
                        onChange={handlechange}
                        fullWidth
                        size="small"
                        autoComplete="tel"
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
                        {loading ? 'Registering...' : 'Create Account'}
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
                    Already registered?{' '}
                    <Box
                        component="span"
                        onClick={() => navigate('/Login')}
                        sx={{
                            color: '#60a5fa',
                            cursor: 'pointer',
                            fontWeight: 600
                        }}
                    >
                        Login
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