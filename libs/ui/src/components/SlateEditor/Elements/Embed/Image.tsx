import React from 'react';
import { useSelected, useFocused } from 'slate-react';

import useResize from '../../utils/customHooks/useResize.ts';

const Image = ({ attributes, element, children }) => {
  const { url, alt } = element;
  const selected = useSelected();
  const focused = useFocused();
  const [size, onMouseDown] = useResize();

  return (
    <div
      {...attributes}
      className="embed"
      style={{
        display: 'flex',
        boxShadow: selected && focused && '0 0 3px 3px lightgray',
      }}
      {...element.attr}
    >
      <div
        contentEditable={false}
        style={{ width: `${size.width}px`, height: `${size.height}px` }}
      >
        <img alt={alt} src={url} />
        {selected && (
          <button
            onMouseDown={onMouseDown}
            style={{
              width: '15px',
              height: '15px',
              opacity: 1,
              background: 'transparent',
            }}
          >
            resize icon
          </button>
        )}
      </div>
      {children}
    </div>
  );
};
export default Image;
