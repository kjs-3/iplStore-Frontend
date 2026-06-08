import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import styles from './AdminUsers.module.css'
const AdminUsers = () => {
    const nav = useNavigate();
    const userRole = localStorage.getItem('userRole');
    const [users, setusers] = useState([]);
    const [loading, setloading] = useState(true);
    const fetchusers = async () => {
        setloading(true);
        try {
            const res = await axios.get(`http://localhost:8080/admin/users`, { withCredentials: true })
            setusers(res.data)
            // console.log(res.data);
        }
        catch (err) {
            toast.error('Failed to fetch Users');
            console.log(err);
        }
        finally {
            setloading(false)
        }
    }
    useEffect(() => {
        if (userRole != 'admin') {
            nav('/home')
            return
        }
        fetchusers()
    }, [])
    return (
        <>
            {loading ? (
                <div className={styles.centerMsg}>
                    <div className={styles.spinner}></div>
                    <p>Loading Users....</p>
                </div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colspan="5" className={styles.noData}>No Users Found!!</td>
                                </tr>
                            ) : (
                                users.map((users) => {
                                    return (
                                        <>
                                            <tr key={users.userId}>
                                                <td >#{users.userId}</td>
                                                <td >{users.userName}</td>
                                                <td>{users.userEmail}</td>
                                                <td>{users.userPhonenumber}</td>
                                                <td>
                                                    <span className=
                                                    {userRole.role == "admin" ? styles.adminrole : styles.userrole}>
                                                        {users.role}
                                                    </span>
                                                </td>


                                            </tr>
                                        </>
                                    )
                                })
                            )}
                        </tbody>

                    </table>
                </div>
            )}
        </>
    )
}

export default AdminUsers