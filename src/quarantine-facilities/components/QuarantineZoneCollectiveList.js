import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFacilities } from 'quarantine-facilities/actions/quarantine-facility';
import { DataTable } from 'app/components/shared';
import { FiDelete, FiEdit, FiEye, FiLock, FiPlus, FiUnlock } from 'react-icons/fi';

const QuarantineZoneCollectiveList = (props) => {
  const dispatch = useDispatch();
  const { facilityData } = useSelector(state => state.quarantineFacility);
  console.log(facilityData);    
  useEffect(() => {
    dispatch(getFacilities({pageIndex:0,pageSize: 10 }));
  }, [dispatch])
  const columns = [
      { Header: '#', accessor: 'index' },
      {Header:"Khu",accessor: "Khu"}
  	  ,{Header:"Địa Chỉ",accessor: "DiaChi"}
    	,{Header:"Người Liên Hệ",accessor:"NguoiLienHe"}
      ,{Header:"SĐT	",accessor:"SDT"}
      ,{Header:"Loại Hình",accessor:"LoaiHinh"}
      ,{Header:"Tổng số phòng",accessor:"TongSophong"}
      ,{Header:"Tổng số giường",accessor:"TongSoGiuong"}
      ,{Header:"Tổng số người đang cách ly",accessor:"SoNguoiDangCachLy"}
      ,{Header:"Tổng số giường còn lại",accessor:"TongGiuongConLai"}
      ,{Header:"Tổng số giường sẵn sàng",accessor:"TongGiuongSanSang"}
  ];

  const data = [
    { id: 1,
      Khu: 'Khu cách ly tập trung Quận Phú Nhuận', 
      DiaChi: '19/21 phú nhuận' ,
      NguoiLienHe: 'Nguyễn Văn A' ,
      SDT: '0123456789' ,
      LoaiHinh: 'khu cách ly tập chung' ,
      TongSophong: 100 ,
      TongSoGiuong: 150 ,
      SoNguoiDangCachLy: 120 ,
      TongGiuongConLai: 30 ,
      TongGiuongSanSang: 20 ,
    }
    
  ];

  return (
    <div> 
      <DataTable 
      title="Danh sách khu cách ly Tập Chung"
      columns={columns}
      data={(data || []).map((r, i) => ({ ...r, index: i + 1 }))}
      pageCount={data.length}
      pageIndex ={1}
      actions = {[
        {
          title: 'Thêm khu cách ly',
          color: 'green',
          icon: <FiPlus />,
          globalAction: true,
        },
        {
          title: 'Sửa Thông Tin',
          color: 'violet',
          icon: <FiEdit />,
          globalAction: false,
        }
        ,{
          title: 'Chi Tiết',
          color: 'violet',
          icon: <FiEye />,
          globalAction: false,
        }
        ,{
          title: 'Vô Hiệu Hóa Khu Cách Ly',
          color: 'red',
          icon: <FiLock />,
          globalAction: false,
        }
        ,{
          title: 'Xóa Khu Cách Ly',
          color: 'red',
          icon: <FiDelete />,
          globalAction: false,
        }
      ]}
      />
    </div>
  );
};

export default QuarantineZoneCollectiveList;
