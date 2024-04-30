/* eslint-disable2 */
// @ts-nocheck33

import { Card, CardContent } from '../../index';
import isHotkey from 'is-hotkey';
import { useCallback, useMemo } from 'react';
import {
  Descendant,
  Editor,
  Element as SlateElement,
  Transforms,
  createEditor,
} from 'slate';
import { withHistory } from 'slate-history';
import { Editable, Slate, useSlate, withReact } from 'slate-react';

import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Quote,
  Underline,
} from 'lucide-react';
import { Button, Toolbar } from './RichTextComponents/Components';
import TableSelector from './Elements/Table/TableSelector';
import withTable from './Plugins/withTable';
import Embed from './Elements/Embed/Embed';
import withEmbeds from './Plugins/withEmbeds';
import Image from './Elements/Embed/Image';
import Video from './Elements/Embed/Video';

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
};

const LIST_TYPES = ['numbered-list', 'bulleted-list'];
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify'];

const RichTextEditor: React.FC<{
  initialVal?: string;
  onValChange?: (data: Descendant[]) => void;
}> = ({ onValChange, initialVal }) => {
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(
    () => withTable(withHistory(withReact(createEditor()))),
    []
  );

  const initVal = initialVal && JSON.parse(initialVal);

  return (
    <Slate
      onValueChange={onValChange}
      editor={editor}
      initialValue={initVal || initialValue}
    >
      <Card className="mt-0 rounded-b-none">
        <CardContent className="p-3">
          <Toolbar>
            <MarkButton format="bold" icon={<Bold size={'17px'} />} />
            <MarkButton format="italic" icon={<Italic size={'17px'} />} />
            <MarkButton format="underline" icon={<Underline size={'17px'} />} />
            <MarkButton format="code" icon={<Code size={'17px'} />} />
            <BlockButton
              format="heading-one"
              icon={<Heading1 size={'17px'} />}
            />
            <BlockButton
              format="heading-two"
              icon={<Heading2 size={'17px'} />}
            />
            <BlockButton
              format={'heading-three'}
              icon={<Heading3 size="17px" />}
            />
            <BlockButton format="block-quote" icon={<Quote size={'17px'} />} />
            <BlockButton
              format="numbered-list"
              icon={<ListOrdered size="17px" />}
            />
            <BlockButton format="bulleted-list" icon={<List size={'17px'} />} />
            <BlockButton format="left" icon={<AlignLeft size="17px" />} />
            <BlockButton format="center" icon={<AlignCenter size="17px" />} />
            <BlockButton format="right" icon={<AlignRight size="17px" />} />
            <BlockButton format="justify" icon={<AlignJustify size="17px" />} />
            <TableSelector key={'element.id'} editor={editor} />
            <Embed key={'element.id2'} format={'image'} editor={editor} />
            <Embed key={'element.id3'} format={'video'} editor={editor} />
          </Toolbar>
        </CardContent>
      </Card>

      <Editable
        // readOnly
        className="p-4  rounded-md rounded-t-none border border-input shadow-sm
        focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[200px]"
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter some rich text…"
        spellCheck
        autoFocus
        onKeyDown={(event) => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event as any)) {
              event.preventDefault();
              const mark = HOTKEYS[hotkey];
              toggleMark(editor, mark);
            }
          }
        }}
      />
    </Slate>
  );
};

export const RichTextRender: React.FC<{
  initialVal?: string;
}> = ({ initialVal }) => {
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(
    () => withEmbeds(withTable(withHistory(withReact(createEditor())))),
    []
  );

  const initVal = initialVal && JSON.parse(initialVal);

  return (
    <Slate editor={editor} initialValue={initVal || initialValue}>
      <Editable
        readOnly
        className="min-h-[200px]"
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter some rich text…"
        spellCheck
        autoFocus
        onKeyDown={(event) => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event as any)) {
              event.preventDefault();
              const mark = HOTKEYS[hotkey];
              toggleMark(editor, mark);
            }
          }
        }}
      />
    </Slate>
  );
};

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
  );
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  });
  let newProperties: Partial<SlateElement>;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    };
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    };
  }
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor, format, blockType = 'type') => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType] === format,
    })
  );

  return !!match;
};

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const Element = (props) => {
  const { attributes, children, element } = props;
  const style = { textAlign: element.align };
  switch (element.type) {
    case 'block-quote':
      return (
        <blockquote
          className="border-l-4 border-gray-500 italic my-4 pl-4"
          style={style}
          {...attributes}
        >
          {children}
        </blockquote>
      );
    case 'bulleted-list':
      return (
        <ul className="list-disc ml-10" style={style} {...attributes}>
          {children}
        </ul>
      );
    case 'heading-one':
      return (
        <h1 className="text-4xl" style={style} {...attributes}>
          {children}
        </h1>
      );
    case 'heading-two':
      return (
        <h2 className="text-3xl " style={style} {...attributes}>
          {children}
        </h2>
      );
    case 'heading-three':
      return (
        <h2 className="text-xl " style={style} {...attributes}>
          {children}
        </h2>
      );
    case 'list-item':
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case 'numbered-list':
      return (
        <ol className="list-decimal ml-10" style={style} {...attributes}>
          {children}
        </ol>
      );
    case 'table':
      return (
        <table className="border-spacing-1 border-gray-700 border-[1px]">
          <tbody {...attributes}>{children}</tbody>
        </table>
      );
    case 'table-row':
      return (
        <tr
          className="min-w-[30px] min-h-2 border-spacing-1  border-gray-700 border-[1px] p-3"
          {...attributes}
        >
          {children}
        </tr>
      );
    case 'table-cell':
      return (
        <td
          className="min-w-[30px] min-h-2 border-spacing-1  border-gray-700 border-[1px] p-3"
          {...element.attr}
          {...attributes}
        >
          {children}
        </td>
      );

    case 'image':
      return <Image {...props} />;
    case 'video':
      return <Video {...props} />;
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const BlockButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <Button
      active={isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
      )}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      {icon}
    </Button>
  );
};

const MarkButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {icon}
    </Button>
  );
};

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: 'Please write here and replace this text. ' }],
  },
];

export { RichTextEditor };
