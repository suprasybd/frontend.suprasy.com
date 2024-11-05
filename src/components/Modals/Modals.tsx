import React from 'react';

import CreateStoreModal from './CreateStore/CreateStore';
import UpdateCategory from './UpdateCategory/UpdateCategory';
import ProductSelection from './ProductSelection/ProductSelection';
import UpdateOrder from './UpdateOrders/UpdateOrders';
import RenewStore from './RenewStore/RenewStore';
import CreateSubCategory from './CreateSubCategory/CreateSubCategory';

const Modals: React.FC = () => {
  return (
    <div>
      <CreateStoreModal />
      <RenewStore />
      <UpdateCategory />
      <CreateSubCategory />
      <ProductSelection />
      <UpdateOrder />
    </div>
  );
};

export default Modals;
