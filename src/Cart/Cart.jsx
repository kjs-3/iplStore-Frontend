import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import styles from './Cart.module.css'
import Navbar from '../Navbar/Navbar'
const Cart = () => {
    const nav = useNavigate();
    const userId = localStorage.getItem("userId");
    const [cartItems, setCartitems] = useState([]);
    const [error, seterror] = useState('');
    const [loading, setloading] = useState(true);
    useEffect(() => {
        if (!userId) {
            nav('/login');
            return;
        }
        fetchcart();
    }, [])
    const fetchcart = async () => {
        setloading(true);
        try {
            const res = await axios.get(`http://localhost:8080/api/cart/getcartofuser/${userId}`, { withCredentials: true });
            // console.log(res)
            setCartitems(res.data);
            console.log(cartItems);

        }
        catch (err) {
            seterror('Failed to load cart items')
        }
        finally {
            setloading(false);
        }
    }
    const increasequantity = async (cartId, currentquantity) => {
        try {
            const res = await axios.put(`http://localhost:8080/api/cart/updatequantity/${cartId}?quantity=${currentquantity + 1}`,
                {}, { withCredentials: true });
            setCartitems(prev => prev.map((items) => {
                return items.cartId == cartId ? res.data : items;
            }))
        }
        catch (err) {
            toast.error('Failed to Increase the Quantity');
        }
        finally {
            setloading(false);
        }
    }
    const decreaseqty = async (cartId, currentqty) => {
        if (currentqty == 1) {
            removecart(cartId);
        }
        try {
            const res = await axios.put(`http://localhost:8080/api/cart/updatequantity/${cartId}?quantity=${currentqty - 1}`, {}
                , { withCredentials: true }
            )
            setCartitems(prev => prev.map((items) => {
                return items.cartId == cartId ? res.data : items;
            }))
        }
        catch (err) {
            toast.error('Failed to decrease');
        }
        finally {
            setloading(false);
        }
    }
    const removecart = async (cartId) => {
        try {
            await axios.delete(`http://localhost:8080/api/cart/deletecart/${cartId}`, { withCredentials: true })
            setCartitems(prev => prev.filter((items) => {
                return items.cartId != cartId
            })
            )
            toast.success('deleted Successfully', { position: "top-right", autoClose: 1500 })
        }
        catch (error) {
            toast.error('Failed to delete')
        }
        finally {
            setloading(false);
        }
    }
    const total = () => 
        cartItems.reduce((acc,nv)=>{
        return (acc+(nv.subtotal || 0))
        },0).toFixed(2)
    

    return (
        <>
            <div className={styles.cartpage}>
                <ToastContainer />
                <Navbar />
                <div className={styles.pageheader}>
                    <h1 className={styles.pagetitle}>My Cart🛒</h1>
                    <p className={styles.pagesubtitle}>
                        {cartItems.length} item{cartItems.length != 1 ? 's' : ''} in cart</p>
                </div>
                <div className={styles.container}>
                    {loading && (
                        <div className={styles.center}>
                            <div className={styles.spinner}></div>
                            <p>Loading Cart..</p>
                        </div>
                    )}
                    {error && (
                        <div className={styles.error}>{error}</div>
                    )}
                    {!loading && cartItems.length === 0 && (
                        <div className={styles.emptycart}>
                            <span className={styles.emptyicon}>🛒</span>
                            <h2>Your Cart is Empty!!!</h2>
                            <p>Add some jerseys and caps to get started of your purchasing items</p>
                            <button className={styles.shopbtn} onClick={() => nav('/products')}>Shop Now</button>
                        </div>
                    )}
                    {!loading && cartItems.length != 0 && (
                        <div className={styles.cartlayout}>
                            <div className={styles.cartitems}>
                                {cartItems.map((items) => {
                                    return (
                                        <div key={items.cartId} className={styles.cartitem}>
                                            <div className={styles.itemimg}>
                                                <img src={`http://localhost:8080${items.imageUrl}`}
                                                    alt={items.productName}
                                                    onError={(e) => { e.target.style.display = 'none' }} />
                                            </div>
                                            <div className={styles.itemdetails}>
                                                <span className={styles.itemteam}>{items.teamName}</span>
                                                <h4 className={styles.itemname}>{items.productName}</h4>
                                                <p className={styles.itemmeta}>{items.categoryName} | Size:{items.size}</p>
                                                <p className={styles.itemprice}>₹{items.price} per item</p>
                                            </div>
                                            <div className={styles.qtyctrl}>
                                                <button className={styles.qtybtn} onClick={() => decreaseqty(items.cartId, items.quantity)}>
                                                    -
                                                </button>
                                                <span className={styles.qtynum}>{items.quantity}</span>
                                                <button className={styles.qtybtn} onClick={() => increasequantity(items.cartId, items.quantity)}>
                                                    +
                                                </button>
                                            </div>
                                            <div className={styles.itemsubtotal}>
                                                <span>₹{items.subtotal}</span>
                                            </div>
                                            <button className={styles.removebtn} onClick={() => removecart(items.cartId)}>❌</button>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className={styles.summary}>
                                <h3 className={styles.summarytitle}>Order Summary</h3>
                                {cartItems.map((items) => {
                                    return (
                                        <div key={items.cartId} className={styles.summaryrow}>
                                            <span>{items.teamName} {items.categoryName} * {items.quantity}</span>
                                            <span>₹{items.subtotal}</span>
                                        </div>
                                    )
                                })}
                                <div className={styles.summarydivider}></div>
                                <div className={styles.totalrow}>
                                    <span>Total Amount</span>
                                    <span className={styles.totalamt}>
                                        ₹{total()}
                                    </span>
                                </div>
                                <p className={styles.note}> Free Delivery on all Orders</p>
                                <button className={styles.checkoutbtn} onClick={() => nav('/checkout')}>Proceed to checkout</button>
                                <button className={styles.continuebtn} onClick={() => nav('/products')}>Continue Shopping</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Cart