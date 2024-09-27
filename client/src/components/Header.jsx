import { Link, useLocation } from "react-router-dom";

function Header() {
    const {pathname} = useLocation();
    return (
        <div className="flex flex-row items-center justify-between border border-black w-screen py-2 px-6 bg-gray-800 text-white drop-shadow-xl">
            <div className="flex items-center justify-start gap-4">
                <img src="./logo.png" className="w-16 h-16" alt="" />
                <h1 className="font-serif text-3xl">Mr. Broast</h1>
            </div>

            <ul className="flex gap-4">
                <Link to="/menu"><li className={`flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer  ${pathname === "/menu" ? "bg-green-50 text-black" : "hover:bg-green-100 hover:text-black text-white"}`}>Menu</li></Link>
                <Link to="/deals"><li className={`flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer  ${pathname === "/deals" ? "bg-green-50 text-black" : "hover:bg-green-100 hover:text-black text-white"}`}>Deals</li></Link>
                <Link to="/order"><li className={`flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer  ${pathname === "/order" ? "bg-green-50 text-black" : "hover:bg-green-100 hover:text-black text-white"}`}>Order</li></Link>
                <Link to="/settings"><li className={`flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer  ${pathname === "/settings" ? "bg-green-50 text-black" : "hover:bg-green-100 hover:text-black text-white"}`}>Settings</li></Link>
            </ul>
        </div>
    );
}

export default Header;
