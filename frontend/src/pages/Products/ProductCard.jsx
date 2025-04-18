import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import { formatPrice } from "../../Utils/cartUtils";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully", { autoClose: 1500 });
  };

  return (
    <div className="max-w-[280px] bg-white object-cover transition-transform duration-300 hover:scale-105">
      {/* Image Section */}
      <div className="relative">
        <Link to={`/product/${p._id}`}>
          <img
            className="w-full h-full object-cover"
            src={p.image}
            alt={p.name}
          />
        </Link>
      </div>

      {/* Product Name & Price */}
      <div className="p-2 text-left">
        <h5 className="text-xl uppercase font-medium text-gray-900">{p?.name}</h5>
        <p className="text-md text-gray-800">
          {formatPrice(p.price)}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
