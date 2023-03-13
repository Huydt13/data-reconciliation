import React, { useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {
  Button,
  Dimmer,
  Form,
  Grid,
  Header,
  Loader,
  Modal,
} from 'semantic-ui-react';
import moment from 'moment';

import { useDispatch, useSelector } from 'react-redux';
import { getQuarantineRequestDetail } from 'quarantine/actions/quarantine-request';
import { getFacilities } from 'quarantine/actions/facility';
import { InfoRow } from 'app/components/shared';
import { formatObjectToAddress } from 'app/utils/helpers';

const StyledMinimizeWrapper = styled.div`
  & .ui.label {
    margin-left: 3px !important;
    margin-right: 0 !important;
    margin-bottom: 3px;
    font-weight: normal !important;
    font-size: 0.9em !important;
  }
  & .detail {
    margin-left: 3px !important;
  }
`;

const ButtonWrapper = styled.div`margin-top: 16px;`;

const DetailQuarantineRequestModal = (props) => {
  const {
    open,
    onClose,
    onApprove,
    onDecline,
    requestId,
  } = props;
  const dispatch = useDispatch();
  const {
    facilityData: { data: facilityList },
    getFacilitiesLoading,
  } = useSelector((s) => s.facility);
  useEffect(() => {
    if (!facilityList?.length === 0) {
      dispatch(getFacilities({ pageIndex: 0, pageSize: 10000 }));
    }
    if (requestId) {
      dispatch(getQuarantineRequestDetail(requestId));
    }
    // eslint-disable-next-line
  }, [dispatch, requestId]);
  const {
    quarantineRequestDetail: d,
    getQuarantineRequestLoading,
  } = useSelector((s) => s.quarantineRequest);
  const loading = getFacilitiesLoading || getQuarantineRequestLoading;

  const labels = [
    {
      rowIndex: 0,
      header: 'Thông tin người đăng ký',
      col: [
        {
          key: 'fullName',
          label: 'Họ và tên',
          value: d.requester?.fullName,
        },
        {
          key: 'dateOfBirth',
          label: `${
            !d.requester?.hasYearOfBirthOnly ? 'Ngày sinh' : 'Năm sinh'
          }`,
          value: moment(d.requester?.dateOfBirth).format(
            d.requester?.hasYearOfBirthOnly ? 'YYYY' : 'DD-MM-YYYY',
          ),
        },
        {
          key: 'gender',
          label: 'Giới tính',
          value: d.requester?.gender === 0 ? 'Nữ' : 'Nam',
        },
        {
          key: 'identityNumber',
          label: 'CMND/Hộ chiếu',
          value:
            d.requester?.identityNumber ?? d.requester?.passportNumber ?? '',
        },
        {
          key: 'phoneNumber',
          label: 'Số điện thoại',
          value: d.requester?.phoneNumber ?? '',
        },
        { key: 'email', label: 'Email', value: d.requester?.email ?? '' },
      ],
    },
    {
      rowIndex: 1,
      header: 'Thông tin địa điểm đăng ký cách ly',
      col: [
        {
          key: 'facility',
          label: 'Khu/Khách sạn đăng ký',
          value:
            (facilityList || []).find(
              (f) => f.id === d.facilityRequest?.facilityId ?? '',
            )?.name ?? '',
        },
        {
          key: 'homeRequest',
          label: 'Địa chỉ nhà đăng ký',
          value: formatObjectToAddress({
            address: d.homeRequest?.homeAddress,
          }),
        },
      ],
    },
  ];
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Chi tiết phiếu đăng ký</Modal.Header>
      <Modal.Content>
        {loading ? (
          <Dimmer active inverted>
            <Loader inverted>Loading</Loader>
          </Dimmer>
        ) : (
          <>
            <StyledMinimizeWrapper>
              <Grid columns={labels.length}>
                <Grid.Row>
                  {labels.map((r) => (
                    <Grid.Column key={r.rowIndex}>
                      <Header content={r.header} />
                      {r.col.map((f) => (
                        <InfoRow
                          key={f.key}
                          label={f.label}
                          content={f?.value ?? '...'}
                        />
                      ))}
                    </Grid.Column>
                  ))}
                </Grid.Row>
              </Grid>
            </StyledMinimizeWrapper>
            {d && !d.finalApproval && (
              <Form loading={loading}>
                <ButtonWrapper>
                  <Button
                    basic
                    color="green"
                    content="Chấp nhận"
                    onClick={onApprove}
                  />
                  <Button
                    basic
                    color="red"
                    content="Từ chối"
                    onClick={onDecline}
                  />
                </ButtonWrapper>
              </Form>
            )}
          </>
        )}
      </Modal.Content>
    </Modal>
  );
};

DetailQuarantineRequestModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
  onDecline: PropTypes.func.isRequired,
  requestId: PropTypes.string.isRequired,
};

export default DetailQuarantineRequestModal;
