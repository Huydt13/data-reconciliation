import { useState, useEffect } from 'react';
import locations from 'app/assets/mock/locations.json';

const useSelectLocations = (initialData) => {
  const {
    provinceValue,
    districtValue,
    wardValue,
  } = initialData;

  const [province, setProvince] = useState(null);
  const [district, setDistrict] = useState(null);
  const [ward, setWard] = useState(null);

  useEffect(() => {
    const tmpProvince = provinceValue && locations.find((p) => p.value === provinceValue);
    const tmpDistrict = districtValue && tmpProvince.districts.find((d) => d.value === districtValue);
    const tmpWard = wardValue && tmpDistrict.find((w) => w.value === wardValue);
    setProvince(tmpProvince);
    setDistrict(tmpDistrict);
    setWard(tmpWard);
  }, [
    provinceValue,
    districtValue,
    wardValue,
  ]);

  useEffect(() => { setDistrict(null); }, [province]);
  useEffect(() => { setWard(null); }, [province]);

  const provinceList = locations ?? [];
  const districtList = province?.districts ?? [];
  const wardList = district?.wards ?? [];

  const setProvinceValue = (value) => {
    setProvince(locations.find((p) => p.value === value));
  };

  const setDistrictValue = (value) => {
    setDistrict(province?.districts.find((d) => d.value === value) ?? null);
  };

  const setWardValue = (value) => {
    setWard(district?.wards.find((w) => w.value === value) ?? null);
  };

  return {
    provinceList,
    districtList,
    wardList,
    province,
    district,
    ward,
    setProvinceValue,
    setDistrictValue,
    setWardValue,
  };
};

export default useSelectLocations;
