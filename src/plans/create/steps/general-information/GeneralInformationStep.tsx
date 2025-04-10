import { FC, useState } from 'react';
import ProviderSelect from 'src/plans/components/ProviderSelect';

import ControlledFormGroup from '@components/common/ControlledFormGroup';
import { WizardStepContainer } from '@components/common/WizardStepContainer';
import { Form, FormSection, MenuToggleStatus, TextInput } from '@patternfly/react-core';
import { getInputValidated } from '@utils/form';
import { useForkliftTranslation } from '@utils/i18n';

import { GeneralFormFieldId, generalFormFieldLabels } from './constants';
import { PlanProjectField } from './PlanProjectField';
import { TargetProjectField } from './TargetProjectField';
import { useCreatePlanFieldWatch, useCreatePlanFormContext } from '../../hooks';

export const GeneralInformationStep: FC = () => {
  const { t } = useForkliftTranslation();
  const {
    formState: { errors },
    setValue,
  } = useCreatePlanFormContext();
  const targetProject = useCreatePlanFieldWatch(GeneralFormFieldId.TargetProject);
  const [providerNamespace, setProviderNamespace] = useState<string>();

  return (
    <WizardStepContainer title={t('General')}>
      <Form>
        <FormSection title={t('Plan information')} titleElement="h3">
          <p>{t('Name your plan and choose the project you would like it to be created in.')}</p>

          <ControlledFormGroup
            isRequired
            fieldId={GeneralFormFieldId.PlanName}
            label={generalFormFieldLabels[GeneralFormFieldId.PlanName]}
            controller={{
              rules: { required: t('Plan name is required.') },
              render: ({ field }) => (
                <TextInput
                  {...field}
                  validated={getInputValidated(!!errors[GeneralFormFieldId.PlanName])}
                />
              ),
            }}
          />

          <PlanProjectField onSelect={(value) => setProviderNamespace(value)} />
        </FormSection>

        <FormSection title={t('Source and target providers')} titleElement="h3">
          <p>
            {t(
              'Select the provider you would like to migrate your virtual machines from (source provider) and the provider you want to migrate your virtual machines to (target provider).',
            )}
          </p>

          <ControlledFormGroup
            isRequired
            fieldId={GeneralFormFieldId.SourceProvider}
            label={generalFormFieldLabels[GeneralFormFieldId.SourceProvider]}
            controller={{
              rules: { required: t('Source provider is required.') },
              render: ({ field }) => (
                <ProviderSelect
                  placeholder={t('Select source provider')}
                  id={GeneralFormFieldId.SourceProvider}
                  namespace={providerNamespace}
                  value={field.value?.metadata?.name || ''}
                  onSelect={(_, value) => field.onChange(value)}
                  status={errors[GeneralFormFieldId.SourceProvider] && MenuToggleStatus.danger}
                />
              ),
            }}
          />

          <ControlledFormGroup
            isRequired
            fieldId={GeneralFormFieldId.TargetProvider}
            label={generalFormFieldLabels[GeneralFormFieldId.TargetProvider]}
            controller={{
              rules: { required: t('Target provider is required.') },
              render: ({ field }) => (
                <ProviderSelect
                  placeholder={t('Select target provider')}
                  id={GeneralFormFieldId.TargetProvider}
                  namespace={providerNamespace}
                  value={field.value?.metadata?.name || ''}
                  onSelect={(_, value) => {
                    field.onChange(value);

                    if (targetProject) {
                      setValue(GeneralFormFieldId.TargetProject, '', { shouldValidate: true });
                    }
                  }}
                  status={errors[GeneralFormFieldId.TargetProvider] && MenuToggleStatus.danger}
                />
              ),
            }}
          />

          <TargetProjectField />
        </FormSection>
      </Form>
    </WizardStepContainer>
  );
};

export default GeneralInformationStep;
