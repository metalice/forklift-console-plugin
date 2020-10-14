import * as React from 'react';
import { Button, TextContent, Text, Grid, GridItem, Bullseye, Flex } from '@patternfly/react-core';
import { PlusCircleIcon, TrashIcon } from '@patternfly/react-icons';
import spacing from '@patternfly/react-styles/css/utilities/Spacing/spacing';
import { MappingType, MappingSource, MappingTarget } from '@app/queries/types';
import LineArrow from '@app/common/components/LineArrow';
import MappingSourceSelect from './MappingSourceSelect';
import MappingTargetSelect from './MappingTargetSelect';
import { getMappingSourceTitle, getMappingTargetTitle } from '../helpers';
import AddTooltip from '@app/common/components/AddTooltip';

import './MappingBuilder.css';
// import AddTooltip from '@app/common/components/AddTooltip';

export interface IMappingBuilderItem {
  source: MappingSource | null;
  target: MappingTarget | null;
}

interface IMappingBuilderProps {
  mappingType: MappingType;
  availableSources: MappingSource[];
  availableTargets: MappingTarget[];
  builderItems: IMappingBuilderItem[];
  setBuilderItems: (groups: IMappingBuilderItem[]) => void;
}

export const MappingBuilder: React.FunctionComponent<IMappingBuilderProps> = ({
  mappingType,
  availableSources,
  availableTargets,
  builderItems,
  setBuilderItems,
}: IMappingBuilderProps) => {
  const messageSelectBoth = 'You must select a source and target before adding another mapping.';
  const messageExhausted = `All source ${
    mappingType === MappingType.Network ? 'networks' : 'datastores'
  } have been mapped.`;

  const getTooltipContent = () => {
    if (builderItems.length === availableSources.length) {
      return messageExhausted;
    }
    return messageSelectBoth;
  };

  const reset = () => setBuilderItems([{ source: null, target: null }]);
  const isReset = builderItems.length === 1 && !builderItems[0].source && !builderItems[0].target;
  const addEmptyItem = () => setBuilderItems([...builderItems, { source: null, target: null }]);
  const removeItem = (itemIndex: number) => {
    if (builderItems.length > 1) {
      setBuilderItems(builderItems.filter((_item, index) => index !== itemIndex));
    } else {
      reset();
    }
  };

  let instructionText = '';
  if (mappingType === MappingType.Network) {
    instructionText = 'Map source and target networks.';
  }
  if (mappingType === MappingType.Storage) {
    instructionText = 'Map source datastores to target storage classes.';
  }

  return (
    <>
      <TextContent>
        <Text component="p">{instructionText}</Text>
      </TextContent>
      {builderItems.map((item, itemIndex) => {
        const key = item.source ? `${item.source.id}` : `empty-${itemIndex}`;
        return (
          <Grid key={key}>
            {itemIndex === 0 ? (
              <>
                <GridItem span={5} className={spacing.pbSm}>
                  <label className="pf-c-form__label">
                    <span className="pf-c-form__label-text">
                      {getMappingSourceTitle(mappingType)}
                    </span>
                  </label>
                </GridItem>
                <GridItem span={1} />
                <GridItem span={5} className={spacing.pbSm}>
                  <label className="pf-c-form__label">
                    <span className="pf-c-form__label-text">
                      {getMappingTargetTitle(mappingType)}
                    </span>
                  </label>
                </GridItem>
                <GridItem span={1} />
              </>
            ) : null}
            <GridItem span={5} className={`mapping-builder-box ${spacing.pSm}`}>
              <MappingSourceSelect
                id={`mapping-sources-for-${key}`}
                builderItems={builderItems}
                itemIndex={itemIndex}
                setBuilderItems={setBuilderItems}
                availableSources={availableSources}
              />
            </GridItem>
            <GridItem span={1}>
              <Bullseye>
                <LineArrow />
              </Bullseye>
            </GridItem>
            <GridItem span={5} className={`mapping-builder-box ${spacing.pSm}`}>
              <MappingTargetSelect
                id={`mapping-target-for-${key}`}
                builderItems={builderItems}
                itemIndex={itemIndex}
                setBuilderItems={setBuilderItems}
                availableTargets={availableTargets}
              />
            </GridItem>
            <GridItem span={1}>
              <Bullseye>
                <Button
                  variant="plain"
                  aria-label="Remove mapping"
                  onClick={() => removeItem(itemIndex)}
                  isDisabled={isReset}
                >
                  <TrashIcon />
                </Button>
              </Bullseye>
            </GridItem>
          </Grid>
        );
      })}
      <Flex
        justifyContent={{ default: 'justifyContentCenter' }}
        spaceItems={{ default: 'spaceItemsMd' }}
      >
        <AddTooltip
          isTooltipEnabled={
            !builderItems.every((item) => item.source && item.target) ||
            builderItems.length === availableSources.length
          }
          content={getTooltipContent()}
          position="bottom"
        >
          <div>
            <Button
              isDisabled={
                !builderItems.every((item) => item.source && item.target) ||
                builderItems.length === availableSources.length
              }
              variant="secondary"
              icon={<PlusCircleIcon />}
              onClick={addEmptyItem}
            >
              Add
            </Button>
          </div>
        </AddTooltip>
        <Button variant="secondary" onClick={reset} isDisabled={isReset}>
          Remove all
        </Button>
      </Flex>
    </>
  );
};