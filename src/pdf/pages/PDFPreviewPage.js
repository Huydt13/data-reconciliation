import React, { useEffect } from 'react';
import PDFDocument from 'pdf/components/PDFDocument';
import { PDFViewer } from '@react-pdf/renderer';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getReport, getSymptoms } from 'infection-chain/actions/subject';

const PDFPreviewPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    if (id) {
      dispatch(getReport(id));
    }
    dispatch(getSymptoms());
  }, [id, dispatch]);
  const { report, symptomList } = useSelector((state) => state.subject);

  return (
    <PDFViewer style={{ width: '100%', height: '100vh' }}>
      <PDFDocument data={report} symptoms={symptomList} subjectId={id} />
    </PDFViewer>
  );
};

export default PDFPreviewPage;
