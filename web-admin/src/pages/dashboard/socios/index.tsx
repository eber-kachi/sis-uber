import { NextPage } from "next"
import { useAuthClient } from "@hooks/useAuthClient"
import { AdminLayout } from "@layout/index"
import React, { useEffect, useState } from "react"
import Table from "react-bootstrap/Table"
import { object } from "prop-types"
// import { Button } from "react-bootstrap"
import Button from "react-bootstrap/Button"
import CustomModal from "@components/Modal/CustomModal"
import Link from "next/link"
import { toast } from "react-toastify"
import SocioService from "../../../services/api/Socio.service"

const SocioListPage: NextPage = ({ dataResponce }) => {
  // const { userValue } = useAuthClient({ redirectIfAuthenticated: "/" })
  // // console.log("user value=>", userValue)
  // console.log('list=>', dataResponce)
  const socioService = new SocioService()
  const [modalShow, setModalShow] = useState(false)
  const [objects, setObjects] = useState(dataResponce || [])

  const getData = async () => {
    const responce: any[] = await socioService.getAll() as any[]
    // getLinks(responce.links);
    setObjects(responce)
  }

  const onClickDelete = (id: string) => {
    socioService.delete(id).then((res) => {
      // console.log(res)
      toast("Eliminado con exito.")
      getData()
    }).catch((error) => {
      // console.log(error)
    })
  }

  useEffect(() => {

  }, [])

  return (
    <AdminLayout>
      <div className="row">
        <div className="m-2 d-flex flex flex-row justify-content-between">
          <div>
            <h3>Lista de socios</h3>
          </div>
          <div>
            <Link className="btn btn-success" href={{ pathname: "/dashboard/socios/[id]", query: { id: "new" } }}>
              Crear Nuevo
            </Link>
            {/* <Button variant="primary" onClick={() => setModalShow(true)}> */}
            {/*  Crear Nuevo */}
            {/* </Button> */}
          </div>
        </div>

        <Table striped>
          <thead>
          <tr>
            <th>#</th>
            <th>Foto</th>
            <th>Nombre completo</th>
            <th>Estado</th>
            <th>Licencia</th>
            <th>Acciones</th>
          </tr>
          </thead>
          <tbody>
          {objects.length > 0 && objects.map((object, index) => (
            <tr key={object.id}>
              <td>{++index}</td>
              <td>Otto</td>
              <td>
                {object.nombres}
                {" "}
                {object.apellidos}
              </td>
              <td>{object.estado}</td>
              <td>
                <ul>
                  <li>
                    Emision:
                    {object.emision}
                  </li>
                  <li>
                    N° Licencia:
                    {object.nroLicencia}
                  </li>
                  <li>
                    Vencimiento:
                    {object.vencimiento}
                  </li>
                </ul>
              </td>
              <td>
                <div className="">
                  {/* <Button variant="outline-warning" > */}
                  <Link
                    className="btn btn-outline-warning"
                    href={{
                      pathname: "/dashboard/socios/[id]/veiculo/[veiculo_id]",
                      query: { id: object.id, veiculo_id: (object?.veiculo == null) ? "new" : object?.veiculo?.id },
                    }}
                  >
                    {/* <a className='btn-warning m-1'> */}
                    Veiculo
                    {/* </a> */}
                  </Link>
                  <Link
                    className="btn btn-outline-warning"
                    href={{
                      pathname: "/dashboard/socios/[id]",
                      query: { id: object.id },
                    }}
                  >
                    {/* <a className='btn-warning m-1'> */}
                    Editar
                    {/* </a> */}
                  </Link>
                  {/* </Button> */}
                  <Button variant="outline-danger" onClick={() => onClickDelete(object.id)}>Eliminar</Button>
                </div>
              </td>
            </tr>
          ))}

          </tbody>
        </Table>

      </div>
      {/* onSave={()=> {}} */}
      {/* <CustomModal */}
      {/*  show={modalShow} */}
      {/*  onHide={() => setModalShow(false)} */}

      {/*  title={"Alerta"} */}
      {/*  size="sm" */}
      {/* > */}
      {/*  <h1>Hola como estas desde la lista </h1> */}
      {/* </CustomModal> */}
    </AdminLayout>
  )
}

export async function getServerSideProps(context) {
  const service = new SocioService()
  try {
    const responce = await service.getAll()

    return {
      props: {
        dataResponce: responce.data,
      },
    }
  } catch (error) {
    // console.error("===========================================>", error)
    if (error?.response?.status == 401) {
      return {
        redirect: {
          permanent: false,
            destination: "/login",
        },
        props:{},
      };
    }

  }
  // console.log(responce);
  return {
    props: {
      dataResponce: [],
    },
  }
}

export default SocioListPage
