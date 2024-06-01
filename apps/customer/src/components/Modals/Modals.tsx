import React from 'react';

import CreateStoreModal from './CreateStore/CreateStore';
import UpdateCategory from './UpdateCategory/UpdateCategory';
import ProductSelection from './ProductSelection/ProductSelection';
import UpdateOrder from './UpdateOrders/UpdateOrders';

const Modals: React.FC = () => {
  return (
    <div>
      <CreateStoreModal />
      <UpdateCategory />
      <ProductSelection />
      <UpdateOrder />
    </div>
  );
};

export default Modals;
