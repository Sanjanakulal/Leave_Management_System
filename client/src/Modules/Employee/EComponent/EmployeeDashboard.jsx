import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

import {
    Clock,
    CheckCircle,
    XCircle,
    History,
    PlusCircle,
    LogOut,
    Wallet,
    RefreshCw
} from "lucide-react";

export default function EmployeeDashboard() {
    const navigate = useNavigate();

    const employeeName =
        localStorage.getItem("EmployeeName") || "Employee";
    const employeeId =
        localStorage.getItem("EmployeeId") || "Not assigned";

    const [leaveBalance, setLeaveBalance] = useState(
        Number(localStorage.getItem("LeaveBalance") || 12)
    );
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const fetchEmployeeDashboard = useCallback(async (showLoader = true) => {
        try {
            if (showLoader) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }

            setError("");

            const token = localStorage.getItem("EmployeeToken");

            if (!token) {
                navigate("/Login", { replace: true });
                return;
            }

            const response = await axios.get(
                // "http://localhost:5000/leave/my-leaves",
                `${API_URL}/leave/my-leaves`,
                {
                    headers: { "auth-token": token }
                }
            );

            setLeaves(response.data.leaves || []);

            // Refresh the balance directly from the employee record.
            // This endpoint must be added to the backend as described below.
            const balanceResponse = await axios.get(
                // "http://localhost:5000/employee/me",
                `${API_URL}/employee/me`,
                {
                    headers: { "auth-token": token }
                }
            );

            const currentBalance = Number(
                balanceResponse.data.employee?.leaveBalance
            );

            if (Number.isFinite(currentBalance)) {
                setLeaveBalance(currentBalance);
                localStorage.setItem("LeaveBalance", String(currentBalance));
            }
        } catch (err) {
            console.error("Employee dashboard error:", err);
            setError(
                err.response?.data?.message ||
                "Unable to refresh your dashboard. Please try again."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchEmployeeDashboard();
    }, [fetchEmployeeDashboard]);

    const handleLogout = () => {
        localStorage.removeItem("EmployeeToken");
        localStorage.removeItem("EmployeeName");
        localStorage.removeItem("EmployeeId");
        localStorage.removeItem("MongoEmployeeId");
        localStorage.removeItem("LeaveBalance");

        navigate("/Login", { replace: true });
    };

    const pendingCount = leaves.filter(
        (leave) => leave.status === "Pending"
    ).length;

    const approvedCount = leaves.filter(
        (leave) => leave.status === "Approved"
    ).length;

    const rejectedCount = leaves.filter(
        (leave) => leave.status === "Rejected"
    ).length;

    const stats = [
        {
            title: "Available Leaves",
            value: leaveBalance,
            description: "Days remaining",
            icon: Wallet
        },
        {
            title: "Pending Requests",
            value: pendingCount,
            description: "Awaiting approval",
            icon: Clock
        },
        {
            title: "Approved Leaves",
            value: approvedCount,
            description: "Approved requests",
            icon: CheckCircle
        },
        {
            title: "Rejected Requests",
            value: rejectedCount,
            description: "Rejected requests",
            icon: XCircle
        }
    ];

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "#020617",
                color: "#ffffff",
                p: { xs: 2, md: 4 },
                "& .MuiTypography-root": {
                    color: "#ffffff"
                }
            }}
        >
            <Box sx={{ maxWidth: 1200, mx: "auto" }}>
                {/* Header */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 2,
                        mb: 4
                    }}
                >
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                            Leave Management
                        </Typography>
                        <Typography sx={{ color: "#94a3b8 !important" }}>
                            Employee Dashboard
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                            variant="outlined"
                            startIcon={<RefreshCw size={17} />}
                            disabled={refreshing || loading}
                            onClick={() => fetchEmployeeDashboard(false)}
                            sx={{
                                color: "#ffffff",
                                borderColor: "#334155",
                                textTransform: "none"
                            }}
                        >
                            Refresh
                        </Button>

                        <Button
                            variant="outlined"
                            startIcon={<LogOut size={18} />}
                            onClick={handleLogout}
                            sx={{
                                color: "#ffffff",
                                borderColor: "#334155",
                                textTransform: "none",
                                "&:hover": {
                                    borderColor: "#60a5fa",
                                    backgroundColor: "#0f172a"
                                }
                            }}
                        >
                            Logout
                        </Button>
                    </Box>
                </Box>

                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 3 }}
                        action={
                            <Button
                                color="inherit"
                                size="small"
                                onClick={() => fetchEmployeeDashboard(false)}
                            >
                                Retry
                            </Button>
                        }
                    >
                        {error}
                    </Alert>
                )}

                {/* Employee information */}
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3, md: 4 },
                        mb: 4,
                        borderRadius: 3,
                        background: "#0f172a",
                        border: "1px solid #1e293b"
                    }}
                >
                    <Typography
                        sx={{
                            color: "#94a3b8 !important",
                            fontSize: 14,
                            mb: 1
                        }}
                    >
                        Welcome back,
                    </Typography>

                    <Typography
                        variant="h4"
                        sx={{ fontWeight: 700, mb: 2 }}
                    >
                        {employeeName}
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 4
                        }}
                    >
                        <Box>
                            <Typography
                                sx={{
                                    color: "#94a3b8 !important",
                                    fontSize: 13
                                }}
                            >
                                Employee ID
                            </Typography>
                            <Typography sx={{ fontWeight: 600 }}>
                                {employeeId}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography
                                sx={{
                                    color: "#94a3b8 !important",
                                    fontSize: 13
                                }}
                            >
                                Account
                            </Typography>
                            <Typography
                                sx={{
                                    color: "#34d399 !important",
                                    fontWeight: 600
                                }}
                            >
                                Employee
                            </Typography>
                        </Box>
                    </Box>
                </Paper>

                {/* Leave overview */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 1,
                        mb: 2
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Leave Overview
                    </Typography>

                    {refreshing && (
                        <CircularProgress size={18} sx={{ color: "#60a5fa" }} />
                    )}
                </Box>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                            lg: "repeat(4, 1fr)"
                        },
                        gap: 2,
                        mb: 4
                    }}
                >
                    {stats.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <Paper
                                key={stat.title}
                                elevation={0}
                                sx={{
                                    p: 2.5,
                                    borderRadius: 3,
                                    background: "#0f172a",
                                    border: "1px solid #1e293b"
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        gap: 1,
                                        mb: 2
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            color: "#cbd5e1 !important",
                                            fontSize: 13
                                        }}
                                    >
                                        {stat.title}
                                    </Typography>

                                    <Icon size={20} color="#60a5fa" />
                                </Box>

                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontWeight: 700,
                                        mb: 1
                                    }}
                                >
                                    {loading ? "—" : stat.value}
                                </Typography>

                                <Typography
                                    sx={{
                                        color: "#94a3b8 !important",
                                        fontSize: 12
                                    }}
                                >
                                    {stat.description}
                                </Typography>
                            </Paper>
                        );
                    })}
                </Box>

                {/* Quick actions */}
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    Quick Actions
                </Typography>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)"
                        },
                        gap: 2
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            background: "#0f172a",
                            border: "1px solid #1e293b"
                        }}
                    >
                        <PlusCircle size={28} color="#60a5fa" />

                        <Typography
                            variant="h6"
                            sx={{ mt: 2, mb: 1, fontWeight: 700 }}
                        >
                            Apply for Leave
                        </Typography>

                        <Typography
                            sx={{
                                color: "#cbd5e1 !important",
                                fontSize: 14,
                                mb: 2
                            }}
                        >
                            Submit a new leave request for approval.
                        </Typography>

                        <Button
                            variant="contained"
                            fullWidth
                            onClick={() => navigate("/ApplyLeave")}
                            sx={{
                                textTransform: "none",
                                backgroundColor: "#2563eb",
                                "&:hover": {
                                    backgroundColor: "#1d4ed8"
                                }
                            }}
                        >
                            Apply Now
                        </Button>
                    </Paper>

                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            background: "#0f172a",
                            border: "1px solid #1e293b"
                        }}
                    >
                        <History size={28} color="#60a5fa" />

                        <Typography
                            variant="h6"
                            sx={{ mt: 2, mb: 1, fontWeight: 700 }}
                        >
                            Leave History
                        </Typography>

                        <Typography
                            sx={{
                                color: "#cbd5e1 !important",
                                fontSize: 14,
                                mb: 2
                            }}
                        >
                            Check the status of your leave requests.
                        </Typography>

                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => navigate("/LeaveHistory")}
                            sx={{
                                color: "#ffffff",
                                borderColor: "#475569",
                                textTransform: "none",
                                "&:hover": {
                                    borderColor: "#60a5fa",
                                    backgroundColor: "#1e293b"
                                }
                            }}
                        >
                            View History
                        </Button>
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
}
