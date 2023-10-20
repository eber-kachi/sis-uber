import { AdminLayout } from '@layout/index';
import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { Card } from 'react-bootstrap';
import SocioService from '../../../services/api/Socio.service';
import CustomSwitch from '../../../components/ui/CustomSwitch';
import { ISocio } from '../../../services/models/socio.model';

const SocioListPage = ({ dataResponce }: { dataResponce: any }) => {
  const socioService = new SocioService();
  const [modalShow, setModalShow] = useState(false);
  const [objects, setObjects] = useState<ISocio[]>(dataResponce || []);

  const getData = async () => {
    const responce: any = await socioService.getAll();
    console.log(responce);

    setObjects(responce.data);
  };

  const onClickDelete = (id: string) => {
    socioService
      .delete(id)
      .then((res) => {
        // console.log(res)
        toast('Eliminado con exito.');
        getData();
      })
      .catch((error) => {
        // console.log(error)
      });
  };

  useEffect(() => {
    console.log(dataResponce);
    getData();
  }, []);

  return (
    <AdminLayout>
      <div className='row'>
        <div className='p-2 d-flex flex flex-row justify-content-between'>
          <div>
            <h3 className='text-title'>Lista de socios</h3>
          </div>
          <div>
            <Link
              className='btn btn-success'
              href={{
                pathname: '/dashboard/socios/[id]',
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
                  <th>Foto</th>
                  <th>Nombre completo</th>
                  <th>Estado</th>
                  <th>Licencia</th>
                  <th>Activar</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {objects.length > 0 &&
                  objects.map((object, index) => (
                    <tr key={object.id}>
                      <td>{++index}</td>
                      <td>
                        <Image
                          alt={object.nombres}
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/socios-files/${object.foto}`}
                          width={50}
                          height={50}
                          objectFit='cover'
                        />
                      </td>
                      <td>
                        {object.nombres} {object.apellidos}
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
                            {object.nro_licencia}
                          </li>
                          <li>
                            Vencimiento:
                            {object.vencimiento}
                          </li>
                          <li>
                            N° Movil:
                            {object.veiculo?.n_movil}
                          </li>
                        </ul>
                      </td>
                      <td>
                        <CustomSwitch
                          enabled={
                            !!(
                              `${object?.activo}` === '1' ||
                              object?.activo === true
                            )
                          }
                          onClick={async () => {
                            await socioService
                              .enabled(object.id)
                              .then(async (res: any) => {
                                await getData();
                                toast(
                                  res.data.activo
                                    ? 'Activado con exito'
                                    : 'Desactivado con exito'
                                );
                                console.log(res);
                              })
                              .catch((error) => {
                                console.log(error);
                                toast('Error al Registrado.', {});
                              });
                          }}
                        />
                      </td>
                      <td>
                        <div className=''>
                          {/* <Button variant="outline-warning" > */}
                          <Link
                            className='btn btn-outline-warning'
                            title={
                              object?.veiculo == null
                                ? 'Crear vehiculo'
                                : 'Ver vehiculo'
                            }
                            href={{
                              pathname:
                                '/dashboard/socios/[id]/veiculo/[veiculo_id]',
                              query: {
                                id: object.id,
                                veiculo_id:
                                  object?.veiculo == null
                                    ? 'new'
                                    : object?.veiculo?.id,
                              },
                            }}
                          >
                            {/* <a className='btn-warning m-1'> */}
                            Vehículo
                            {/* </a> */}
                          </Link>
                          <Link
                            className='btn btn-outline-warning'
                            href={{
                              pathname: '/dashboard/socios/[id]',
                              query: { id: object.id },
                            }}
                          >
                            {/* <a className='btn-warning m-1'> */}
                            Editar
                            {/* </a> */}
                          </Link>
                          {/* </Button> */}
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
//   const service = new SocioService();
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

export default SocioListPage;
