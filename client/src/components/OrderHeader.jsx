function OrderHeader() {
    return (
        <div className="flex w-full py-3 px-3 border-b border-gray-300 text-white bg-[rgb(218,174,120)]">
            <span className="flex-1 font-semibold">Product Name</span>
            <span className="flex-1 text-center font-semibold">Price</span>
            <span className="flex-1 text-center font-semibold">Quantity</span>
            <span className="flex-1 text-center font-semibold">Total</span>
        </div>
    );
}

export default OrderHeader;
