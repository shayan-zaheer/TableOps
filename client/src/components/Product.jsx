import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { orderActions } from "../store/orderSlice";
import toast from "react-hot-toast";

function Product({ name, price, image, onDelete, category }) {
    const dispatch = useDispatch();
    const quantityRef = useRef();
    const conPrice = price;
    const [priceState, setPriceState] = useState(price);
    
    const handleAddItem = () => {
        const quantity = +quantityRef.current.value;
        dispatch(orderActions.addItem({
            name,
            price: conPrice,
            quantity,
            category
        }));

        toast.success(`${quantity} ${name}(s) added to order!`, {
            duration: 3000,
        });
    };

    return (
        <div className="py-5 relative max-w-sm border border-gray-800 rounded-lg shadow bg-[rgb(124,99,67)]">
            <img
                className="p-8 rounded-t-lg object-cover w-full h-64"
                src={image}
                alt="product image"
            />
            <div className="px-5 pb-5">
                <h5 className="text-xl font-semibold tracking-tight text-white">
                    {name}
                </h5>
                <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-white">
                        Rs. {priceState}
                    </span>

                    <button
                        onClick={handleAddItem}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center"
                    >
                        Add to Order
                    </button>

                    {/* <button onClick={onDelete} className="absolute top-0 right-0 transform translate-x-1 -translate-y-1 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 focus:outline-none">
        -
      </button> */}

                    <input
                        type="number"
                        ref={quantityRef}
                        onChange={() => setPriceState(conPrice * quantityRef.current.value)}
                        min={0}
                        maxLength={2}
                        defaultValue={1}
                        className="appearance-none w-24 border border-gray-300 rounded-md py-1.5 px-4 text-center focus:outline-none focus:ring-4 focus:ring-blue-300"
                    />
                </div>
            </div>
        </div>
    );
}

export default Product;
