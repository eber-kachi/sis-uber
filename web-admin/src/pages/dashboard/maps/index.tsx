import { AdminLayout } from '@layout/index';
import React, { RefObject, useEffect, useMemo, useRef, useState } from 'react';
import {
  CircleF,
  GoogleMap,
  MarkerF,
  MarkerProps,
  useLoadScript,
} from '@react-google-maps/api';
import ViajeService from 'src/services/api/Viaje.service';
import { toast } from 'react-toastify';
// import socket from '@lib/sockets/socket';
import { Form, FormLabel, ListGroup, Card } from 'react-bootstrap';
import { ISocio } from 'src/services/models/socio.model';
import { log } from 'console';
import { right } from '@popperjs/core';
import { useSocket } from '@hooks/socketContext';
import SocioService from '../../../services/api/Socio.service';

const urlfornt = process.env.NEXT_PUBLIC_FRONT_URL || 'http://localhost:3000';

const CustomMarker = (props: any) => {
  // id=> socio id
  const { id, onMarkerClick, position, data } = props;

  const handleClick = () => {
    if (data.estado === 'LIBRE') {
      console.log(id);
      onMarkerClick(id);
    }
  };

  return (
    <MarkerF
      draggable
      position={position}
      label={{
        text: `${data.veiculo?.n_movil}`,
        color: '#fff',
        fontWeight: 'bold',
        className: 'marker-label font-weight-bold -mt-30 ',
      }}
      icon={{
        url: `${urlfornt}/assets/img/cars/${
          data.estado === 'LIBRE' ? 'car-green.svg' : 'car-red.svg'
        }`,
        scale: 0.02,
        scaledSize: new window.google.maps.Size(30, 30),
        origin: new window.google.maps.Point(0, 0),
        anchor: new window.google.maps.Point(25, 25),
      }}
      onClick={handleClick}
      {...props}
    />
  );
};

