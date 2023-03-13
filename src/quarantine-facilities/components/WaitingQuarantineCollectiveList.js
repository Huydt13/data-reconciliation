import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFacilities } from "quarantine-facilities/actions/quarantine-facility";
import { DataTable } from "app/components/shared";
import { FiDelete, FiEdit, FiEye, FiLock, FiPlus } from "react-icons/fi";

const WaitingQuarantineCollectiveList = (props) => {
  const dispatch = useDispatch();
  const { facilityData } = useSelector((state) => state.quarantineFacility);
  // console.log(facilityData);
  useEffect(() => {
    dispatch(getFacilities({ pageIndex: 0, pageSize: 10 }));
  }, [dispatch]);
  // Khu	Tên	Năm sinh	Địa chỉ	Mốc thời gian cách ly	Ngày chỉ định	Ngày dự kiến kết thúc cách ly
  const columns = [
    { Header: "#", accessor: "index" },
    { Header: "Khu", accessor: "Khu" },
    { Header: "Tên", accessor: "profileName" },
    { Header: "Địa Chỉ", accessor: "DiaChi" },
    { Header: "Mốc thời gian cách ly", accessor: "MocThoiGianCachLy" },
    { Header: "Ngày chỉ định", accessor: "NgayChiDinh" },
    { Header: "Ngày tiếp nhận	", accessor: "NgayTiepNhan" },
    { Header: "Phòng	", accessor: "Phong" },
    { Header: "Ngày dự kiến kết thúc cách ly", accessor: "NgayKetThuc" },
  ];

  const data = [
    {
      id: 1,
      Khu: "Khu cách ly tập trung Quận Phú Nhuận",
      profileName: "Nguyên Van A",
      DiaChi: "19/21 phú nhuận",
      MocThoiGianCachLy: "19-02-2021",
      NgayChiDinh: "19-02-2021",
      NgayKetThuc: "03-03-2021",
      NgayTiepNhan: "03-03-2021",
      Phong: "001",
    },
  ];

  return (
    <div>
      <DataTable
        title="Danh sách chờ cách ly Tập Chung"
        columns={columns}
        data={data}
        pageCount={data.length}
        pageIndex={1}
        actions={[
          {
            title: "Thêm khu cách ly",
            color: "green",
            icon: <FiPlus />,
            globalAction: true,
          },
          {
            title: "Sửa Thông Tin",
            color: "violet",
            icon: <FiEdit />,
            globalAction: false,
          },
          {
            title: "Chi Tiết",
            color: "violet",
            icon: <FiEye />,
            globalAction: false,
          },
          {
            title: "Vô Hiệu Hóa Khu Cách Ly",
            color: "red",
            icon: <FiLock />,
            globalAction: false,
          },
          {
            title: "Xóa Khu Cách Ly",
            color: "red",
            icon: <FiDelete />,
            globalAction: false,
          },
        ]}
      />
    </div>
  );
};
export default WaitingQuarantineCollectiveList;
