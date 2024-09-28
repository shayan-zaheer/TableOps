import { FaTrash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { orderActions } from '../store/orderSlice';

function Order({ name, price, quantity }) {
    const dispatch = useDispatch();
    return (
        <div className="flex items-center justify-between w-full mx-3 py-5 border-b bg-gray-800 text-white">
            <span className="flex-1">{name}</span>
            <span className="flex-1 text-center">Rs. {price}</span>
            <span className="flex-1 text-center">{quantity}</span>
            <span className="flex-1 text-center">Rs. {price * quantity}</span>
            <button onClick={() => dispatch(orderActions.removeItem(name))} className="text-red-500 hover:text-red-700">
                <FaTrash />
            </button>
        </div>
    );
}

export default Order;
