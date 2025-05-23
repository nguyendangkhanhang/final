import { Link } from "react-router-dom";
import { formatPrice } from "../../Utils/cartUtils";

const ProductCard = ({ p }) => {

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
