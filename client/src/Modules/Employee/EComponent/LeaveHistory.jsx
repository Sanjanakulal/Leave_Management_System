
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Box,
    Paper,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Alert,
    CircularProgress
} from "@mui/material";
import { ArrowLeft, RefreshCw, History } from "lucide-react";

export default function LeaveHistory() {
    const navigate = useNavigate();

    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchHistory = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("EmployeeToken");

            if (!token) {
                navigate("/Login", { replace: true });
                return;
            }

            const response = await axios.get(
                "http://localhost:5000/leave/my-leaves",
                {
                    headers: { "auth-token": token }
                }
            );

            setLeaves(response.data.leaves || []);
        } catch (err) {
            console.error("Leave history error:", err);
            setError(
                err.response?.data?.message ||
                "Unable to load leave history."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const getStatusColor = (status) => {
        if (status === "Approved") return "success";
        if (status === "Rejected") return "error";
        return "warning";
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "#020617",
                color: "#fff",
                p: { xs: 2, md: 4 }
            }}
        >
            <Box sx={{ maxWidth: 1200, mx: "auto" }}>
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
                        <Typography
                            variant="h4"
                            sx={{ color: "#fff", fontWeight: 700, mb: 1 }}
                        >
                            <History
                                size={28}
                                style={{
                                    verticalAlign: "middle",
                                    marginRight: 10
                                }}
                            />
                            Leave History
                        </Typography>

                        <Typography sx={{ color: "#94a3b8" }}>
                            View the status of all your leave applications.
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                            variant="outlined"
                            startIcon={<RefreshCw size={17} />}
                            onClick={fetchHistory}
                            disabled={loading}
                            sx={{
                                color: "#fff",
                                borderColor: "#334155",
                                textTransform: "none"
                            }}
                        >
                            Refresh
                        </Button>

                        <Button
                            variant="outlined"
                            startIcon={<ArrowLeft size={17} />}
                            onClick={() => navigate("/EmployeeDashboard")}
                            sx={{
                                color: "#fff",
                                borderColor: "#334155",
                                textTransform: "none"
                            }}
                        >
                            Dashboard
                        </Button>
                    </Box>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <Paper
                    elevation={0}
                    sx={{
                        bgcolor: "#0f172a",
                        border: "1px solid #1e293b",
                        borderRadius: 3,
                        overflow: "hidden"
                    }}
                >
                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <TableContainer sx={{ overflowX: "auto" }}>
                            <Table sx={{ minWidth: 850 }}>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: "#111c30" }}>
                                        {[
                                            "Leave Type",
                                            "Start Date",
                                            "End Date",
                                            "Days",
                                            "Reason",
                                            "Status",
            
                                        ].map((heading) => (
                                            <TableCell
                                                key={heading}
                                                sx={{
                                                    color: "#cbd5e1",
                                                    fontWeight: 700,
                                                    whiteSpace: "nowrap",
                                                    borderColor: "#1e293b"
                                                }}
                                            >
                                                {heading}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {leaves.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                align="center"
                                                sx={{
                                                    color: "#94a3b8",
                                                    py: 6,
                                                    borderColor: "#1e293b"
                                                }}
                                            >
                                                You haven't submitted any leave requests yet.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        leaves.map((leave) => (
                                            <TableRow
                                                key={leave._id}
                                                sx={{
                                                    "&:hover": {
                                                        bgcolor: "#172338"
                                                    },
                                                    "& td": {
                                                        color: "#e2e8f0",
                                                        borderColor: "#1e293b"
                                                    }
                                                }}
                                            >
                                                <TableCell>{leave.leaveType}</TableCell>

                                                <TableCell>
                                                    {new Date(
                                                        leave.startDate
                                                    ).toLocaleDateString("en-IN")}
                                                </TableCell>

                                                <TableCell>
                                                    {new Date(
                                                        leave.endDate
                                                    ).toLocaleDateString("en-IN")}
                                                </TableCell>

                                                <TableCell>{leave.totalDays}</TableCell>

                                                <TableCell sx={{ minWidth: 150 }}>
                                                    {leave.reason}
                                                </TableCell>

                                                <TableCell>
                                                    <Chip
                                                        label={leave.status}
                                                        color={getStatusColor(leave.status)}
                                                        size="small"
                                                    />
                                                </TableCell>

                            
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>
            </Box>
        </Box>
    );
}
