import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Header() {
    const { pathname } = useLocation();
    
    const [isProductsDropdownOpen, setProductsDropdownOpen] = useState(false);
    const [isCategoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);

    const toggleProductsDropdown = () => {
        setProductsDropdownOpen((prev) => !prev);
        setCategoriesDropdownOpen(false); // Close categories dropdown if products is opened
    };

    const toggleCategoriesDropdown = () => {
        setCategoriesDropdownOpen((prev) => !prev);
        setProductsDropdownOpen(false); // Close products dropdown if categories is opened
    };

    return (
        <div className="flex flex-row items-center justify-between border border-black py-2 px-6 bg-gray-800 text-white drop-shadow-xl">
            <div className="flex items-center justify-start gap-4">
                <img src="./logo.png" className="w-16 h-16" alt="Logo" />
                <h1 className="font-serif text-3xl">Mr. Broast</h1>
            </div>

            <ul className="flex gap-4 relative">
                <Link to="/menu">
                    <li className={`flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer ${pathname === "/menu" ? "bg-green-50 text-black" : "hover:bg-green-100 hover:text-black text-white"}`}>
                        Menu
                    </li>
                </Link>

                <Link to="/deals">
                    <li className={`flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer ${pathname === "/deals" ? "bg-green-50 text-black" : "hover:bg-green-100 hover:text-black text-white"}`}>
                        Deals
                    </li>
                </Link>

                <div className="relative">
                    <li onPointerOver={toggleProductsDropdown} className={`flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer ${pathname.includes("/products") ? "bg-green-50 text-black" : "hover:bg-green-100 hover:text-black text-white"}`}>
                        Products
                    </li>
                    {isProductsDropdownOpen && (
                        <div className="absolute left-0 w-40 bg-gray-700 text-white rounded-md shadow-lg z-10">
                            <Link to="/products/create">
                                <li className="py-2 px-4 hover:bg-green-100 hover:text-black cursor-pointer">Add Product</li>
                            </Link>
                            <Link to="/products/update">
                                <li className="py-2 px-4 hover:bg-green-100 hover:text-black cursor-pointer">Update Product</li>
                            </Link>
                            <Link to="/products/delete">
                                <li className="py-2 px-4 hover:bg-green-100 hover:text-black cursor-pointer">Delete Product</li>
                            </Link>
                        </div>
                    )}
                </div>

                <div className="relative">
                    <li onPointerOver={toggleCategoriesDropdown} className={`flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer ${pathname.includes("/categories") ? "bg-green-50 text-black" : "hover:bg-green-100 hover:text-black text-white"}`}>
                        Categories
                    </li>
                    {isCategoriesDropdownOpen && (
                        <div className="absolute left-0 w-40 bg-gray-700 text-white rounded-md shadow-lg z-10">
                            <Link to="/categories/create">
                                <li className="py-2 px-4 hover:bg-green-100 hover:text-black cursor-pointer">Add Category</li>
                            </Link>
                            <Link to="/categories/update">
                                <li className="py-2 px-4 hover:bg-green-100 hover:text-black cursor-pointer">Update Category</li>
                            </Link>
                            <Link to="/categories/delete">
                                <li className="py-2 px-4 hover:bg-green-100 hover:text-black cursor-pointer">Delete Category</li>
                            </Link>
                        </div>
                    )}
                </div>

                <Link to="/settings">
                    <li className={`flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer ${pathname === "/settings" ? "bg-green-50 text-black" : "hover:bg-green-100 hover:text-black text-white"}`}>
                        Settings
                    </li>
                </Link>
            </ul>
        </div>
    );
}

export default Header;
