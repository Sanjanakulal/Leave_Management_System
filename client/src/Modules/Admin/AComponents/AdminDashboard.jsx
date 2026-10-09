import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip
} from "@mui/material";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalEmployees: 0,
        pendingLeaves: 0,
        approvedLeaves: 0
    });
    const [recentLeaves, setRecentLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem("UserToken");

                const [employeesResponse, leavesResponse] = await Promise.all([
                    // axios.get("http://localhost:5000/employee/all", {
                    //     headers: { "auth-token": token }
                    // }),
                    axios.get(`${API_URL}/employee/all`, {
                        headers: { "auth-token": token }
                    }),
                    // axios.get("http://localhost:5000/leave/all", {
                    //     headers: { "auth-token": token }
                    // })
                    axios.get(`${API_URL}/leave/all`, {
                        headers: { "auth-token": token }
                    })
                ]);

                const employees =
                    employeesResponse.data.employees || [];
                const leaves = leavesResponse.data.leaves || [];

                setStats({
                    totalEmployees: employees.length,
                    pendingLeaves: leaves.filter(
                        (leave) => leave.status === "Pending"
                    ).length,
                    approvedLeaves: leaves.filter(
                        (leave) => leave.status === "Approved"
                    ).length
                });

                setRecentLeaves(leaves.slice(0, 5));
            } catch (err) {
                console.error("Dashboard error:", err);
                setError("Unable to load dashboard data. Please check the server.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const cards = [
        {
            title: "Total Employees",
            value: stats.totalEmployees,
            icon: <PeopleRoundedIcon />,
            color: "#60a5fa"
        },
        {
            title: "Pending Requests",
            value: stats.pendingLeaves,
            icon: <PendingActionsRoundedIcon />,
            color: "#fbbf24"
        },
        {
            title: "Approved Requests",
            value: stats.approvedLeaves,
            icon: <CheckCircleRoundedIcon />,
            color: "#34d399"
        }
    ];

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, color: "#f8fafc" }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={700}>
                    Admin Dashboard
                </Typography>
                <Typography sx={{ color: "#94a3b8", mt: 1 }}>
                    Overview of your workforce and leave applications.
                </Typography>
            </Box>

            {error && (
                <Typography sx={{ color: "#f87171", mb: 3 }}>
                    {error}
                </Typography>
            )}

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {cards.map((card) => (
                    <Grid item xs={12} sm={6} lg={4} key={card.title}>
                        <Card
                            sx={{
                                height: "100%",
                                bgcolor: "#1e293b",
                                color: "#f8fafc",
                                border: "1px solid #334155",
                                borderRadius: 3,
                                boxShadow: "0 8px 24px rgba(0,0,0,0.12)"
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        mb: 3
                                    }}
                                >
                                    <Typography sx={{ color: "#cbd5e1" }}>
                                        {card.title}
                                    </Typography>
                                    <Box sx={{ color: card.color }}>
                                        {card.icon}
                                    </Box>
                                </Box>
                                <Typography
                                    variant="h3"
                                    fontWeight={700}
                                    sx={{ color: card.color }}
                                >
                                    {card.value.toLocaleString("en-IN")}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Paper
                sx={{
                    bgcolor: "#1e293b",
                    color: "#f8fafc",
                    border: "1px solid #334155",
                    borderRadius: 3,
                    overflow: "hidden"
                }}
            >
                <Box
                    sx={{
                        p: 3,
                        display: "flex",
                        alignItems: "center",
                        gap: 1
                    }}
                >
                    <EventNoteRoundedIcon sx={{ color: "#60a5fa" }} />
                    <Typography variant="h6" fontWeight={600}>
                        Recent Leave Applications
                    </Typography>
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: "#0f172a" }}>
                                {["Employee", "Leave Type", "Start Date", "End Date", "Days", "Status"].map(
                                    (heading) => (
                                        <TableCell
                                            key={heading}
                                            sx={{
                                                color: "#94a3b8",
                                                fontWeight: 600,
                                                whiteSpace: "nowrap"
                                            }}
                                        >
                                            {heading}
                                        </TableCell>
                                    )
                                )}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {recentLeaves.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        align="center"
                                        sx={{ color: "#94a3b8", py: 5 }}
                                    >
                                        No leave applications yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                recentLeaves.map((leave) => (
                                    <TableRow
                                        key={leave._id}
                                        hover
                                        sx={{
                                            "&:hover": { bgcolor: "#273449" },
                                            "& td": {
                                                color: "#e2e8f0",
                                                borderColor: "#334155"
                                            }
                                        }}
                                    >
                                        <TableCell>
                                            <Typography fontWeight={600}>
                                                {leave.employeeName}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                                                {leave.employeeId}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{leave.leaveType}</TableCell>
                                        <TableCell>
                                            {new Date(leave.startDate).toLocaleDateString("en-IN")}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(leave.endDate).toLocaleDateString("en-IN")}
                                        </TableCell>
                                        <TableCell>{leave.totalDays}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={leave.status}
                                                size="small"
                                                sx={{
                                                    fontWeight: 600,
                                                    bgcolor:
                                                        leave.status === "Approved"
                                                            ? "#064e3b"
                                                            : leave.status === "Rejected"
                                                                ? "#7f1d1d"
                                                                : "#78350f",
                                                    color:
                                                        leave.status === "Approved"
                                                            ? "#6ee7b7"
                                                            : leave.status === "Rejected"
                                                                ? "#fca5a5"
                                                                : "#fcd34d"
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
}
