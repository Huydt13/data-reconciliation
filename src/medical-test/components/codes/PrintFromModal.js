import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Modal, Select } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getRePrintCode,
  getRePrintDisease,
} from 'medical-test/actions/medical-test';
import { useAuth } from 'app/hooks';
import { useForm } from 'react-hook-form';
import SelectYear from 'app/components/shared/SelectYear';
import moment from 'moment';

const PrintFromModal = (props) => {
  const { open, onClose, onSubmit } = props;
  const { watch, register, setValue, getValues } = useForm();

  const {
    unitInfo,
    prefixList,
    getPrefixesLoading,
    getPrintDiseaseLoading,
    getPrintCodeLoading,
    publishAndPrintErrorMessage,
    getAvailableCodesToPrintLoading,
    availableDiseaseToPrintList,
    getAvailableCodesToPublishLoading,
    getAvailableDiseasesToPrintLoading,
    getAvailableDiseasesToPublishLoading,
    rePrintCodeLoading,
    printCodeLoading,
    publishCodeLoading,
    availableCodeToPrintList,
  } = useSelector((state) => state.medicalTest);
  const loading =
    getPrefixesLoading ||
    getAvailableCodesToPrintLoading ||
    getAvailableCodesToPublishLoading ||
    getAvailableDiseasesToPrintLoading ||
    getAvailableDiseasesToPublishLoading ||
    rePrintCodeLoading ||
    printCodeLoading ||
    publishCodeLoading ||
    getPrintDiseaseLoading ||
    getPrintCodeLoading;

  const { isAdmin } = useAuth();
  const [options, setOptions] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedDisease, setSelectedDisease] = useState(null);

  useEffect(() => {
    register({ name: 'startCode' });
    register({ name: 'year' });
    setValue('year', moment().format('YYYY'));
    if (!isAdmin) {
      if (unitInfo) {
        setSelectedUnit(unitInfo);
      }
      setOptions(
        prefixList
          .filter((p) => p.id === unitInfo?.id)
          .map((p) => ({
            key: p.id,
            text: p.name,
            value: p.id,
          })),
      );
    } else {
      setOptions(
        prefixList.map((p) => ({
          key: p.id,
          text: p.name,
          value: p.id,
        })),
      );
    }
  }, [register, unitInfo, setValue, isAdmin, prefixList]);

  const dispatch = useDispatch();
  const year = watch('year');
  useEffect(() => {
    if (selectedUnit && year) {
      dispatch(getRePrintDisease(selectedUnit.code, year));
    }
  }, [dispatch, selectedUnit, year]);

  useEffect(() => {
    if (selectedUnit && selectedDisease && year) {
      dispatch(
        getRePrintCode(selectedUnit.code, selectedDisease.code, true, year),
      );
    }
  }, [dispatch, selectedUnit, selectedDisease, year]);

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>In mã xét nghiệm chọn lọc</Modal.Header>
      <Modal.Content>
        <Form
          loading={loading}
          error={publishAndPrintErrorMessage.length !== 0}
          onSubmit={() => onSubmit(getValues())}
        >
          <Form.Group widths="equal">
            <Form.Field
              required
              search
              deburr
              label="Tên cơ sở"
              control={Select}
              options={options}
              value={selectedUnit?.id}
              onChange={(e, { value }) => {
                setSelectedUnit(prefixList.find((pr) => pr.id === value));
              }}
            />
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
              value={selectedDisease?.code ?? ''}
              options={(availableDiseaseToPrintList || []).map((d) => ({
                key: d.id,
                text: `${d.name} - Mã bệnh: ${d.code}`,
                value: d.code,
              }))}
              onChange={(e, { value }) =>
                setSelectedDisease(
                  availableDiseaseToPrintList.find((d) => d.code === value),
                )
              }
              disabled={!selectedUnit || !year}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              search
              required
              clearable
              control={Select}
              label="Mã bắt đầu in"
              disabled={!selectedUnit?.id || !selectedDisease || !year}
              options={(availableCodeToPrintList || []).map((p) => ({
                key: p,
                text: p,
                value: p,
              }))}
              onChange={(e, { value }) => {
                setValue('startCode', value);
              }}
            />
            <Form.Field
              required
              type="number"
              control={Input}
              label="Số lượng in"
              name="quantity"
              input={{ ref: register }}
              disabled={!selectedUnit || !selectedDisease}
            />
          </Form.Group>
          <Button primary disabled={!watch('quantity') || !watch('startCode')}>
            Xác nhận
          </Button>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

PrintFromModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
};

PrintFromModal.defaultProps = {
  open: false,
  onClose: () => {},
  onSubmit: () => {},
};

export default PrintFromModal;
