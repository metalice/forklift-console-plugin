import { type FC, type ReactNode, useCallback, useState } from 'react';
import { useModal } from 'src/modules/Providers/modals/ModalHOC/ModalHOC';

import type { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import {
  Alert,
  AlertVariant,
  Button,
  ButtonVariant,
  Modal,
  ModalVariant,
} from '@patternfly/react-core';
import { useForkliftTranslation } from '@utils/i18n';

type ModalFormProps = {
  title: string;
  children: ReactNode;
  onConfirm: () => Promise<K8sResourceCommon>;
  variant?: ModalVariant;
  confirmLabel?: string;
  cancelLabel?: string;
  className?: string;
  confirmVariant?: ButtonVariant;
  isDisabled?: boolean;
};

const ModalForm: FC<ModalFormProps> = ({
  cancelLabel,
  children,
  className,
  confirmLabel,
  confirmVariant,
  isDisabled,
  onConfirm,
  title,
  variant = ModalVariant.small,
}) => {
  const { t } = useForkliftTranslation();
  const { toggleModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await onConfirm();
      toggleModal();
    } catch (e) {
      setError((e as Error)?.message ?? e?.toString());
      setIsLoading(false);
    }
  }, [onConfirm, toggleModal]);

  return (
    <Modal
      variant={variant}
      title={title}
      isOpen
      showClose={false}
      position="top"
      onClose={toggleModal}
      actions={[
        <Button
          key="confirm"
          variant={confirmVariant ?? ButtonVariant.primary}
          onClick={handleConfirm}
          isLoading={isLoading}
          isDisabled={isLoading || Boolean(error) || isDisabled}
        >
          {confirmLabel ?? t('Save')}
        </Button>,
        <Button key="cancel" variant={ButtonVariant.secondary} onClick={toggleModal}>
          {cancelLabel ?? t('Cancel')}
        </Button>,
      ]}
      className={className}
    >
      {children}

      {error && (
        <Alert title="Error" variant={AlertVariant.danger} isInline>
          {error}
        </Alert>
      )}
    </Modal>
  );
};

export default ModalForm;
