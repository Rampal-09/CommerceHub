import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, PackagePlus, LayoutDashboard } from "lucide-react";
import toast from "react-hot-toast";
import ProductForm from "../../components/product/ProductForm";
import { createProduct } from "../../services/productService";

export const AddProduct = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      const res = await createProduct(formData);
      toast.success(res.message || "Product created successfully.");
      navigate("/admin/products");
    } catch (err) {
      console.error("Create product error:", err);
      const msg =
        err.response?.data?.message || err.message || "Failed to create product.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-8 font-sans text-slate-800">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              <Link
                to="/dashboard"
                className="hover:text-indigo-600 flex items-center gap-1 transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
              <span>/</span>
              <Link to="/admin/products" className="hover:text-indigo-600 transition-colors">
                Products
              </Link>
              <span>/</span>
              <span className="text-indigo-600">New</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <PackagePlus className="w-7 h-7 text-indigo-600" />
              Add New Product
            </h1>
          </div>

          <button
            onClick={() => navigate("/admin/products")}
            className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products</span>
          </button>
        </div>

        {/* Product Form */}
        <ProductForm
          onSubmit={handleSubmit}
          submitting={submitting}
          isEditing={false}
        />
      </div>
    </div>
  );
};

export default AddProduct;
