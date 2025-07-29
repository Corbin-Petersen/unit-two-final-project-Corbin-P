import { NavLink, useParams } from "react-router";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";

export default function Header( props ) {
    const [ menuOpen, setMenuOpen ] = useState(false);
    const { data, loggedIn } = props;
    // const { listID } = useParams();
    const { 
        userId, setUserId,
        isLoggedIn, setIsLoggedIn 
    } = useContext(AppContext);
    
    // const userInfo = data.find(user => user.userID == userID);

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
                            <NavLink to={`${userId}/lists`} onClick={handleSubMenu} end>MY LISTS</NavLink>
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