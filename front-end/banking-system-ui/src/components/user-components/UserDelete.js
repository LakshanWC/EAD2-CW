import React, { useEffect, useState } from "react";
import axios from "axios";

const UserDelete = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:8086/user-service/users/all");
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            axios.delete(`http://localhost:8086/user-service/users/delete/${id}`)
                .then(() => {
                    fetchUsers();
                })
                .catch(error => {
                    console.error("Error deleting user:", error);
                });
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>User Management</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                    <tr>
                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>ID</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Username</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Full Name</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Email</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Role</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{user.id}</td>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{user.username}</td>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{user.fullName}</td>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{user.email}</td>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{user.role}</td>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                <button
                                    style={{ backgroundColor: "#ff4d4f", color: "white", border: "none", padding: "5px 10px", cursor: "pointer" }}
                                    onClick={() => handleDelete(user.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default UserDelete;