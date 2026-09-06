import React from 'react'
import styles from './Checkout.module.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from '../Navbar/Navbar'

const Checkout = () => {
    const nav = useNavigate();
    const userId = localStorage.getItem("userId");
    const [cartItems, setcartItems] = useState([]);
    const [address, setaddress] = useState([]);
    const [selectedaddress, setselectedaddress] = useState(null);
    const [loading, setloading] = useState(true);
    const [placeorder, setplaceorder] = useState(false);

    useEffect(() => {
        if (!userId) {
            nav('/login')
            return;
        } else {
            fetchload();
        }
    }, [])

    const fetchload = async () => {
        setloading(true);
        try {
            const [cartres, addressres] = await Promise.all([
                axios.get(`https://iplstore-backend.onrender.com/api/cart/getcartofuser/${userId}`, { withCredentials: true }),
                axios.get(`https://iplstore-backend.onrender.com/api/address/${userId}`, { withCredentials: true })
            ])
            setcartItems(cartres.data);
            setaddress(addressres.data);
            
            const defaultaddress = addressres.data.find(addr => addr.default === true)
            if (defaultaddress) {
                setselectedaddress(defaultaddress.addressId);
            }
        } catch (err) {
            toast.error('Failed to load address and cartItems')
        } finally {
            setloading(false);
        }
    }

    const total = () => {
        return cartItems.reduce((acc, nv) => acc + nv.subtotal, 0)
    }

    const placeorders = async () => {
        if (cartItems.length === 0) {
            toast.error('cannot place order!! Cart is empty');
            return;
        }
        if (!selectedaddress) {
            toast.error('Please select an address to deliver your items');
            return;
        }
        setplaceorder(true);
        try {
            // Match the DTO in Spring Boot exactly: userId and addressID
            const payload = { 
                userId: parseInt(userId, 10), 
                addressID: parseInt(selectedaddress, 10) 
            };

            const res = await axios.post(
                `http://localhost:8080/api/orders/placeorder`,
                payload,
                { withCredentials: true }
            );

            toast.success('order Placed successfully 🎉', { position: "top-right", autoClose: 2000 });
            setTimeout(() => nav('/orders'), 2000)
        } catch (err) {
            // This prints the exact exception message sent back from your Java backend Service layer
            console.error("Full Backend Error context:", err.response);
            const backendMsg = err.response?.data || 'Failed to place an order';
            toast.error(typeof backendMsg === 'string' ? backendMsg : 'Failed to place an order');
        } finally {
            setplaceorder(false)
        }
    }

    return (
        <>
            <div className={styles.Checkoutpage}>
                <ToastContainer />
                <Navbar />
                <div className={styles.pageheader}>
                    <h1 className={styles.pagetitle}>Checkout</h1>
                    <p className={styles.pagesubtitle}>Review your order and select address</p>
                </div>
                {loading ? (
                    <div className={styles.center}>
                        <div className={styles.spinner}></div>
                        <p>Loading....</p>
                    </div>
                ) : (
                    <div className={styles.container}>
                        <div className={styles.checkoutlayout}>
                            <div className={styles.lhs}>
                                <div className={styles.section}>
                                    <h3 className={styles.sectiontitle}>Select Delivery Address</h3>
                                    {address.length === 0 ? (
                                        <div className={styles.noaddress}>
                                            <p>Address not found</p>
                                            <button className={styles.addressbtn} onClick={() => nav('/address')}>Add Address</button>
                                        </div>
                                    ) : (
                                        <div className={styles.addresslist}>
                                            {address.map((addr) => (
                                                <div 
                                                    key={addr.addressId} 
                                                    className={`${styles.addresscard} ${selectedaddress === addr.addressId ? styles.selected : ''}`}
                                                    onClick={() => setselectedaddress(addr.addressId)}
                                                >
                                                    <div className={styles.radiocircle}>
                                                        {selectedaddress === addr.addressId && <div className={styles.radiodot}></div>}
                                                    </div>
                                                    <div className={styles.addrdetails}>
                                                        <p className={styles.addrname}>{addr.fullName}
                                                            {addr.default && <span className={styles.defbadge}>Default</span>}
                                                        </p>
                                                        <p className={styles.addrtext}>{addr.doorNo}, {addr.street}</p>
                                                        <p className={styles.addrtext}>{addr.city}, {addr.state} - {addr.pincode}</p>
                                                        <p className={styles.addrphone}>{addr.phoneNo}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className={styles.section}>
                                    <h3 className={styles.sectiontitle}>Review Your Items</h3>
                                    <div className={styles.itemlist}>
                                        {cartItems.map((items) => (
                                            <div key={items.cartId} className={styles.checkoutitem}>
                                                <img src={`http://localhost:8080${items.imageUrl}`} alt={items.productName}
                                                    className={styles.itemimg} onError={(e) => e.target.style.display = 'none'} />
                                                <div className={styles.iteminfo}>
                                                    <span className={styles.itemteam}>{items.teamName}</span>
                                                    <p className={styles.itemname}>{items.productName}</p>
                                                    <p className={styles.itemmeta}>Size: {items.size} | Qty: {items.quantity}</p>
                                                </div>
                                                <span className={styles.itemtotal}>₹{items.subtotal}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.rhs}>
                                <div className={styles.summary}>
                                    <h3 className={styles.summarytitle}>Order Summary</h3>
                                    <div className={styles.summaryrow}>
                                        <span>Items ({cartItems.length})</span>
                                        <span>₹{total()}</span> {/* ✅ Fixed: Evaluates function value */}
                                    </div>
                                    <div className={styles.summaryrow}>
                                        <span>Delivery</span>
                                        <span className={styles.free}>FREE</span>
                                    </div>
                                    <div className={styles.divider}></div>
                                    <div className={styles.totalrow}>
                                        <span>Total Amount</span>
                                        <span className={styles.totalamt}>₹{total()}</span> {/* ✅ Fixed: Evaluates function value */}
                                    </div>
                                    {selectedaddress && (
                                        <div className={styles.addprev}>
                                            <p className={styles.deliverto}>Delivering To:</p>
                                            {address
                                                .filter(addr => addr.addressId === selectedaddress)
                                                .map(a => (
                                                    <p key={a.addressId} className={styles.addprevtext}>{a.fullName}, {a.city}</p>
                                                ))
                                            }
                                        </div>
                                    )}
                                    <button 
                                        className={styles.placeorder} 
                                        onClick={() => placeorders()}
                                        disabled={placeorder || !selectedaddress}
                                    >
                                        {placeorder ? 'Placing Order...' : 'Place Order'}
                                    </button>
                                    <p className={styles.note}>Pay</p>
                                    <button onClick={() => nav('/cart')} className={styles.backbtn}>Back to Cart</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default Checkout
