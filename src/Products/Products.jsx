import React, { useEffect, useState } from 'react'
import styles from './Products.module.css'
import axios from 'axios';
import Navbar from '../Navbar/Navbar'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Products = () => {
    const nav = useNavigate();
    const [products, setproducts] = useState([]);
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState('');
    const iplteams = ["All", "CSK", "MI", "RCB", "RR", "SRH", "LSG", "PBKS", "DC", "KKR", "GT"];
    const [searchparams, setSearchparams] = useSearchParams();
    const [selectedcategory, setSelectedcategory] = useState(searchparams.get('categoryId') || 'All');
    console.log(selectedcategory) //1
    const [selectedteam, setSelectedteam] = useState(searchparams.get('teamName') || 'All');
    console.log(selectedteam) //all
    const [addingId, setaddingId] = useState(null);
    const handlecategory = (value) => {
        setSelectedcategory(value);
        if (value != "ALL") {
            setSearchparams(prev => {
                prev.set('categoryId', value);
                return prev;
            })
        }
        else {
            setSearchparams(prev => {
                prev.delete('categoryId');
                return prev;
            })
        }
    }
    const handleteam = (value) => {
        setSelectedteam(value);
        if (value != "All") {
            setSearchparams(prev => {
                prev.set('teamName', value);
                return prev;
            })
        }
        else {
            setSearchparams(prev => {
                prev.delete('teamName');
                return prev;
            })
        }
    }
    const fetchallproducts = async () => {
        setloading(true);
        seterror('');
        try {
            let url = "http://localhost:8080/api/products/getallproducts"; //backend base url if its all then this url will worl
            const hasCategory = selectedcategory != "All";
            const hasTeam = selectedteam != "All";
            if (hasCategory && hasTeam) { //used requestparam
                url = `http://localhost:8080/api/products/filter?categoryId=${selectedcategory}&teamname=${selectedteam}`;
            }
            else if (hasCategory) {
                url = `http://localhost:8080/api/products/getbycategory?categoryId=${selectedcategory}`;
            }
            else if (hasTeam) {
                url = `http://localhost:8080/api/products/getbyteam?teamname=${selectedteam}`; //usedpathvariable
            }
            const res = await axios.get(url, { withCredentials: true })
            setproducts(res.data);
            console.log(res.data.imageUrl);
        }
        catch (err) {
            seterror('Failed Loading Products check Connectivity');
        }
        finally {
            setloading(false);
        }
    }
    useEffect(() => {
        fetchallproducts();
    }, [selectedcategory, selectedteam]);
    const gettitle = () => {
        if (selectedcategory != "All" && selectedteam != "All") {
            return `${selectedteam} ${selectedcategory == "1" ? "Jerseys" : "Caps"}`
        }
        else if (selectedteam != "All") {
            return `${selectedteam} Products`
        }
        else if (selectedcategory == 1) {
            return 'IPL Jerseys';
        }
        else if (selectedcategory == 2) {
            return 'IPL Caps'
        }
        return 'All Products'
    }
    const addtocart = async (products) => {
        const uId = localStorage.getItem("userId");
        if (!uId) {
            toast.error('Please Login First', { position: 'top-right', autoClose: 2000 });
            nav('/login')
            return;
        }

        setaddingId(products.productId);
        try {
            const logindata = { userId: Number(uId), productId: products.productId, quantity: 1 };
            await axios.post('http://localhost:8080/api/cart/addtocart',
                logindata
                , { withCredentials: true }
            );
            toast.success(`${products.teamName} ${products.categoryName} added to 🛒`, {
                position: 'top-right', autoClose: 2400, style: { background: '#003366', color: 'white', fontWeight: '600' }
            })
        }
        catch (err) {
            const msg = err.respone?.data || "Failed to add in cart";
            toast.error(msg, { position: "top-right", autoClose: 2500 })

        }
        finally {
            setaddingId(null);
        }
    }


    return (
        <>
            <div className={styles.productpage}>
                <ToastContainer />
                <Navbar />
                <div className={styles.pageheader}>
                    <h1 className={styles.pagetitle}>{() => gettitle()}</h1>
                    <p className={styles.pagesubtitle}>{products.length} &nbsp;products available</p>

                </div>
                <div className={styles.filterbar}>
                    <div className={styles.filtergrp}>
                        <span className={styles.filterlabel}>Category:</span>
                        <button className={`${styles.filterbtn} ${selectedcategory == "All" ? styles.active : ''}`}
                            onClick={() => handlecategory("All")}>All</button>
                        <button className={`${styles.filterbtn} ${selectedcategory == "1" ? styles.active : ''}`}
                            onClick={() => handlecategory("1")}>👕 Jerseys</button>
                        <button className={`${styles.filterbtn} ${selectedcategory == "2" ? styles.active : ''}`}
                            onClick={() => handlecategory("2")}>🧢 Caps</button>
                    </div>
                    <div className={styles.divider}>
                        <div className={styles.filtergrp}>
                            <span className={styles.filterlabel}>Teams:</span>
                            <div className={styles.teambtns}>
                                {iplteams.map((team) => {
                                    return (
                                        <>
                                            <button key={team} className={`${styles.filterbtn} 
                                        ${selectedteam === team ? styles.active : ''}`}
                                                onClick={() => handleteam(team)}>{team}</button>
                                        </>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.container}>
                    {loading && (
                        <div className={styles.center}>
                            <div className={styles.spinner}></div>
                            <p>Loading Products......</p>
                        </div>
                    )}
                    {error && (
                        <div className={styles.error}>{error}</div>
                    )}
                    {!loading && !error && products.length == 0 && (
                        <div className={styles.center}>
                            <span style={{ fontSize: "48px" }}>😕</span>
                            <p>No Products found </p>
                            <button className={styles.clearbtn} onClick={() => {
                                setSelectedcategory('All');
                                setSelectedteam('All');
                                setSearchparams({});
                            }}>Show All Products</button>
                        </div>
                    )}
                    {!loading && !error && (
                        <div className={styles.productgrid}>
                            {products.map((product) => {
                                return (
                                    <>
                                        <div key={product.productId} className={styles.productcard}>
                                            <div className={styles.imgbox} onClick={() => nav(`/ products / ${product.productId} `)}>
                                                <img src={`http://localhost:8080${product.imageUrl}`} alt={product.name}
                                                    className={styles.productimg} onError={(e) => e.target.style.display = 'none'} />
                                                < span className={styles.catelabel} >
                                                    {product.categoryName}
                                                </span >
                                            </div >
                                            <div className={styles.cardbody}>
                                                <span className={styles.teamtag}>{product.teamName}</span>
                                                <h5 className={styles.productname} onClick={() => nav(`/products/${product.productId}`)}>
                                                    {product.name}
                                                </h5>
                                                <p className={styles.size}>Size: {product.size}</p>
                                                <div className={styles.cardfooter}>
                                                    <span className={styles.price}>₹ {product.price}</span>
                                                    {product.stockQuantity === 0 ? <span className={styles.outstock}>Out Of Stock</span> :
                                                        <button className={styles.cartbtn} disabled={addingId == product.productId} onClick={() => addtocart(product)}>
                                                            {addingId == product.productId ? "Adding...." : "🛒 Add"}
                                                        </button>}
                                                </div>
                                            </div>
                                        </div >
                                    </>
                                )
                            })}
                        </div >
                    )}
                </div >
            </div >
        </>
    )
}

export default Products