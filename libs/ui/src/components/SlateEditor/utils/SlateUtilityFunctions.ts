import { Editor, Transforms, Element as SlateElement } from 'slate';
import { useSlateStatic } from 'slate-react';

import Image from '../Elements/Embed/Image';
import Video from '../Elements/Embed/Video';

export const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
  });

  return !!match;
};
