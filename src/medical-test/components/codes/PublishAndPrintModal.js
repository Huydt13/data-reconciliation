/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Modal, Select, Message } from 'semantic-ui-react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import {
  getAvailableDiseaseToPrint,
  getAvailableDiseaseToPublish,
  getAvailableCodeToPrint,
  getAvailableCodeToPublish,
  getRePrintCode,
  getRePrintDisease,
} from 'medical-test/actions/medical-test';
import { useAuth } from 'app/hooks';
import SelectYear from 'app/components/shared/SelectYear';
import moment from 'moment';

const PublishAndPrintModal = (props) => {
  const { open, onClose, prefix, isPrint, isAvailable, onSubmit } = props;

  const { watch, register, setValue, getValues } = useForm();

  const {
    unitInfo,
    prefixList,
    getPrintDiseaseLoading,
    getPrintCodeLoading,
    publishAndPrintErrorMessage,
    getAvailableCodesToPrintLoading,
    availableCodeToPrint,
    getAvailableCodesToPublishLoading,
    availableCodeToPublish,
    getAvailableDiseasesToPrintLoading,
    availableDiseaseToPrintList,
    getAvailableDiseasesToPublishLoading,
    availableDiseaseToPublishList,
    rePrintCodeLoading,
    printCodeLoading,
    publishCodeLoading,
  } = useSelector((state) => state.medicalTest);

  const { isAdmin } = useAuth();
  const [options, setOptions] = useState([]);

  useEffect(() => {
    register({ name: 'unitCode' });
    register({ name: 'diseaseCode' });
    register({ name: 'year' });
    setValue('year', moment().format('YYYY'));
    if (!isAdmin) {
      setValue('unitCode', unitInfo?.code);
      setOptions(
        prefixList
          .filter((p) => p.id === unitInfo?.id)
          .map((p) => ({
            key: p.id,
            text: p.name,
            value: p.code,
          })),
      );
    } else {
      setOptions(
        prefixList.map((p) => ({
          key: p.id,
          text: p.name,
          value: p.code,
        })),
      );
    }
  }, [register, unitInfo, setValue, isAdmin, prefixList]);

  const loading =
    getAvailableCodesToPrintLoading ||
    getAvailableCodesToPublishLoading ||
    getAvailableDiseasesToPrintLoading ||
    getAvailableDiseasesToPublishLoading ||
    rePrintCodeLoading ||
    printCodeLoading ||
    publishCodeLoading ||
    getPrintDiseaseLoading ||
    getPrintCodeLoading;

  const diseaseOptions = isPrint
    ? availableDiseaseToPrintList
    : availableDiseaseToPublishList;
  const codeAmount = isPrint ? availableCodeToPrint : availableCodeToPublish;

  const unitCode = watch('unitCode');
  const year = watch('year');
  const diseaseCode = watch('diseaseCode');
  const allowToSubmit =
    watch('unitCode') && watch('diseaseCode') && watch('quantity');

  const dispatch = useDispatch();
  useEffect(() => {
    if (unitCode && year) {
      dispatch(
        isPrint
          ? !isAvailable
            ? getAvailableDiseaseToPrint(unitCode, year)
            : getRePrintDisease(unitCode, year)
          : getAvailableDiseaseToPublish(unitCode, year),
      );
    }
  }, [dispatch, unitCode, isPrint, isAvailable, year]);

  useEffect(() => {
    if (unitCode && diseaseCode && year) {
      dispatch(
        isPrint
          ? !isAvailable
            ? getAvailableCodeToPrint(unitCode, diseaseCode, year)
            : getRePrintCode(unitCode, diseaseCode, false, year)
          : getAvailableCodeToPublish(unitCode, diseaseCode, year),
      );
    }
  }, [dispatch, unitCode, diseaseCode, isPrint, isAvailable, year]);

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        {isPrint ? 'In mã xét nghiệm' : 'Cấp mã xét nghiệm'}
      </Modal.Header>
      <Modal.Content>
        <Form
          loading={loading}
          error={publishAndPrintErrorMessage.length !== 0}
          onSubmit={() => onSubmit(getValues())}
        >
          <Form.Group widths="equal">
            {!prefix && (
              <Form.Field
                required
                search
                deburr
                label="Tên cơ sở"
                control={Select}
                value={watch('unitCode') || ''}
                options={options}
                onChange={(e, { value }) => {
                  setValue('unitCode', value);
                }}
              />
            )}
            <SelectYear onChange={(y) => setValue('year', y)} />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              required
              search
              deburr
              clearable
              label="Loại bệnh"
              control={Select}
              options={(diseaseOptions || []).map((d) => ({
                key: d.id,
                text: `${d.name} - Mã bệnh: ${d.code}`,
                value: d.code,
              }))}
              onChange={(e, { value }) => setValue('diseaseCode', value)}
              disabled={!unitCode || !year}
            />
            <Form.Field
              required
              type="number"
              control={Input}
              label={`Số lượng có thể ${isPrint ? 'in' : 'cấp'}: ${codeAmount}`}
              name="quantity"
              input={{ ref: register, max: codeAmount }}
              disabled={!diseaseCode}
            />
          </Form.Group>
          <Message error content={publishAndPrintErrorMessage} />
          <Button primary disabled={!allowToSubmit}>
            Xác nhận
          </Button>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

PublishAndPrintModal.propTypes = {
  prefix: PropTypes.string,
  open: PropTypes.bool,
  isPrint: PropTypes.bool,
  isAvailable: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
};

PublishAndPrintModal.defaultProps = {
  prefix: '',
  open: false,
  isPrint: false,
  isAvailable: false,
  onClose: () => {},
  onSubmit: () => {},
};

export default PublishAndPrintModal;
