import { Element, useEditor } from '@craftjs/core';
import { Tooltip } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import { Card } from '@mui/material';

import { Button } from '../../selectors/Button';
import { Container } from '../../selectors/Container';
import { Text } from '../../selectors/Text';
import { Video } from '../../selectors/Video';
import { BoxIcon, Square, TvIcon, Type } from 'lucide-react';

const ToolboxDiv = styled.div<{ enabled: boolean }>`
  transition: 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  ${(props) => (!props.enabled ? `width: 0;` : '')}
  ${(props) => (!props.enabled ? `opacity: 0;` : '')}
`;

const Item = styled.a<{ move?: boolean }>`
  svg {
    width: 22px;
    height: 22px;
    fill: #707070;
  }
  ${(props) =>
    props.move &&
    `
    cursor: move;
  `}
`;

export const Toolbox = () => {
  const {
    enabled,
    connectors: { create },
  } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  return (
    <ToolboxDiv
      enabled={enabled && enabled}
      className="toolbox transition w-[400px] h-full flex p-4 flex-col bg-white"
    >
      <div className="flex justify-around flex-wrap pt-3 gap-[9px]">
        <div
          ref={(ref) =>
            create(
              ref,
              <Element
                canvas
                is={Container}
                background={{ r: 78, g: 78, b: 78, a: 1 }}
                color={{ r: 0, g: 0, b: 0, a: 1 }}
                height="300px"
                width="300px"
              ></Element>
            )
          }
        >
          <Card className="w-[150px] h-[150px] flex justify-center items-center">
            <Tooltip title="Container" placement="right">
              <Item
                className="m-2 pb-2 flex flex-col justify-center items-center cursor-pointer text-center"
                move
              >
                <Square />
                Container
              </Item>
            </Tooltip>
          </Card>
        </div>
        <div
          ref={(ref) =>
            create(ref, <Text fontSize="12" textAlign="left" text="Hi there" />)
          }
        >
          <Card className="w-[150px] h-[150px] flex justify-center items-center">
            <Tooltip title="Text" placement="right">
              <Item
                className="m-2 pb-2 flex flex-col justify-center items-center cursor-pointer text-center"
                move
              >
                <Type />
                Text
              </Item>
            </Tooltip>
          </Card>
        </div>
        <div ref={(ref) => create(ref, <Button />)}>
          <Card className="w-[150px] h-[150px] flex justify-center items-center">
            <Tooltip title="Button" placement="right">
              <Item
                className="m-2 pb-2 flex flex-col justify-center items-center cursor-pointer text-center"
                move
              >
                <BoxIcon />
                Button
              </Item>
            </Tooltip>
          </Card>
        </div>
        <div ref={(ref) => create(ref, <Video />)}>
          <Card className="w-[150px] h-[150px] flex justify-center items-center">
            <Tooltip title="Video" placement="right">
              <Item
                className="m-2 pb-2 flex flex-col justify-center items-center cursor-pointer text-center"
                move
              >
                <TvIcon />
                Video
              </Item>
            </Tooltip>
          </Card>
        </div>
      </div>
    </ToolboxDiv>
  );
};
