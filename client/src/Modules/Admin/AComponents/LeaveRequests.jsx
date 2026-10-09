
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button,
    CircularProgress,
    Alert,
    Stack
} from "@mui/material";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function LeaveRequests() {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [processingId, setProcessingId] = useState(null);

    const fetchLeaves = async () => {
        try {
            setError("");

            const token = localStorage.getItem("UserToken");

            const response = await axios.get(
                // "http://localhost:5000/leave/all",
                `${API_URL}/leave/all`,
                {
                    headers: { "auth-token": token }
                }
            );

            setLeaves(response.data.leaves || []);
        } catch (err) {
            console.error("Fetch leave requests error:", err);
            setError(
                err.response?.data?.message ||
                "Unable to load leave requests."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const updateLeaveStatus = async (leaveId, status) => {
        try {
            setProcessingId(leaveId);
            setError("");
            setMessage("");

            const token = localStorage.getItem("UserToken");

            const response = await axios.patch(
                // `http://localhost:5000/leave/${leaveId}/status`,
                `${API_URL}/leave/${leaveId}/status`,
                { status },
                {
                    headers: { "auth-token": token }
                }
            );

            setMessage(
                response.data.message ||
                `Leave ${status.toLowerCase()} successfully.`
            );

            await fetchLeaves();
        } catch (err) {
            console.error("Update leave status error:", err);
            setError(
                err.response?.data?.message ||
                "Unable to update leave status. Please try again."
            );
        } finally {
            setProcessingId(null);
        }
    };

    const statusColor = (status) => {
        if (status === "Approved") return "success";
        if (status === "Rejected") return "error";
        return "warning";
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, color: "#f8fafc" }}>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                Leave Requests
            </Typography>

            <Typography sx={{ color: "#94a3b8", mb: 3 }}>
                Review and manage employee leave applications.
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {message && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {message}
                </Alert>
            )}

            <TableContainer
                component={Paper}
                sx={{
                    bgcolor: "#1e293b",
                    color: "#f8fafc",
                    border: "1px solid #334155",
                    borderRadius: 3,
                    overflowX: "auto"
                }}
            >
                <Table sx={{ minWidth: 1050 }}>
                    <TableHead>
                        <TableRow sx={{ bgcolor: "#0f172a" }}>
                            {[
                                "Employee",
                                "Leave Type",
                                "Start Date",
                                "End Date",
                                "Days",
                                "Reason",
                                "Status",
                                "Actions"
                            ].map((heading) => (
                                <TableCell
                                    key={heading}
                                    sx={{
                                        color: "#cbd5e1",
                                        fontWeight: 700,
                                        whiteSpace: "nowrap"
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
                                    colSpan={8}
                                    align="center"
                                    sx={{ color: "#cbd5e1", py: 5 }}
                                >
                                    No leave requests found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            leaves.map((leave) => (
                                <TableRow
                                    key={leave._id}
                                    sx={{
                                        "&:hover": {
                                            bgcolor: "#273449"
                                        },
                                        "& td": {
                                            color: "#e2e8f0",
                                            borderColor: "#334155",
                                            verticalAlign: "top"
                                        }
                                    }}
                                >
                                    <TableCell>
                                        <Typography fontWeight={600}>
                                            {leave.employeeName}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{ color: "#94a3b8" }}
                                        >
                                            {leave.employeeId}
                                        </Typography>
                                    </TableCell>

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

                                    <TableCell sx={{ minWidth: 160, maxWidth: 240 }}>
                                        {leave.reason}
                                    </TableCell>

                                    <TableCell>
                                        <Chip
                                            label={leave.status}
                                            color={statusColor(leave.status)}
                                            size="small"
                                        />
                                    </TableCell>

                                    <TableCell sx={{ minWidth: 110 }}>
                                        {leave.status === "Pending" ? (
                                            <Stack spacing={1}>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    color="success"
                                                    disabled={processingId !== null}
                                                    onClick={() =>
                                                        updateLeaveStatus(
                                                            leave._id,
                                                            "Approved"
                                                        )
                                                    }
                                                >
                                                    {processingId === leave._id
                                                        ? "Processing..."
                                                        : "Approve"}
                                                </Button>

                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    color="error"
                                                    disabled={processingId !== null}
                                                    onClick={() =>
                                                        updateLeaveStatus(
                                                            leave._id,
                                                            "Rejected"
                                                        )
                                                    }
                                                >
                                                    Reject
                                                </Button>
                                            </Stack>
                                        ) : (
                                            <Typography
                                                variant="body2"
                                                sx={{ color: "#94a3b8" }}
                                            >
                                                Completed
                                            </Typography>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
