import jwtDecode from 'jwt-decode';

import {
  setToken,
  login as li,
  logout as lo,
  getUserInfo,
  getPermission,
  checkCredential,
} from 'app/actions/auth';
import store from 'app/store';

import { toast } from 'react-toastify';
import { TOKEN, EXPIRED_TIME, CDS_AUTH_PERMISSION } from 'app/utils/constants';

const useAuth = () => {
  /**
   * Check and handle token from localStorage and return if the token is still validate
   * @returns {boolean} token validate status
   */

  /**
   * Logout and delete token from localStorage
   */
  const logout = () => {
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(EXPIRED_TIME);
    sessionStorage.removeItem(TOKEN);
    sessionStorage.removeItem(EXPIRED_TIME);
    store.dispatch(lo());
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem(TOKEN) || sessionStorage.getItem(TOKEN);
    checkCredential(token).then(() => {
      getPermission(token).catch(() => {
        toast.warning('Phiên đăng nhập đã hết, vui lòng đăng nhập lại', {
          toastId: 'token-expired',
        });
        logout();
      });
    });
    const expiredTime = new Date(
      localStorage.getItem(EXPIRED_TIME) ||
        sessionStorage.getItem(EXPIRED_TIME),
    );
    if (token && expiredTime > new Date()) {
      store.dispatch(setToken(token, expiredTime, jwtDecode(token)));
      if (!store.getState().auth.userInfo) {
        store.dispatch(getUserInfo());
      }
      return true;
    }
    logout();
    return false;
  };

  const getAuthInfo = () => store.getState().auth.userInfo;
  const isUsername = (username) => getAuthInfo()?.Username === username;

  // admin role
  const isAdmin = (getAuthInfo()?.Role ?? []).includes('admin');

  // chain's role
  const isMasterDte =
    getAuthInfo()?.Username === 'master.dte' ||
    getAuthInfo()?.Username === 'hcdc';

  // examination's role
  const isMasterXng =
    getAuthInfo()?.Username === 'master.xng' ||
    getAuthInfo()?.Username === 'hcdc';
  const isHcdcXng =
    getAuthInfo()?.Username === 'hcdc' ||
    getAuthInfo()?.Username === 'hcdc.xng';

  const isHcdcDtr =
    getAuthInfo()?.Username === 'hcdc' ||
    getAuthInfo()?.Username === 'hcdc.dtr';

  /**
   * Return a Promise which resolve when login successfully
   * @param {string} username Username
   * @param {string} password Password
   * @param {boolean} remember Option to remember password
   * @returns {Promise} Resolve if login successfully and reject if login failed
   */
  const login = (username, password, remember = true) =>
    new Promise((resolve, reject) => {
      store
        .dispatch(li(username, password))
        .then((response) => {
          const { access_token: token, expires_in: expiresIn } = response;
          getPermission(token).then((permissionList) => {
            if (
              permissionList &&
              permissionList.map((p) => p.code).includes(CDS_AUTH_PERMISSION)
            ) {
              if (remember) {
                localStorage.setItem(TOKEN, token);
                localStorage.setItem(
                  EXPIRED_TIME,
                  new Date(new Date().getTime() + expiresIn * 1000),
                );
              } else {
                sessionStorage.setItem(TOKEN, token);
                sessionStorage.setItem(
                  EXPIRED_TIME,
                  new Date(new Date().getTime() + expiresIn * 1000),
                );
              }
              store.dispatch(getUserInfo());
              resolve();
            } else {
              const error = {
                type: 'Không có quyền truy cập!',
                message: 'Tài khoản này không có quyền truy cập vào hệ thống',
              };
              reject(error);
            }
          });
        })
        .catch(reject);
    });

  return {
    isAuthenticated,
    isAdmin,
    isMasterDte,
    isMasterXng,
    isHcdcXng,
    isUsername,
    isHcdcDtr,
    getAuthInfo,
    login,
    logout,
  };
};

export default useAuth;
