import { AdminLayout } from "@layout/index";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  CircleF,
  GoogleMap,
  MarkerF,
  useLoadScript,
} from "@react-google-maps/api";
import SocioService from "../../../services/api/Socio.service";
import ViajeService from "src/services/api/Viaje.service";
import { toast } from "react-toastify";
import socket from "@lib/sockets/socket";
import { Form, ListGroup } from "react-bootstrap";
import { ISocio } from "src/services/models/socio.model";

const CustomMarker = (props) => {
  // id=> socio id
  const { id, onMarkerClick } = props;

  const handleClick = (evt) => {
    onMarkerClick(id);
  };

  return <MarkerF onClick={handleClick} {...props} />;
};

const MapsPage = () => {
  const libraries = useMemo(() => ["places"], []);
  const mapRef = useRef(null);
  const makerRef = useRef(null);
  // -17.39470732739393, -66.28102605202128
  //   -17.39418792844535, -66.28356318651015
  const mapCenter = useMemo(
    () => ({ lat: -17.39470732739393, lng: -66.28102605202128 }),
    []
  );
  // -17.39457571741809, -66.2861413204621
  const [viajePending, setViajePendig] = useState<any[]>([]);
  const [currenLocationSelect, setCurrenLocationSelect] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [veiculos, setVeiculos] = useState<ISocio[]>([]);

  const [selectedViajeId, setSelectedViajeId] = useState<any>(null);

  const socioService = new SocioService();
  const viajeService = new ViajeService();

  const memoizedMarkers = useMemo(() => veiculos, [veiculos]);

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      draggable: true,
      // scrollwheel: false,
    }),
    []
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
    libraries: libraries as any,
    language: "es_ES",
  });

  // sockets
  React.useEffect(() => {
    // socketInitializer();

    // socioService.getAllByStatus("LIBRE")

    const intervalId = setInterval(async () => {
      const responce: any = await socioService.getAllWithStatus();
      // debugger;
      console.log(responce.data);
      setVeiculos([...responce.data]);
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    socket.on("pendiente_confirmacion", (viajes: any) => {
      console.log("pendiente_confirmacion", viajes);
      // debugger;
      setViajePendig(() => [...viajePending, viajes]);
    });
    return () => {
      socket.off("pendiente_confirmacion");
    };
  }, []);

  const socketInitializer = async () => {
    // We just call it because we don't need anything else out of it
    // await fetch("/api/socket");
    //
    // socket = io();
    //
    // socket.on("newIncomingMessage", (msg) => {
    //   setMessages((currentMsg) => [
    //     ...currentMsg,
    //     { author: msg.author, message: msg.message },
    //   ]);
    //   console.log(messages);
    // });
    // await fetch('http://localhost:3001')
    // socket = io({host:"http://localhost:3001"})
    // socket.on("message", (message: any) => {
    //   console.log(message);
    // });
  };

  // metodo para asignar  un socio con un veiculo
  const handleMarkerClick = (socio_id: string | number) => {
    // console.log("EL id en el padre=> ", id);
    // console.log(selectedViajeId);
    if (selectedViajeId != null) {
      viajeService
        .asignarViajeSocio(selectedViajeId, socio_id)
        .then((res: any) => {
          // socket.emit("asignacion", { id: selectedViajeId, evento: "" , data: res.data });
          socket.emit("asignacion_event", { id: selectedViajeId, evento: "" });
          socket.emit("asignacion_event_socio", {
            socio_id: res.data.socio.id,
            data: res.data,
          });

          toast("Asignado con exito.");

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
          toast("Error al Asignado.", {});
        });
    }
  };

  // metodo para cuando seleciona al cliente
  const handlerSelectViaje = (viaje_id: string) => {
    setSelectedViajeId(viaje_id);
    // todo marcar donde esta el usuario
    // mapRef.current.
    const viaje = viajePending.find((v) => (v.id = viaje_id));
    // setCurrenLocationSelect({latitude:viaje.start, longitude})
  };

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <AdminLayout>
      <div className="row ">
        <div
          className="col col-2"
          style={{ overflowY: "scroll", height: "75vh" }}
        >
          <h5>Nuevos viajes</h5>
          <Form>
            <ListGroup>
              {viajePending &&
                viajePending.map((viaje: any, index) => (
                  <ListGroup.Item
                    key={viaje.id}
                    onChange={() => handlerSelectViaje(viaje.id)}
                  >
                    <Form.Check
                      key={viaje.id}
                      value={viaje.id}
                      type={"radio"}
                      name="viajes"
                      label={`${viaje.cliente.nombres} ${viaje.cliente.apellidos}`}
                      checked={selectedViajeId === viaje.id}
                      onChange={() => {}}
                    />
                  </ListGroup.Item>
                ))}
            </ListGroup>
          </Form>
        </div>
        <div className="col col-10">
          <div style={{ display: "flex", height: "80vh" }}>
            <GoogleMap
              ref={mapRef}
              options={mapOptions}
              zoom={14}
              center={mapCenter}
              mapTypeId={google.maps.MapTypeId.ROADMAP}
              mapContainerStyle={{ width: "100%", height: "100%" }}
              onLoad={() => console.log("Map Component Loaded...")}
            >
              {/* <MarkerF position={mapCenter} onLoad={() => console.log('Marker Loaded')}   icon="https://picsum.photos/64" /> */}
              {/* <MarkerF  position={mapCenter} onLoad={() => console.log('Marker Loaded')}   icon="http://localhost:3000/assets/img/cars/car-red.svg" /> */}
              {memoizedMarkers.map((markerData: ISocio, index: number) => (
                <CustomMarker
                  id={markerData.id}
                  key={+index}
                  draggable
                  position={{
                    lat: markerData.latitude,
                    lng: markerData.longitude,
                  }}
                  label={{
                    text: "" + index,
                    color: "#fff",
                    fontWeight: "bold",
                    className: "marker-label font-weight-bold -mt-30",
                  }}
                  icon={{
                    url: `http://localhost:3000/assets/img/cars/${
                      markerData.estado === "LIBRE"
                        ? "car-green.svg"
                        : "car-red.svg"
                    }`,
                    scale: 0.02,
                    scaledSize: new window.google.maps.Size(30, 30),
                    origin: new window.google.maps.Point(0, 0),
                    anchor: new window.google.maps.Point(25, 25),
                  }}
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

              {makerRef.current && (
                <MarkerF
                  position={{
                    lat: currenLocationSelect
                      ? currenLocationSelect.latitude
                      : 0,
                    lng: currenLocationSelect
                      ? currenLocationSelect.longitude
                      : 0,
                  }}
                  onLoad={() => console.log("Marker Loaded")}
                  icon="https://picsum.photos/64"
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
      </div>
    </AdminLayout>
  );
};

export default MapsPage;
