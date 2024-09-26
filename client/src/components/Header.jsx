function Header() {
    return (
        <div className="fixed top-0 flex flex-row items-center justify-between h-16 border border-black w-screen p-6 ">
            <div className="flex items-center justify-start gap-4">
                <img src="./logo.png" className="w-16 h-16" alt="" />
                <h1 className="font-serif text-3xl">Mr. Broast</h1>
            </div>

            <ul className="flex gap-8">
                <li>Menu</li>
                <li>Deals</li>
                <li>Settings</li>
            </ul>
        </div>
    );
}

export default Header;
