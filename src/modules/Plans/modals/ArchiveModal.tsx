import { type FC, type ReactNode, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom-v5-compat';
import useToggle from 'src/modules/Providers/hooks/useToggle';
import { AlertMessageForModals } from 'src/modules/Providers/modals/components/AlertMessageForModals';
import { useModal } from 'src/modules/Providers/modals/ModalHOC/ModalHOC';
import { ForkliftTrans, useForkliftTranslation } from 'src/utils/i18n';

import { PlanModel, type V1beta1Plan } from '@kubev2v/types';
import { type K8sModel, k8sPatch } from '@openshift-console/dynamic-plugin-sdk';
import { Alert, Button, Modal, ModalVariant } from '@patternfly/react-core';

import { getPlanPhase } from '../utils/helpers/getPlanPhase';
import { PlanPhase } from '../utils/types/PlanPhase';

/**
 * Props for the DeleteModal component
 * @typedef ArchiveModalProps
 * @property {string} title - The title to display in the modal
 * @property {V1beta1Plan} resource - The resource object to delete
 * @property {K8sModel} model - The model used for deletion
 * @property {string} [redirectTo] - Optional redirect URL after deletion
 */
type ArchiveModalProps = {
  resource: V1beta1Plan;
  model: K8sModel;
  title?: string;
  redirectTo?: string;
};

/**
 * A generic delete modal component
 * @component
 * @param {ArchiveModalProps} props - Props for DeleteModal
 * @returns {Element} The DeleteModal component
 */
export const ArchiveModal: FC<ArchiveModalProps> = ({ redirectTo, resource, title }) => {
  const { t } = useForkliftTranslation();
  const { toggleModal } = useModal();
  const [isLoading, toggleIsLoading] = useToggle();
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState<ReactNode>(null);

  const title_ = title || t('Archive migration plan');
  const { name } = resource?.metadata || {};

  const onArchive = useCallback(async () => {
    toggleIsLoading();
    try {
      const op = resource?.spec?.archived ? 'replace' : 'add';

      await k8sPatch({
        data: [{ op, path: '/spec/archived', value: true }],
        model: PlanModel,
        path: '',
        resource,
      });

      if (redirectTo) {
        navigate(redirectTo);
      }

      toggleModal();
    } catch (err) {
      toggleIsLoading();

      setAlertMessage(<AlertMessageForModals title={t('Error')} message={err.toString()} />);
    }
  }, [resource, navigate]);

  const phase = getPlanPhase({ plan: resource });

  const actions = [
    <Button
      key="confirm"
      variant={phase === PlanPhase.Running ? 'danger' : 'primary'}
      onClick={onArchive}
      isLoading={isLoading}
    >
      {t('Archive')}
    </Button>,
    <Button key="cancel" variant="secondary" onClick={toggleModal}>
      {t('Cancel')}
    </Button>,
  ];

  const IsExecutingAlert: FC = () => (
    <Alert
      isInline
      variant="danger"
      title="Plan is currently running"
      className="forklift-delete-modal__alert"
    />
  );

  return (
    <Modal
      title={title_}
      position="top"
      showClose={false}
      variant={ModalVariant.small}
      isOpen={true}
      onClose={toggleModal}
      actions={actions}
    >
      {
        <ForkliftTrans>
          <p>
            Archive plan <strong className="co-break-word">{name}</strong>?
          </p>
          <br />
          <p>
            When a plan is archived, its history, metadata, and logs are deleted. The plan cannot be
            edited or restarted but it can be viewed.
          </p>
        </ForkliftTrans>
      }
      {phase === PlanPhase.Running && <IsExecutingAlert />}
      {alertMessage}
    </Modal>
  );
};
