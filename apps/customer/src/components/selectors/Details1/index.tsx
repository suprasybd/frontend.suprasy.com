import { useNode, useEditor, Element } from '@craftjs/core';
import React from 'react';
import ContentEditable from 'react-contenteditable';

import { DetailsSettings } from './DetailsSettings';
import { Container } from '../Container';
import { Text } from '../Text';

export type DetailsProps = {
  fontSize: string;
  textAlign: string;
  fontWeight: string;
  color: Record<'r' | 'g' | 'b' | 'a', string>;
  bgColor: Record<'r' | 'g' | 'b' | 'a', string>;
  borderRadius: number;
  shadow: number;
  padding: number;
  text: string;
  margin: [string, string, string, string];
};

export const Details = ({
  fontSize,
  textAlign,
  fontWeight,
  color,
  shadow,
  text,
  margin,
  bgColor,
  borderRadius,
  padding,
}: Partial<DetailsProps>) => {
  const {
    connectors: { connect },
    setProp,
  } = useNode();
  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));
  return (
    <div>
      <Text
        fontSize="23"
        fontWeight="400"
        text="Craft.js is a React framework for building powerful &amp; feature-rich drag-n-drop page editors."
      ></Text>
    </div>
  );
};

Details.craft = {
  displayName: 'Details1',
  props: {
    fontSize: '15',
    textAlign: 'left',
    fontWeight: '500',
    color: { r: 92, g: 90, b: 90, a: 1 },
    margin: [0, 0, 0, 0],
    shadow: 0,
    text: 'Text',
    bgColor: 'white',
    borderRadius: 2,
    padding: 3,
  },

  related: {
    toolbar: DetailsSettings,
  },
};
