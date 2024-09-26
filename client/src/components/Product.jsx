import { useRef, useState } from "react";

function Product() {
    const quantityRef = useRef();
    const conPrice = 350;
    const [price, setPrice] = useState(350);
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
                        Rs. {price}
                    </span>
                    <input onChange={() => setPrice(conPrice*quantityRef.current.value )} ref={quantityRef} placeholder="Enter quantity" type="number" min={1} maxLength={3} onClick={event => console.log(event)}
            className="text-black bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-1 py-2.5 text-center" />
                </div>
            </div>
        </div>
    );
}

export default Product;
