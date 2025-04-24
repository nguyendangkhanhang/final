import { Link } from "react-router-dom";
import { formatPrice } from "../../Utils/cartUtils";

const Product = ({ product }) => {
  return (
    <div className="w-[22rem] relative object-cover transition-transform duration-300 hover:scale-105">
      <div className="relative ">
        <img
          src={product.image}
          alt={product.name}
          className="w-[30rem] rounded"
        />
      </div>

      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h2 className="text-2xl uppercase font-semibold text-gray-800">{product.name}</h2>
        </Link>
        <div className="mt-1 text-lg text-black">{formatPrice(product.price)}</div>
      </div>
    </div>
  );
};

export default Product;
