import React from 'react';
import styled from 'styled-components';
import {
  Form,
  Input,
  Grid,
  Image,
  Header,
} from 'semantic-ui-react';

import avatar from 'app/assets/images/avatar.jpeg';
import { useAuth } from 'app/hooks';

const Wrapper = styled.div`
  width: 100%;
  min-height: 400px;
  position: relative;
  overflow: hidden;
`;

const StyledImage = styled(Image)`
  position: absolute !important;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const InfoPage = () => {
  const { getAuthInfo } = useAuth();
  const userInfo = getAuthInfo();
  const {
    FullName,
    Email,
    // Phone,
    // Permission,
  } = userInfo;

  return (
    <Grid>
      <Grid.Column width={16}>
        <Header as="h3">Thông tin tài khoản</Header>
      </Grid.Column>
      <Grid.Column width={6}>
        <Wrapper>
          <StyledImage src={avatar} />
        </Wrapper>
      </Grid.Column>
      <Grid.Column width={10}>
        <Form widths="equal">
          <Form.Field
            control={Input}
            label="Tên cơ sở"
            value={FullName}
          />
          <Form.Field
            readOnly
            control={Input}
            label="Loại tài khoản"
            value="Tài khoản toàn quyền"
          />
          <Form.Field
            control={Input}
            label="Số điện thoại"
            value="012345678"
          />
          <Form.Field
            control={Input}
            label="Email"
            value={Email}
          />
        </Form>
      </Grid.Column>
    </Grid>
  );
};

export default InfoPage;
