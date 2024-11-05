import React, { useRef, useState } from 'react';

import { isBlockActive } from '../../utils/SlateUtilityFunctions';
import usePopup from '../../utils/customHooks/usePopup';
import { insertEmbed } from '../../utils/embed.js';
import { Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import MediaModal from '@/components/Modals/MediaModal/MediaModal';
import './Embed.css';
import { Clapperboard, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Embed = ({ editor, format }) => {
  const urlInputRef = useRef();
  const [showInput, setShowInput] = usePopup(urlInputRef);
  const [formDataGlobal, setFormData] = useState<{ url: string; alt: string }>({
    url: '',
    alt: '',
  });
  const [selection, setSelection] = useState();
  const handleButtonClick = (e) => {
    e.preventDefault();
    setSelection(editor.selection);
    selection && ReactEditor.focus(editor);

    setShowInput((prev) => !prev);
  };
  const handleFormSubmit = (formData: { url: string; alt: string }) => {
    selection && Transforms.select(editor, selection);
    selection && ReactEditor.focus(editor);
    console.log('form data', formData);
    if (format === 'image') {
      insertEmbed(editor, { ...formData }, format);
    } else {
      insertEmbed(editor, { ...formDataGlobal }, format);
    }

    setShowInput(false);
    setFormData({
      url: '',
      alt: '',
    });
  };
  const handleImageUpload = () => {
    setShowInput(false);
  };

  const ModalImageSubmit = (image) => {
    handleFormSubmit({ url: image, alt: '' });
  };

  return (
    <div ref={urlInputRef} className="popup-wrapper">
      <Button
        disabled={isBlockActive(editor, format)}
        style={{
          border: showInput ? '1px solid lightgray' : '',
          borderBottom: 'none',
        }}
        onClick={handleButtonClick}
      >
        {format === 'image' && <Image size="17px" />}
        {format === 'video' && <Clapperboard size="17px" />}
      </Button>
      {format === 'image' && (
        <MediaModal
          Editor
          ModalImageSubmit={ModalImageSubmit}
          Open={!!showInput}
          setFormData={setFormData}
        />
      )}

      {showInput && (
        <div className="popup">
          {format === 'image' && (
            <div>
              <div
                style={{ display: 'flex', gap: '10px' }}
                onClick={handleImageUpload}
              >
                icon upload
                <span>Upload</span>
              </div>
              <p style={{ textAlign: 'center', opacity: '0.7', width: '100%' }}>
                OR
              </p>
            </div>
          )}
          <form>
            <input
              className="border-2 border-blue-500 p-3 rounded-md"
              type="text"
              placeholder="Enter video url"
              value={formDataGlobal.url}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, url: e.target.value }))
              }
            />

            <Button
              onClick={(e) => {
                e.preventDefault();
                handleFormSubmit({ url: '', alt: '' });
              }}
              type="submit"
            >
              Save
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Embed;
