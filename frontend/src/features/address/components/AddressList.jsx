import React from "react";
import AddressCard from "./AddressCard";

/**
 * Responsive Address List Grid Component
 */
export const AddressList = ({
  addresses = [],
  selectedAddressId = null,
  onSelect,
  onEdit,
  onDelete,
  onSetDefault,
  isActionLoading = false,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {addresses.map((address) => (
        <AddressCard
          key={address._id}
          address={address}
          isSelected={selectedAddressId === address._id}
          onSelect={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}
          onSetDefault={onSetDefault}
          isActionLoading={isActionLoading}
        />
      ))}
    </div>
  );
};

export default AddressList;
