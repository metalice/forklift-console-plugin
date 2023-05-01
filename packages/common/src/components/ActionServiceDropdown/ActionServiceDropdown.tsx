import React, { useMemo, useState } from 'react';
import { useHistory } from 'react-router';
import { ActionService, ActionServiceProvider } from 'common/src/polyfills/sdk-shim';

import { Dropdown, DropdownItem, DropdownToggle, KebabToggle } from '@patternfly/react-core';

export interface ActionServiceDropdownProps<T> {
  /** The contextId of the `console.action/provider` extension to use */
  contextId: string;

  /** The kind of toggle to use for the resourceData actions. Default: `'kebab'` */
  variant?: 'kebab' | 'dropdown';

  /** Text to display when the variant is 'dropdown'. */
  dropdownToggleText?: string;

  /** The resource's namespace. */
  namespace?: string;

  /** Resource the actions will act upon. */
  resourceData: T;

  /** A list of actions to ignore and leave off the full set of actions for the entity. */
  ignoreList?: string[];
}

/**
 * Use the `console.action/provider` defined extension provided to generate the set of
 * actions to provide for the given resource.  Use `ActionsAsDropdown` to render the
 * list actions generated by the service provider.
 */
export function ActionServiceDropdown<T>({
  contextId,
  variant = 'kebab',
  dropdownToggleText,
  namespace,
  resourceData,
  ignoreList,
}: ActionServiceDropdownProps<T>) {
  const serviceProviderData = useMemo(
    () => ({ [contextId]: { resourceData, namespace } }),
    [contextId, resourceData, namespace],
  );

  return (
    <ActionServiceProvider context={serviceProviderData}>
      {(actionService: ActionService) => (
        <ActionsAsDropdown
          {...actionService}
          variant={variant}
          dropdownToggleText={dropdownToggleText}
          ignoreList={ignoreList}
        />
      )}
    </ActionServiceProvider>
  );
}
ActionServiceDropdown.displayName = 'ActionServiceDropdown';

const ActionsAsDropdown = ({
  actions,
  variant,
  dropdownToggleText = '',
  ignoreList = [],
}: ActionService &
  Pick<ActionServiceDropdownProps<object>, 'variant' | 'dropdownToggleText' | 'ignoreList'>) => {
  const history = useHistory();
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const isPlain = variant === 'kebab';
  const toggle =
    variant === 'kebab' ? (
      <KebabToggle onToggle={setIsActionMenuOpen} />
    ) : (
      <DropdownToggle onToggle={setIsActionMenuOpen}>{dropdownToggleText}</DropdownToggle>
    );
  return (
    <Dropdown
      position="right"
      onSelect={() => setIsActionMenuOpen(!isActionMenuOpen)}
      toggle={toggle}
      isOpen={isActionMenuOpen}
      isPlain={isPlain}
      dropdownItems={actions
        .filter(({ id }) => !ignoreList?.includes(id))
        .map(({ id, label, cta, disabled, disabledTooltip, tooltip }) => (
          <DropdownItem
            key={id}
            onClick={typeof cta === 'function' ? cta : () => cta.href && history.push(cta.href)}
            isAriaDisabled={disabled}
            tooltip={disabled ? disabledTooltip : tooltip}
          >
            {label}
          </DropdownItem>
        ))}
    />
  );
};

export function withActionServiceContext<T>(
  {
    contextId,
    variant,
    dropdownToggleText,
  }: Pick<ActionServiceDropdownProps<T>, 'contextId' | 'variant' | 'dropdownToggleText'>,
  Component: typeof ActionServiceDropdown = ActionServiceDropdown,
) {
  function ActionServiceDropdownProviderHoc(
    props: Pick<ActionServiceDropdownProps<T>, 'namespace' | 'resourceData' | 'ignoreList'>,
  ) {
    return (
      <Component<T>
        {...props}
        contextId={contextId}
        variant={variant}
        dropdownToggleText={dropdownToggleText}
      />
    );
  }

  const componentName = Component['displayName'] || Component.name || 'Component';
  ActionServiceDropdownProviderHoc.displayName = `withActionServiceContext(${componentName})`;

  return ActionServiceDropdownProviderHoc;
}