import { useFavourites } from "../context/FavouriteContext";
import { HeartOff } from "lucide-react";
import { Link } from "react-router-dom";

export default function Favourites() {
  const { favourites, removeFromFavourites } = useFavourites();

  if (!favourites || favourites.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">No Favourites Yet ❤️</h2>
        <Link
          to="/products"
          className="bg-red-400 text-white px-6 py-2 rounded hover:bg-red-500"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">Your Favourites</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favourites.map((product) => {
          const productId = product._id || product.sku || product.id;
          const productImage = Array.isArray(product.images)
            ? product.images[0]
            : product.images;

          return (
            <div
              key={productId}
              className=" group rounded-2xl shadow:md
               bg-white hover:shadow-2xl hover:scale-103 transition-all duration-300"
            >
              <img
                src={productImage || "/placeholder.png"}
                alt={product.name || product.title}
                className="w-fit h-fit object-cover rounded-t-2xl
                 group-hover:scale-110 transition-all duration-500"
              />
              <div className=" p-3 mt-4 flex-1">
                <h3 className="font-semibold text-lg">
                  {product.name || product.title}
                </h3>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2 mb-2">
                  {product.description || "No description available"}
                </p>
                <div className='text-gray text-xm font-bold flex items-center justify-between'> 

                    {product.price && (
                    <p className="mt-2 font-bold">
                        {product.currency ?? ""} {product.price}
                    </p>
                    )}

                    <button
                        onClick={() => removeFromFavourites(productId)}
                        className=" group/btn bg-red-400 hover:bg-red-500 text-white px-3 py-2 rounded-lg
                        hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex
                        items-center space-x-2 cursor-pointer font-medium text-xs"
                    >
                    <HeartOff size={18} className="mr-2" />
                    Remove
                    </button>
                </div>
              </div>
             
            </div>
          );
        })}
      </div>
    </div>
  );
}
