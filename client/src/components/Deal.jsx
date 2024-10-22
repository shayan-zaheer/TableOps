import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { orderActions } from "../store/orderSlice";
import toast from "react-hot-toast";

function Deal({ name, price, image, dealItems }) {
    const dispatch = useDispatch();
    const quantityRef = useRef();
    const conPrice = price;
    const [priceState, setPriceState] = useState(price);

    const handleAddDeal = () => {
        dealItems.forEach(item => {
            dispatch(orderActions.addItem({
                name: item.productId.name,
                price: item.productId.price,
                quantity: item.quantity,
                dealPrice: price
            }));
        });

        // dispatch(orderActions.addItem({

        // }))

        toast.success(`${name} (deal) added to order!`, {
            duration: 3000,
        });
    };

    return (
        <div className="py-5 relative max-w-sm border border-gray-800 rounded-lg shadow bg-[rgb(124,99,67)]">
            <img
                className="p-8 rounded-t-lg object-cover w-full h-64"
                src={image}
                alt="deal image"
            />
            <div className="px-5 pb-5">
                <h5 className="text-xl font-semibold tracking-tight text-white">
                    {name} (Deal)
                </h5>
                <div className="text-sm text-white">
                    {dealItems.map(item => (
                        <p key={item.productId._id}>{item.quantity}x: {item.productId.name} - Rs. {item.productId.price}</p>
                    ))}
                </div>
                <div className="flex items-center justify-between mt-4">
                    <span className="text-3xl font-bold text-white">
                        Rs. {priceState}
                    </span>

                    <button
                        onClick={handleAddDeal}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center"
                    >
                        Add Deal to Order
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Deal;