const MapsPage = () => {
  const { socket } = useSocket();
  const libraries = useMemo(() => ['places'], []);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<google.maps.Marker>();

  const mapCenter = useMemo(
    () => ({ lat: -17.39470732739393, lng: -66.28102605202128 }),
    []
  );

  const [viajePending, setViajePendig] = useState<any[]>([
    // {
    //   estado: "pendiente_confirmacion",
    //   initial_address: "JM3V+X84, RN 4, Quillacollo, Bolivia",
    //   final_address: "",
    //   start_latitude: -17.395390049804433,
    //   start_longitude: -66.30298244555,
    //   end_latitude: -17.4007804,
    //   end_longitude: -66.1214404,
    //   cliente: {
    //     id: "ef451731-22ec-4cc4-94c3-77678c0f2eaa",
    //     createdAt: "2023-06-05T01:04:50.538Z",
    //     updatedAt: "2023-06-05T01:04:50.538Z",
    //     nombres: "eber",
    //     apellidos: "eber",
    //     direccionMadre: null,
    //   },
    //   distancia_recorrida: 0,
    //   fecha: null,
    //   calificacion: null,
    //   start_time: null,
    //   end_time: null,
    //   id: "2bd1e02a-afae-418c-be2f-052171c95719",
    //   createdAt: "2023-06-14T18:38:34.593Z",
    //   updatedAt: "2023-06-14T18:38:34.593Z",
    // },
    // {
    //   estado: "pendiente_confirmacion",
    //   initial_address: "JM3V+X84, RN 4, Quillacollo, Bolivia",
    //   final_address: "",
    //   start_latitude: -17.395514121197564,
    //   start_longitude: -66.306858882308,
    //   end_latitude: -17.4007804,
    //   end_longitude: -66.1214404,
    //   cliente: {
    //     id: "ef451731-22ec-4cc4-94c3-77678c0f2eaaaa",
    //     createdAt: "2023-06-05T01:04:50.538Z",
    //     updatedAt: "2023-06-05T01:04:50.538Z",
    //     nombres: "Natali",
    //     apellidos: "Salvatierra",
    //     direccionMadre: null,
    //   },
    //   distancia_recorrida: 0,
    //   fecha: null,
    //   calificacion: null,
    //   start_time: null,
    //   end_time: null,
    //   id: "2bd1e02a-afae-418c-be2f-052171c9571as",
    //   createdAt: "2023-06-14T18:38:34.593Z",
    //   updatedAt: "2023-06-14T18:38:34.593Z",
    // },
  ]);
  const [currenLocationSelect, setCurrenLocationSelect] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [veiculos, setVeiculos] = useState<ISocio[]>([]);

  const [selectedViajeId, setSelectedViajeId] = useState<any>(null);
  const [zoom, setZoom] = useState<number>(14);

  const socioService = new SocioService();
  const viajeService = new ViajeService();

  const memoizedMarkers = useMemo(() => veiculos, [veiculos]);

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      draggable: true,
      // zoom: 15,
      // scrollwheel: false,
    }),
    []
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
    libraries: libraries as any,
    language: 'es_ES',
  });

  // sockets
  // React.useEffect(() => {
  //   // socketInitializer();

  //   // socioService.getAllByStatus("LIBRE")

  //   const intervalId = setInterval(async () => {
  //     const responce: any = await socioService.getAllWithStatus();
  //     // debugger;
  //     console.log(responce.data);
  //     setVeiculos([...responce.data]);
  //   }, 10000);

  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, []);

  useEffect(() => {
    if (socket) {
      // escuchamos a los eventos de los clientes pendientes para asignar un vehiculo
      socket.on('pendiente_confirmacion', (viajes: any) => {
        console.log('pendiente_confirmacion', viajes);
        // debugger;
        setViajePendig(() => [...viajePending, viajes]);
      });
      socket.emit('socios_conectados');
      // escuchar la lista de socios conectados al sockets
      socket.on('socios_conectados', (datas: any[]) => {
        console.log('vehiculos_conectados', datas);
        setVeiculos([...datas]);
      });
    }
    return () => {
      if (socket) {
        socket.off('pendiente_confirmacion');
        socket.off('socios_conectados');
      }
    };
  }, [socket]);

  // metodo para asignar  un socio con un veiculo
  const handleMarkerClick = (socio_id: string | number) => {
    console.log('EL id en el padre=> ', socio_id);
    // console.log(selectedViajeId);
    if (selectedViajeId != null) {
      viajeService
        .asignarViajeSocio(selectedViajeId, socio_id)
        .then((res: any) => {
          // socket.emit("asignacion", { id: selectedViajeId, evento: "" , data: res.data });
          // socket.emit("asignacion_event", { id: selectedViajeId, evento: "" });
          socket.emit('asignacion_event_socio', {
            socio_id: res.data.socio.id,
            data: res.data,
          });

          toast('Asignado con exito.');

          // const newviajes = viajePending.map((v) => {
          //   if (v.id != selectedViajeId) {
          //     return v;
          //   }
          // });
          const newviajes = viajePending.reduce((acc, item) => {
            if (item.id != selectedViajeId) {
              return [...acc, item];
            }
            return acc;
          }, []);
          setViajePendig(newviajes.length == 0 ? [] : newviajes);
          setSelectedViajeId(null);
        })
        .catch((error) => {
          console.log(error);
          toast('Error al Asignado.', {});
        });
    }
  };

  // metodo para cuando seleciona al cliente
  const handlerSelectViaje = (e: any) => {
    // debugger;
    // console.log({ name: e.target.name, value: e.target.value });
    const viaje_id = e.target.value;
    // console.log("click => ", viaje_id);
    setSelectedViajeId(viaje_id);
    const viaje = viajePending.find((v) => v.id === viaje_id);
    // setZoom(17);
    // setCurrenLocationSelect({
    //   latitude: viaje.start_latitude,
    //   longitude: viaje.start_longitude,
    // });
    moveToCoordinate({
      latitude: viaje.start_latitude,
      longitude: viaje.start_longitude,
    });
  };
  // mover el mapa donde se hizo click
  const handlerSelectSocio = (socio: any) => {
    // console.log(socio);
    moveToCoordinate({
      latitude: socio?.latitude,
      longitude: socio?.longitude,
    });
  };

  const moveToCoordinate = (
    { latitude, longitude }: { latitude: number; longitude: number },
    zoom = 17
  ) => {
    setZoom(zoom);
    setCurrenLocationSelect({
      latitude,
      longitude,
    });
  };

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <AdminLayout>
      <Card>
        <Card.Body>
          <div className='row '>
            <div
              className='col col-12 col-sm-12 col-md-2'
              style={{ overflowY: 'scroll', height: '75vh' }}
            >
              <h5 className='text-center text-title'>Nuevos viajes</h5>

              <ListGroup>
                {viajePending &&
                  viajePending.map((viaje: any, index) => (
                    <ListGroup.Item key={viaje.id + index}>
                      <label className='d-flex gap-1  form-label'>
                        <input
                          className='form-check-input'
                          id={viaje.id}
                          value={viaje.id}
                          name='viajes'
                          type='radio'
                          aria-label={`${viaje?.cliente?.nombres} ${viaje?.cliente?.apellidos}`}
                          onChange={() => {}}
                          // onChange={handlerSelectViaje}
                          onClick={handlerSelectViaje}
                        />
                        {`${viaje?.cliente?.nombres} ${viaje?.cliente?.apellidos}`}
                      </label>
                    </ListGroup.Item>
                  ))}
              </ListGroup>
            </div>
            <div className='col col-12 col-md-8 col-sm-12'>
              <div style={{ display: 'flex', height: '80vh' }}>
                <GoogleMap
                  options={mapOptions}
                  zoom={zoom}
                  center={{
                    lat: currenLocationSelect
                      ? currenLocationSelect.latitude
                      : -17.39470732739393,
                    lng: currenLocationSelect
                      ? currenLocationSelect.longitude
                      : -66.28102605202128,
                  }}
                  mapTypeId={google.maps.MapTypeId.ROADMAP}
                  mapContainerStyle={{ width: '100%', height: '100%' }}
                  onLoad={() => console.log('Map Component Loaded...')}
                >
                  {/* <MarkerF position={mapCenter} onLoad={() => console.log('Marker Loaded')}   icon="https://picsum.photos/64" /> */}
                  {/* <MarkerF  position={mapCenter} onLoad={() => console.log('Marker Loaded')}   icon="http://localhost:3000/assets/img/cars/car-red.svg" /> */}
                  {memoizedMarkers.map((markerData: ISocio, index: number) => (
                    <CustomMarker
                      id={markerData.id}
                      key={+index}
                      data={markerData}
                      position={{
                        lat: markerData.latitude,
                        lng: markerData.longitude,
                      }}
                      // draggable
                      // label={{
                      //   text: `${markerData.veiculo?.n_movil}`,
                      //   color: '#fff',
                      //   fontWeight: 'bold',
                      //   className: 'marker-label font-weight-bold -mt-30 ',
                      // }}
                      // icon={{
                      //   url: `${urlfornt}/assets/img/cars/${
                      //     markerData.estado === 'LIBRE'
                      //       ? 'car-green.svg'
                      //       : 'car-red.svg'
                      //   }`,
                      //   scale: 0.02,
                      //   scaledSize: new window.google.maps.Size(30, 30),
                      //   origin: new window.google.maps.Point(0, 0),
                      //   anchor: new window.google.maps.Point(25, 25),
                      // }}
                      onMarkerClick={handleMarkerClick}
                    />
                    // <MarkerF
                    //   key={+index}
                    //   // options={{ optimized: true }}
                    //   onDrag={(e) => {
                    //     console.log("aqui");
                    //     console.log(e);
                    //   }}
                    //   draggable
                    //   position={{ lat: markerData.lat, lng: markerData.lng }}
                    //   onLoad={() => console.log("Marker Loaded")}
                    //   onClick={(e) => {
                    //     console.log("click me..", e);
                    //   }}
                    //   onDblClick={(event) => {
                    //     console.log(event.domEvent.currentTarget);
                    //     // const idCarFromMarker = event.target.key;
                    //   }}
                    //   label={{
                    //     text: "Richat",
                    //     color: "black",
                    //     fontWeight: "bold",
                    //     className: "marker-label font-weight-bold -mt-30",
                    //   }}
                    //   icon={{
                    //     // path: "M61.2849 48.0244C61.2849 64.3164 48.0769 77.5244 31.7849 77.5244C15.4929 77.5244 2.28491 64.3164 2.28491 48.0244C2.28491 34.9504 22.2469 12.2714 29.6169 3.82141C31.1029 2.11741 33.7479 2.12141 35.2349 3.82441C42.6149 12.2764 61.2849 34.9514 61.2849 48.0244Z",
                    //     url: "http://localhost:3000/assets/img/cars/car-red.svg",
                    //     scale: 0.02,
                    //     scaledSize: new window.google.maps.Size(30, 30),
                    //     origin: new window.google.maps.Point(0, 0),
                    //     anchor: new window.google.maps.Point(25, 25),
                    //   }}
                    // />
                  ))}

                  {currenLocationSelect && (
                    <MarkerF
                      position={{
                        lat: currenLocationSelect
                          ? currenLocationSelect.latitude
                          : 0,
                        lng: currenLocationSelect
                          ? currenLocationSelect.longitude
                          : 0,
                      }}
                      onLoad={() => console.log('Marker Loaded')}
                      icon={{
                        // url: `http://localhost:3000/assets/img/location-user.png`,
                        url: `${urlfornt}/assets/img/location.gif`,
                        scale: 0.02,
                        scaledSize: new window.google.maps.Size(30, 30),
                        origin: new window.google.maps.Point(0, 0),
                        anchor: new window.google.maps.Point(25, 25),
                      }}
                    />
                  )}
                  {/* {[1000, 2500].map((radius, idx) => { */}
                  {/*  return ( */}
                  {/*    <CircleF */}
                  {/*      key={idx} */}
                  {/*      center={mapCenter} */}
                  {/*      radius={radius} */}
                  {/*      onLoad={() => console.log('Circle Load...')} */}
                  {/*      options={{ */}
                  {/*        fillColor: radius > 1000 ? 'red' : 'green', */}
                  {/*        strokeColor: radius > 1000 ? 'red' : 'green', */}
                  {/*        strokeOpacity: 0.8, */}
                  {/*      }} */}
                  {/*    />)})} */}
                </GoogleMap>
              </div>
            </div>
            <div className='col col-12 col-md-2 col-sm-12'>
              <div className='container-fluid'>
                <h5 className='text-center text-title'>
                  Socios conectados {veiculos.length}
                </h5>
                <ListGroup>
                  {veiculos &&
                    veiculos.map((socio: any, index) => (
                      <ListGroup.Item
                        key={socio.id + index}
                        onClick={() => handlerSelectSocio(socio)}
                      >
                        🚗 {socio?.veiculo?.n_movil} - {socio.nombres}{' '}
                        {socio.apellidos}
                      </ListGroup.Item>
                    ))}
                </ListGroup>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </AdminLayout>
  );
};

export default MapsPage;
