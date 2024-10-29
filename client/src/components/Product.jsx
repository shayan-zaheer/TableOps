// import { useRef, useState } from "react";
// import { useDispatch } from "react-redux";
// import { orderActions } from "../store/orderSlice";
// import toast from "react-hot-toast";
// import { IoIosAddCircle } from "react-icons/io";

// function Product({ name, price, image, onDelete, category = ""}) {
//     const dispatch = useDispatch();
//     const quantityRef = useRef();
//     const conPrice = price;
//     const [priceState, setPriceState] = useState(price);
//     const [selectedSize, setSelectedSize] = useState("");
//     const [selectedFlavor, setSelectedFlavor] = useState("");

//     const handleAddItem = () => {
//         const quantity = +quantityRef.current.value;
//         if (category.includes("Pizza")) {
//             if (!selectedSize || !selectedFlavor) {
//                 toast.error("Please select both size and flavor for pizza.", { duration: 3000 });
//                 return;
//             }
//             const newName = `${selectedFlavor} ${selectedSize}`;
//             dispatch(orderActions.addItem({
//                 name: newName,
//                 price: priceState,
//                 quantity,
//                 category,
//             }));
//             toast.success(`${quantity} ${newName}(s) added to order!`, { duration: 3000 });
//         } else {
//             dispatch(orderActions.addItem({
//                 name,
//                 price: priceState,
//                 quantity,
//                 category,
//             }));
//             toast.success(`${quantity} ${name}(s) added to order!`, { duration: 3000 });
//         }
//     };

//     return (
//         <div className="relative max-w-sm border border-gray-800 rounded-lg shadow bg-[rgb(124,99,67)]">
//             <img
//                 className="p-4 rounded-t-lg object-cover w-full h-48"
//                 src={image}
//                 alt={`${name} image`}
//             />
//             <div className="px-4 pb-4">
//                 <h5 className="text-lg font-semibold tracking-tight text-white">
//                     {name}
//                 </h5>
//                 <div className="flex flex-col items-start space-y-2 mt-2">
//                 {!category.includes("Pizza") && (
//                         <>
//                             <span className="text-2xl font-bold text-white">
//                         Rs. {priceState}
//                     </span>
//                         </>
//                     )}

//                     <input
//                         type="number"
//                         ref={quantityRef}
//                         onChange={() =>
//                             setPriceState(conPrice * quantityRef.current.value)
//                         }
//                         min={1}
//                         defaultValue={1}
//                         className="w-20 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-4 focus:ring-blue-300"
//                     />

//                     <button
//                         onClick={handleAddItem}
//                         className="mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
//                     >
//                         <IoIosAddCircle />
//                     </button>

//                     {category.includes("Pizza") && !name.includes("Fries") && !name.includes("Pasta") && (
//                         <div className="flex flex-col space-y-2 mt-2">
//                             <select
//                                 value={selectedSize}
//                                 className="bg-[rgb(255,206,146)] text-black"
//                                 onChange={(e) => setSelectedSize(e.target.value)}
//                             >
//                                 <option value="">Select Size</option>
//                                 <option value="(Small)">S</option>
//                                 <option value="(Medium)">M</option>
//                                 <option value="(Large)">L</option>
//                             </select>

//                             <select
//                                 value={selectedFlavor}
//                                 className="bg-[rgb(255,206,146)] text-black"
//                                 onChange={(e) => setSelectedFlavor(e.target.value)}
//                             >
//                                 <option value="">Select Flavor</option>
//                                 <option value="Chicken Tikka">Tikka</option>
//                                 <option value="Chicken Fajita">Fajita</option>
//                                 <option value="Chicken Afghani">Afghani</option>
//                                 <option value="Cheese Lover">Cheese</option>
//                                 <option value="Veg Lover">Veg</option>
//                                 <option value="Chicken Malai Boti">Malai</option>
//                                 <option value="Chicken Creamy">Creamy</option>
//                                 <option value="Chicken Supreme Pizza">Supreme</option>
//                                 <option value="Special 2 in 1">2 in 1</option>
//                                 <option value="Special Kababish Pizza">Kababish</option>
//                                 <option value="Special 4 in 1 Pizza">4 in 1</option>
//                                 <option value="Kababish 2 in 1">Kababish 2in1</option>
//                                 <option value="Kababish 4 in 1">Kababish 4in1</option>
//                                 <option value="Peri Peri Pizza">Peri Peri</option>
//                             </select>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Product;

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
