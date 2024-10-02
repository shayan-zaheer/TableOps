import { useSelector } from "react-redux";
import Order from "../components/Order";
import OrderHeader from "../components/OrderHeader";
import OrderFooter from "../components/OrderFooter";

// bg-[rgb(151,106,51)]

function OrderPage() {
    const orderList = useSelector((store) => store.order);

    console.log(orderList);
    if (!orderList || orderList.length === 0) {
        return <div className="flex flex-col h-screen items-center justify-center bg-[rgb(255,206,146)]">
            <h1 className="font-bold text-2xl drop-shadow-xl text-white">No items added yet!</h1>
            </div>;
    }

    return (
        <>
            <div className="bg-[rgb(109,80,44)]">
                <OrderHeader />
                {orderList.map(({ name, price, quantity }, index) => {
                    return (
                        <Order
                            key={index}
                            name={name}
                            price={price}
                            quantity={quantity}
                        />
                    );
                })}
            </div>
            <OrderFooter />
        </>
    );
}

export default OrderPage;