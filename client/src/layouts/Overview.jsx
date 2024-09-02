import { useEffect } from "react";
import { useAppContext } from '../context/AppContext';

function Overview() {
    const { isLoggedIn } = useAppContext();

    useEffect(() => {
        // fetch items here
    }, []);


    return (
        <div className="container mt-5">
            {isLoggedIn ? <button>Add Item</button> : null}
           
        </div>
    );
}

export default Overview;
