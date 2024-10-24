import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { orderActions } from "../store/orderSlice";
import toast from "react-hot-toast";
import { IoIosAddCircle } from "react-icons/io";

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
        <div className="relative max-w-sm border border-gray-800 rounded-lg shadow bg-[rgb(124,99,67)]">
            <img
                className="p-4 rounded-t-lg object-cover w-full h-48"
                src={image}
                alt={`${name} image`}
            />
            <div className="px-4 pb-4">
                <h5 className="text-lg font-semibold tracking-tight text-white">
                    {name}
                </h5>
                <div className="flex items-center justify-between mt-2">
                    <span className="text-2xl font-bold text-white">
                        Rs. {priceState}
                    </span>

                    <input
                        type="number"
                        ref={quantityRef}
                        onChange={() => setPriceState(conPrice * quantityRef.current.value)}
                        min={1}
                        defaultValue={1}
                        className="w-20 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-4 focus:ring-blue-300"
                    />

                    <button
                        onClick={handleAddItem}
                        className="ml-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
                    >
                        <IoIosAddCircle />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Product;
