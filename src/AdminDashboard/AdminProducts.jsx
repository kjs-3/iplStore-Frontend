import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';
import styles from './AdminProducts.module.css'
import Navbar from '../Navbar/Navbar'
const AdminProducts = () => {
    const nav = useNavigate();
    const userRole = localStorage.getItem('userRole');
    const [products, setproducts] = useState([]);
    const [loading, setloading] = useState(true);
    const [save, setsave] = useState(false);
    const [showform, setshowform] = useState(false);
    const [editId, seteditId] = useState(null);
    const emptyForm = {
        name: '',
        price: '',
        stockQuantity: '',
        categoryId: '',
        teamName: '',
        imageUrl: '',
        size: '',
        description: ''
    }
    const [form, setform] = useState(emptyForm);
    useEffect(() => {
        if (userRole != 'admin') {
            nav('/home')
            return;
        }
        fetchproducts();
    }, [])
    const fetchproducts = async () => {
        setloading(true)
        try {
            const res = await axios.get(`https://iplstore-backend.onrender.com/api/admin/products/getallproducts`, { withCredentials: true })
            setproducts(res.data)
            console.log(res.data)
        }
        catch (err) {
            toast.error('Failed to fetch Products')
        }
        finally {
            setloading(false);
        }
    }
    const handleEdit = (products) => {
        setform({
            name: products.name || '',
            description: products.description || '',
            price: products.price || '',
            stockQuantity: products.stockQuantity || '',
            categoryId: products.categoryId || '',
            teamName: products.teamName || '',
            imageUrl: products.imageUrl || '',
            size: products.size || ''
        })
        seteditId(products.productId);
        setshowform(true);
    }
    //add use
    const openForm = () => {
        setshowform(true);
        setform(emptyForm);
        seteditId(null);
    }
    const closeForm = () => {
        seteditId(null),
            setform(emptyForm),
            setshowform(false)
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.description || !form.price || !form.categoryId || !form.imageUrl || !form.size || !form.stockQuantity || !form.teamName) {
            toast.error('Please fill all fields');
            return;
        }
        setsave(true)
        try {
            const details = {
                ...form, price: parseFloat(form.price),
                stockQuantity: parseInt(form.stockQuantity),
                categoryId: parseInt(form.categoryId)
            }
            if (editId) {
                //update product
                await axios.put(`https://iplstore-backend.onrender.com/api/products/admin/updateproduct/${editId}`, details,
                    { withCredentials: true })
                toast.success('Updated Product Successfully');
            }
            else {
                //adding product
                await axios.post(`https://iplstore-backend.onrender.com/api/products/admin/addproduct`, details
                    , { withCredentials: true }
                )
                toast.success('Added product Successfully')
            }
            closeForm();
            fetchproducts()
        }
        catch (err) {
            toast.error('Failed of either Updating or Adding Products')
        }
        finally {
            setsave(false); //button
        }
    }
    const handleDelete = async (productId) => {
        try {
            await axios.delete(`https://iplstore-backend.onrender.com/api/products/admin/deleteproduct/${productId}`
                , { withCredentials: true }
            )
            toast.success('Product deleted successfully')
            fetchproducts();
        }
        catch (err) {
            toast.error('Failed to delete Product')
        }
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setform({ ...form, [name]: value })
    }
    return (
        <>
            <div className={styles.page}>
                <ToastContainer />
                <Navbar />
                <div className={styles.pageTitle}>Products---CRUD</div>
                <p className={styles.pageSubtitle}>{products.length} total Products</p>
            </div>
            <div className={styles.container}>
                {showform && (
                    <div className={styles.formCard}>
                        <h3 className={styles.formTitle}>
                            {editId ? "Edit Product" : "Add Product"}
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Product Name:</label>
                                    <input type="text" name="name" className={styles.input}
                                        placeholder='eg:CSK JERSEY/CAP' value={form.name} onChange={handleChange} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>TeamName(CSK,RCB,MI....):</label>
                                    <input type="text" name="teamName" className={styles.input}
                                        placeholder='eg:CSK/MI/RCB/RR' value={form.teamName} onChange={handleChange} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>CategoryId:(1="Jersey" 2="Caps")</label>
                                    <input type="text" name="categoryId" className={styles.input}
                                        placeholder='eg:1 for JERSEY,2 for CAP' value={form.categoryId} onChange={handleChange} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Size:(S/L/M/XL...)</label>
                                    <input type="text" name="size" className={styles.input}
                                        placeholder='eg:S/M/L' value={form.size} onChange={handleChange} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Product Price:</label>
                                    <input type="text" name="price" className={styles.input}
                                        placeholder='eg:800' value={form.price} onChange={handleChange} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Stock Qunatity:</label>
                                    <input type="text" name="stockQuantity" className={styles.input}
                                        placeholder='eg:20' value={form.stockQuantity} onChange={handleChange} />
                                </div>
                                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                    <label className={styles.label}>Product Image:</label>
                                    <input type="text" name="imageUrl" className={styles.input}
                                        placeholder='eg:images/jerseys/csk_jersey.jpeg'
                                        value={form.imageUrl} onChange={handleChange} />
                                </div>
                                <div className={`${styles.formGroup} ${styles.formfullWidth}`}>
                                    <label className={styles.label}>Product Description:</label>
                                    <input type="text" name="description" className={styles.input}
                                        placeholder='eg:description...' value={form.description} onChange={handleChange} />
                                </div>
                            </div>
                            <div className={styles.formBtns}>
                                <button type="submit" className={styles.saveBtn} disabled={save}>
                                    {save ? 'saving' : editId ? 'UpdateProduct' : 'AddProduct'}
                                </button>
                                <button type="button" className={styles.cancelBtn}
                                    onClick={closeForm}>Cancel</button>
                            </div>

                        </form>
                    </div>
                )}
                {!showform && (
                    <button className={styles.addBtn} onClick={openForm}>
                        Add Product
                    </button>
                )}
            </div>
            {loading ? (
                <div className={styles.centerMsg}>
                    <div className={styles.spinner}></div>
                    <p>Loading Products....</p>
                </div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Team</th>
                                <th>Category</th>
                                <th>Size</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colspan="9" className={styles.noData}>No Products Found!!</td>
                                </tr>
                            ) : (
                                products.map((products) => {
                                    return (
                                        <>
                                            <tr key={products.productId}>
                                                <td className={styles.ideCell}>#{products.productId}</td>
                                                <td><img src={`https://iplstore-backend.onrender.com${products.imageUrl}`}
                                                    alt={products.name} className={styles.tableImg}
                                                    onError={(e) => e.target.style.display = 'none'} /></td>
                                                <td className={styles.nameCell}>{products.name}</td>
                                                <td>
                                                    <span className={styles.teamTag}>{products.teamName}</span>
                                                </td>
                                                <td>{products.categoryName}</td>
                                                <td>{products.size}</td>
                                                <td className={styles.priceCell}>₹{products.price}</td>
                                                <td>
                                                    <span className={products.stockQuantity === 0 ?
                                                        styles.outStock : styles.inStock
                                                    }>{products.stockQuantity}</span>
                                                </td>
                                                <td>
                                                    <div className={styles.action}>
                                                        <button className={styles.editBtn}
                                                            onClick={() => handleEdit(products)}>✍Edit</button>
                                                        <button className={styles.deleteBtn}
                                                            onClick={() => handleDelete(products.productId)}>🗑Delete</button>
                                                    </div>
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

export default AdminProducts
