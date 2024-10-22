// import { useDispatch, useSelector } from 'react-redux';
// import { setDeals, removeProductFromDeal } from '../store/dealSlice';
// import axios from "axios";
// import Deal from '../components/Deal';
// import { useEffect } from 'react';

// const DealsPage = () => {
//     const dispatch = useDispatch();
//     const deals = useSelector(store => store.deal.deals);

//     const deleteProductHandler = (productId, dealId) => {
//         dispatch(removeProductFromDeal({ productId, dealId }));

//         axios.delete(`http://localhost:8000/api/products/${productId}`)
//             .then(response => {
//                 console.log("Product deleted:", response.data);
//             })
//             .catch(error => {
//                 console.error("Error deleting product:", error);
//             });
//     };

//     useEffect(() => {
//         const fetchDeals = async () => {
//             try {
//                 const response = await axios.get('http://localhost:8000/api/deals/with-products');
//                 console.log("Fetched deals:", response.data);
//                 dispatch(setDeals(response.data));
//             } catch (error) {
//                 console.error("Error fetching deals:", error);
//             }
//         };

//         fetchDeals();
//     }, [dispatch]);

//     console.log("dealsss", deals);

//     return (
//         <div className="flex flex-col items-center py-8 h-100 bg-[rgb(255,206,146)]">
//             {deals && deals.length > 0 ? (
//                 <div key={deals[0]._id} className="w-full max-w-4xl mb-10">
//                     <h2 className="text-2xl font-bold mb-4">{deals[0].name}</h2>
//                     <div className="flex flex-row justify-center flex-wrap gap-6">
//                         {deals.map((deal) => (
//                             <Deal
//                                 key={deal._id}
//                                 name={deal.name}
//                                 price={deal.price}
//                                 image={deal.image}
//                                 dealItems={deal.products}
//                             />
//                         ))}
//                     </div>
//                 </div>
//             ) : (
//                 <p className="text-center text-gray-700">No deals or products available.</p>
//             )}
//         </div>
//     );
// };

// export default DealsPage;
