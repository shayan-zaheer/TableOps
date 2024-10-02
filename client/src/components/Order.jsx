import { FaTrash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { orderActions } from '../store/orderSlice';
import toast from 'react-hot-toast';

function Order({ name, price, quantity }) {

    const handleDeleteItem = () => {
        toast.error(`${quantity} ${name}(s) removed!`)
        dispatch(orderActions.removeItem(name));
    }

    const dispatch = useDispatch();
    return (
        <div className="flex items-center justify-between mx-3 py-5 border-b bg-[rgb(109,80,44)] text-white">
            <span className="flex-1">{name}</span>
            <span className="flex-1 text-center">Rs. {price}</span>
            <span className="flex-1 text-center">{quantity}</span>
            <span className="flex-1 text-center">Rs. {price * quantity}</span>
            <button onClick={handleDeleteItem} className="text-red-500 hover:text-red-700">
                <FaTrash />
            </button>
        </div>
    );
}

export default Order;
