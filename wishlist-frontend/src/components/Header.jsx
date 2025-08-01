import { NavLink, useParams } from "react-router";
import { useState } from "react";

export default function Header( props ) {
    const [ menuOpen, setMenuOpen ] = useState(false);
    const { userID, userInfo, isLoggedIn, setIsLoggedIn } = props;
    
    const handleMenu = (e) => {
        e.preventDefault();
        setMenuOpen(!menuOpen);
    }
    const handleSubMenu = (e) => {
        setMenuOpen(!menuOpen);
    }

    return (
        <header>
            <div id="header-content">
                <nav>
                    <img src="/wistlish-logo.png" />
                    <div className="menu" onClick={handleMenu}>
                        <i className="fa-solid fa-bars"></i>
                    </div>
                    {!isLoggedIn ? (
                    <ul className={ menuOpen ? "open" : "" }>
                        <li>
                            <NavLink to="/" >HOME</NavLink>
                        </li>
                    </ul>
                    ) : (
                    <ul className={ menuOpen ? "open" : "" }>
                        <li>
                            <NavLink to={`${userID}/lists`} onClick={handleSubMenu} end>MY LISTS</NavLink>
                        </li>
                        <li>
                            <NavLink to="/" onClick={handleSubMenu} reloadDocument end>LOGOUT</NavLink>
                        </li>
                    </ul>
                    )}
                </nav>
            </div>

        </header>
    );
}