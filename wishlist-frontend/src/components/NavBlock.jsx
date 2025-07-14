import { NavLink } from "react-router";

export default function NavBlock() {


    return (
        <nav>
            <NavLink to="/:userID/lists" end>MY LISTS</NavLink>
            <NavLink to="/" end>LOGOUT</NavLink>
        </nav>
    );
}