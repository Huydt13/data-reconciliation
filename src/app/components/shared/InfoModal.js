/* eslint-disable no-nested-ternary */
import React, { useMemo } from 'react';
import { Modal, Button, Grid } from 'semantic-ui-react';
import { FiCheck, FiX } from 'react-icons/fi';
import styled from 'styled-components';

import { useDispatch, useSelector } from 'react-redux';
import { showInfoModal } from 'app/actions/global';

const StyledIconWrapper = styled.span`
  line-height: 0;
  margin-right: 8px;
  font-size: 20px;
  vertical-align: middle;
`;
const Message = styled.p`
  font-family: Arial, Helvetica, sans-serif;
  white-space: break-spaces;
  font-size: 30px;
`;

const InfoModal = () => {
  const dispatch = useDispatch();
  const { infoHeader, infoContent, infoCallback } = useSelector(
    (state) => state.global,
  );
  const isFormatted = useMemo(() => {
    if (infoContent && typeof infoContent === 'string') {
      return infoContent.indexOf('\r') > -1 || infoContent.indexOf('\n') > -1;
    }
    return '';
  }, [infoContent]);
  const isProfileResult = infoHeader?.includes('Kết quả');

  return (
    <Modal basic open={Boolean(infoHeader)}>
      {!isProfileResult && <Modal.Header>{infoHeader}</Modal.Header>}
      <Modal.Content>
        {isFormatted ? (
          <Message style={{ fontSize: 16, fontWeight: 'bold' }}>Lỗi</Message>
        ) : (
          ''
        )}
        {isProfileResult ? (
          <Grid>
            <Message>Mã không tìm thấy</Message>
            <Grid.Row columns={6}>
              {infoContent
                .filter((e) => e.includes('Code'))
                .map((e) => (
                  <Grid.Column>
                    {e.substring(0, e.indexOf(' ') + 1)}
                  </Grid.Column>
                ))}
            </Grid.Row>
            <Message>Mã không tìm thấy hồ sơ</Message>
            <Grid.Row columns={6}>
              {infoContent
                .filter((e) => e.includes('ProfileId'))
                .map((e) => (
                  <Grid.Column>
                    {e.substring(0, e.indexOf(' ') + 1)}
                  </Grid.Column>
                ))}
            </Grid.Row>
          </Grid>
        ) : (
          <>
            {isFormatted
              ? infoContent.split(/(\r\n|\n|\r)/gm).map((text) => {
                  if (text && text.length !== 1) {
                    return (
                      <Message key={text} style={{ fontSize: 14 }}>
                        {text}
                      </Message>
                    );
                  }
                  return null;
                })
              : Array.isArray(infoContent)
              ? infoContent.map((c) => (
                  // eslint-disable-next-line react/jsx-indent
                  <Message key={c} style={{ fontSize: 14 }}>
                    {c}
                  </Message>
                ))
              : infoContent}
          </>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button
          basic
          inverted
          color="red"
          content="Đóng"
          icon={
            <StyledIconWrapper>
              <FiX />
            </StyledIconWrapper>
          }
          onClick={() => dispatch(showInfoModal(null, null, null))}
        />
        {infoCallback && (
          <Button
            color="green"
            inverted
            content="Xác nhận"
            icon={
              <StyledIconWrapper>
                <FiCheck />
              </StyledIconWrapper>
            }
            onClick={() => {
              infoCallback();
              dispatch(showInfoModal(null, null, null));
            }}
          />
        )}
      </Modal.Actions>
    </Modal>
  );
};

export default InfoModal;
