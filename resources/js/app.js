import './bootstrap';
import { setCookie, getCookie } from "./cookie";

(function () {
    const hamBurger = document.querySelector(".toggle-btn");
    const sidebar = document.querySelector("#sidebar");

    function handleSidebar() {
        if (window.innerWidth <= 800) {
            sidebar.classList.remove("expand");
        } else {
            sidebar.classList.add("expand");
        }
    }

    function setSidebarStateToCookie(isExpanded) {
        const state = isExpanded ? "expanded" : "collapsed";
        setCookie("sidebarState", state, 7);
    }

    function getSidebarStateFromCookie() {
        const state = getCookie("sidebarState");
        return state === "expanded";
    }

    hamBurger.addEventListener("click", function () {
        sidebar.classList.toggle("expand");
        this.classList.toggle("rotate-vertical");
        setSidebarStateToCookie(sidebar.classList.contains("expand"));
    });

    window.addEventListener("resize", handleSidebar);

    function initializeSidebar() {
        handleSidebar();
        const isExpanded = getSidebarStateFromCookie();
        if (isExpanded) {
            sidebar.classList.add("expand");
            hamBurger.classList.remove("rotate-vertical");
        } else {
            sidebar.classList.remove("expand");
            hamBurger.classList.add("rotate-vertical");
        }
    }

    initializeSidebar();
    
    // adding a bit of animation when hovered on sidebar items
    const icons = document.querySelectorAll('i.fa-solid');
    
    icons.forEach(icon => {
        const parent = icon.parentElement;
        if (parent) {
            parent.addEventListener('mouseover', function (event) {
                icon.classList.add("fa-bounce");
                icon.style = 'font-size: 1rem; color: #4285f4;';
            });

            parent.addEventListener('mouseout', function (event) {
                icon.classList.remove("fa-bounce");
                icon.style = 'font-size: 0.8rem; color: #484848;';
            });
        }
    });
})();

