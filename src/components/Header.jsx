import React from "react";

function Header() {
    return (
        <header>
            <div className="logo-wrapper">
                <img
                    src={process.env.PUBLIC_URL + "/logo.png"}
                    alt="Logo"
                    className="logo"
                />
                <h1>Easy Note</h1>
            </div>
        </header>
    );
}

export default Header;
