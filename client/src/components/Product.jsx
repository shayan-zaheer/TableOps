function Product() {
    return (
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <img
                    className="p-8 rounded-t-lg"
                    src="./zinger.png"
                    alt="product image"
                />
            <div className="px-5 pb-5">
                <a href="#">
                    <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                        Zinger Burger
                    </h5>
                </a>
                <div className="flex items-center mt-2.5 mb-5">
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        Rs. 350
                    </span>
                    <button
                        onClick={event => console.log(event)}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        Add to cart
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Product;
