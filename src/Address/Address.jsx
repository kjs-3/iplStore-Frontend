import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import styles from './Address.module.css'
import Navbar from '../Navbar/Navbar';
const Address = () => {
    const nav = useNavigate();
    const [address, setaddress] = useState([]);
    const [loading, setloading] = useState(true);
    const [showform, setshowform] = useState(false);
    const [save, setsave] = useState(false);
    const userId = localStorage.getItem('userId');
    const [form, setform] = useState({
        userName: '',
        phoneNo: '',
        doorNo: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false
    });
    useEffect(() => {
        if (!userId) {
            nav('/login')
            return;
        }
        else {
            fetchAddress()
        }
    }, [])
    //fetching all user address /api/address/{userId}
    const fetchAddress = async () => {
        setloading(true);
        try {
            const res = await axios.get(`http://localhost:8080/api/address/${userId}`, { withCredentials: true })
            setaddress(res.data);
            // incase there is no address given by user show the form
            if (res.data.length === 0) {
                setshowform(true)
            }
        }
        catch (err) {
            toast.error('Failed to fetch address try again');
        }
        finally {
            setloading(false)
        }
    }
    //user types form the value need to be chnage for all input same func name so use [] to find key
    const handleChange = (e) => {
        e.preventDefault();
        const { name, value, checked, type } = e.target; //i/p filed target these are fileds we have
        setform(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
        //if the type is checkbox then checked t/f iflese value what we write

    }
    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.userName || !form.phoneNo || !form.doorNo || !form.street || !form.city || !form.state || !form.pincode) {
            toast.error('All Fields are required');
            return;
        }
        // if(form.phoneNo!=10){
        //     toast.error('Phone number must be 10 digits')
        //     return;
        // }
        // if(form.pincode!=6){
        //     toast.error('Pincode must be 6 digis')
        //     return
        // }
        setsave(true); //gng to save an address so true
        try {
            await axios.post(`http://localhost:8080/api/address/addaddress`, { ...form, userId: parseInt(userId) }, { withCredentials: true })
            toast.success('Address saved successfully')
            setform({
                userName: '',
                phoneNo: '',
                doorNo: '',
                city: '',
                state: '',
                pincode: '',
                street: '',
                isDefault: false
            })
            setshowform(false)
            fetchAddress(); //to see what address you have added additionally
        }
        catch (err) {
            toast.error('Failed to add address')
        }
        finally {
            setloading(false);
        }
    }
    // to set default address
    const setdefault = async (addressId) => {
        try {
            await axios.put(`http://localhost:8080/api/address/update/${addressId}/${userId}`, {}, { withCredentials: true })
            toast.success('Default address been added');
            setsave(false);
            fetchAddress();
        }
        catch (err) {
            toast.error('Failed to set Default Address')
        }
    }
    const deleteaddr = async (addressId) => {
        try {
            await axios.delete(`http://localhost:8080/api/address/delete/${addressId}`, { withCredentials: true })
            toast.success('Deleted Address')
            fetchAddress();
        }
        catch (err) {
            toast.error('Failed to delete')
        }
    }

    return (
        <>
            <div className={styles.addressPage}>
                <ToastContainer />
                <Navbar />
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>MY Address</h1>
                    <p className={styles.pageSubtitle}>Manage your delivery address</p>
                </div>
                <div className={styles.container}>
                    {loading ? (
                        <div className={styles.centerMsg}>
                            <div className={styles.spinner}></div>
                            <p>Loading....</p>
                        </div>
                    ) : (
                        <>
                            {address.length > 0 && (
                                <div className={styles.addressGrid}>
                                    {address.map((address) => {
                                        return (
                                            <>
                                                <div key={address.addressId} className={`${styles.addrCard} ${address.default ?
                                                    styles.defaultCard : ''
                                                    }`}>
                                                    {address.default && (
                                                        <span className={styles.defaultBadge}>✨Default</span>
                                                    )}
                                                    <h4 className={styles.addrName}>{address.userName}</h4>
                                                    <p className={styles.addrLine}>{address.doorNo} , {address.street}</p>
                                                    <p className={styles.addrLine}>{address.city} , {address.state} </p>
                                                    <p className={styles.addrLine}>Pincode: {address.pincode}</p>
                                                    <p className={styles.addrPhone}>📞 {address.phoneNo}</p>
                                                    <div className={styles.addrActions}>
                                                        {!address.Default && (
                                                            <button className={styles.defaultBtn}
                                                                onClick={() => setdefault(address.addressId)}>Set Default</button>
                                                        )}
                                                        <button className={styles.deleteBtn}
                                                            onClick={() => deleteaddr(address.addressId)}>Delete</button>
                                                    </div>
                                                </div>
                                            </>
                                        )
                                    })}
                                    <div className={styles.addCard} onClick={() => setshowform(true)}>
                                        <span className={styles.addIcon}>+</span>
                                        <p>Add New Address</p>
                                    </div>
                                </div>
                            )}
                            {showform && (
                                <div className={styles.formCard}>
                                    <h3 className={styles.formTitle}>Add New Address</h3>
                                    <form onSubmit={handleSave}>
                                        <div className={styles.formGrid}>
                                            <div className={styles.formGroup}>
                                                <label className={styles.label}>
                                                    FullName:
                                                </label>
                                                <input type="text" name="userName" className={styles.input}
                                                    placeholder='Enter full Name' value={form.userName} onChange={handleChange} />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label className={styles.label}>
                                                    PhoneNo:
                                                </label>
                                                <input type="tel" name="phoneNo" className={styles.input}
                                                    placeholder='Enter PhoneNo' value={form.phoneNo} onChange={handleChange} />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label className={styles.label}>
                                                    DoorNo/FlatNo:
                                                </label>
                                                <input type="text" name="doorNo" className={styles.input}
                                                    placeholder='eg:300/A' value={form.doorNo} onChange={handleChange} />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label className={styles.label}>
                                                    Street/Area:
                                                </label>
                                                <input type="text" name="street" className={styles.input}
                                                    placeholder='Enter Street' value={form.street} onChange={handleChange} />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label className={styles.label}>
                                                    City:
                                                </label>
                                                <input type="text" name="city" className={styles.input}
                                                    placeholder='Enter City' value={form.city} onChange={handleChange} />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label className={styles.label}>
                                                    State:
                                                </label>
                                                <input type="text" name="state" className={styles.input}
                                                    placeholder='Enter State' value={form.state} onChange={handleChange} />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label className={styles.label}>
                                                    Pincode:
                                                </label>
                                                <input type="text" name="pincode" className={styles.input}
                                                    placeholder='Enter Pincode' value={form.pincode} onChange={handleChange} />
                                            </div>
                                            <div className={styles.checkboxGroup}>
                                                <input type="checkbox" className={styles.checkbox}
                                                    name="isDefault" id="isDefault" checked={form.isDefault}
                                                    onChange={handleChange} />
                                                <label htmlFor='isDefault' className={styles.checkboxLabel}>Set as Default Address</label>
                                            </div>
                                        </div>
                                        <div className={styles.formBtns}>
                                            <button type="submit" className={styles.saveBtn} disabled={save}>
                                                {save ? 'saving....' : 'Save Address'}
                                            </button>
                                            {address.length > 0 && (
                                                <button type='button' className={styles.cancelBtn}
                                                    onClick={() => setshowform(false)}>Cancel

                                                </button>
                                            )}
                                        </div>
                                    </form>
                                </div>
                            )}
                            {address.length > 0 && !showform && (
                                <div className={styles.bottomBar}>
                                    <button className={styles.checkoutBtn}
                                        onClick={() => nav('/checkout')}>Proceed to checkout</button>
                                </div>
                            )}
                        </>

                    )}
                </div>
            </div>
        </>
    )
}

export default Address