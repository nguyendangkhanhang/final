import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully", { autoClose: 1500 });
  };

  return (
    <div className="max-w-[280px] bg-white">
      {/* Image Section */}
      <div className="relative">
        <Link to={`/product/${p._id}`}>
          <img
            className="w-full h-full object-cover"
            src={p.image}
            alt={p.name}
          />
        </Link>

        {/* Giỏ hàng ở góc dưới phải của hình ảnh */}
        <button
          className="absolute bottom-2 right-2 bg-black text-white p-2 rounded-full opacity-80 hover:opacity-100 transition"
          onClick={() => addToCartHandler(p, 1)}
        >
          <AiOutlineShoppingCart size={20} />
        </button>
      </div>

      {/* Product Name & Price */}
      <div className="p-2 text-left">
        <h5 className="text-xl font-medium text-gray-900">{p?.name}</h5>
        <p className="text-md text-gray-800">
          {p?.price?.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
