import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import styles from './AdminOrders.module.css'
const AdminOrders = () => {
    const nav = useNavigate();
    const userRole = localStorage.getItem('userRole');
    const [orders, setorders] = useState([]);
    const [loading, setloading] = useState(true);
    const fetchorders = async () => {
        setloading(true);
        try {
            const res = await axios.get(`https://iplstore-backend.onrender.com/api/admin/admin/getallorders`, { withCredentials: true })
            setorders(res.data)
            console.log(res.data)
        }
        catch (err) {
            toast.error('Failed to fetch Orders')
            console.log(err)
        }
        finally {
            setloading(false)
        }
    }
    const updateStatus = async (orderId, status) => {
        try {
            await axios.put(`https://iplstore-backend.onrender.com/api/orders/admin/updateorderstatus/${orderId}`,
                { status },
                { withCredentials: true }
            )
            toast.success('Updated Ordered Successfully');
            fetchorders();
        }
        catch (err) {
            toast.error('Failed to Update Product')
        }
    }
    useEffect(() => {
        if (userRole != 'admin') {
            nav('/home')
            return
        }
        fetchorders();
    }, [])
    //nthg but shwing colors
    const getStatusClass = () => {
        switch (status) {
            case 'PENDING':
                return styles.pending;
            case 'CONFIRMED':
                return styles.confirmed;
            case 'SHIPPED':
                return styles.shipped;
            case 'DELIVERED':
                return styles.delivered;
            case 'CANCELLED':
                return styles.cancelled;
            default:
                return ''
        }
    }
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
                                <th>Id</th>
                                <th>Customer</th>
                                <th>City</th>
                                <th>ItemsOrdered</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>UpdateStatus</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((orders) => {
                                return (
                                    <>
                                        <tr key={orders.orderId}>
                                            <td>#{orders.orderId}</td>
                                            <td>{orders.userName}</td>
                                            <td>{orders.city}</td>
                                            <td>{orders.orderItemsResponseDtoList.length} items</td>
                                            <td>₹{orders.totalAmount}</td>
                                            <td>
                                                <span className={`${styles.statusBadge} ${getStatusClass(orders.status)}`}>
                                                    {orders.status}
                                                </span>
                                            </td>
                                            <td>
                                                {/* if it is pending make n it to go next stage confirmed -->shipped-->deliverrd-->done */}
                                                {orders.status == 'PENDING' && (
                                                    <button className={styles.confirmBtn}
                                                        onClick={() => updateStatus(orders.orderId, 'CONFIRMED')}>Confirm</button>
                                                )}
                                                {orders.status == 'CONFIRMED' && (
                                                    <button className={styles.shipBtn}
                                                        onClick={() => updateStatus(orders.orderId, 'SHIPPED')}>Shipped</button>
                                                )}
                                                {orders.status == 'SHIPPED' && (
                                                    <button className={styles.deliverBtn}
                                                        onClick={() => updateStatus(orders.orderId, 'DELIVERED')}>DELIVERED</button>
                                                )}
                                                {orders.status == 'DELIVERED' || orders.status == 'CANCELLED' && (
                                                    <span className={styles.doneText}>Done</span>
                                                )}
                                            </td>
                                        </tr>
                                    </>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    )
}

export default AdminOrders
