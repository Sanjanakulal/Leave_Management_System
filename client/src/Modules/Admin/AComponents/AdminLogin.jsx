import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AdminLogin() {
    const [showPassword, setShowPassword] = useState(false);

    const [adminlogin, setLogin] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setLogin({
            ...adminlogin,
            [e.target.name]: e.target.value
        });
    };

    const handleLogin = async () => {
        try {
            // const res = await axios.post(
            //     'http://localhost:5000/admin/loginbyadmin',
            //     adminlogin
            // );

            const res = await axios.post(
                `${API_URL}/admin/loginbyadmin`,
                adminlogin
            );
            if (res.data.success) {
                localStorage.setItem('UserToken', res.data.token);
                alert('Login successful');
                navigate('/Admin');
            } else {
                alert('Login failed');
            }
        } catch (error) {
            console.log(error);
            alert(
                error.response?.data?.message || 'Login failed'
            );
        }
    };

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: `
                    radial-gradient(circle at top left, rgba(59,130,246,0.12), transparent 20%),
                    radial-gradient(circle at bottom right, rgba(139,92,246,0.12), transparent 20%),
                    linear-gradient(180deg, #020617 0%, #0f172a 100%)
                `
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    width: '100%',
                    maxWidth: '420px',
                    p: 4,
                    borderRadius: '24px',
                    background: 'rgba(17,24,39,0.92)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    boxShadow: '0 30px 80px rgba(0,0,0,0.55)'
                }}
            >
                <Typography
                    sx={{
                        color: '#ffffff',
                        fontSize: '32px',
                        fontWeight: 700,
                        textAlign: 'center',
                        mb: 0.5,
                        letterSpacing: '-0.03em'
                    }}
                >
                    Admin Login
                </Typography>

                <Typography
                    sx={{
                        color: '#94a3b8',
                        fontSize: '13px',
                        textAlign: 'center',
                        mb: 3
                    }}
                >
                    Authorized Admin Access Only
                </Typography>

                <Box
                    sx={{
                        height: '1px',
                        background: '#1e293b',
                        mb: 3
                    }}
                />

                <TextField
                    variant="outlined"
                    label="Email"
                    fullWidth
                    name="email"
                    type="email"
                    value={adminlogin.email}
                    onChange={handleChange}
                    autoComplete="email"
                    sx={{
                        mb: 2.2,
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '14px',
                            background: '#0f172a',
                            color: '#ffffff',
                            '& fieldset': {
                                borderColor: '#1e293b'
                            },
                            '&:hover fieldset': {
                                borderColor: '#2563eb'
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#2563eb'
                            }
                        },
                        '& .MuiInputLabel-root': {
                            color: '#64748b'
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: '#60a5fa'
                        }
                    }}
                />

                <TextField
                    variant="outlined"
                    label="Password"
                    fullWidth
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={adminlogin.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    sx={{ color: '#64748b' }}
                                >
                                    {showPassword
                                        ? <VisibilityOff />
                                        : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                    sx={{
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '14px',
                            background: '#0f172a',
                            color: '#ffffff',
                            '& fieldset': {
                                borderColor: '#1e293b'
                            },
                            '&:hover fieldset': {
                                borderColor: '#2563eb'
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#2563eb'
                            }
                        },
                        '& .MuiInputLabel-root': {
                            color: '#64748b'
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: '#60a5fa'
                        }
                    }}
                />

                <Button
                    variant="contained"
                    fullWidth
                    onClick={handleLogin}
                    sx={{
                        mt: 1,
                        py: 1.3,
                        borderRadius: '999px',
                        fontWeight: 600,
                        fontSize: '14px',
                        textTransform: 'none',
                        background: `
                            linear-gradient(
                                135deg,
                                #2563eb,
                                #7c3aed
                            )
                        `,
                        boxShadow: 'none',
                        '&:hover': {
                            background: `
                                linear-gradient(
                                    135deg,
                                    #1d4ed8,
                                    #6d28d9
                                )
                            `,
                            boxShadow: '0 0 20px rgba(37,99,235,0.35)'
                        }
                    }}
                >
                    Login
                </Button>
            </Paper>
        </Box>
    );
}
