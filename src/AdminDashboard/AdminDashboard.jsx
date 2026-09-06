import React, { useEffect, useState } from 'react'
import styles from './AdminDashboard.module.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
const AdminDashboard = () => {
    const nav = useNavigate();
    const userRole = localStorage.getItem('userRole');
    const [status, setstatus] = useState(null);
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState('');
    const userName = localStorage.getItem('userName');
    const fetchdashboardstatus = async () => {
        setloading(true);
        try {
            const res = await axios.get(`https://iplstore-backend.onrender.com/admin/dashboard`, { withCredentials: true })
            console.log(res.data)
            setstatus(res.data)
        }
        catch (err) {
            seterror('Failed to fetch dashboard details');
        }
        finally {
            setloading(false)
        }
    }
    useEffect(() => {
        if (userRole == "user") {
            nav('/home')
        }
        fetchdashboardstatus()
    }, [])
    return (
        <>
            <div className={styles.adminPage}>
                <Navbar />
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>Admin Dashboard...</h1>
                    <p className={styles.pageSubtitle}>welcome back !! Admin - {userName} </p>
                </div>
                <div className={styles.container}>
                    {loading && (
                        <div className={styles.center}>
                            <div className={styles.spinner}></div>
                            <p>Loading Dashboard.....</p>
                        </div>
                    )}
                    {error && (
                        <div className={styles.error}>
                            {error}
                            <button className={styles.retrybtn}
                                onClick={() => fetchdashboardstatus()}>Retry</button>
                        </div>
                    )}
                    {!loading && !error && status && (
                        <>
                            <h2 className={styles.sectionTitle}>
                                Overview
                            </h2>
                            <div className={styles.statsgrid}>
                                <div className={`${styles.statCard} ${styles.blue}`}>
                                    <div className={styles.statIcon}>👩🧑</div>
                                    <div className={styles.statsInfo}>
                                        <span className={styles.statNum}>
                                            {status.totalUsers}
                                        </span>
                                        <span className={styles.statLabel}>Total Users</span>
                                    </div>
                                </div>
                                <div className={`${styles.statCard} ${styles.green}`}>
                                    <div className={styles.statIcon}>👕</div>
                                    <div className={styles.statsInfo}>
                                        <span className={styles.statNum}>
                                            {status.totalProducts}
                                        </span>
                                        <span className={styles.statLabel}>Total Products</span>
                                    </div>
                                </div>
                                <div className={`${styles.statCard} ${styles.orange}`}>
                                    <div className={styles.statIcon}>👑</div>
                                    <div className={styles.statsInfo}>
                                        <span className={styles.statNum}>
                                            {status.totalOrders}
                                        </span>
                                        <span className={styles.statLabel}>Total Orders</span>
                                    </div>
                                </div>
                                <div className={`${styles.statCard} ${styles.yellow}`}>
                                    <div className={styles.statIcon}>⏱</div>
                                    <div className={styles.statsInfo}>
                                        <span className={styles.statNum}>
                                            {status.pendingOrders}
                                        </span>
                                        <span className={styles.statLabel}>Pending Orders</span>
                                    </div>
                                </div>
                                <div className={`${styles.statCard} ${styles.teal}`}>
                                    <div className={styles.statIcon}>✅</div>
                                    <div className={styles.statsInfo}>
                                        <span className={styles.statNum}>
                                            {status.deliveredOrders}
                                        </span>
                                        <span className={styles.statLabel}>Delivered Orders</span>
                                    </div>
                                </div>
                                <div className={`${styles.statCard} ${styles.purple}`}>
                                    <div className={styles.statIcon}>💰</div>
                                    <div className={styles.statsInfo}>
                                        <span className={styles.statNum}>
                                            {status.totalAmountGained}
                                        </span>
                                        <span className={styles.statLabel}>TotalGainedAmount</span>
                                    </div>
                                </div>
                                <h2 className={styles.sectionTitle}>
                                    Quick Actions
                                </h2>
                                <div className={styles.quickActions}>
                                    <button className={styles.actionBtn} onClick={() => nav('/admin/getallproducts')}>
                                        👕Manage Products🧢
                                    </button>
                                    <button className={styles.actionBtn} onClick={() => nav('/admin/getallorders')}>
                                        👑Manage Orders
                                    </button>
                                    <button className={styles.actionBtn} onClick={() => nav('/admin/getallcategories')}>
                                        🏷Manage Categories
                                    </button>
                                    <button className={styles.actionBtn} onClick={() => nav('/admin/getallusers')}>
                                        👩Manage Users🧑
                                    </button>
                                </div>

                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

export default AdminDashboard
