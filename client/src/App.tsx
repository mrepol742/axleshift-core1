import "./sass/bootstrap.scss";
import "./sass/app.scss";
import "bootstrap";
import { Outlet } from "react-router-dom";
import Navbar from "./layouts/components/Navbar";
import Sidebar from "./layouts/components/Sidebar";

const App = () => {
    return (
        <div>
            <Navbar />
            <div className="wrapper">
                <Sidebar />
                <div className="main">
                    <div className="mx-2">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default App;
