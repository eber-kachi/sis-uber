import { AdminLayout } from '@layout/index';
import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';

import Button from 'react-bootstrap/Button';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { Card } from 'react-bootstrap';
import ClienteService from '../../../services/api/Cliente.service';

const SocioListPage = ({ dataResponce }: { dataResponce: any[] }) => {
  // const { userValue } = useAuthClient({ redirectIfAuthenticated: "/" })
  // console.log("user value=>", userValue)
  console.log('list=>', dataResponce);
  const clienteService = new ClienteService();
  const [modalShow, setModalShow] = useState(false);
  const [objects, setObjects] = useState(dataResponce || []);

  const getData = async () => {
    const responce = await clienteService.getAll();
    // getLinks(responce.links);
    setObjects(responce.data);
  };

  const onClickDelete = (id: string) => {
    clienteService
      .delete(id)
      .then((res) => {
        console.log(res);
        toast('Eliminado con exito.');
        getData();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {}, []);

  return (
    <AdminLayout>
      <div className='row'>
        <div className='p-2 d-flex flex flex-row justify-content-between'>
          <div>
            <h3 className='text-title'>Lista de Clientes</h3>
          </div>
          <div />
        </div>
        <Card>
          <Card.Body>
            <Table striped responsive size='sm'>
              <thead>
                <tr>
                  <th>#</th>

                  <th>Nombre completo</th>

                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {objects.length > 0 &&
                  objects.map((object, index) => (
                    <tr key={object.id}>
                      <td>{++index}</td>
                      <td>
                        {object.nombres} {object.apellidos}
                      </td>

                      <td>
                        <div className=''>
                          <Link
                            className='btn btn-outline-warning'
                            title='Ver viajes'
                            href={{
                              pathname: '/dashboard/clientes/[id]/viajes',
                              query: { id: object.id },
                            }}
                          >
                            Viajes
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

export async function getServerSideProps(context: any) {
  const service = new ClienteService();
  const responce = await service.getAll();
  // console.log(responce);
  return {
    props: {
      dataResponce: responce.data,
    },
  };
}

export default SocioListPage;
