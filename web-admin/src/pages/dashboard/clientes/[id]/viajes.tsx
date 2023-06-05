import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import SocioService from "../../../../services/api/Socio.service";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { AdminLayout } from "@layout/index";
import { Button, Col, Form, Row, Badge } from "react-bootstrap";
import VeiculoService from "../../../../services/api/Veiculo.service";
import { NextPage } from "next";
import Link from "next/link";
import Table from "react-bootstrap/Table";
import ViajeService from "../../../../services/api/Viaje.service";

const ViajesListPage: NextPage = ({ dataResponce }) => {
  // const { userValue } = useAuthClient({ redirectIfAuthenticated: "/" })
  // console.log("user value=>", userValue)
  console.log("list=>", dataResponce);
  const socioService = new SocioService();
  const [modalShow, setModalShow] = useState(false);
  const [objects, setObjects] = useState(dataResponce ? dataResponce : []);

  const getData = async () => {
    const responce: any[] = (await socioService.getAll()) as any[];
    // getLinks(responce.links);
    setObjects(responce);
  };

  const onClickDelete = (id: string) => {
    socioService
      .delete(id)
      .then((res) => {
        console.log(res);
        toast("Eliminado con exito.");
        getData();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {}, []);

  return (
    <AdminLayout>
      <div className="row">
        <div className="m-2 d-flex flex flex-row justify-content-between">
          <div>
            <h3>Lista de viajes </h3>
          </div>
          <div>
            {/*<Link className="btn btn-success" href={{ pathname: "/dashboard/socios/[id]", query: { id: "new" } }}>*/}
            {/*  Crear Nuevo*/}
            {/*</Link>*/}
            {/*<Button variant="primary" onClick={() => setModalShow(true)}>*/}
            {/*  Crear Nuevo*/}
            {/*</Button>*/}
          </div>
        </div>

        <Table striped>
          <thead>
            <tr>
              <th>#</th>
              {/* <th>Foto</th> */}
              {/*<th>Nombre completo</th>*/}
              <th>Estado</th>
              {/*<th>Licencia</th>*/}
              {/* <th>Acciones</th> */}
            </tr>
          </thead>
          <tbody>
            {objects.length > 0 &&
              objects.map((object, index) => (
                <tr key={object.id}>
                  <td>{++index}</td>
                  {/* <td>Otto</td> */}
                  <td>
                    <Badge bg="success"> {object.estado}</Badge>
                  </td>
                  {/* <td> */}
                  {/* <div className=""> */}
                  {/*<Button variant="outline-warning" >*/}
                  {/*<Link className="btn btn-outline-warning"*/}
                  {/*      href={{*/}
                  {/*        pathname: "/dashboard/socios/[id]/veiculo/[veiculo_id]",*/}
                  {/*        query: { id: object.id , veiculo_id: (object?.veiculo==null)? 'new': object?.veiculo?.id },*/}
                  {/*      }}>*/}
                  {/*  Veiculo*/}
                  {/*</Link>*/}
                  {/*<Link className="btn btn-outline-warning"*/}
                  {/*      href={{*/}
                  {/*        pathname: "/dashboard/socios/[id]",*/}
                  {/*        query: { id: object.id },*/}
                  {/*      }}>*/}
                  {/*  Editar*/}
                  {/*</Link>*/}
                  {/*</Button>*/}
                  {/*<Button variant="outline-danger" onClick={() => onClickDelete(object.id)}>Eliminar</Button>*/}
                  {/* </div> */}
                  {/* </td> */}
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
      {/*onSave={()=> {}}*/}
      {/*<CustomModal*/}
      {/*  show={modalShow}*/}
      {/*  onHide={() => setModalShow(false)}*/}

      {/*  title={"Alerta"}*/}
      {/*  size="sm"*/}
      {/*>*/}
      {/*  <h1>Hola como estas desde la lista </h1>*/}
      {/*</CustomModal>*/}
    </AdminLayout>
  );
};

export async function getServerSideProps(context) {
  console.log("vaijes=> ", context.params.id);

  const service = new ViajeService();
  const responce = await service.getByclienteoId(context.params.id);
  // console.log(responce);
  return {
    props: {
      dataResponce: responce.data,
    },
  };
}

export default ViajesListPage;
