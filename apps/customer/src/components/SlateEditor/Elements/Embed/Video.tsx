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
import ReactPlayer from 'react-player';
// import "./Video.css";

const Video = ({ attributes, element, children }) => {
  const { url, alt, width, height } = element;
  const [size, onMouseDown, resizing] = useResize(width, height);
  const selected = useSelected();
  const focused = useFocused();

  const editor = useSlateStatic();

  // Persist width and height when size changes
  React.useEffect(() => {
    if (size) {
      const path = ReactEditor.findPath(editor, element);
      // console.log('nodes path', path);
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
      className="embed !w-full h-full"
      style={{
        display: 'flex',
        justifyContent: 'center',
        boxShadow: selected && focused && '0 0 3px 3px lightgray',
        height: `${size.height}px`,
        maxWidth: `${size.width}px`,
      }}
      {...element.attr}
    >
      <div
        contentEditable={false}
        style={{
          maxWidth: `${size.width}px`,
          maxHeight: `${size.height}px`,
          width: '100%',
          height: '100%',
        }}
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
            <ReactPlayer width={'100%'} height={'100%'} url={url} />
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
