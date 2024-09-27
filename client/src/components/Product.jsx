import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { orderActions } from "../store/orderSlice";

function Product({name}) {
    const dispatch = useDispatch();
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
                <h5 className="text-xl font-semibold tracking-tight text-white">
                    {name}
                </h5>
                {/* <div className="flex items-center mt-2.5 mb-5"></div> */}
                <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-white">
                        Rs. {price}
                    </span>
                    <button onClick={() => dispatch(orderActions.addItem({
                        name, price: conPrice, quantity: +quantityRef.current.value
                    }))} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center">
                        Add to Order
                    </button>
                    <input
                    type="number"
                    ref={quantityRef}
                    onChange={() => setPrice(conPrice * quantityRef.current.value)}
                    min={0} maxLength={2}
                    defaultValue={1}
                    class="appearance-none w-24 border border-gray-300 rounded-md py-1.5 px-4 text-center focus:outline-none focus:ring-4 focus:ring-blue-300"
                    />

                    {/* <input
                        onChange={() =>
                            setPrice(conPrice * quantityRef.current.value)
                        }
                        ref={quantityRef}
                        type="number"
                        min={1}
                        maxLength={3}
                        className="text-black bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-0.5 py-2.5 text-center"
                    /> */}
                </div>
            </div>
        </div>
    );
}

export default Product;
