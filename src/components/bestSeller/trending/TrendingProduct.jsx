import '../trending/trendingProduct.css'



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../trending/trendingProduct.css';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const TrendingProduct = () => {
  const [products, setProducts] = useState([]);

  const getAllProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_URL}/api/v1/product/getAllProduct`);
      if (response.data.success) {
        const allProducts = response.data.getAllProducts;
        setProducts(allProducts);
        // Extract unique categories
        const uniqueCategories = [...new Set(allProducts.map(product => product.category.categoryName))];
        // setCategories(uniqueCategories); // Ensure to have the categories state if you need it
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Something went wrong');
      }
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <div className="trendingProduct">
      <div className="container">
        <div className="trendingProductContainer">
          <h2 className='trendingHeading homeHeading'>Trending Products</h2>
          <div className="trendingCard">
            {products.map((tProduct) => (
              <Link className='link' key={tProduct._id} to={`/products-details/${tProduct.slug}`}>
              <div key={tProduct.id} className="cardContainer">
                <img className='trendingImg' src={tProduct.images[0]} alt={tProduct.name} />
                <div className='tredingCardDetails'>
                  <p>{tProduct?.category?.categoryName}</p>
                  <h4 className='homePage_product_title'>{tProduct.name.slice(0,25)}</h4>
                  <div className="product-rating"> <span>⭐⭐⭐⭐⭐</span></div>
                  <div className='trendingPrice'>
                    <p>Rs {tProduct.salePrice}</p>
                    {tProduct.realPrice && <p className="original-price">Rs {tProduct.realPrice}</p>}
                  </div>
                </div>
              </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingProduct;
