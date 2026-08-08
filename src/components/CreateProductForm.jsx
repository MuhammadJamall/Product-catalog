import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "../store/productsSlice";
import { fetchCategories } from "../store/categoriesSlice";
import { Link } from 'react-router-dom';
export default function CreateProductForm() {
    const dispatch = useDispatch();
    const { createStatus } = useSelector((state) => state.products);
    const { items: categories, status: categoryStatus } = useSelector(
        (state) => state.categories
    );

    useEffect(() => {
        if (categoryStatus === "idle") {
            dispatch(fetchCategories());
        }
    }, [categoryStatus, dispatch]);

    const [form, setForm] = useState({
        name: "",
        price: "",
        category: "",
        in_stock: true,
    });

    const [errors, setErrors] = useState({});

    // Handle input change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const validate = () => {
        const newErrors = {};

        if (!form.name) {
            newErrors.name = "Name is required";
        } else if (form.name.length < 2 || form.name.length > 150) {
            newErrors.name = "Name must be 2–150 characters";
        } else if (form.name.toLowerCase() === "test") {
            newErrors.name = "Name cannot be 'test'";
        }

        if (!form.price) {
            newErrors.price = "Price is required";
        } else if (Number(form.price) <= 0) {
            newErrors.price = "Price must be greater than 0";
        }

        if (!form.category) {
            newErrors.category = "Category is required";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        const payload = {
            name: form.name,
            price: Number(form.price),
            category_id: Number(form.category),
        };

        const resultAction = await dispatch(createProduct(payload));

        if (createProduct.rejected.match(resultAction)) {
            const serverErrors = resultAction.payload;

            if (serverErrors?.detail) {
                const formattedErrors = {};

                serverErrors.detail.forEach((err) => {
                    const field = err.loc[1];
                    formattedErrors[field] = err.msg;
                });

                setErrors(formattedErrors);
            }
        }

        if (createProduct.fulfilled.match(resultAction)) {
            setForm({
                name: "",
                price: "",
                category: "",
                in_stock: true,
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create Product</h2>

            <div>
                <label>Name</label>
                <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                />
                {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
            </div>

            <div>
                <label>Price</label>
                <input
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                />
                {errors.price && <p style={{ color: "red" }}>{errors.price}</p>}
            </div>

            <div>
                <label>Category</label>
                <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                >
                    <option value="">
                        {categoryStatus === "loading"
                            ? "Loading categories..."
                            : "Select category"}
                    </option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
                {errors.category && (
                    <p style={{ color: "red" }}>{errors.category}</p>
                )}
            </div>

            <div>
                <label>
                    <input
                        type="checkbox"
                        name="in_stock"
                        checked={form.in_stock}
                        onChange={handleChange}
                    />
                    In Stock
                </label>
            </div>

            <button type="submit" disabled={createStatus === "loading"}>
                {createStatus === "loading" ? "Saving..." : "Create Product"}
            </button>
            
        </form>
    );
}