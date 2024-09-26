function Counter() {
    return (
            <input placeholder="Enter quantity" type="number" min={1} maxLength={3} onClick={event => console.log(event)}
            className="text-black bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-1 py-2.5 text-center" />
    );
}

export default Counter;
