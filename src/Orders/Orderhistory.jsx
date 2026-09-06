import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import styles from './orderhistory.module.css'
import Navbar from '../Navbar/Navbar'
const Orderhistory = () => {
    const nav = useNavigate();
    const userId = localStorage.getItem("userId");
    const [orders, setorders] = useState([]);
    const [loading, setloading] = useState(true);
    const [expandId, setexpandId] = useState(null);
    const fetchorders = async () => {
        setloading(true);
        try {
            const res = await axios.get(`https://iplstore-backend.onrender.com/api/orders/userorders/${userId}`
                , { withCredentials: true }
            )
            setorders(res.data)
            console.log(orders)
        }
        catch (err) {
            toast.error('Failed to fetch orders try again')
        }
        finally {
            setloading(false);
        }
    }
    const cancelorder = async (orderid) => {
        try {
            await axios.put(`https://iplstore-backend.onrender.com/api/orders/cancelorder/${orderid}`, {},
                { withCredentials: true }
            )
            toast.success('Order Cancelled')
            fetchorders();
        }
        catch (err) {
            toast.error('Failed to cancel')
        }
    }
    useEffect(() => {
        if (!userId) {
            nav('/login')
            return
        }
        fetchorders()
    }, [])
    const toggleexpand = (orderid) => {
        setexpandId(prev => prev === orderid ? null : orderid); //hide and close
    }
    const getstatusStyle = (status) => {
        switch (status) {
            case 'PENDING':
                return styles.statusPending;
            case 'CONFIRMED':
                return styles.statusConfirmed;
            case 'SHIPPED':
                return styles.statusShipped;
            case 'DELIVERED':
                return styles.statusDelivered;
            case 'CANCELLED':
                return styles.statusCancelled;
            default:
                return ''
        }
    }
    const getstatusIcon = (status) => {
        switch (status) {
            case 'PENDING':
                return '⏱';
            case 'CONFIRMED':
                return '✅';
            case 'SHIPPED':
                return '🚚';
            case 'DELIVERED':
                return '💥';
            case 'CANCELLED':
                return '❌';
            default:
                return ''
        }
    }
    return (
        <>
            <div className={styles.ordersPage}>
                <ToastContainer />
                <Navbar />
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>My Orders</h1>
                    <p className={styles.pageSubtitle}>{orders.length} order{orders.length != 1 ? 's' : ''} placed</p>
                </div>
                <div className={styles.container}>
                    {loading && (
                        <div className={styles.centerMsg}>
                            <div className={styles.spinner}></div>
                            <p>Loading orders.....</p>
                        </div>
                    )}
                    {!loading && orders.length == 0 && (
                        <div className={styles.emptyOrders}>
                            <h3>No orders yet....!!!</h3>
                            <p>Place your First Order</p>
                            <button className={styles.shopBtn}
                                onCLick={() => nav('/products')}>Shop Now</button>
                        </div>
                    )}
                    {!loading && orders.map((orders) => {
                        return (
                            <>
                                <div key={orders.orderId} className={styles.orderCard}>
                                    <div className={styles.orderHeader} onClick={() => toggleexpand(orders.orderId)}>
                                        <div className={styles.orderInfo}>
                                            <span className={styles.orderId}>Order #{orders.orderId}</span>

                                        </div>
                                        <div className={`${styles.statusBadge} ${getstatusStyle(orders.status)}`}>
                                            {getstatusIcon(orders.status)} {orders.status}
                                        </div>
                                        <div className={styles.orderRight}>
                                            <span className={styles.orderTotal}>
                                                ₹{orders.totalAmount}
                                            </span>
                                            <span className={styles.expandIcon}>
                                                {expandId === orders.orderId ? '🔼' : '🔽'}
                                            </span>
                                        </div>
                                    </div>
                                    {expandId === orders.orderId && (
                                        <div className={styles.orderDetails}>
                                            <div className={styles.detailSection}>
                                                <h4 className={styles.detailTitle}>Delivery Address</h4>
                                                <p className={styles.addrText}>{orders.userName}</p>
                                                <p className={styles.addrText}>{orders.doorNo} , {orders.street}</p>
                                                <p className={styles.addrText}>{orders.city} ,{orders.state} -{orders.pincode}</p>
                                                <p className={styles.addrText}>📞{orders.userPhone}</p>

                                            </div>
                                            <div className={styles.detailSection}>
                                                <h4 className={styles.detailTitle}>Items Ordered</h4>
                                                {orders.orderItemsResponseDtoList.map((orderitems) => {
                                                    return (
                                                        <div key={orderitems.orderitemsId} className={styles.orderItem}>
                                                            <img src={`https://iplstore-backend.onrender.com${orderitems.imageUrl}`}
                                                                alt={styles.productName} className={styles.itemimg}
                                                                onError={(e) => e.target.style.display = 'none'} />
                                                            <div className={styles.itemInfo}>
                                                                <span className={styles.itemTeam}>
                                                                    {orderitems.teamName}
                                                                </span>
                                                                <p className={styles.itemName}>
                                                                    {orderitems.productName}
                                                                </p>
                                                                <p className={styles.itemMeta}>
                                                                    Size: {orderitems.size}
                                                                    Qty: {orderitems.quantity}
                                                                </p>
                                                            </div>
                                                            <span className={styles.itemTotal}>
                                                                ₹{orderitems.subtotal}
                                                            </span>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                            <div className={styles.orderSummary}>
                                                <div className={styles.summaryRow}>
                                                    <span>Total Amount</span>
                                                    <span className={styles.totalAmt}>
                                                        ₹{orders.totalAmount}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={styles.timeline}>
                                                {['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'].map((val, index) => {
                                                    return (
                                                        <>
                                                            <div key={index} className={styles.timelineStep}>
                                                                <div className={`${styles.timelineDot} 
                                                    ${['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED']
                                                                        .indexOf(orders.status) >= index ? styles.dotActive : ''}`}></div>
                                                                <span className={styles.timelinelabel}>{val}</span>
                                                            </div>
                                                        </>
                                                    )
                                                })}
                                            </div>
                                            {orders.status === 'PENDING' && (
                                                <div className={styles.cancelBox}>
                                                    <p className={styles.cancelNote}>
                                                        If you want You can cancel since your order is in PENDING STATE
                                                    </p>
                                                    <button className={styles.cancelBtn}
                                                        onClick={() => cancelorder(orders.orderId)}>Cancel Order</button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </>
                        )
                    })}
                </div>

            </div>
        </>
    )
}

export default Orderhistory
