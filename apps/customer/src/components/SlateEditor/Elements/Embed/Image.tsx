import React from 'react';
import {
  useSelected,
  useFocused,
  useEditor,
  ReactEditor,
  useSlateStatic,
} from 'slate-react';
import { Transforms } from 'slate';
import useResize from '../../utils/customHooks/useResize.ts';
import { Scale3D } from 'lucide-react';

const Image = ({ attributes, element, children }) => {
  const { url, alt, width, height } = element;
  const selected = useSelected();
  const focused = useFocused();
  const [size, onMouseDown] = useResize(width, height);
  const editor = useSlateStatic();

  // Persist width and height when size changes
  React.useEffect(() => {
    if (true) {
      const path = ReactEditor.findPath(editor, element);
      console.log('nodes path', path);
      Transforms.setNodes(
        editor,
        { width: size.width, height: size.height },
        { at: path }
      );
    }
  }, [size]);

  return (
    <div
      {...attributes}
      className=" w-full flex justify-center items-center"
      style={{
        display: 'flex',
        boxShadow: selected && focused && '0 0 3px 3px lightgray',
      }}
      {...element.attr}
    >
      <div
        className="relative"
        contentEditable={false}
        style={{
          maxWidth: `${size.width}px`,
          maxHeight: `${size.height}px`,
          // overflow: 'hidden',
        }}
      >
        <img
          style={{
            width: '100%',
            height: '100%',
          }}
          alt={alt}
          src={url}
        />

        {true && (
          <button
            className="absolute right-0 bottom-0 p-2 "
            onClick={(e) => e.preventDefault()}
            onMouseDown={onMouseDown}
            style={{
              width: '15px',
              height: '15px',
              opacity: 1,
              background: 'transparent',
            }}
          >
            <Scale3D className="!text-white bg-blue-500 rounded-sm" />
          </button>
        )}
      </div>
      {children}
    </div>
  );
};

export default Image;
