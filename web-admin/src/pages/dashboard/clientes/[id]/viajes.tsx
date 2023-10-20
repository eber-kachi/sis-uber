import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@layout/index';
import { Badge, Card } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import ViajeService from '../../../../services/api/Viaje.service';

const ViajesListPage = ({ dataResponce }: { dataResponce: any[] }) => {
  const service = new ViajeService();

  const [objects, setObjects] = useState(dataResponce || []);

  const router = useRouter();
  const { id } = router.query;

  const getById = async () => {
    const response = await service.getByclienteoId(String(id));
    console.log(response.data);

    setObjects(response.data);
  };

  useEffect(() => {
    if (id) {
      getById().then();
    }
    return () => {};
  }, [router.isReady]);

  return (
    <AdminLayout>
      <div className='row'>
        <div className='p-2 d-flex flex flex-row justify-content-between'>
          <div>
            <h3 className='text-title'>Lista de viajes </h3>
          </div>
          <div>
            {/* <Link className="btn btn-success" href={{ pathname: "/dashboard/socios/[id]", query: { id: "new" } }}> */}
            {/*  Crear Nuevo */}
            {/* </Link> */}
          </div>
        </div>
        <Card>
          <Card.Body>
            <Table striped responsive size='sm'>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {objects.length > 0 &&
                  objects.map((object, index) => (
                    <tr key={object.id}>
                      <td>{++index}</td>
                      {/* <td>Otto</td> */}
                      <td>
                        {object.estado === 'FINALIZADO' ? (
                          <Badge bg='success'> {object.estado}</Badge>
                        ) : (
                          <Badge bg='warning'> {object.estado}</Badge>
                        )}
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
//   console.log('vaijes=> ', context.params.id);

//   const service = new ViajeService();
//   const responce = await service.getByclienteoId(context.params.id);
//   // console.log(responce);
//   return {
//     props: {
//       dataResponce: responce.data || [],
//     },
//   };
// }

export default ViajesListPage;
