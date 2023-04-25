import {memo, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';
import {getIsAllowedPermission} from "../../Helpers";

export const PermissionsComponent = memo(
    ({
        reducerInput, permissionsList, permissionsId, allowEmptyRoles, children,
    }) => {
        const [allowed, setAllowed] = useState(false);

        const response = useSelector((state) => state?.[reducerInput]);

        useEffect(() => {
            setAllowed(
                getIsAllowedPermission(
                    permissionsList,
                    response,
                    permissionsId,
                    allowEmptyRoles,
                ),
            );
        }, [allowEmptyRoles, permissionsId, permissionsList, response]);

        return (allowed && children) || null;
    },
);

PermissionsComponent.displayName = 'PermissionsComponent';

PermissionsComponent.propTypes = {
    reducerInput: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.instanceOf(Element),
        PropTypes.instanceOf(Object),
    ]),
    permissionsList: PropTypes.instanceOf(Array),
    permissionsId: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    allowEmptyRoles: PropTypes.bool,
};
PermissionsComponent.defaultProps = {
    permissionsList: [],
    permissionsId: undefined,
    children: undefined,
    allowEmptyRoles: false,
    reducerInput: 'userSubscriptionsReducer',
};
