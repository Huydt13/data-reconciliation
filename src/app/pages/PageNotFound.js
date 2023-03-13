import React from 'react';
import { Button } from 'semantic-ui-react';
import { FiArrowLeftCircle } from 'react-icons/fi';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

const Wrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;

const ErrorCode = styled.p`
  font-size: 100px;
  margin-bottom: 0px;
`;

const Message = styled.p`
  font-size: 20px;
`;

const Icon = styled(FiArrowLeftCircle)`
  margin-right: 8px;
`;

const PageNotFound = () => {
  const history = useHistory();

  return (
    <Wrapper>
      <ErrorCode>404</ErrorCode>
      <Message>Page Not Found!</Message>
      <Button
        primary
        content="Go back"
        icon={<Icon />}
        onClick={() => history.push('/')}
      />
    </Wrapper>
  );
};

export default PageNotFound;
