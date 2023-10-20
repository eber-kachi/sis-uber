import { NextPage } from 'next';
import { AdminLayout } from '@layout/index';
import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';
import { toast } from 'react-toastify';

import GrupoTrabajoService from 'src/services/api/GrupoTrabajo.service';
import { Card } from 'react-bootstrap';

const GrupoTrabajoListPage = ({ dataResponce }: { dataResponce: any[] }) => {
  const socioService = new GrupoTrabajoService();
  const [modalShow, setModalShow] = useState(false);
  const [objects, setObjects] = useState<any[]>(dataResponce || []);

  const getData = async () => {
    const responce: any = await socioService.getAll();
    // getLinks(responce.links);
    console.log(responce);

    setObjects(responce.data);
  };

  const onClickDelete = (id: string) => {
    socioService
      .delete(id)
      .then((res) => {
        console.log(res);
        toast('Eliminado con exito.');
        getData();
      })
      .catch((error) => {
        // console.log(error)
        console.log(error);
        toast(error.message, { type: 'error' });
      });
  };

  useEffect(() => {
    console.log(dataResponce);
    getData();
  }, []);

  return (
    <AdminLayout>
      <div className='row'>
        <div className='m-2 d-flex flex flex-row justify-content-between'>
          <div>
            <h3 className='text-title'>Lista de grupo trabajo</h3>
          </div>
          <div>
            <Link
              className='btn btn-success'
              href={{
                pathname: '/dashboard/grupotrabajo/[id]',
                query: { id: 'new' },
              }}
            >
              Crear Nuevo
            </Link>
          </div>
        </div>
        <Card>
          <Card.Body>
            <Table striped responsive size='sm'>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre </th>
                  <th>Horario grupo trabajo </th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {objects.length > 0 &&
                  objects.map((object, index) => (
                    <tr key={object.id}>
                      <td>{++index}</td>

                      <td>{object.nombre}</td>
                      <td>
                        {object.hora_inicio} + {object.hora_fin} h
                      </td>
                      <td>
                        <div className=''>
                          <Link
                            className='btn btn-outline-warning'
                            href={{
                              pathname: '/dashboard/grupotrabajo/[id]',
                              query: { id: object.id },
                            }}
                          >
                            Editar
                          </Link>
                          <Button
                            variant='outline-danger'
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
          </Card.Body>
        </Card>
      </div>
    </AdminLayout>
  );
};

// export async function getServerSideProps(context: any) {
//   const service = new GrupoTrabajoService();
//   try {
//     const responce = await service.getAll();

//     return {
//       props: {
//         dataResponce: responce.data,
//       },
//     };
//   } catch (error: any) {
//     // console.error("===========================================>", error)
//     if (error?.response?.status == 401) {
//       return {
//         redirect: {
//           permanent: false,
//           destination: '/login',
//         },
//         props: {},
//       };
//     }
//   }
//   // console.log(responce);
//   return {
//     props: {
//       dataResponce: [],
//     },
//   };
// }

export default GrupoTrabajoListPage;
