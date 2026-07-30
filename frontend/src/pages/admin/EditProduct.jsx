import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Edit3, LayoutDashboard } from "lucide-react";
import toast from "react-hot-toast";
import ProductForm from "../../components/product/ProductForm";
import Loader from "../../components/common/Loader";
import { getProduct, updateProduct } from "../../services/productService";

export const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Load product details by ID
  const fetchProductDetails = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getProduct(id);
      const data = res.data || res.product || res;
      setProductData(data);
    } catch (err) {
      console.error("Fetch product details error:", err);
      const msg =
        err.response?.data?.message || err.message || "Failed to load product details.";
      toast.error(msg);
      navigate("/admin/products");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      const res = await updateProduct(id, formData);
      toast.success(res.message || "Product updated successfully.");
      navigate("/admin/products");
    } catch (err) {
      console.error("Update product error:", err);
      const msg =
        err.response?.data?.message || err.message || "Failed to update product.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 p-8 flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md">
          <Loader message="Preloading product details..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-8 font-sans text-slate-800">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header & Breadcrumb */}
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
              <span className="text-indigo-600">Edit</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <Edit3 className="w-7 h-7 text-amber-500" />
              Edit Product: {productData?.title}
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

        {/* Product Form in Edit Mode */}
        {productData && (
          <ProductForm
            initialData={productData}
            onSubmit={handleSubmit}
            submitting={submitting}
            isEditing={true}
          />
        )}
      </div>
    </div>
  );
};

export default EditProduct;
