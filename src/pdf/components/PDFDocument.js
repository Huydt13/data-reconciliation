/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';

import moment from 'moment';

import LoraMedium from 'app/assets/fonts/LoraMedium.ttf';
import LoraBold from 'app/assets/fonts/LoraBold.ttf';
import LoraItalic from 'app/assets/fonts/LoraItalic.ttf';
import LoraBoldItalic from 'app/assets/fonts/LoraBoldItalic.ttf';

import nations from 'app/assets/mock/nations.json';
import locations from 'app/assets/mock/locations.json';

Font.register({
  family: 'LoraMedium',
  src: LoraMedium,
});
Font.register({
  family: 'LoraBold',
  src: LoraBold,
});
Font.register({
  family: 'LoraItalic',
  src: LoraItalic,
});
Font.register({
  family: 'LoraBoldItalic',
  src: LoraBoldItalic,
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    fontSize: '13px',
    flexWrap: 'wrap',
    fontFamily: 'LoraMedium',
    paddingTop: 50,
  },
  section: {
    margin: '0 10px 0 10px',
    padding: '0 10px 0 10px',
    flexGrow: 1,
    alignItems: 'center',
  },
  center: {
    textAlign: 'center',
  },
  bold: {
    fontFamily: 'LoraBold',
  },
  italic: {
    fontFamily: 'LoraItalic',
  },
  boldItalic: {
    fontFamily: 'LoraBoldItalic',
  },
  paddingBottom2: {
    paddingBottom: 2,
  },
  marginLeft50: {
    marginLeft: 50,
  },
  left50: {
    left: 50,
  },
  paddingLeft100: {
    paddingLeft: 100,
  },
  paddingLeft11: {
    paddingLeft: 11,
  },
  paddingLeft21: {
    paddingLeft: 21,
  },
  paddingTop8: {
    paddingTop: 8,
  },
  marginTop40: {
    marginTop: 40,
  },
  paddingVertical15: {
    paddingVertical: '15px 0 5px 0',
  },
  borderBottom: {
    borderBottom: '1px solid black',
  },
  paddingHorizontal40: {
    paddingHorizontal: 40,
    textAlign: 'justify',
    lineHeight: 1.8,
  },
  paddingHorizontal50: {
    paddingHorizontal: 50,
    textAlign: 'justify',
    lineHeight: 1.8,
  },
  footer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 50,
    paddingRight: 100,
    marginTop: 10,
  },
  signature: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 50,
    paddingRight: 90,
  },
  tableWidth: {
    width: '100vw',
    right: 32.5,
    paddingRight: 32.5,
  },
});

// const Table = ({ children }) => (
//   <View
//     style={{
//       marginTop: 8,
//       marginBottom: 8,
//       borderTop: '1 solid black',
//       borderLeft: '1 solid black',
//       display: 'flex',
//       flexDirection: 'column',
//     }}
//   >
//     {children}
//   </View>
// );

// const TableRow = ({ children }) => (
//   <View
//     style={{
//       display: 'flex',
//       flexDirection: 'row',
//       textAlign: 'center',
//     }}
//   >
//     {children}
//   </View>
// );

// const TableCell = ({ children }) => (
//   <View
//     style={{
//       flex: 1,
//       borderRight: '1 solid black',
//       borderBottom: '1 solid black',
//       paddingLeft: 10,
//     }}
//   >
//     <Text>{children}</Text>
//   </View>
// );

const formatAddress = (adds) => adds.map((e) => {
  if (e) {
    const { locationType, name } = e;
    let formattedFloor = '';
    let formattedBlock = '';
    let formattedStreet = '';
    let formattedWard = '';
    let formattedDistrict = '';
    let formattedProvince = '';

    formattedFloor = e.floor ? `Tầng ${e.floor}, ` : '';
    formattedBlock = e.block ? `Lô ${e.block}, ` : '';
    formattedStreet = e.streetHouseNumber
      ? `${e.streetHouseNumber}, `
      : '';
    formattedProvince = e.provinceValue
      ? locations.find((p) => p.value === e.provinceValue).label
      : '';
    formattedDistrict = (e.districtValue && e.provinceValue)
      ? `${locations
        .find((p) => p.value === e.provinceValue)
        .districts.find((d) => d.value === e.districtValue).label}, `
      : '';
    formattedWard = (e.wardValue && e.provinceValue && e.districtValue)
      ? `${locations
        .find((p) => p.value === e.provinceValue)
        .districts.find((d) => d.value === e.districtValue)
        .wards.find((w) => w.value === e.wardValue).label}, `
      : '';
    if (!formattedProvince && !formattedDistrict && !formattedWard) {
      return {
        ...e,
        formattedAddress: 'Chưa xác định',
      };
    }
    return {
      ...e,
      formattedAddress:
        `${locationType ?? ''} ${name ?? ''} ${formattedFloor}${formattedBlock}${formattedStreet
        }${formattedWard}${formattedDistrict}${formattedProvince}`,
    };
  }
  return [];
});

