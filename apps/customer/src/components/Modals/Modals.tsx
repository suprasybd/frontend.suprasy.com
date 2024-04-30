import React from 'react';

import CreateStoreModal from './CreateStore/CreateStore';
import UpdateCategory from './UpdateCategory/UpdateCategory';

const Modals: React.FC = () => {
  return (
    <div>
      <CreateStoreModal />
      <UpdateCategory />
    </div>
  );
};

export default Modals;
