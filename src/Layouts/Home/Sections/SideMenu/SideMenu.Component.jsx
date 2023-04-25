import React from 'react';
import { storageService } from 'utils';
import { LoginActions } from 'Store/Actions';
import { useLocation } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { GlobalHistory } from '../../../../Helpers/Middleware.Helper';
import { removeAllPendingRequestsRecordHttp, showError, showSuccess } from 'Helpers';
import { Accordion, AccordionDetails, AccordionSummary, ButtonBase, Tooltip } from '@mui/material';
import './SideMenu.Style.scss';

export const SideMenuComponent = ({ isSideMenuOpen, HomeRoutes, handleSideMenuOpenClose }) => {
  const location = useLocation();
  const isRouteActive = (path) => location.pathname.includes(path);

  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const logoutHandler = async () => {
    removeAllPendingRequestsRecordHttp();
    LoginActions.logout();
    storageService.clearLocalStorage();

    setTimeout(() => {
      GlobalHistory.push('/accounts/login');
    }, 100);

    const response = {};

    if (response && response.data && response.status === 200) {
      const { data } = response;

      showSuccess(data?.msg || 'Logged out Successfully');

      LoginActions.logout();
      storageService.clearLocalStorage();

      setTimeout(() => {
        GlobalHistory.push('/accounts/login');
      }, 100);
    } else {
      const errorMsg = 'You must be logged in to complete this request!';

      if (response)
        if (typeof response === 'string' || response instanceof String)
          showError(response || errorMsg);

      if (response && response.data)
        if (typeof response.data === 'string' || response.data instanceof String)
          showError(response.data || errorMsg);

      if (response && response.data && response.data.error)
        if (typeof response.data.error === 'string' || response.data.error instanceof String)
          showError(response.data.error || errorMsg);
    }
  };

  return (
    <div className={`side-menu-wrapper ${isSideMenuOpen ? 'is-open' : ''}`}>
      <div className='side-menu-content'>
        <div className='side-menu-title-info-wrapper'>
          <div
            id='nav-icon'
            className={`${isSideMenuOpen ? 'open' : ''}`}
            onClick={handleSideMenuOpenClose}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className='side-menu-title'>SDTS</div>
        </div>

        <div className='side-menu-title-wrapper'></div>

        <div className={`side-menu-items ${!isSideMenuOpen ? 'is-closed' : ''}`}>
          <div className='side-menu-items-wrapper'>
            {HomeRoutes.filter((item) => !item.isHidden).map((item, index) => (
              <div
                key={`side-menu-item-${item.id}-${index + 1}`}
                className={`side-menu-item ${isRouteActive(item.path) ? 'is-active' : ''}`}>
                <Tooltip title={`${isSideMenuOpen ? '' : item.name}`} placement='right'>
                  <Accordion
                    onClick={() => GlobalHistory.push(`${item.layout}${item.path}`)}
                    expanded={
                      isSideMenuOpen &&
                      isRouteActive(item.path) &&
                      expanded === item.id &&
                      item.children.length > 0
                    }
                    onChange={handleChange(item.id)}>
                    <AccordionSummary
                      expandIcon={item.children.length === 0 ? <></> : <ExpandMoreIcon />}>
                      <div className='item-info'>
                        <span className={`mdi mdi-${item.icon}`} />
                        <div className='item-name'>{item.name}</div>
                      </div>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div className={`sub-item-info ${!isSideMenuOpen ? 'is-closed' : ''}`}>
                        {item.children &&
                          item.children.length > 0 &&
                          item.children.map((el, i) => (
                            <ButtonBase
                              key={`side-menu-subitem-${el.id}-${index + i + 1}`}
                              id={`side-menu-subitem-${el.id}-${index + i + 1}`}
                              onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();

                                GlobalHistory.push(`${el.layout}${el.path}`);
                              }}>
                              <span className={`mdi mdi-${el.icon}`} />
                              <div className='subitem-name'>{el.name}</div>
                            </ButtonBase>
                          ))}
                      </div>
                    </AccordionDetails>
                  </Accordion>
                </Tooltip>
              </div>
            ))}

            <div className='side-menu-signout-btn'>
              <Tooltip title={`${isSideMenuOpen ? '' : 'Logout'}`} placement='right'>
                <ButtonBase onClick={logoutHandler}>
                  <span className='mdi mdi-logout mr-3' />
                  <div className='item-name'>Logout</div>
                </ButtonBase>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
