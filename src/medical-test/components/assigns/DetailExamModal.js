/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';

import { Header, Message, Modal } from 'semantic-ui-react';

import { useSelector } from 'react-redux';

import { DataTable, InfoRow } from 'app/components/shared';
import { formatToTime } from 'app/utils/helpers';

const DetailExamModal = ({ open, data, onClose }) => {
  const unitInfo = useSelector((s) => s.medicalTest.unitInfo);
  const labels = [
    { label: 'Lý do xét nghiệm', content: data?.reasonLevel1 },
    { label: 'Nơi xét nghiệm', content: data?.samplingPlace?.name },
    { label: 'Đơn vị lấy mẫu', content: data?.unit?.name },
    { label: 'Thời gian lấy mẫu', content: formatToTime(data?.dateTaken) },
    {
      label: 'Loại hình',
      content: data?.feeType === 0 ? 'Không thu phí' : 'Thu phí',
    },
  ];
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header content={data?.person?.name} />
      <Modal.Content>
        <Header as="h3" content="Thông tin lấy mẫu" />
        {labels.map((l) => (
          <InfoRow key={l.label} big label={l.label} content={l.content} />
        ))}
        <DataTable
          title="Danh sách mẫu bệnh phẩm"
          columns={[
            {
              Header: 'Mã xét nghiệm',
              formatter: ({ code }) =>
                code?.length === 12 ? <b>{code}</b> : code,
            },
            {
              Header: 'Mẫu bệnh phẩm',
              formatter: (row) => row?.diseaseSampleName ?? '',
            },
            { Header: 'Kỹ thuật xét nghiệm', accessor: 'testTechnique' },
          ]}
          data={
            data?.examinationDetails?.map((e) => ({
              ...e,
              diseaseSampleId: e.diseaseSample.id,
              diseaseSampleName: e.diseaseSample.name,
            })) ?? []
          }
        />
        {(!data?.isEditable || data?.unit?.id !== unitInfo?.id) && (
          <Message negative>
            <Message.Header>Không thể sửa/xóa</Message.Header>
            <Message.List>
              {data?.unit?.id !== unitInfo?.id && (
                <Message.Item>
                  Không thể sửa/xóa do không phải mẫu thuộc tài khoản hiện hành
                </Message.Item>
              )}
              {!data?.isEditable && (
                <Message.Item>
                  {`Mẫu ${data?.examinationDetails
                    ?.filter((ex) => !ex.isEditable)
                    .map((ex) => ex.code)
                    .join(
                      ', ',
                    )} đã tồn tại trong phiên chuyển mẫu, không thể sửa hoặc xóa mẫu`}
                </Message.Item>
              )}
            </Message.List>
          </Message>
        )}
      </Modal.Content>
    </Modal>
  );
};

DetailExamModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.shape({
    examinationDetails: PropTypes.arrayOf(PropTypes.shape({})),
    reasonLevel1: PropTypes.string,
    samplingPlace: PropTypes.shape({
      name: PropTypes.string,
    }),
    unit: PropTypes.shape({
      name: PropTypes.string,
    }),
    dateTaken: PropTypes.string,
    person: PropTypes.shape({
      name: PropTypes.string,
    }),
    feeType: PropTypes.number,
  }),
};

DetailExamModal.defaultProps = {
  data: {},
};

export default DetailExamModal;
