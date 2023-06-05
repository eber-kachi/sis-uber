import { NextPage } from "next";
import { AdminLayout } from "@layout/index";
import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import UserService from "../../../services/api/User.service";
import { IUser } from "src/services/models/user.model";
import { AxiosError } from "axios";

const UserListPage: NextPage = ({ dataResponce }) => {
  // const { userValue } = useAuthClient({ redirectIfAuthenticated: "/" })
  // console.log("user value=>", userValue)
  console.log("list=>", dataResponce);
  const clienteService = new UserService();
  const [modalShow, setModalShow] = useState(false);
  const [objects, setObjects] = useState<IUser[]>(
    dataResponce ? dataResponce : []
  );

  const getData = async () => {
    const responce: any = await clienteService.getAll();
    setObjects(responce.data.data);
  };

  const onClickDelete = (id: string) => {
    clienteService
      .delete(id)
      .then((res) => {
        console.log(res);
        toast("Eliminado con exito.");
        getData();
      })
      .catch((error) => {
        console.log(error);
        if (error instanceof AxiosError) {
          toast.error(error.message);
        }
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <AdminLayout>
      <div className="row">
        <div className="m-2 d-flex flex flex-row justify-content-between">
          <div>
            <h3>Lista de Usuarios</h3>
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
              <th>Correo</th>
              <th>Rol</th>
              {/*<th>Licencia</th>*/}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {objects.length > 0 &&
              objects.map((object, index) => (
                <tr key={object.id}>
                  <td>{++index}</td>
                  <td>{object.email}</td>

                  <td>{object.role}</td>
                  <td>
                    <div className="">
                      <Button
                        variant="outline-danger"
                        onClick={() => onClickDelete(object.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </td>
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

// export async function getServerSideProps(context) {
//   const service = new UserService();
//   const responce = await service.getAll();
//   // console.log(responce);
//   return {
//     props: {
//       dataResponce: responce.data,
//     },
//   };
// }

export default UserListPage;
