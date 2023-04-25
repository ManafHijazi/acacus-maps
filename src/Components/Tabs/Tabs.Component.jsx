import React, {memo, useRef} from 'react';
import PropTypes from 'prop-types';
import {Tab, Tabs} from '@mui/material';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import './Tabs.Style.scss';
import {getIsAllowedPermission} from "../../Helpers";
import {PermissionsComponent} from "../Permissions/Permissions.Component";

export const TabsComponent = memo(
    ({
        iconInput,
        data,
        currentTab,
        onTabChanged,
        wrapperClasses,
        tabsAriaLabel,
        labelInput,
        translationPath,
        parentTranslationPath,
        variant,
        orientation,
        iconOnly,
        themeClasses,
        scrollButtons,
        hiddenTabIndexes,
        maxIndex,
        minIndex,
        dynamicComponentProps,
        componentInput,
        withDynamicComponents,
        totalCountInput,
        isDisabled,
        isWithLine,
        isPrimary,
        idRef,
        dynamicIdRef,
        tabsContentRefInput,
        tabsContentClasses,
    }) => {
        const {t} = useTranslation(parentTranslationPath);
        const tabsContentRef = useRef(null);
        // const loginResponse = useSelector((state) => state.login.loginResponse);
        const loginResponse = useSelector((state) => state.login);

        return (
            <>
                <Tabs
                    value={currentTab}
                    onChange={onTabChanged}
                    variant={variant}
                    orientation={orientation}
                    scrollButtons={scrollButtons}
                    indicatorColor="primary"
                    disabled={isDisabled}
                    textColor="primary"
                    className={`tabs-wrapper ${wrapperClasses} ${themeClasses}${
                        isWithLine ? ' is-with-line' : ''
                    }${iconOnly ? ' icon-only' : ''}${isPrimary ? ' is-primary' : ''}`}
                    aria-label={tabsAriaLabel}
                >
                    {data
            && data
                .filter(
                    (item, index) => hiddenTabIndexes.findIndex((element) => element === index)
                    === -1
                  && getIsAllowedPermission(
                      item.permissionsList,
                      loginResponse,
                      item.permissionsId,
                      true,
                  ),
                )
                .map((item, index) => (
                    <Tab
                        key={`${idRef}${index + 1}`}
                        disabled={
                            isDisabled
                    || item.disabled
                    || index > (maxIndex || data.length - 1)
                    || index < (minIndex || 0)
                        }
                        label={
                            labelInput
                    && !iconOnly && (
                                <span>
                                    {t(`${translationPath}${item[labelInput]}`)}
                                    {totalCountInput && (
                                        <span className="px-1">
                            (
                                            {item[totalCountInput]}
                            )
                                        </span>
                                    )}
                                </span>
                            )
                        }
                        icon={
                            <span className={(iconInput && item[iconInput]) || undefined} />
                        }
                    />
                ))}
                </Tabs>
                {(dynamicComponentProps || withDynamicComponents) && data && (
                    <div
                        className={`tabs-content-wrapper${
                            (orientation === 'vertical' && ' is-vertical-tabs') || ''
                        }${(tabsContentClasses && ` ${tabsContentClasses}`) || ''}`}
                        ref={tabsContentRef}
                    >
                        {data
                            .filter(
                                (item, index) => hiddenTabIndexes.findIndex((element) => element === index)
                    === -1
                  && getIsAllowedPermission(
                      item.permissionsList,
                      loginResponse,
                      item.permissionsId,
                      true,
                  ),
                            )
                            .map((item, index) => {
                                const Component = item[componentInput];

                                return (
                                    currentTab === index
                  && ((Component && (
                      <PermissionsComponent
                          permissionsList={item.permissionsList}
                          permissionsId={item.permissionsId}
                          key={`${idRef}${dynamicIdRef}${index + 1}`}
                          allowEmptyRoles
                      >
                          <Component
                              {...((tabsContentRefInput && {
                                  [tabsContentRefInput]: tabsContentRef,
                              })
                          || {})}
                              {...(dynamicComponentProps || {})}
                              {...(item.props || {})}
                          />
                      </PermissionsComponent>
                  ))
                    || null)
                                );
                            })}
                    </div>
                )}
            </>
        );
    },
);

TabsComponent.displayName = 'TabsComponent';

TabsComponent.propTypes = {
    data: PropTypes.instanceOf(Array).isRequired,
    onTabChanged: PropTypes.func.isRequired,
    hiddenTabIndexes: PropTypes.arrayOf(PropTypes.number),
    currentTab: PropTypes.number,
    iconInput: PropTypes.string,
    labelInput: PropTypes.string,
    wrapperClasses: PropTypes.string,
    tabsAriaLabel: PropTypes.string,
    translationPath: PropTypes.string,
    parentTranslationPath: PropTypes.string,
    variant: PropTypes.string,
    tabsContentRefInput: PropTypes.string,
    tabsContentClasses: PropTypes.string,
    orientation: PropTypes.oneOf(['horizontal', 'vertical']),
    totalCountInput: PropTypes.string,
    themeClasses: PropTypes.oneOf(['theme-solid', 'theme-default', 'theme-curved']),
    scrollButtons: PropTypes.oneOf(['auto', 'desktop', 'off', 'on']),
    iconOnly: PropTypes.bool,
    isWithLine: PropTypes.bool,
    maxIndex: PropTypes.number,
    minIndex: PropTypes.number,
    dynamicComponentProps: PropTypes.instanceOf(Object),
    componentInput: PropTypes.string,
    idRef: PropTypes.string,
    dynamicIdRef: PropTypes.string,
    withDynamicComponents: PropTypes.bool,
    isPrimary: PropTypes.bool,
    isDisabled: PropTypes.bool,
};
TabsComponent.defaultProps = {
    hiddenTabIndexes: [],
    currentTab: 0,
    iconInput: undefined,
    labelInput: undefined,
    scrollButtons: undefined,
    totalCountInput: undefined,

    wrapperClasses: '',
    translationPath: '',
    parentTranslationPath: '',
    tabsAriaLabel: 'tabs',
    variant: 'scrollable',
    themeClasses: 'theme-default',
    orientation: undefined, // 'vertical',undefined (for horizontal)
    iconOnly: false,
    isWithLine: false,
    maxIndex: undefined,
    minIndex: undefined,
    tabsContentRefInput: undefined,
    tabsContentClasses: undefined,
    dynamicComponentProps: undefined,
    componentInput: 'component',
    withDynamicComponents: undefined,
    idRef: 'tabRef',
    dynamicIdRef: 'dynamicComponentRef',
    isDisabled: false,
    isPrimary: false,
};
