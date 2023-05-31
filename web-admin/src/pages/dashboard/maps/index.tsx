import { AdminLayout } from "@layout/index";
import React, { useMemo, useState } from "react";
import {
  CircleF,
  GoogleMap,
  MarkerF,
  useLoadScript,
} from "@react-google-maps/api";
import io from "socket.io-client";
import { log } from "console";
import CarRed from "../../../../public/assets/img/cars/car-red.svg";
import SocioService from "../../../services/api/Socio.service";
import ViajeService from "src/services/api/Viaje.service";
import { toast } from "react-toastify";

let socket;

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
  // -17.39470732739393, -66.28102605202128
  //   -17.39418792844535, -66.28356318651015
  const mapCenter = useMemo(
    () => ({ lat: -17.39470732739393, lng: -66.28102605202128 }),
    []
  );
  // -17.39457571741809, -66.2861413204621
  const [viajePending, setViajePendig] = useState<any[]>([]);

  const [veiculos, setVeiculos] = useState(
    [
      // { latitude: -17.39470732739393, longitude: -66.28102605202128 },
      // { latitude: -17.39418792844535, longitude: -66.28356318651015 },
      // { latitude: -17.39457571741809, longitude: -66.2861413204621 },
    ]
  );

  const [selectedViajeId, setSelectedViajeId] = useState<any>();

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
    socketInitializer();

    // socioService.getAllByStatus("LIBRE")

    const intervalId = setInterval(async () => {
      const responce : any = await socioService.getAllByStatus("LIBRE");
      console.log(responce);
      setVeiculos(responce.data);
    }, 5000);

    return () => {
      clearInterval(intervalId);
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
    socket = io("https://b26f-2803-9400-3-386d-d5ce-e1f-8ea6-b9c0.ngrok-free.app");

    socket.on("connect", () => {
      console.log("connected...");
    });

    socket.on("pendiente_confirmacion", (viajes: any) => {
      console.log(viajes);
      // debugger;
      setViajePendig(() => [...viajePending, viajes]);
    });

    // socket.on("message", (message: any) => {
    //   console.log(message);
    // });
  };

  const handleMarkerClick = (id: string | number) => {
    console.log("EL id en el padre=> ", id);
    console.log(selectedViajeId);
    viajeService.asignarViajeSocio(selectedViajeId, id)
      .then(res => {
        toast("Asignado con exito.");
        console.log(res);
      })
      .catch(error => {
        console.log(error);
        toast("Error al Asignado.",{});
      });
  };

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <AdminLayout>
      <div className="row">
        <div className="col col-2">
          <h4>Sidevar Maps</h4>
          <ul className="">
            {viajePending.map((viaje: any, index) => (
              <li className="bg-secondary rounded text-center" key={+index}>
                <input
                  className="form-check-input"
                  type="radio"
                  value={viaje.id}
                  id={`viaje-${index}`}
                  checked={selectedViajeId === viaje.id}
                  onChange={() => setSelectedViajeId(viaje.id)}
                ></input>
                {/* {viaje.cliente.nombres} {viaje.cliente.apellidos} */}
                <label htmlFor={`viaje-${index}`}>
                  {viaje.cliente.nombres} {viaje.cliente.apellidos}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className="col col-10">
          <div style={{ display: "flex", height: "80vh" }}>
            <GoogleMap
              options={mapOptions}
              zoom={14}
              center={mapCenter}
              mapTypeId={google.maps.MapTypeId.ROADMAP}
              mapContainerStyle={{ width: "100%", height: "100%" }}
              onLoad={() => console.log("Map Component Loaded...")}
            >
              {/* <MarkerF position={mapCenter} onLoad={() => console.log('Marker Loaded')}   icon="https://picsum.photos/64" /> */}
              {/* <MarkerF  position={mapCenter} onLoad={() => console.log('Marker Loaded')}   icon="http://localhost:3000/assets/img/cars/car-red.svg" /> */}
              {memoizedMarkers.map((markerData, index) => (
                <CustomMarker
                  id={markerData.id}
                  key={+index}
                  draggable
                  position={{ lat: markerData.latitude, lng: markerData.longitude }}
                  label={{
                    text: "Richat",
                    color: "black",
                    fontWeight: "bold",
                    className: "marker-label font-weight-bold -mt-30",
                  }}
                  icon={{
                    url: "http://localhost:3000/assets/img/cars/car-red.svg",
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
