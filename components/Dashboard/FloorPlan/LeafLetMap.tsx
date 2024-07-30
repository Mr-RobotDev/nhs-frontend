"use client";
import React, { useEffect, useState } from "react";
import { MapContainer, ImageOverlay, Marker, Popup, FeatureGroup } from "react-leaflet";
import { Icon, LatLngBoundsExpression } from "leaflet";
import axiosInstance from "@/lib/axiosInstance";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "./leaflet.css";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { useDispatch } from "react-redux";
import { DevicesType } from "@/type";
import { EditControl } from "react-leaflet-draw"
import { iconsBasedOnType } from "@/utils/helper_functions";

interface LeafLetMapProps {
  diagram?: string;
  fullScreen?: boolean
}

const LeafLetMap: React.FC<LeafLetMapProps> = ({ diagram, fullScreen }) => {

  const imageUrl = diagram || "/floor-plan.png";

  const bounds: LatLngBoundsExpression = [
    [51.5008, -0.0839],
    [51.5019, -0.082],
  ];

  const getMarkerIcons = (key: string) => {
    return new Icon({
      iconUrl: iconsBasedOnType(key),
      iconSize: [22, 22],
    })
  }

  const _created = (e: any) => {
    const { lat, lng } = e.layer._latlng
    console.log(lat, lng)
  }


  const dataPoints = [
    {
      name: 'red',
      lat: 51.50158520438192,
      lng: -0.08238941431045534
    },
    {
      name: 'red',
      lat: 51.50133976424587,
      lng: -0.08250206708908081
    },
    {
      name: 'red',
      lat: 51.50158854369437,
      lng: -0.08346766233444215
    },
    {
      name: 'red',
      lat: 51.50125795057346,
      lng: -0.08321285247802734
    },
    {
      name: 'red',
      lat: 51.501025866091155,
      lng: -0.08361518383026124
    },
    {
      name: 'green',
      lat: 51.501478346253876,
      lng: -0.08238404989242554
    },
    {
      name: 'green',
      lat: 51.501014178352165,
      lng: -0.08238673210144044
    },
    {
      name: 'green',
      lat: 51.50104924156018,
      lng: -0.08282393217086793
    },
    {
      name: 'green',
      lat: 51.50159355266261,
      lng: -0.08318603038787842
    },
    {
      name: 'green',
      lat: 51.50146665863092,
      lng: -0.08365005254745485
    },

    {
      name: 'amber',
      lat: 51.501488364214026,
      lng: -0.08256644010543823
    },
    {
      name: 'amber',
      lat: 51.5015267663742,
      lng: -0.08295536041259767
    },
    {
      name: 'amber',
      lat: 51.50104423253212,
      lng: -0.08260935544967651
    },
    {
      name: 'amber',
      lat: 51.5012829955908,
      lng: -0.08349716663360596
    },
    {
      name: 'amber',
      lat: 51.501682044344044,
      lng: -0.0829017162322998
    },
  ]

  return (
    <div
      style={{ width: "100%" }}
      className={`w-full ${fullScreen ? 'h-screen' : 'h-[500px] md:max-h-[670px] 2xl:h-[900px]'}`}
    >
      <MapContainer
        center={[51.5014, -0.083]}
        zoom={fullScreen ? 20 : 19}
        minZoom={19}
        scrollWheelZoom={false}
        style={{ width: "100%", height: "100%", backgroundColor: "white" }}
      >
        {dataPoints.map((dp, index) => {
          return <Marker
            key={index}
            position={[dp.lat, dp.lng]}
            icon={getMarkerIcons(dp.name)}
          >
            <Popup>
              <p>Name: {dp.name.toUpperCase()}</p>
            </Popup>
          </Marker>
        })}

        <ImageOverlay url={imageUrl} bounds={bounds} />


      </MapContainer>
    </div>
  );
};

export default LeafLetMap;
