import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, Select } from 'semantic-ui-react';
import styled from 'styled-components';

import { GoogleMap, HeatmapLayer, useLoadScript } from '@react-google-maps/api';
import { useDispatch, useSelector } from 'react-redux';
import { getOutbreakLocation, searchLocation } from 'contact/actions/contact';

const locationOptions = [
  { text: 'Địa điểm tiếp xúc', value: 1 },
  { text: 'Địa điểm phát bệnh', value: 2 },
];

const mapContainerStyle = {
  height: '500px',
  width: '100%',
};

const center = {
  lat: 10.8231,
  lng: 106.6297,
};

const StyledCard = styled(Card)`
  width: auto !important;
`;
const RightAlign = styled.div`
  text-align: right !important;
`;

const libraries = ['visualization'];

// const gradient = [
//   'rgba(0, 255, 255, 0)',
//   'rgba(0, 255, 255, 1)',
//   'rgba(0, 191, 255, 1)',
//   'rgba(0, 127, 255, 1)',
//   'rgba(0, 63, 255, 1)',
//   'rgba(0, 0, 255, 1)',
//   'rgba(0, 0, 223, 1)',
//   'rgba(0, 0, 191, 1)',
//   'rgba(0, 0, 159, 1)',
//   'rgba(0, 0, 127, 1)',
//   'rgba(63, 0, 91, 1)',
//   'rgba(127, 0, 63, 1)',
//   'rgba(191, 0, 31, 1)',
//   'rgba(255, 0, 0, 1)',
// ];

const HeatMapChart = () => {
  const [map, setMap] = useState(null);
  const onLoad = useCallback((m) => setMap(m), []);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const dispatch = useDispatch();
  const [locationType, setLocationType] = useState(1);
  useEffect(() => {
    dispatch(searchLocation({ pageIndex: 0, pageSize: 0, name: '' }));
    dispatch(getOutbreakLocation());
  }, [dispatch]);

  const {
    searchContactLocationList: { data: contactLocationList },
    outbreakLocationList,
  } = useSelector((state) => state.contact);

  const heatmapLayer = useMemo(() => {
    if (map) {
      return (
        <HeatmapLayer
          data={(locationType === 1
            ? contactLocationList || []
            : outbreakLocationList
          )
            ?.filter((d) => d.lat && d.lng)
            ?.map((d) =>
              window.google?.maps
                ? new window.google.maps.LatLng(d.lat, d.lng)
                : [],
            )}
          options={{
            radius: 20,
            gradient: null,
          }}
        />
      );
    }
    return null;
  }, [contactLocationList, outbreakLocationList, locationType, map]);

  return (
    <>
      <RightAlign>
        <Select
          text={locationOptions.find((e) => e.value === locationType).text}
          options={locationOptions}
          onChange={(_, { value: v }) => setLocationType(v)}
        />
      </RightAlign>
      {isLoaded && (
        <StyledCard className="heatmap-chart">
          <GoogleMap
            id="heatmap-example"
            mapContainerStyle={mapContainerStyle}
            zoom={11}
            center={center}
            onLoad={onLoad}
          >
            {heatmapLayer}
          </GoogleMap>
        </StyledCard>
      )}
    </>
  );
};

export default HeatMapChart;
