import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import '../../styles/ListUsers.css';
import { axiosInstance } from '../../lib/axios';
import Navbar from '../Navbar';

const ListUsers = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [error, setError] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Decode JWT and check role
        const token = Cookies.get('access_token');
        if (token) {
            const decodedToken = jwtDecode(token);
            console.log(decodedToken.sub.role);
            setIsAdmin(decodedToken.sub.role === 'admin');
        }
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axiosInstance.get(`/users/list?page=${page}&limit=${limit}`);
                setUsers(response.data.users);
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching users.');
            }
        };
        fetchUsers();
    }, [page, limit]);

    const handleNextPage = () => {
        setPage((prevPage) => prevPage + 1);
    };

    const handlePreviousPage = () => {
        if (page > 1) setPage((prevPage) => prevPage - 1);
    };

    const handleDeleteUser = async (userId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (!confirmDelete) return;

        try {
            await axiosInstance.delete(`/users/delete/${userId}`);
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
            alert('User deleted successfully!');
        } catch (err) {
            setError('Error deleting user.');
        }
    };

    return (
        <div>
            <Navbar />
            <div className="list-users-container">
                <h2>Users List</h2>
                <ul className="user-list">
                    {users.map((user) => (
                        <li key={user.id} className="user-item">
                            <img src={user.image || '/default-avatar.png'} alt={user.username} className="user-avatar" />
                            <div className="user-details">
                                <strong>Username:</strong> {user.username} <br />
                                <strong>Full Name:</strong> {user.full_name} <br />
                                <strong>Role:</strong> {user.role}
                            </div>
                            {isAdmin && (
                                <div className="user-actions">
                                    <a href={`/update-user/${user.id}`}>
                                        <button className="update-btn" >Update</button>
                                    </a>
                                    <button className="delete-btn" onClick={() => handleDeleteUser(user.id)}>Delete</button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
                <div className="pagination">
                    <button onClick={handlePreviousPage} disabled={page === 1}>Previous</button>
                    <span>Page {page}</span>
                    <button onClick={handleNextPage}>Next</button>
                </div>
                {error && <p className="error">{error}</p>}
                {!error && users.length === 0 && <p>No users found.</p>}
            </div>
        </div>
    );
};

export default ListUsers;
