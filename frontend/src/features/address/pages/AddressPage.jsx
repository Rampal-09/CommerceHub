import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Plus, ChevronRight, ArrowLeft } from "lucide-react";
import { useAddress } from "../hooks/useAddress";
import AddressList from "../components/AddressList";
import AddressForm from "../components/AddressForm";
import EmptyAddress from "../components/EmptyAddress";

/**
 * Skeleton Loader for Address Page
 */
const AddressSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
    {[1, 2, 3].map((i) => (
      <div key={i} className="h-64 bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4">
        <div className="flex justify-between">
          <div className="w-20 h-6 bg-slate-200 rounded-full"></div>
          <div className="w-16 h-6 bg-slate-200 rounded-full"></div>
        </div>
        <div className="h-5 bg-slate-200 rounded-md w-3/4"></div>
        <div className="h-4 bg-slate-100 rounded-md w-1/2"></div>
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="h-3 bg-slate-100 rounded-md w-full"></div>
          <div className="h-3 bg-slate-100 rounded-md w-5/6"></div>
          <div className="h-3 bg-slate-100 rounded-md w-2/3"></div>
        </div>
      </div>
    ))}
  </div>
);

/**
 * Address Management Page Component
 */
export const AddressPage = () => {
  const {
    addresses,
    selectedAddress,
    loading,
    actionLoading,
    addAddress,
    editAddress,
    setDefault,
    removeAddress,
    selectAddress,
  } = useAddress();

  const [showFormModal, setShowFormModal] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState(null);

  const handleOpenAddForm = () => {
    setAddressToEdit(null);
    setShowFormModal(true);
  };

  const handleOpenEditForm = (address) => {
    setAddressToEdit(address);
    setShowFormModal(true);
  };

  const handleCloseForm = () => {
    setShowFormModal(false);
    setAddressToEdit(null);
  };

  const handleFormSubmit = async (formData) => {
    let success = false;
    if (addressToEdit) {
      success = await editAddress(addressToEdit._id, formData);
    } else {
      success = await addAddress(formData);
    }

    if (success) {
      handleCloseForm();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 font-sans text-slate-800 pb-16">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden bg-white border-b border-slate-200/80 text-slate-800 py-8 sm:py-10 px-4 sm:px-8">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-indigo-100/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-1/4 w-80 h-80 bg-violet-100/60 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <Link to="/products" className="hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800 font-bold">My Addresses</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-display flex items-center gap-3">
                <MapPin className="w-8 h-8 text-indigo-600" /> Saved Addresses
              </h1>
              <p className="text-sm text-slate-600 font-medium">
                Manage your delivery locations for fast and secure checkout.
              </p>
            </div>

            {addresses.length > 0 && (
              <button
                type="button"
                onClick={handleOpenAddForm}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold rounded-2xl transition-all shadow-md hover:shadow-lg cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Address</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-6">
        {loading ? (
          <AddressSkeleton />
        ) : addresses.length === 0 ? (
          <EmptyAddress onAddClick={handleOpenAddForm} />
        ) : (
          <AddressList
            addresses={addresses}
            selectedAddressId={selectedAddress?._id}
            onSelect={selectAddress}
            onEdit={handleOpenEditForm}
            onDelete={removeAddress}
            onSetDefault={setDefault}
            isActionLoading={actionLoading}
          />
        )}
      </div>

      {/* Modal Dialog for Add / Edit Address Form */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200 my-8">
            <AddressForm
              initialData={addressToEdit}
              onSubmit={handleFormSubmit}
              onCancel={handleCloseForm}
              isLoading={actionLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressPage;
