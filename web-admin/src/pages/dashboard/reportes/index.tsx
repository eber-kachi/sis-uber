import { NextPage } from 'next';
import { AdminLayout } from '@layout/index';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { Card } from 'react-bootstrap';
import SocioService from 'src/services/api/Socio.service';
import ClienteService from '../../../services/api/Cliente.service';

const ReporteListPage: NextPage = (a) => {
  const [loading, setLoading] = useState(false);
  const clienteService = new ClienteService();
  const socioService = new SocioService();

  const handlerClient = () => {
    setLoading(true);
    // console.log('asasdasdasd');
    toast('Descargado...', { delay: 100 });
    // hora dia mes año en texto Date
    const currentTime = new Date();
    const textTime = `${currentTime.getHours()}${currentTime.getMonth()}${currentTime.getFullYear()}`;
    clienteService.getReport().then((resp: any) => {
      const a = document.createElement('a');
      a.href = `data:${resp.mimeType};base64,${resp.content}`;
      a.target = '_blank';
      a.download = `cliente-viajes-${textTime}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      console.log(resp);
      setLoading(false);
    });
  };

  const handlerSocio = () => {
    setLoading(true);
    // console.log('asasdasdasd');
    toast('Descargado...', { delay: 100 });
    // hora dia mes año en texto Date
    const currentTime = new Date();
    const textTime = `${currentTime.getHours()}${currentTime.getMonth()}${currentTime.getFullYear()}`;
    socioService
      .getReport()
      .then((resp: any) => {
        const a = document.createElement('a');
        a.href = `data:${resp.mimeType};base64,${resp.content}`;
        a.target = '_blank';
        a.download = `cliente-viajes-${textTime}.pdf`;
        document.body.appendChild(a);
        a?.click();
        a?.remove();
        console.log(resp);
        setLoading(false);
      })
      .catch(console.log)
      .finally(() => {
        console.log('paso algo ');
        setLoading(false);
      });
  };

  useEffect(() => {}, []);

  return (
    <AdminLayout>
      <div className='row'>
        <div className='p-2 d-flex flex flex-row justify-content-between'>
          <div>
            <h3>Reportes</h3>
          </div>
        </div>
        {/* d-flex flex-row justify-content-center */}
        <div className='row '>
          <div className='col col-md-4'>
            <Card style={{ width: '18rem' }}>
              {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
              <Card.Body>
                <Card.Title>Reporte de clientes viajes</Card.Title>
                <Card.Text>
                  Este reporte es para ver, a los clientes cuantos viajes tuvo.
                </Card.Text>
                <Button
                  variant='primary'
                  disabled={loading}
                  onClick={() => handlerClient()}
                >
                  Descargar
                </Button>
              </Card.Body>
            </Card>
          </div>
          <div className='col col-md-4'>
            <Card style={{ width: '18rem' }}>
              {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
              <Card.Body>
                <Card.Title>Reporte de socio viajes</Card.Title>
                <Card.Text>
                  Este reporte es para ver, a los clientes cuantos viajes tuvo.
                </Card.Text>
                <Button
                  variant='primary'
                  disabled={loading}
                  onClick={() => handlerSocio()}
                >
                  Descargar
                </Button>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ReporteListPage;
