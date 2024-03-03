import React from 'react';

const Table = ({ attributes, children, element }) => {
  return (
    <table
      border={'2'}
      className="border-spacing-1 border border-gray-700 border-[1px]"
    >
      <tbody {...attributes}>{children}</tbody>
    </table>
  );
};

export default Table;
