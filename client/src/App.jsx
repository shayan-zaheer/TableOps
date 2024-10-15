import { Outlet } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { Toaster } from 'react-hot-toast';

function App() {
    return (
        <div className="flex flex-col bg-gray-800 min-h-screen">
            <Header />
            <div className="flex-1">
            <Toaster
                position="bottom-right" // You can change the 
                toastOptions={{
                    style: {
                        background: '#333', // Dark background
                        color: '#fff', // White text
                    }
                }}
            />
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}

export default App;
