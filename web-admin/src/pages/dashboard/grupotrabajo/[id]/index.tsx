import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AdminLayout } from '@layout/index';
import { Button, Col, Form, InputGroup, Row, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import GrupoTrabajoService from 'src/services/api/GrupoTrabajo.service';

type Inputs = {
  nombre: string;
  hora_inicio: string;
  hora_fin: string;
};

const VeiculoEditPage = ({ isnew, data }: { isnew: boolean; data: any }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const socioService = new GrupoTrabajoService();
  console.log(data);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<Inputs>({
    defaultValues: {
      nombre: data?.nombre ? data.nombre : '',
      hora_inicio: data?.hora_inicio ? data.hora_inicio : '',
      hora_fin: data?.hora_fin ? data.hora_fin : '',
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (formData) => {
    // console.log(formData);

    if (isnew) {
      socioService
        .create(formData)
        .then((res) => {
          toast('Creado con exito.');
          router.back();
          // console.log(res);
        })
        .catch((error) => {
          console.log(error);
          toast('Error al crear.', {});
        });
    } else {
      socioService
        .update(formData, data.id)
        .then((res) => {
          // toastSuccess(res.message);
          toast('Actualizado con exito.');
          router.back();
        })
        .catch((error) => {
          console.log(error);
          toast('Error al actualizar.', {});
        });
    }
  };

  return (
    <AdminLayout>
      <div className='row'>
        <div className='col'>
          <div>
            <h3 className='text-title text-center'>{`${
              isnew ? 'Crear ' : 'Editar'
            } grupo trabajo`}</h3>
          </div>
          <Card>
            <Card.Body>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col xs={12} md={12}>
                    <Form.Group className='mb-3' controlId='formBasicPassword'>
                      <Form.Label>Nombre </Form.Label>
                      <Form.Control
                        type='text'
                        placeholder=''
                        {...register('nombre', { required: 'Es requerido' })}
                      />
                      {errors.nombre?.type === 'required' && (
                        <span className='text-danger'>
                          {errors.nombre?.message}{' '}
                        </span>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={6}>
                    <Form.Group className='mb-3' controlId='formBasicPassword'>
                      <Form.Label>Hora inicio</Form.Label>
                      <Form.Control
                        type='time'
                        placeholder=''
                        {...register('hora_inicio', {
                          required: 'C.I es requerido',
                        })}
                      />
                      {errors.hora_inicio?.type === 'required' && (
                        <span className='text-danger'>
                          {errors.hora_inicio?.message}{' '}
                        </span>
                      )}
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group className='mb-3' controlId='formBasicPassword'>
                      <Form.Label>Horas trabajo </Form.Label>
                      <Form.Control
                        type='number'
                        min='1'
                        max='24'
                        placeholder=''
                        {...register('hora_fin', {
                          required: 'Nacionalidad es requerido',
                        })}
                      />
                      {errors.hora_fin?.type === 'required' && (
                        <span className='text-danger'>
                          {errors.hora_fin?.message}{' '}
                        </span>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                <div className='d-flex justify-content-center'>
                  <Button
                    className='w-25 m-4'
                    type='submit'
                    variant='outline-success'
                  >
                    Guardar
                  </Button>
                  <Button
                    className='m-4'
                    variant='outline-danger'
                    type='button'
                    onClick={() => {
                      router.back();
                    }}
                  >
                    Cerrar
                  </Button>
                </div>
              </form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export async function getServerSideProps(context: any) {
  const { id } = context.params;

  console.log(context.params);

  if (id !== 'new') {
    try {
      const service = new GrupoTrabajoService();
      const response = await service.getById(id);
      return {
        props: {
          isnew: false,
          // eslint-disable-next-line camelcase
          data: response.data,
        },
      };
    } catch (e: any) {
      // console.log(e);
      if (e?.response?.status === 404) {
        return {
          notFound: true,
        };
      }
    }
  }

  return {
    props: {
      isnew: true,
      // eslint-disable-next-line camelcase
      data: {},
    },
  };
}

export default VeiculoEditPage;
