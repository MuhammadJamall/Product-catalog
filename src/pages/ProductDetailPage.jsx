import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchProductById,
    updateProduct,
    deleteProduct,
} from "../store/productsSlice";
import { fetchCategories } from "../store/categoriesSlice";
import { selectRole } from "../store/authSlice";

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const role = useSelector(selectRole);

    const { selectedProduct, status } = useSelector(
        (state) => state.products
    );

    const { items: categories } = useSelector(
        (state) => state.categories
    );

    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        category_id: "",
        description: "",
    });

    useEffect(() => {
        dispatch(fetchProductById(id));
        dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        if (selectedProduct) {
            setFormData({
                name: selectedProduct.name || "",
                price: selectedProduct.price ?? "",
                category:
                    selectedProduct.category && typeof selectedProduct.category === "object"
                        ? selectedProduct.category.id
                        : selectedProduct.category || "",
                description:
                    selectedProduct.description && typeof selectedProduct.description === "object"
                        ? JSON.stringify(selectedProduct.description)
                        : selectedProduct.description || "",
            });
        }
    }, [selectedProduct]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        const fixedData = {
            ...formData,
            price: Number(formData.price),
            category_id: formData.category === "" ? null : Number(formData.category),
        };

        dispatch(updateProduct({ id, ...fixedData }))
            .unwrap()
            .then(() => {
                navigate("/");
            })
            .catch((err) => {
                console.log("Error:", err);
                alert("Update failed");
            });
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            dispatch(deleteProduct(id))
                .unwrap()
                .then(() => {
                    alert('Product deleted successfully!');
                    navigate('/');
                })
                .catch((err) => {
                    console.error('Delete failed:', err);
                    alert(`Delete failed: ${err || 'Unknown error'}`);
                });
        }
    };

    if (status === "loading") return <p>Loading...</p>;
    if (!selectedProduct) return <p>No product found</p>;

    return (
        <div className="product-detail">
            <h2>Product Detail</h2>

            {!isEditing ? (
                /* VIEW MODE */
                <div className="view-mode">
                    <p><b>Name:</b> {selectedProduct.name}</p>
                    <p><b>Price:</b> ${selectedProduct.price}</p>
                    <p><b>Category:</b> {
                        selectedProduct.category && typeof selectedProduct.category === "object"
                            ? selectedProduct.category.name
                            : selectedProduct.category
                    }</p>
                    <p><b>Description:</b> {
                        typeof selectedProduct.description === "object"
                            ? JSON.stringify(selectedProduct.description)
                            : selectedProduct.description
                    }</p>

                    <div className="action-buttons">
                        {/* EDIT BUTTON - Manager & Admin only */}
                        {(role === 'manager' || role === 'admin') && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="btn-edit"
                            >
                                ✏️ EDIT
                            </button>
                        )}

                        {/* DELETE BUTTON - Admin ONLY */}
                        {role === 'admin' && (
                            <button
                                onClick={handleDelete}
                                className="btn-delete"
                            >
                                🗑️ DELETE
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                /* EDIT MODE - Manager & Admin only */
                (role === 'manager' || role === 'admin') ? (
                    <form onSubmit={handleUpdate} className="edit-form">
                        <div className="form-group">
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Product Name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="Price"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Description"
                                rows="4"
                            />
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-save">
                                💾 Update
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="btn-cancel"
                            >
                                ❌ Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    /* NO PERMISSION MESSAGE */
                    <div className="no-permission">
                        <p>⚠️ You do not have permission to edit this product.</p>
                        <p>Only <strong>Managers</strong> and <strong>Admins</strong> can edit products.</p>
                        {(role === 'user') && (
                            <p>Your current role: <span className="badge-user">USER</span></p>
                        )}
                    </div>
                )
            )}
        </div>
    );
};

export default ProductDetailPage;