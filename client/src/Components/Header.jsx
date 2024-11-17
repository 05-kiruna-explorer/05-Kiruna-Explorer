import React, { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";

const Header = ({ isLoggedIn, handleLogout, headerClass, isHomePage }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(prevState => !prevState);
    };

    return (
        <header
            className={`d-flex justify-content-between align-items-center p-3 w-100 ${headerClass}`}
            style={{ position: "fixed", top: 0, zIndex: 2, height: "60px" }}
        >
            <div className="d-flex align-items-center">
                {/* Toggle Sidebar Button */}
                <button onClick={toggleSidebar} style={{
                    backgroundColor: 'transparent',
                    color: 'white',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    marginRight: '10px'
                }}>
                    ☰
                </button>

                {/* Title */}
                <h1 className="m-0" style={{transition: "transform 0.3s ease",
                transform: isSidebarOpen ? "translateX(200px)" : "translateX(0)"}}>
                    <Link to="/" className="text-light text-decoration-none" style={{ fontFamily: "fantasy" }}>
                        Kiruna eXplorer
                    </Link>
                </h1>
            </div>

            <div>
                {isLoggedIn ? (
                    <button className="btn btn-light" onClick={handleLogout}>
                        Logout
                    </button>
                ) : (
                    location.pathname !== "/login" && (
                        <Link to="/login" className="btn btn-light">
                            Login
                        </Link>
                    )
                )}
            </div>

            {/* Sidebar Component */}
            <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={setIsSidebarOpen} />
        </header>
    );
};

export default Header;