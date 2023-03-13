import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Modal } from 'semantic-ui-react';

import moment from 'moment';
import { InfoRow } from 'app/components/shared';

const MedicalTestDetailModal = (props) => {
  const { open, onClose, data } = props;
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>{data?.person.name}</Modal.Header>
      <Modal.Content>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Header content="Thông tin chung" />
              <InfoRow
                label="Đơn vị lấy mẫu"
                content={data?.unit.name ?? '...'}
              />
              <InfoRow
                label="Thời gian lấy mẫu"
                content={
                  moment(data?.dateTaken).format('HH:mm | DD-MM-YYYY') ?? '...'
                }
              />
              <InfoRow label="Loại bệnh" content={data?.diseaseName ?? '...'} />
              <InfoRow
                label="Loại mẫu xét nghiệm"
                content={data?.examinationType.name ?? '...'}
              />
              <InfoRow
                label="Loại hình"
                content={data?.feeType === 1 ? 'Thu phí' : 'Không thu phí'}
              />
              <Header content="Danh sách mẫu bệnh phẩm" />
              {data?.examinationDetails.map((ex, i) => (
                <>
                  {`${i + 1}. ${ex.code} - ${ex.diseaseSample.name} - ${
                    ex.testTechnique
                  }`}
                  <br />
                  {`Kết quả: ${ex.result} ngày ${moment(ex.resultDate).format(
                    'DD-MM-YYYY',
                  )}`}
                  <br />
                  {`Nơi xét nghiệm: ${ex.unitName}`}
                </>
              ))}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Modal.Content>
    </Modal>
  );
};

MedicalTestDetailModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.shape({
    person: PropTypes.shape({
      name: PropTypes.string,
    }),
    unit: PropTypes.shape({
      name: PropTypes.string,
    }),
    diseaseSample: PropTypes.shape({
      name: PropTypes.string,
    }),
    dateTaken: PropTypes.string,
    diseaseId: PropTypes.string,
    examinationType: PropTypes.shape({
      name: PropTypes.string,
    }),
    examinationDetails: PropTypes.array,
  }),
};

MedicalTestDetailModal.defaultProps = {
  data: {},
};

export default MedicalTestDetailModal;
