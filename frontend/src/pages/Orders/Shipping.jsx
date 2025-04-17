import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps";
import { FaMapMarkerAlt, FaCreditCard } from "react-icons/fa";

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || "");
  const [country, setCountry] = useState(shippingAddress.country || "");
  const [firstName, setFirstName] = useState(userInfo?.username || shippingAddress.firstName || "");
  const [lastName, setLastName] = useState(shippingAddress.lastName || "");
  const [email, setEmail] = useState(userInfo?.email || shippingAddress.email || "");
  const [phone, setPhone] = useState(shippingAddress.phone || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ 
      address, 
      city, 
      postalCode, 
      country,
      firstName,
      lastName,
      email,
      phone
    }));
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-8xl mx-auto px-4 py-16">
        <div className="mb-5">
          <ProgressSteps step1 step2 />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
          {/* Left Column - Shipping Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-[#efe9e0] rounded-xl flex items-center justify-center">
                  <FaMapMarkerAlt className="w-6 h-6 text-[#5b3f15]" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">Shipping Information</h1>
                  <p className="mt-1 text-gray-500">Please provide your delivery details</p>
                </div>
              </div>

              <form onSubmit={submitHandler} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-1">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
                      placeholder="Enter your first name"
                      value={firstName}
                      required
                      onChange={(e) => setFirstName(e.target.value)}
                      readOnly={!!userInfo?.username}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
                      placeholder="Enter your email"
                      value={email}
                      required
                      onChange={(e) => setEmail(e.target.value)}
                      readOnly={!!userInfo?.email}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
                      placeholder="Enter your phone number"
                      value={phone}
                      required
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
                    placeholder="Enter your complete address"
                    value={address}
                    required
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
                      placeholder="Enter your city"
                      value={city}
                      required
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
                      placeholder="Enter postal code"
                      value={postalCode}
                      required
                      onChange={(e) => setPostalCode(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
                    placeholder="Enter your country"
                    value={country}
                    required
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Payment Method */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-[#efe9e0] rounded-xl flex items-center justify-center">
                  <FaCreditCard className="w-6 h-6 text-[#5b3f15]" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Payment Method</h2>
                  <p className="mt-1 text-gray-500">Choose your preferred payment option</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-6">
                  <label className="flex items-center gap-4 cursor-pointer group">
                    <input
                      type="radio"
                      className="w-5 h-5 text-[#5b3f15] focus:ring-[#efe9e0] border-gray-300"
                      name="paymentMethod"
                      value="PayPal"
                      checked={paymentMethod === "PayPal"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div>
                      <span className="text-gray-900 font-medium">PayPal or Credit Card</span>
                      <p className="text-sm text-gray-500">Secure payment through PayPal</p>
                    </div>
                  </label>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <label className="flex items-center gap-4 cursor-pointer group">
                    <input
                      type="radio"
                      className="w-5 h-5 text-[#5b3f15] focus:ring-[#efe9e0] border-gray-300"
                      name="paymentMethod"
                      value="VNPay"
                      checked={paymentMethod === "VNPay"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div>
                      <span className="text-gray-900 font-medium">VNPay</span>
                      <p className="text-sm text-gray-500">Pay with VNPay</p>
                    </div>
                  </label>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <label className="flex items-center gap-4 cursor-pointer group">
                    <input
                      type="radio"
                      className="w-5 h-5 text-[#5b3f15] focus:ring-[#efe9e0] border-gray-300"
                      name="paymentMethod"
                      value="Cash on Delivery"
                      checked={paymentMethod === "Cash on Delivery"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div>
                      <span className="text-gray-900 font-medium">Cash on Delivery</span>
                      <p className="text-sm text-gray-500">Pay when you receive the order</p>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                onClick={submitHandler}
                className="w-[60%] mt-6 py-3 px-4 rounded-lg font-semibold bg-black text-white border border-transparent hover:bg-white hover:text-black hover:border-black transition-colors duration-300 block mx-auto"
              >
                Continue to Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;