const PDFDocument = (props) => {
  const {
    data,
    symptoms,
    subjectId,
  } = props;
  const [initialData, setInitialData] = useState({
    addresses: [],
    alias: '',
    code: '',
    job: '',
    contacts: [],
    covidPositiveExaminationRecord: {
      dateCreated: '',
    },
    contactSituation: '',
    dateCreated: '',
    dateOfBirth: '',
    fullName: '',
    gender: 1,
    hasYearOfBirthOnly: false,
    nationalityCode: '',
    symptomStatuses: [],
    workAddresses: [],
    quarantineLocations: [],
  });

  useEffect(() => {
    if (data) {
      setInitialData(data);
    }
  }, [data]);

  const {
    addresses,
    job,
    code,
    contacts,
    covidPositiveExaminationRecord,
    dateCreated,
    dateOfBirth,
    fullName,
    gender,
    nationalityCode,
    symptomStatuses,
    workAddresses,
    quarantineLocations,
  } = initialData;

  const nationName = nationalityCode ? nations.find((n) => n.countryCode === nationalityCode).name : '';
  const fromContactData = contacts.find((c) => c.fromSubjectId !== subjectId);
  const toContactData = contacts.filter((c) => c.fromSubjectId === subjectId);

  const formattedSymptoms = (st) => {
    if (st?.length && symptoms?.length) {
      return st.map((e) => ({
        ...e,
        name: symptoms.find((s) => s.id === e.symptomId)?.name ?? '',
        formattedDate: moment(e.dateExposed, 'YYYY-MM-DD').format('DD-MM-YYYY'),
      }));
    }
    return [];
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>SỞ Y TẾ TP.HỒ CHÍ MINH</Text>
          <Text style={styles.bold}>TRUNG TÂM KIỂM SOÁT </Text>
          <Text
            style={[styles.bold, styles.paddingBottom2, styles.borderBottom]}
          >
            BỆNH TẬT THÀNH PHỐ
          </Text>
          <Text style={[styles.paddingTop8]}>Số :         /KSBT-BTN</Text>
          <Text>V/v báo cáo nhanh 01 trường hợp </Text>
          <Text>xác định nhiễm COVID-19</Text>
          <Text style={[styles.paddingVertical15]}>Kính gửi:</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.bold}>CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM</Text>
          <Text
            style={[styles.bold, styles.paddingBottom2, styles.borderBottom]}
          >
            Độc lập - Tự do - Hạnh phúc
          </Text>
          <Text style={[styles.italic, styles.paddingTop8]}>
            TP.Hồ Chí Minh, ngày      tháng      năm 2020
          </Text>
        </View>
        <View style={styles.paddingHorizontal40}>
          <Text style={styles.paddingLeft100}>
            -  Viện Pasteur thành phố Hồ Chí Minh;
          </Text>
          <Text style={styles.paddingLeft100}>
            -  Sở Y tế thành phố Hồ Chí Minh.
          </Text>
        </View>
        <View style={styles.paddingHorizontal40}>
          <Text style={[styles.paddingLeft21]}>
            Trung tâm Kiểm soát bệnh tật báo cao nhanh thông tin về 1 trường hợp
            xác định
          </Text>
          <Text>nhiễm COVID-19 tại thành phố Hồ Chí Minh như sau:</Text>
        </View>
        <View style={styles.paddingHorizontal50}>
          <Text style={styles.bold}>1. Thông tin ca bệnh</Text>
          <Text>
            -  Ngày nhận thông tin: ngày
            {' '}
            {moment(dateCreated).format('DD-MM-YYYY')}
            .
          </Text>
          <Text>
            -  Bệnh nhân:
            {' '}
            <Text style={styles.bold}>{fullName}</Text>
            ,
            {' '}
            {gender === 1 ? 'nam' : 'nữ'}
            , sinh năm
            {' '}
            {moment(dateOfBirth).year()}
            , quốc tịch
            {' '}
            {nationName}
            {' '}
            (Sau đây gọi tắt là BN
            {code}
            ).
          </Text>
          <Text>
            {symptomStatuses?.length > 0 && (
              <Text>
                -  Ngày
                {' '}
                {(formattedSymptoms(symptomStatuses))[0]?.formattedDate ?? ''}
                {' '}
                BN có triệu chứng
                {' '}
                {formattedSymptoms(symptomStatuses).map((e) => e.name && e.name?.toLowerCase()).join(', ')}
                .
              </Text>
            )}
          </Text>
          {quarantineLocations.map((e) => (
            <Text key={e.id}>
              -  BN đã được chuyển về
              {' '}
              {e.quarantineZone.name}
              {' '}
              ngày
              {' '}
              {moment(e.enterRoomDate).format('DD-MM-YYYY') || ''}
              .
            </Text>
          ))}
          {addresses.length === 1 && (
            <Text>
              -  Điạ chỉ nơi ở:
              {' '}
              {addresses.length === 1 && formatAddress(addresses).map((e) => (
                <Text key={e.id}>
                  {`${e.formattedAddress}`}
                </Text>
              ))}
              .
            </Text>
          )}
          {addresses.length > 1 && formatAddress(addresses).map((e, i) => (
            <Text key={e.id} style={styles.paddingLeft21}>
              {`${i + 1}. `}
              {`${e.formattedAddress}`}
              .
            </Text>
          ))}
          {workAddresses.length === 1 && (
            <Text>
              -  Điạ chỉ nơi làm việc/ học tập:
              {' '}
              {workAddresses.length === 1 && formatAddress(workAddresses).map((e) => (
                <Text key={e.id}>
                  {`${e.formattedAddress}`}
                </Text>
              ))}
              .
            </Text>
          )}
          {workAddresses.length > 1 && formatAddress(workAddresses).map((e, i) => (
            <Text key={e.id} style={styles.paddingLeft21}>
              {`${i + 1}. `}
              {`${e.formattedAddress}`}
              .
            </Text>
          ))}
          <Text>
            -  Yếu tố liên quan:
            {fromContactData && (
              <Text>
                {' '}
                Là
                {' '}
                {fromContactData.fromSubjectConnections[0].relationship?.toLowerCase() || ''}
                ,
                {' '}
                tiếp xúc với
                {' '}
                BN
                {fromContactData.fromSubject?.code ?? '(Chưa có bí danh)'}
                {' '}
                tại
                {' '}
                {fromContactData.contactLocation
                  ? `${fromContactData?.contactLocation?.locationType?.toLowerCase() ?? ''} ${fromContactData?.contactLocation?.name ?? ''}`
                  : `${fromContactData?.contactVehicle?.vehicleType?.toLowerCase() ?? ''} ${fromContactData?.contactVehicle?.vehicleName ?? ''}`}
                {toContactData?.length > 0 ? ';' : '.' }
                {' '}
              </Text>
            )}
            {toContactData?.length > 0 && (
              <View>
                {(toContactData ?? []).map((c, i) => (
                  <Text key={c.id}>
                    {i === 0 && ' '}
                    tiếp xúc với
                    {' '}
                    {(c.toSubjects).map((s, j) => (
                      <Text key={s.id}>
                        {c?.fromSubjectConnections[j]?.relationship?.toLowerCase() ?? ''}
                        {' '}
                        là BN
                        {s?.code ?? '(Chưa có bí danh)'}
                        {j < c?.toSubjects.length - 1 && ', '}
                      </Text>
                    ))}
                    {' '}
                    tại
                    {' '}
                    {c.contactLocation
                      ? `${c?.contactLocation?.locationType?.toLowerCase() ?? ''} ${c?.contactLocation?.name ?? ''}`
                      : `${c?.contactVehicle?.vehicleType?.toLowerCase() ?? ''} ${c?.contactVehicle?.vehicleName ?? ''}`}
                    {i < toContactData.length - 1 && '; '}
                  </Text>
                ))}
                .
              </View>
            )}
          </Text>

          <Text style={styles.bold}>
            2. Lịch sử đi lại và tiền sử tiếp xúc của BN
          </Text>
          <Text>
            BN có tiếp xúc với
            {fromContactData && (
              <Text>
                {' '}
                BN
                {' '}
                {fromContactData.fromSubject?.code ?? '(Chưa có bí danh)'}
                {' '}
                tại
                {' '}
                {fromContactData.contactLocation
                  ? `${fromContactData?.contactLocation?.locationType?.toLowerCase() ?? ''} ${fromContactData?.contactLocation?.name ?? ''}`
                  : `${fromContactData?.contactVehicle?.vehicleType?.toLowerCase() ?? ''} ${fromContactData?.contactVehicle?.vehicleName ?? ''}`}
                {toContactData?.length > 0 ? ';' : '.' }
                {' '}
              </Text>
            )}
            <Text>
              {toContactData?.length > 0 && (
                <Text>
                  {(toContactData ?? []).map((c, i) => (
                    <Text key={c.id}>
                      {c.toSubjects.map((s, j) => (
                        <Text key={s.id}>
                          {' '}
                          BN
                          {s?.code ?? '(Chưa có bí danh)'}
                          {j < c?.toSubjects.length - 1 && ', '}
                        </Text>
                      ))}
                      {' '}
                      tại
                      {' '}
                      {c.contactLocation
                        ? `${c?.contactLocation?.locationType?.toLowerCase() ?? ''} ${c?.contactLocation?.name ?? ''}`
                        : `${c?.contactVehicle?.vehicleType?.toLowerCase() ?? ''} ${c?.contactVehicle?.vehicleName ?? ''}`}
                      {i < toContactData.length - 1 && '; '}
                    </Text>
                  ))}
                  {'. '}
                </Text>
              )}
            </Text>
            Công việc chính của BN là
            {' '}
            {job || 'chưa xác định'}
            . Cụ thể các
            tiếp xúc khác như sau:
          </Text>
          {fromContactData && (
            <Text>
              {fromContactData.fromTime === fromContactData.toTime ? (
                <>
                  -  Vào
                  {' '}
                  {fromContactData.fromTimeHasDateOnly ? moment(fromContactData.fromTime).format('ngày DD-MM-YYYY') : moment(fromContactData.fromTime).format('HH:mm giờ ngày DD-MM-YYYY')}
                </>
              ) : (
                <>
                  -  Từ
                  {' '}
                  {fromContactData.fromTimeHasDateOnly ? moment(fromContactData.fromTime).format('ngày DD-MM-YYYY') : moment(fromContactData.fromTime).format('HH:mm giờ ngày DD-MM-YYYY')}
                  {' '}
                  đến
                  {' '}
                  {fromContactData.toTimeHasDateOnly ? moment(fromContactData.toTime).format('ngày DD-MM-YYYY') : moment(fromContactData.toTime).format('HH:mm giờ ngày DD-MM-YYYY')}
                </>
              )}
              {' '}
              gặp
              {' '}
              BN
              {fromContactData.fromSubject.code ?? '(Chưa có bí danh)'}
              {' '}
              tại
              {' '}
              {fromContactData.contactLocation
                ? `${fromContactData?.contactLocation?.locationType?.toLowerCase() ?? ''} ${fromContactData?.contactLocation?.name ?? ''}`
                : `${fromContactData?.contactVehicle?.vehicleType?.toLowerCase() ?? ''} ${fromContactData?.contactVehicle?.vehicleName ?? ''}`}
              {'.'}
            </Text>
          )}
          {(toContactData ?? []).map((c) => (
            <Text key={c.id}>
              {c.fromTime === c.toTime ? (
                <>
                  -  Vào
                  {' '}
                  {c.fromTimeHasDateOnly ? moment(c.fromTime).format('ngày DD-MM-YYYY') : moment(c.fromTime).format('HH:mm giờ ngày DD-MM-YYYY')}

                </>
              ) : (
                <>
                  -  Từ
                  {' '}
                  {c.fromTimeHasDateOnly ? moment(c.fromTime).format('ngày DD-MM-YYYY') : moment(c.fromTime).format('HH:mm giờ ngày DD-MM-YYYY')}
                  {' '}
                  đến
                  {' '}
                  {c.toTimeHasDateOnly ? moment(c.toTime).format('ngày DD-MM-YYYY') : moment(c.toTime).format('HH:mm giờ ngày DD-MM-YYYY')}
                </>
              )}
              {' '}
              gặp
              {' '}
              {c.toSubjects.map((s, j) => (
                <Text key={s.id}>
                  BN
                  {s?.code ?? '(Chưa có bí danh)'}
                  {j < c?.toSubjects.length - 1 ? ', ' : ' '}
                </Text>
              ))}
              tại
              {' '}
              {c.contactLocation
                ? `${c?.contactLocation?.locationType?.toLowerCase() ?? ''} ${c?.contactLocation?.name ?? ''}`
                : `${c?.contactVehicle?.vehicleType?.toLowerCase() ?? ''} ${c?.contactVehicle?.vehicleName ?? ''}`}
              {'.'}
            </Text>
          ))}
          <Text>
            {Boolean(covidPositiveExaminationRecord?.dateCreated) && (
              <Text>
                -
                {' '}
                Ngày
                {' '}
                {moment(covidPositiveExaminationRecord.dateCreated).format('DD-MM-YYYY')}
                {' '}
                tiến hành xét nghiệm tại
                {' '}
                {covidPositiveExaminationRecord.takenFrom}
                {' '}
                có kết quả dương tính, xác minh nhiễm COVID-19.
              </Text>
            )}
          </Text>
          {quarantineLocations.map((q) => (
            <Text>
              -
              {' '}
              Ngày
              {' '}
              {moment(q.enterRoomDate).format('DD-MM-YYYY')}
              {', '}
              BN được chuyển vào cách ly tại khu cách ly
              {' '}
              {q.quarantineZone.isTreatmentZone ? 'điều trị' : 'kiểm dịch'}
              {' '}
              {q.quarantineZone.name}
              .
            </Text>
          ))}
          {/* <Text style={styles.bold}>3. Các hoạt động đã triển khai</Text>
          <Text>
            -  Tiếp cận BN điều tra tiền sử đi lại, lập danh sách tiếp xúc và
            phối hợp các quận, huyện liên quan xác minh, lấy mẫu xét nghiệm, cụ
            thể:
          </Text>
          <View style={styles.tableWidth}>
            <Table>
              <TableRow>
                <TableCell>key</TableCell>
                <TableCell>value</TableCell>
                <TableCell>va*ue</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>1</TableCell>
                <TableCell>a</TableCell>
                <TableCell>*</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2</TableCell>
                <TableCell>b</TableCell>
                <TableCell>*</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>3</TableCell>
                <TableCell>c</TableCell>
                <TableCell>*</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>4</TableCell>
                <TableCell>d</TableCell>
                <TableCell>*</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>5</TableCell>
                <TableCell>e</TableCell>
                <TableCell>*</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>6</TableCell>
                <TableCell>f</TableCell>
                <TableCell>*</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>7</TableCell>
                <TableCell>g</TableCell>
                <TableCell>*</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>8</TableCell>
                <TableCell>h</TableCell>
                <TableCell>*</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>9</TableCell>
                <TableCell>i</TableCell>
                <TableCell>*</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>10</TableCell>
                <TableCell>j</TableCell>
                <TableCell>*</TableCell>
              </TableRow>
            </Table>
          </View> */}
          <Text>Trung tâm Kiểm soát bệnh tật thành phố kính báo.</Text>
        </View>

        <View style={styles.footer}>
          <View>
            <Text style={[styles.boldItalic, styles.alignItemsFlexStart]}>
              Nơi nhận:
            </Text>
            <Text style={styles.alignItemsFlexStart}>- Như trên;</Text>
            <Text style={styles.alignItemsFlexStart}>- Viện Pasteur TPHCM;</Text>
            <Text style={styles.alignItemsFlexStart}>
              - BS Nguyễn Hữu Hưng PGĐ SYT;
            </Text>
            <Text style={styles.alignItemsFlexStart}>
              - Phòng Nghiệp vụ Y – SYT;
            </Text>
            <Text style={styles.alignItemsFlexStart}>
              - Lưu: PCBTN, KHNV, TCHC.
            </Text>
            {/* <Text style={styles.alignItemsFlexStart}>(LHN – LTAT: 6b)</Text> */}
          </View>
          <View style={[styles.bold]}>
            <Text>
              {' '}
              {' '}
              KT. GIÁM ĐỐC
            </Text>
            <Text>PHÓ GIÁM ĐỐC</Text>
          </View>
        </View>
        <View style={[styles.signature, styles.marginTop40, styles.bold]}>
          <Text>{' '}</Text>
          {/* <Text>Huỳnh Ngọc Thành</Text> */}
        </View>
      </Page>
    </Document>
  );
};

PDFDocument.propTypes = {
  data: PropTypes.shape({
    addresses: PropTypes.arrayOf(PropTypes.shape({})),
    alias: PropTypes.string,
    contactSituation: PropTypes.string,
    dateCreated: PropTypes.string,
    dateOfBirth: PropTypes.string,
    fullName: PropTypes.string,
    gender: PropTypes.number,
    hasYearOfBirthOnly: PropTypes.bool,
    nationalityCode: PropTypes.string,
    symptomStatuses: PropTypes.arrayOf(PropTypes.shape({})),
    workAddresses: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  symptoms: PropTypes.arrayOf(PropTypes.shape({})),
  subjectId: PropTypes.string,
};

PDFDocument.defaultProps = {
  data: {
    addresses: [],
    alias: '',
    contactSituation: '',
    dateCreated: '',
    dateOfBirth: '',
    fullName: '',
    gender: 1,
    hasYearOfBirthOnly: false,
    nationalityCode: '',
    symptomStatuses: [],
    workAddresses: [],
  },
  symptoms: [],
  subjectId: '',
};

export default PDFDocument;
