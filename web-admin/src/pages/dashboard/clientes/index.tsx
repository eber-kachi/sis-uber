import { NextPage } from "next"
import { useAuthClient } from "@hooks/useAuthClient"
import { AdminLayout } from "@layout/index"
import React, { useEffect, useState } from "react"
import Table from "react-bootstrap/Table"
import SocioService from "../../../services/api/Socio.service"
import { object } from "prop-types"
// import { Button } from "react-bootstrap"
import Button from "react-bootstrap/Button"
import CustomModal from "@components/Modal/CustomModal"
import Link from "next/link"
import { toast } from "react-toastify"
import ClienteService from "../../../services/api/Cliente.service"


const SocioListPage: NextPage = ({ dataResponce }) => {
  // const { userValue } = useAuthClient({ redirectIfAuthenticated: "/" })
  // console.log("user value=>", userValue)
  console.log("list=>", dataResponce)
  const clienteService = new ClienteService()
  const [modalShow, setModalShow] = useState(false)
  const [objects, setObjects] = useState(dataResponce ? dataResponce : [])

  const getData = async () => {
    const responce: any[] = await clienteService.getAll() as any[]
    // getLinks(responce.links);
    setObjects(responce)
  }

  const onClickDelete = (id: string) => {
    clienteService.delete(id).then(res => {
      console.log(res)
       toast("Eliminado con exito.");
      getData()
    }).catch(error => {
      console.log(error)
    })
  }

  useEffect(() => {

  }, [])


  return (<AdminLayout>
      <div className="row">
        <div className="m-2 d-flex flex flex-row justify-content-between">
          <div>
            <h3>Lista de Clientes</h3>
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
            <th>Foto</th>
            <th>Nombre completo</th>
            {/*<th>Estado</th>*/}
            {/*<th>Licencia</th>*/}
            <th>Acciones</th>
          </tr>
          </thead>
          <tbody>
          {objects.map((object, index) => (
            <tr key={object.id}>
              <td>{++index}</td>
              <td>Otto</td>
              <td>{object.nombres} {object.apellidos}</td>
              {/*<td>{object.estado}</td>*/}
              {/*<td>*/}
              {/*  <ul>*/}
              {/*    <li>Emision: {object.emision}</li>*/}
              {/*    <li>N° Licencia: {object.nroLicencia}</li>*/}
              {/*    <li>Vencimiento: {object.vencimiento}</li>*/}
              {/*  </ul>*/}
              {/*</td>*/}
              <td>
                <div className="">
                  {/*<Link className="btn btn-outline-warning"*/}
                  {/*      href={{*/}
                  {/*        pathname: "/dashboard/socios/[id]/veiculo/[veiculo_id]",*/}
                  {/*        query: { id: object.id , veiculo_id: (object?.veiculo==null)? 'new': object?.veiculo?.id },*/}
                  {/*      }}>*/}
                  {/*  /!*<a className='btn-warning m-1'>*!/*/}
                  {/*  Veiculo*/}
                  {/*  /!*</a>*!/*/}
                  {/*</Link>*/}
                  <Link className="btn btn-outline-warning" title="Ver viajes"
                        href={{
                          pathname: "/dashboard/clientes/[id]/viajes",
                          query: { id: object.id },
                        }}>
                    {/*<a className='btn-warning m-1'>*/}
                    Viajes
                  </Link>
                  {/*<Button variant="outline-danger" onClick={() => onClickDelete(object.id)}>Eliminar</Button>*/}
                  <Button variant="outline-danger" onClick={() => onClickDelete(object.id)}>Eliminar</Button>
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
  )
}

export async function getServerSideProps(context) {
  const service = new ClienteService()
  const responce = await service.getAll()
  // console.log(responce);
  return {
    props: {
      dataResponce: responce,
    },
  }
}

export default SocioListPage
