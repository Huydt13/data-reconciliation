import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import { useAuth } from 'app/hooks';

const LandingPage = () => {
  const history = useHistory();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (history) {
      history.push(isAuthenticated() ? '/home' : '/login');
    }
    // eslint-disable-next-line
  }, []);

  return <div>...</div>;
};

LandingPage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default LandingPage;
