import React from 'react';

import { capitalize, weightDescription } from '../../../utils/text';
import { ToolbarSection, ToolbarItem } from '../../editor';
import { ToolbarRadio } from '../../editor/Toolbar/ToolbarRadio';

export const TextSettings = () => {
  return (
    <React.Fragment>
      <ToolbarSection
        title="Typography"
        props={['fontSize', 'fontWeight', 'textAlign']}
        summary={({ fontSize, fontWeight, textAlign }: any) => {
          return `${fontSize || ''}, ${weightDescription(
            parseInt(fontWeight)
          )}, ${capitalize(textAlign)}`;
        }}
      >
        <ToolbarItem
          full={true}
          propKey="fontSize"
          type="slider"
          label="Font Size"
        />
        <ToolbarItem propKey="textAlign" type="radio" label="Align">
          <ToolbarRadio value="left" label="Left" />
          <ToolbarRadio value="center" label="Center" />
          <ToolbarRadio value="right" label="Right" />
        </ToolbarItem>
        <ToolbarItem propKey="fontWeight" type="radio" label="Weight">
          <ToolbarRadio value="400" label="Regular" />
          <ToolbarRadio value="500" label="Medium" />
          <ToolbarRadio value="700" label="Bold" />
        </ToolbarItem>
      </ToolbarSection>
      <ToolbarSection
        title="Margin"
        props={['margin']}
        summary={({ margin }: any) => {
          return `${margin[0] || 0}px ${margin[1] || 0}px ${margin[2] || 0}px ${
            margin[3] || 0
          }px`;
        }}
      >
        <ToolbarItem propKey="margin" index={0} type="slider" label="Top" />
        <ToolbarItem propKey="margin" index={1} type="slider" label="Right" />
        <ToolbarItem propKey="margin" index={2} type="slider" label="Bottom" />
        <ToolbarItem propKey="margin" index={3} type="slider" label="Left" />
      </ToolbarSection>
      <ToolbarSection
        title="Appearance"
        props={['color', 'shadow', 'bgColor', 'borderRadius']}
        summary={({ color, shadow, bgColor, borderRadius }: any) => {
          return (
            <div className="fletext-right">
              <p
                style={{
                  color: color && `rgba(${Object.values(color)})`,
                  borderRadius: `${borderRadius}px` || '0px',
                  textShadow: `0px 0px 2px rgba(0, 0, 0, ${shadow / 100})`,
                  backgroundColor: bgColor && `rgba(${Object.values(bgColor)})`,
                }}
                className="text-white text-right"
              >
                T
              </p>
            </div>
          );
        }}
      >
        <ToolbarItem full={true} propKey="color" type="color" label="Text" />
        <ToolbarItem
          full={true}
          propKey="shadow"
          type="slider"
          label="Shadow"
        />
        <ToolbarItem
          full={true}
          propKey="bgColor"
          type="color"
          label="Text Background"
        />
        <ToolbarItem
          propKey="borderRadius"
          index={0}
          full={true}
          type="slider"
          label="Rounded Corner"
        />
        <ToolbarItem
          propKey="padding"
          index={0}
          full={true}
          type="slider"
          label="Padding"
        />
      </ToolbarSection>
    </React.Fragment>
  );
};
