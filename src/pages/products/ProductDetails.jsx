import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import '../products/productDetails.css';
import Description from './Description/Description';
import Specification from './specification/Specification';

import toast from 'react-hot-toast';
import { useCartGlobally } from '../../context/CartContext';

const ProductDetails = () => {
    const { id } = useParams();
    const {addToCart} = useCartGlobally();
    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState('');
    const [activeThumbnail, setActiveThumbnail] = useState('');
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [activeTab, setActiveTab] = useState('description');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // const response = await axios.get(`http://localhost:4000/api/v1/product/getSingleProduct/${id}`);
                const response = await axios.get(`${import.meta.env.VITE_REACT_APP_URL}/api/v1/product/getSingleProduct/${id}`);

                const fetchedProduct = response.data.singleProduct;
                setProduct(fetchedProduct);

                if (fetchedProduct.images && fetchedProduct.images.length > 0) {
                    setMainImage(fetchedProduct.images[0]);
                    setActiveThumbnail(fetchedProduct.images[0]);
                }

                // const relatedResponse = await axios.get(`http://localhost:4000/api/v1/product/relatedProducts/${fetchedProduct.category}`);
                const relatedResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_URL}/api/v1/product/relatedProducts/${fetchedProduct.category}`);
                const fetchedRelatedProducts = relatedResponse.data.relatedProducts;
                setRelatedProducts(fetchedRelatedProducts);
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        };
        fetchProduct();
    }, [id]);

    const handleThumbnailClick = (src) => {
        setMainImage(src);
        setActiveThumbnail(src);
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleAddToCart = () => {
        addToCart(product);
        toast.success('Item added to cart');
    };

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="productDetailsContainer">
                <div className="container">
                    <div className="productDetails">
                        <div className='productDetailsLeft'>
                            <img className='productDetailsMainImg' src={mainImage} alt={product.name} />
                            <div className="childimg">
                                {product.images.map((src, id) => (
                                    <img key={id} className={src === activeThumbnail ? 'active' : ''} src={src} alt={product.name} onClick={() => handleThumbnailClick(src)}/>
                                ))}
                            </div>
                        </div>
                        <div className="productDetailsDataRight">
                            <h4 className='productHeading'>{product.name}</h4>
                            <p>{product.description}</p>
                            <div className="priceContainer">
                                <h4 className='salePrice'>Rs {product.salePrice}</h4>
                                <h4 className='realPrice'>Rs {product.realPrice}</h4>
                            </div>
                            <h4 className='productBrand'>{product.brand}</h4>
                            <p className='productDiscount'>{product.discount}% off</p>
                            <button className='cartBtn' onClick={handleAddToCart}>Add to Cart</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="tabContainer">
                <div className="container">
                    <button className={activeTab === 'description' ? 'active' : ''} onClick={() => handleTabClick('description')}>Description</button>
                    <button className={activeTab === 'specification' ? 'active' : ''} onClick={() => handleTabClick('specification')}>Specification</button>
                </div>
            </div>

            <div className="container">
                {activeTab === 'description' && <Description product={product} />}
                {activeTab === 'specification' && <Specification product={product} />}
            </div>

            <div className="relatedProductsContainer">
                <div className="container">
                    <h3>Related Products</h3>
                    <div className="allProducts">
                        {relatedProducts.length > 0 ? (
                            relatedProducts.map(relatedProduct => (
                                <Link className='link' to={`/products-details/${relatedProduct._id}`} key={relatedProduct._id}>
                                    <div className='productChildContainer'>
                                        <img className='productImg' src={relatedProduct.images[0]} alt={relatedProduct.name} />
                                        <p className='productName'>{relatedProduct.name}</p>
                                        <div className="priceContainer">
                                            <h4 className='salePrice'>Rs {relatedProduct.salePrice}</h4>
                                            <h4 className='realPrice'>Rs {relatedProduct.realPrice}</h4>
                                        </div>
                                        <h4 className='productBrand'>{relatedProduct.brand}</h4>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <h2>No related products found.</h2>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetails;
