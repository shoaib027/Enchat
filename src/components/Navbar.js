import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import MsgContext from '../context/MsgContext'

const Navbar = () => {
    const url = 'http://localhost:5000/api/'
    const [searchVal, setSearchVal] = useState("")
    const myContext = useContext(MsgContext)
    const { setSearchedUsername, loginFailed, setLoginFailed, setResponseChatID } = myContext
    const logout = () => {
        setLoginFailed(true)
        setSearchedUsername({ "name": "", "username": "" })
        setSearchVal("")
        setResponseChatID(null)
        localStorage.clear()
    }
    const handleChange = (e) => {
        setSearchVal(e.target.value)
    }
    const searchUsername = async () => {
        try {
            let response = await fetch(`${url}search`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ "username": searchVal })
            });

            if (response.status === 404) {
                // Handle the case where the user is not found (404 Not Found).
                // You can set an appropriate error message or take other actions.
                await setSearchedUsername({ "error": true, "name": "", "username": "" });
            } else if (response.ok) {
                // If the response status is OK (e.g., 200), parse the JSON response.
                const responseData = await response.json();
                await setSearchedUsername(responseData);
                localStorage.setItem('username', responseData.username)
                localStorage.setItem('name', responseData.name)
                setSearchVal("")
            } else {
                // Handle other non-success HTTP status codes as needed.
                console.log("Unexpected response status: " + response.status);
            }
        } catch (e) {
            console.log("An error occurred: " + e);
        }
    }

    const searchHandler = (e) => {
        searchUsername();
        e.preventDefault();
    }
    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <Link className="nav-link" aria-current="page" to="/"><img src="favicon-32x32.png" className="logo" alt="Logo" /></Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link" aria-current="page" to="/home">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" aria-current="page" to="/about">About</Link>
                            </li>
                        </ul>
                        {loginFailed === false && <form className="d-flex" role="search" >
                            <input required onChange={handleChange} value={searchVal} className="form-control me-2" id='search-input' type="search" placeholder="Search username" aria-label="Search" />
                            <button type="submit" onClick={searchHandler} className="btn btn-outline-success" style={{ marginRight: '30vw' }}>
                                <Link className="nav-link" aria-current="page" to="/search">
                                    Search
                                </Link>
                            </button>
                        </form>}

                        {loginFailed === false &&
                            <button type="submit" className="btn btn-primary">
                                <Link className="nav-link" aria-current="page" style={{marginTop: '1px'}} onClick={logout} to="/login">Logout</Link>
                            </button>

                        }
                        {
                            (loginFailed === true || loginFailed === null) &&
                            <button type="submit" className="btn btn-primary" style={{ marginRight: '2px', marginTop: '1px' }}>
                                <Link className="nav-link" aria-current="page" to="/login">Login</Link>
                            </button>
                        }

                        {
                            (loginFailed === true || loginFailed === null) &&
                            <button type="submit" className="btn btn-primary">
                                <Link className="nav-link" aria-current="page" to="/signup">Signup</Link>

                            </button>
                        }



                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar
