import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { getCookie, setCookie } from "./Cookies";

export default function Navbar() {
    useEffect(() => {
        const hamBurger = document.querySelector(".toggle-btn");

        function getSidebarStateFromCookie() {
            const state = getCookie("sidebarState");
            return state === "expanded";
        }

        const isExpanded = getSidebarStateFromCookie();
        if (isExpanded) {
            hamBurger.classList.remove("rotate-vertical");
        } else {
            hamBurger.classList.add("rotate-vertical");
        }
    }, []);

    function toggleBtn() {
        sidebar.classList.toggle("expand");
        toggleBtn.classList.toggle("rotate-vertical");

        const isExpanded = sidebar.classList.contains("expand");
        const state = isExpanded ? "expanded" : "collapsed";
        setCookie("sidebarState", state, 7);
    }

    return (
        <div>
            <nav className="navbar navbar-expand-md navbar-light bg-white">
                <div className="container-fluid">
                    <div className="navbar-brand">
                        {/* check if user is logged in */}
                        <button className="toggle-btn" type="button" id="toggleBtn" onClick={toggleBtn}>
                            <i className="fa-solid fa-bars-staggered"></i>
                        </button>
                        <a className="d-none d-md-inline text-dark" href="/">
                            Freight Core1
                        </a>
                    </div>

                    <div className="" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mx-3">
                            {/* check if user is not login */}
                            <li className="nav-item">
                                <a className="nav-link" href="{{ route('login') }}">
                                    Login
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="{{ route('register') }}">
                                    Register
                                </a>
                            </li>
                        </ul>

                        <div className="d-flex">
                            <li className="nav-item">
                                <div className="input-group m-1">
                                    <input type="text" className="form-control mw-25" placeholder="Track your shipment" aria-label="Track your shipment" aria-describedby="basic-addon1" />
                                    <span className="input-group-text" id="basic-addon1">
                                        <i className="fa-solid fa-magnifying-glass"></i>
                                    </span>
                                </div>
                            </li>
                            {/* check if user is logged in */}
                            <li className="nav-item dropdown">
                                <a id="navbarDropdown" className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-pre>
                                    Firstname
                                </a>

                                <div className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                    <a
                                        className="dropdown-item"
                                        href="{{ route('logout') }}"
                                        onclick="event.preventDefault();
                                                     document.getElementById('logout-form').submit();">
                                        Logout
                                    </a>

                                    <form id="logout-form" action="{{ route('logout') }}" method="POST" className="d-none">
                                        @csrf
                                    </form>
                                </div>
                            </li>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}
