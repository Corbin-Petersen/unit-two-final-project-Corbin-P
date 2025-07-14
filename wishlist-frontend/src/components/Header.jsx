import { NavLink, useParams } from "react-router";
import { useState } from "react";

export default function Header( props ) {
    const { data, loggedIn } = props;
    const { userID, listID } = useParams();
    const [ menuOpen, setMenuOpen ] = useState(false);
    const userInfo = data.find(user => user.userID == userID);

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
                    {!loggedIn ? (
                    <ul className={ menuOpen ? "open" : "" }>
                        <li>
                            <NavLink to="/" >HOME</NavLink>
                        </li>
                    </ul>
                    ) : (
                    <ul className={ menuOpen ? "open" : "" }>
                        <li>
                            <NavLink to={`${loggedIn}/lists`} onClick={handleSubMenu} end>MY LISTS</NavLink>
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