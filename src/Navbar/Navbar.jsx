import React, { useState } from 'react'
import {useNavigate,Link} from 'react-router-dom'
import axios from 'axios';
import styles from './Navbar.module.css'
const Navbar = () => {
    const nav=useNavigate();
    const userName=localStorage.getItem("userName") || "user";
    const userRole=localStorage.getItem("userRole");
    const [menubar,setmenubar]=useState(false);
    const handlelogout=()=>{
        try{
             axios.post('http://localhost:8080/api/auth/logout',{},{withCredentials:true})
        }
        catch(error){
            console.log("logout is not happening check once");
        }
        localStorage.clear();
        nav('/login');
    }
  return (
    <>
    <nav className={styles.navbar}>
        <Link to="/" className={styles.logo}>🏏 <span>IPL STORE</span></Link>
        <button className={styles.hamburger} onClick={()=>setmenubar(!menubar)}>&#9776;</button>
        <div className={`${styles.navlinks} ${menubar?styles.open:' '}`}>
            <Link to="/home" className={styles.navlink} onClick={()=>setmenubar(false)}>Home</Link>
             <Link to="/products" className={styles.navlink} onClick={()=>setmenubar(false)}>Products</Link>
             {userRole=="user"&&(<Link to="/orders" className={styles.navlink} onClick={()=>setmenubar(false)}>
             My Orders
             </Link>)}
             {userRole=="admin"&&(<Link to="/admin" className={styles.navlink} onClick={()=>setmenubar(false)}>
             DashBoard
             </Link>)}
             {userRole=="user"&&(<Link to="/cart" className={styles.cartbtn} onClick={()=>setmenubar(false)}>
             🛒Cart
             </Link>)}
             <span className={styles.userName}>Hello ! {userName}</span>
             <button className={styles.logoutbtn} onClick={()=>handlelogout()}>Logout</button>
        </div>
    </nav>
    </>
  )
}

export default Navbar