import { FC, PropsWithChildren } from 'react';

import { Flex, Title } from '@patternfly/react-core';

import './WizardStepContainer.style.scss';

type WizardStepContainerProps = PropsWithChildren & {
  title: string;
  isFullWidth?: boolean;
};

export const WizardStepContainer: FC<WizardStepContainerProps> = ({
  title,
  isFullWidth,
  children,
}) => (
  <Flex className={`wizard-step-container${isFullWidth ? '' : '--form'}`}>
    <Title headingLevel="h2">{title}</Title>
    {children}
  </Flex>
);

export default WizardStepContainer;
