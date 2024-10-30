import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { orderActions } from "../store/orderSlice";
import toast from "react-hot-toast";
import { IoIosAddCircle } from "react-icons/io";

function Product({ name = "", price, image, onDelete, category = "" }) {
    const dispatch = useDispatch();
    const quantityRef = useRef();
    const [priceState, setPriceState] = useState(price);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedFlavor, setSelectedFlavor] = useState("");

    const pizzaOptions = {
        "Chicken Tikka (Small)": 250,
        "Chicken Tikka (Medium)": 450,
        "Chicken Tikka (Large)": 700,
        "Chicken Fajita (Small)": 250,
        "Chicken Fajita (Medium)": 450,
        "Chicken Fajita (Large)": 700,
        "Chicken Afghani (Small)": 250,
        "Chicken Afghani (Medium)": 450,
        "Chicken Afghani (Large)": 700,
        "Cheese Lover (Small)": 250,
        "Cheese Lover (Medium)": 450,
        "Cheese Lover (Large)": 700,
        "Veg Lover (Small)": 250,
        "Veg Lover (Medium)": 450,
        "Veg Lover (Large)": 700,
        "Chicken Malai Boti (Small)": 250,
        "Chicken Malai Boti (Medium)": 450,
        "Chicken Malai Boti (Large)": 700,
        "Chicken Pizza Pasta (Small)": 300,
        "Chicken Pizza Pasta (Medium)": 500,
        "Chicken Pizza Pasta (Large)": 850,
        "Chicken Creamy (Small)": 300,
        "Chicken Creamy (Medium)": 500,
        "Chicken Creamy (Large)": 850,
        "Chicken Supreme Pizza (Small)": 300,
        "Chicken Supreme Pizza (Medium)": 500,
        "Chicken Supreme Pizza (Large)": 850,
        "Special 2 in 1 (Small)": 300,
        "Special 2 in 1 (Medium)": 500,
        "Special 2 in 1 (Large)": 850,
        "Special Kababish Pizza (Small)": 300,
        "Special Kababish Pizza (Medium)": 500,
        "Special Kababish Pizza (Large)": 850,
        "Special 4 in 1 Pizza (Small)": 300,
        "Special 4 in 1 Pizza (Medium)": 500,
        "Special 4 in 1 Pizza (Large)": 850,
        "Kababish 2 in 1 (Small)": 300,
        "Kababish 2 in 1 (Medium)": 500,
        "Kababish 2 in 1 (Large)": 850,
        "Kababish 4 in 1 (Small)": 300,
        "Kababish 4 in 1 (Medium)": 500,
        "Kababish 4 in 1 (Large)": 850,
        "Peri Peri Pizza (Small)": 300,
        "Peri Peri Pizza (Medium)": 500,
        "Peri Peri Pizza (Large)": 850,
    };

    const newName = selectedFlavor && selectedSize ? `${selectedFlavor} ${selectedSize}` : name;
    const conPrice = category.includes("Pizza") && newName in pizzaOptions ? pizzaOptions[newName] : price;

    const handleAddItem = () => {
        const quantity = +quantityRef.current.value;
        if (category.includes("Pizza")) {
            if (!selectedSize || !selectedFlavor) {
                toast.error("Please select both size and flavor for pizza.", {
                    duration: 3000,
                });
                return;
            }
            dispatch(
                orderActions.addItem({
                    name: newName,
                    price: pizzaOptions[newName],
                    quantity,
                    category,
                })
            );
            toast.success(`${quantity} ${newName}(s) added to order!`, {
                duration: 3000,
            });
        } else {
            dispatch(
                orderActions.addItem({
                    name,
                    price: priceState,
                    quantity,
                    category,
                })
            );
            toast.success(`${quantity} ${name}(s) added to order!`, {
                duration: 3000,
            });
        }
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
                <div className="flex flex-col items-start space-y-2 mt-2">
                    <span className="text-2xl font-bold text-white">
                        Rs. {conPrice * (quantityRef.current?.value || 1)}
                    </span>

                    <input
                        type="number"
                        ref={quantityRef}
                        onChange={() =>
                            setPriceState(conPrice * quantityRef.current.value)
                        }
                        min={1}
                        defaultValue={1}
                        className="w-20 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-4 focus:ring-blue-300"
                    />

                    <button
                        onClick={handleAddItem}
                        className="mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
                    >
                        <IoIosAddCircle />
                    </button>

                    {category.includes("Pizza") &&
                        !name.includes("Fries") &&
                        !name.includes("Pasta") && (
                            <div className="flex flex-col space-y-2 mt-2">
                                <select
                                    value={selectedSize}
                                    className="bg-[rgb(255,206,146)] text-black"
                                    onChange={(e) =>
                                        setSelectedSize(e.target.value)
                                    }
                                >
                                    <option value="">Select Size</option>
                                    <option value="(Small)">S</option>
                                    <option value="(Medium)">M</option>
                                    <option value="(Large)">L</option>
                                </select>

                                <select
                                    value={selectedFlavor}
                                    className="bg-[rgb(255,206,146)] text-black"
                                    onChange={(e) =>
                                        setSelectedFlavor(e.target.value)
                                    }
                                >
                                    <option value="">Select Flavor</option>
                                    <option value="Chicken Tikka">Tikka</option>
                                    <option value="Chicken Fajita">Fajita</option>
                                    <option value="Chicken Afghani">Afghani</option>
                                    <option value="Cheese Lover">Cheese</option>
                                    <option value="Veg Lover">Veg</option>
                                    <option value="Chicken Malai Boti">Malai</option>
                                    <option value="Chicken Creamy">Creamy</option>
                                    <option value="Chicken Supreme Pizza">Supreme</option>
                                    <option value="Special 2 in 1">2 in 1</option>
                                    <option value="Special Kababish Pizza">Kababish</option>
                                    <option value="Special 4 in 1 Pizza">4 in 1</option>
                                    <option value="Kababish 2 in 1">Kababish 2in1</option>
                                    <option value="Kababish 4 in 1">Kababish 4in1</option>
                                    <option value="Peri Peri Pizza">Peri Peri</option>
                                </select>
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
}

export default Product;