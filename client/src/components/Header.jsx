import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Header() {
    const { pathname } = useLocation();
    
    const [isProductsDropdownOpen, setProductsDropdownOpen] = useState(false);
    const [isCategoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);

    const toggleProductsDropdown = () => {
        setProductsDropdownOpen((prev) => !prev);
        setCategoriesDropdownOpen(false);
    };

    const toggleCategoriesDropdown = () => {
        setCategoriesDropdownOpen((prev) => !prev);
        setProductsDropdownOpen(false);
    };

    return (
        <div className="flex flex-row items-center justify-between border border-black py-2 px-6 bg-[rgb(249,159,49)] text-black drop-shadow-xl">
            <div className="flex items-center justify-start gap-4">
                <img src="images/logo.png" className="w-16 h-16" alt="Logo" />
                <h1 className="font-serif font-bold text-3xl">Natural Mr. Broast</h1>
            </div>

            <ul className="flex gap-4 relative">
                <Link to="/">
                    <li className={`flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer ${pathname === "/" ? "bg-[rgb(129,86,29)]  text-white" : "hover:bg-[rgb(126,101,69)] hover:text-white text-black"}`}>
                        Menu
                    </li>
                </Link>

                <Link to="/order">
                    <li className={`flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer ${pathname === "/order" ? "bg-[rgb(129,86,29)]  text-white" : "hover:bg-[rgb(126,101,69)] hover:text-white text-black"}`}>
                        Orders
                    </li>
                </Link>


                <Link to="/delivery">
                    <li className={`flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer ${pathname === "/delivery" ? "bg-[rgb(129,86,29)]  text-white" : "hover:bg-[rgb(126,101,69)] hover:text-white text-black"}`}>
                        Delivery
                    </li>
                </Link>

                <Link to="/dinein">
                    <li className={`flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer ${pathname === "/dinein" ? "bg-[rgb(129,86,29)]  text-white" : "hover:bg-[rgb(126,101,69)] hover:text-white text-black"}`}>
                        Dine-In
                    </li>
                </Link>

                <Link to="/riders">
                    <li className={`flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer ${pathname === "/riders" ? "bg-[rgb(129,86,29)]  text-white" : "hover:bg-[rgb(126,101,69)] hover:text-white text-black"}`}>
                        Riders
                    </li>
                </Link>

                <Link to="/waiters">
                    <li className={`flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer ${pathname === "/waiters" ? "bg-[rgb(129,86,29)]  text-white" : "hover:bg-[rgb(126,101,69)] hover:text-white text-black"}`}>
                        Waiters
                    </li>
                </Link>
             
                <Link to="/audit">
                    <li className={`flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer ${pathname === "/audit" ? "bg-[rgb(129,86,29)]  text-white" : "hover:bg-[rgb(126,101,69)] hover:text-white text-black"}`}>
                        Audit
                    </li>
                </Link>
            </ul>
        </div>
    );
}

export default Header;
