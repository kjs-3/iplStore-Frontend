import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './Login.module.css';
const Login = () => {
    const [userEmail, setuserEmail] = useState("");
    const [userPassword, setuserPassword] = useState("");
    const [error, seterror] = useState("");
    const [loading, setloading] = useState(false);
    const nav = useNavigate();
    const handlelogin = async (e) => {
        e.preventDefault();
        seterror(' ');
        setloading(true);
        if (!userEmail || !userPassword) {
            seterror("Please enter Email and Passwod to Login");
            setloading(false);
            return;
        }
        try {
            const res = await axios.post('http://localhost:8080/api/auth/login',
                { userEmail, userPassword }, { withCredentials: true });
            const user = res.data;
            console.log(user);
            localStorage.setItem('userId', user.userId);
            localStorage.setItem('userRole', user.role);
            localStorage.setItem('userName', user.userName);
            if (user.role == 'admin') {
                nav('/admin')
            }
            else {
                nav('/home');
            }
        }
        catch (err) {
            seterror("login failed, Try again.....");
        }
        finally {
            setloading(false);
        }
    }
    return (
        <>
            <div className={styles.loginpage}>
                <div className={styles.logincard}>
                    <div className={styles.header}>
                        <div className={styles.logo}>🏏</div>
                        <h2 className={styles.title}>IPL STORE</h2>
                        <p className={styles.subtitle}>Sign In to your account</p>
                    </div>
                    {error && (
                        <div className="alert alert-danger py-2" role="alert">{error}</div>
                    )}
                    <form onSubmit={handlelogin}>
                        <div className={styles.formgrp}>
                            <label className={styles.label}>Email Address:</label>
                            <input type="email" className={styles.input}
                                placeholder='Enter Your Email' value={userEmail}
                                onChange={(e) => setuserEmail(e.target.value)} />
                        </div>
                        <div className={styles.formgrp}>
                            <label className={styles.label}>Password:</label>
                            <input type="password" className={styles.input}
                                placeholder='Enter Your Password' value={userPassword}
                                onChange={(e) => setuserPassword(e.target.value)} />
                        </div>
                        <button type="submit" className={styles.loginbtn} disabled={loading}>
                            {loading ? 'SigningIn...' : 'SignIn'}
                        </button>
                    </form>
                    <p className={styles.register}>Don't have an account? <Link to="/register"
                        className={styles.reglink}>Register here</Link></p>
                </div>
            </div>
        </>
    )
}

export default Login


// api end point for login -->/api/auth/login --->postmapping