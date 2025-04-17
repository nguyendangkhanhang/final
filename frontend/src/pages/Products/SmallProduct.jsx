import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";
import { formatPrice } from "../../Utils/cartUtils";
const SmallProduct = ({ product }) => {
    return(
        <div className="w-[20rem] ml-[2rem] p-3 hover:scale-105 transition-transform duration-300">
            <div className="relative">
                <img
                src={product.image}
                alt={product.name}
                className="h-auto rounded"
                />

                <div className="p-4">
                    <Link to={`/product/${product._id}`}>
                        <h5 className="text-xl font-medium text-gray-900">{product?.name}</h5>
                        <p className="text-md text-gray-800">
                        {formatPrice(product.price)}
                        </p>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default SmallProduct;