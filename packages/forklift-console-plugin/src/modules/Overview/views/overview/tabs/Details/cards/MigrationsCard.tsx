import React, { FC } from 'react';
import { MigrationCounts } from 'src/modules/Overview/hooks';
import { useForkliftTranslation } from 'src/utils/i18n';

import { V1beta1ForkliftController } from '@kubev2v/types';
import {
  Card,
  CardBody,
  CardTitle,
  Divider,
  Flex,
  FlexItem,
  Text,
  TextVariants,
} from '@patternfly/react-core';

type MigrationsCardProps = {
  obj?: V1beta1ForkliftController;
  count?: MigrationCounts;
  vmCount?: MigrationCounts;
  loaded?: boolean;
  loadError?: unknown;
};

interface StatusCardProps {
  status: string;
  count: number | string;
  counterClassName?: string;
}

/**
 * StatusCard component displays count of given status
 * @param {StatusCardProps} props
 * @returns JSX.Element
 */
const StatusCard: React.FC<StatusCardProps> = ({
  status,
  count,
  counterClassName,
}: StatusCardProps) => (
  <FlexItem>
    <Text component={TextVariants.h1} className={counterClassName}>
      {count}
    </Text>
    <Text component={TextVariants.h6}>{status}</Text>
  </FlexItem>
);

export const MigrationsCard: FC<MigrationsCardProps> = ({ count, vmCount }) => {
  const { t } = useForkliftTranslation();

  return (
    <Card>
      <CardTitle>{t('Migration plans')}</CardTitle>
      <CardBody className="forklift-status-migration">
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
          <StatusCard status="Total" count={count['Total']} />
          <StatusCard
            status="Running"
            count={count['Running']}
            counterClassName="forklift-status-migration-running"
          />
          <StatusCard
            status="Failed"
            count={count['Failed']}
            counterClassName="forklift-status-migration-failed"
          />
          <StatusCard
            status="Succeeded"
            count={count['Succeeded']}
            counterClassName="forklift-status-migration-succeeded"
          />
        </Flex>

        <Divider />
      </CardBody>

      <CardTitle>{t('Virtual Machine Migrations')}</CardTitle>
      <CardBody className="forklift-status-migration">
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
          <StatusCard status="Total" count={vmCount['Total']} />
          <StatusCard
            status="Running"
            count={vmCount['Running']}
            counterClassName="forklift-status-migration-running"
          />
          <StatusCard
            status="Failed"
            count={vmCount['Failed']}
            counterClassName="forklift-status-migration-failed"
          />
          <StatusCard
            status="Succeeded"
            count={vmCount['Succeeded']}
            counterClassName="forklift-status-migration-succeeded"
          />
        </Flex>

        <Divider />
      </CardBody>
    </Card>
  );
};