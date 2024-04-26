import React, { useEffect } from 'react';
import {
  useSelected,
  useFocused,
  ReactEditor,
  useSlateStatic,
} from 'slate-react';

import useResize from '../../utils/customHooks/useResize.js';
import { Scale3D } from 'lucide-react';
import { Transforms } from 'slate';
// import "./Video.css";

const Video = ({ attributes, element, children }) => {
  const { url, alt, width, height } = element;
  const [size, onMouseDown, resizing] = useResize(width, height);
  const selected = useSelected();
  const focused = useFocused();

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
        {
          // The iframe reloads on each re-render and hence it stutters and the document doesn't detect mouse-up event leading to unwanted behaviour
          // So during resize replace the iframe with a simple div
          resizing ? (
            <div
              style={{
                width: '100%',
                height: '100%',
                border: '2px dashed black',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              video player icon
            </div>
          ) : (
            <iframe src={url} frameBorder="0" title={alt} />
          )
        }
        {true && (
          <button
            onClick={(e) => {
              e.preventDefault();
            }}
            onMouseDown={onMouseDown}
            style={{
              width: '15px',
              height: '15px',
              opacity: 1,
              background: 'transparent',
            }}
          >
            <Scale3D className="text-red-500" />
          </button>
        )}
      </div>
      {children}
    </div>
  );
};
export default Video;
