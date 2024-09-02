import { useEffect } from "react";
import { getCookie, setCookie } from "./Cookies";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
    useEffect(() => {
        const sidebar = document.querySelector("#sidebar");

        function getSidebarStateFromCookie() {
            const state = getCookie("sidebarState");
            return state === "expanded";
        }

        function handleSidebar() {
            if (window.innerWidth <= 800) return sidebar.classList.remove("expand");
            sidebar.classList.add("expand");
        }

        window.addEventListener("resize", handleSidebar);

        handleSidebar();

        const isExpanded = getSidebarStateFromCookie();
        if (isExpanded) {
            sidebar.classList.add("expand");
        } else {
            sidebar.classList.remove("expand");
        }

        return () => {
            window.removeEventListener("resize", handleSidebar);
        };
    }, []);

    return (
        <div>
            <aside id="sidebar" className="expand">
                <ul className="sidebar-nav bg-white">
                    <li className="sidebar-item {{ Request::path() == '/' ? 'active' : ''  }}">
                        <a href="/" className="sidebar-link">
                            <i className="fa-solid fa-house"></i>
                            <span>Overview</span>
                        </a>
                    </li>
                    <li className="sidebar-item">
                        <a href="#" className="sidebar-link has-dropdown" data-bs-toggle="collapse" data-bs-target="#multi" aria-expanded="true" aria-controls="multi">
                            <i className="fa-regular fa-paper-plane"></i>
                            <span>Shipping Services</span>
                        </a>
                        <ul id="multi" className="sidebar-dropdown list-unstyled collapse show" data-bs-parent="#sidebar">
                            <li className="sidebar-item mx-4">
                                <a href="/freight/land" className="sidebar-link {{ Request::path() == 'freight/land' ? 'active' : ''  }}">
                                    <i className="fa-solid fa-truck"></i> Land Freight
                                </a>
                            </li>
                            <li className="sidebar-item mx-4">
                                <a href="/freight/air" className="sidebar-link {{ Request::path() == 'freight/air' ? 'active' : ''  }}">
                                    <i className="fa-solid fa-plane-departure"></i> Air Freight
                                </a>
                            </li>
                            <li className="sidebar-item mx-4">
                                <a href="/freight/sea" className="sidebar-link {{ Request::path() == 'freight/sea' ? 'active' : ''  }}">
                                    <i className="fa-solid fa-ship"></i> Sea Freight
                                </a>
                            </li>
                        </ul>
                    </li>
                    <hr className="mx-4" />
                    <li className="sidebar-item">
                        <a href="#" className="sidebar-link">
                            <i className="fa-solid fa-folder"></i>
                            <span>Document and Package</span>
                        </a>
                    </li>
                    <li className="sidebar-item">
                        <a href="#" className="sidebar-link">
                            <i className="fa-solid fa-folder"></i>
                            <span>Containers and Cargo</span>
                        </a>
                    </li>
                </ul>
            </aside>
        </div>
    );
}
