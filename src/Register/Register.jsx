import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import styles from './Register.module.css';
const Register = () => {
    const [userName, setuserName] = useState("");
    const [userEmail, setuserEmail] = useState("");
    const [userPassword, setuserPassword] = useState("");
    const [userPhonenumber, setuserPhonenumber] = useState();
    const [error, seterror] = useState("");
    const [success, setsuccess] = useState("");
    const [loading, setloading] = useState(false);
    const nav = useNavigate();
    const handleregister = async (e) => {
        e.preventDefault();
        seterror(' ');
        setsuccess(' ');
        setloading(true);
        if (!userName || !userEmail || !userPassword || !userPhonenumber) {
            seterror("All fields are Required");
            setloading(false);
            return;
        }
        if (userPassword.length < 6) {
            seterror("Password must be atleast 6 characters try again");
            setloading(false);
            return;
        }
        if (userPhonenumber.length < 10) {
            seterror("PhoneNumber must be 10 digits");
            setloading(false);
            return;
        }
        try {
            const res = await axios.post('http://localhost:8080/api/auth/register', {
                userName, userEmail, userPassword,
                userPhonenumber
            });
            setsuccess("Registration Successfully Happening...");
            setTimeout(() => nav("/login"), 2000);
        }
        catch (err) {
            seterror("Registration failed try again");
        }
        finally {
            setloading(false);
        }
    }
    return (
        <>
            <div className={styles.regpage}>
                <div className={styles.regcard}>
                    <div className={styles.header}>
                        <div className={styles.logo}>
                            🏏
                        </div>
                        <h2 className={styles.title}>IPL STORE</h2>
                        <p className={styles.subtitle}>Create Your Account</p>
                    </div>
                    {error && (<div className={"alert alert-danger py-2"}>{error}</div>)}
                    {success && (<div className={"alert alert-success py-2"}>{success}</div>)}
                    <form onSubmit={handleregister}>
                        <div className={styles.formgrp}>
                            <label className={styles.label}>FullName:</label>
                            <input type="text" className={styles.input}
                                placeholder='Enter Your Fullname' value={userName}
                                onChange={(e) => setuserName(e.target.value)} />
                        </div>
                        <div className={styles.formgrp}>
                            <label className={styles.label}>EmailAddress:</label>
                            <input type="text" className={styles.input}
                                placeholder='Enter Your Email' value={userEmail}
                                onChange={(e) => setuserEmail(e.target.value)} />
                        </div>
                        <div className={styles.formgrp}>
                            <label className={styles.label}>PhoneNumber:</label>
                            <input type="text" className={styles.input}
                                placeholder='Enter Your PhoneNumber' value={userPhonenumber}
                                onChange={(e) => setuserPhonenumber(e.target.value)} max="10" />
                        </div>
                        <div className={styles.formgrp}>
                            <label className={styles.label}>Password:</label>
                            <input type="text" className={styles.input}
                                placeholder='Enter Your Password' value={userPassword}
                                onChange={(e) => setuserPassword(e.target.value)} />
                        </div>
                        <button type="submit" className={styles.regbtn} disabled={loading}>
                            {loading ? 'CreatingAccount...' : 'Create Account'}
                        </button>
                    </form>
                    <p className={styles.login}>
                        Already have an Account? <Link to="/login" className={styles.loginlink}>Sign In here</Link>
                    </p>
                </div>

            </div>
        </>
    )
}

export default Register