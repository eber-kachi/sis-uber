import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AdminLayout } from '@layout/index';
import { Button, Col, Form, Row, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import GrupoTrabajoService from 'src/services/api/GrupoTrabajo.service';
import Select from '@components/ui/select';
import SocioService from '../../../../services/api/Socio.service';

const categorias = [
  'Particular (P)',
  'Profesional (A)',
  'Profesional (B)',
  'Profesional (C)',
  'Motorista (T)',
];

type Inputs = {
  nombres: string;
  apellidos: string;
  ci: string;
  nacionalidad: string;
  foto: string;
  emision: string;
  vencimiento: string;
  nro_licencia: string;
  categoria: string;
  user_id: string;
  // veiculo_id: string,
  username: string;
  email: string;
  grupotrabajo_id: string;
};

// const SocioEditPage = ({ isnew, data }: { isnew: boolean; data: any }) => {
const SocioEditPage = () => {
  // console.log('editar=>', data);

  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const socioService = new SocioService();
  const grupoTrabajoService = new GrupoTrabajoService();
  const [foto, setFoto] = useState<any>(null);
  const [grupoTrabajo, setGrupoTrabajo] = useState<any[]>([]);

  const [isnew, setIsnew] = useState<boolean>(false);
  const [data, setData] = useState<any>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    reset,
  } = useForm<Inputs>({
    defaultValues: {
      nombres: data?.nombres ? data.nombres : '',
      apellidos: data?.apellidos ? data.apellidos : '',
      ci: data?.ci ? data.ci : '',
      nacionalidad: data?.nacionalidad ? data.nacionalidad : '',
      foto: data?.foto ? data.foto : '',
      emision: data?.emision ? data.emision : '',
      vencimiento: data?.vencimiento ? data.vencimiento : '',
      nro_licencia: data?.nro_licencia ? data.nro_licencia : '',
      categoria: data?.categoria ? data.categoria : 'Profesional (B)',
      user_id: data?.user ? data.user.id : '',
      email: data?.user ? data.user.email : '',
      grupotrabajo_id: data?.grupotrabajo_id ? data.grupotrabajo_id : '',
    },
  });
  // watch((e) => {
  //   console.log(e);
  // });

  const listGrupotrabajo = async () => {
    const respose = await grupoTrabajoService.getAll();
    console.log(respose.data);
    setGrupoTrabajo(respose.data);
  };
  const getSocioById = async () => {
    const response = await socioService.getById(String(id));
    reset({ ...response?.data });
    setValue('email', response.data.user ? response.data.user.email : '');
    setData(response?.data);
  };

  useEffect(() => {
    listGrupotrabajo();

    if (id !== 'new') {
      setIsnew(false);
      getSocioById().then();
    } else {
      setIsnew(true);
      setData(null);
    }

    return () => {};
  }, [router.isReady]);

  const onSubmit: SubmitHandler<Inputs> = (formData) => {
    // console.log(formData)

    const newForm = new FormData();
    newForm.append('nombres', formData.nombres);
    newForm.append('apellidos', formData.apellidos);
    newForm.append('ci', formData.ci);
    newForm.append('nacionalidad', formData.nacionalidad);
    if (foto) {
      newForm.append('foto', foto, foto.name);
    }
    // newForm.append("foto", foto || "");
    newForm.append('vencimiento', formData.vencimiento);
    newForm.append('emision', formData.emision);
    newForm.append('nro_licencia', formData.nro_licencia);
    newForm.append('categoria', formData.categoria);
    newForm.append('user_id', formData.user_id);
    newForm.append('email', formData.email);
    newForm.append('grupotrabajo_id', formData.grupotrabajo_id);

    if (isnew) {
      socioService
        .create(newForm)
        .then((res) => {
          toast('Creado con exito.');
          router.back();
        })
        .catch((error) => {
          toast('Error al crear.', {});
        });
    } else {
      socioService
        .updateFormData(newForm, data.id)
        .then((res) => {
          toast('Creado con exito.');
          router.back();
        })
        .catch((error) => {
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
            } socio`}</h3>
          </div>
          <Card>
            <Card.Body>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col xs={12} md={6}>
                    <Form.Group className='mb-3' controlId='formBasicPassword'>
                      <Form.Label>Nombres</Form.Label>
                      <Form.Control
                        type='text'
                        placeholder=''
                        {...register('nombres', { required: 'Es requerido' })}
                      />
                      {errors.nombres?.type === 'required' && (
                        <span className='text-danger'>
                          {errors.nombres?.message}{' '}
                        </span>
                      )}
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group className='mb-3' controlId='formBasicPassword'>
                      <Form.Label>Apellidos</Form.Label>
                      <Form.Control
                        type='text'
                        placeholder=''
                        {...register('apellidos', { required: 'Es requerido' })}
                      />
                      {errors.apellidos?.type === 'required' && (
                        <span className='text-danger'>
                          {errors.apellidos?.message}{' '}
                        </span>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={6}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Cédula Identidad</Form.Label>
                      <Form.Control
                        type='text'
                        placeholder=''
                        {...register('ci', { required: 'C.I es requerido' })}
                      />
                      {errors.ci?.type === 'required' && (
                        <span className='text-danger'>
                          {errors.ci?.message}{' '}
                        </span>
                      )}
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Nacionalidad</Form.Label>
                      <Form.Control
                        type='text'
                        placeholder=''
                        {...register('nacionalidad', {
                          required: 'Nacionalidad es requerido',
                        })}
                      />
                      {errors.nacionalidad?.type === 'required' && (
                        <span className='text-danger'>
                          {errors.nacionalidad?.message}{' '}
                        </span>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col xs={6} md={4}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Fecha emision</Form.Label>
                      <Form.Control
                        type='date'
                        placeholder=''
                        {...register('emision', { required: 'Es requerido' })}
                      />
                      {errors.emision?.type === 'required' && (
                        <span className='text-danger'>
                          {errors.emision?.message}{' '}
                        </span>
                      )}
                    </Form.Group>
                  </Col>
                  <Col xs={6} md={4}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Fecha Vencimiento</Form.Label>
                      <Form.Control
                        type='date'
                        placeholder=''
                        {...register('vencimiento', {
                          required: 'Es requerido',
                        })}
                      />
                      {errors.vencimiento?.type === 'required' && (
                        <span className='text-danger'>
                          {errors.vencimiento?.message}{' '}
                        </span>
                      )}
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={4}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Categoria</Form.Label>
                      <Form.Select
                        {...register('categoria', { required: 'Es requerido' })}
                      >
                        {categorias.map((c, index) => (
                          <option key={index} value={c}>
                            {c}
                          </option>
                        ))}
                      </Form.Select>
                      {errors.categoria?.type === 'required' && (
                        <span className='text-danger'>
                          {errors.categoria?.message}{' '}
                        </span>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={6} className='d-flex'>
                    <Form.Group className='mb-3'>
                      <Form.Label>Foto</Form.Label>
                      <Form.Control
                        type='file'
                        accept='.png, .jpj'
                        placeholder=''
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setFoto(e.target?.files && e.target?.files[0]);
                        }}
                      />
                      {/* {errors.foto?.type === "required" && (
                    <span className="text-danger">{errors.foto?.message} </span>
                  )} */}
                    </Form.Group>
                    <img
                      className='m-1'
                      style={{ width: '100px' }}
                      src={
                        foto ||
                        'https://eggerslab.com/wp-content/uploads/2016/02/foto-user.png'
                      }
                    />
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group className='mb-3'>
                      <Form.Label>N° Licencia</Form.Label>
                      <Form.Control
                        type='text'
                        placeholder=''
                        {...register('nro_licencia', {
                          required: 'Es requerido',
                        })}
                      />
                      {errors.nro_licencia?.type === 'required' && (
                        <span className='text-danger'>
                          {errors.nro_licencia?.message}{' '}
                        </span>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col xs={6} md={4}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Correo Electronico</Form.Label>
                      <Form.Control
                        type='text'
                        placeholder=''
                        {...register('email', { required: true })}
                      />
                      {errors.email?.type === 'required' && (
                        <span>{errors.email?.message} </span>
                      )}
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={4}>
                    <Form.Group className='mb-3'>
                      {/* <Select
                    label='Grupo trabajo'
                    data={grupoTrabajo}
                    {...register('grupotrabajo_id')}
                  /> */}
                      <Form.Label>Grupo trabajo</Form.Label>

                      <Form.Select
                        {...register('grupotrabajo_id', {
                          required: 'Es requerido',
                        })}
                        defaultValue={
                          data?.grupotrabajo_id ? data.grupotrabajo_id : ''
                        }
                      >
                        <option disabled value=''>
                          Selecione un grupo
                        </option>
                        {grupoTrabajo &&
                          grupoTrabajo.map((c, index) => (
                            <option key={index} value={c.id}>
                              {c.nombre}
                            </option>
                          ))}
                      </Form.Select>
                      {errors.grupotrabajo_id?.type === 'required' && (
                        <span className='text-danger'>
                          {errors.grupotrabajo_id?.message}{' '}
                        </span>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                <div className='d-flex justify-content-center'>
                  {/* <div className="d-flex g-2"> */}
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
                  {/* </div> */}
                </div>
              </form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

// export async function getServerSideProps(context: any) {
//   const { id } = context.params;

//   // console.log(context.params)
//   const service = new SocioService();

//   if (id !== 'new') {
//     try {
//       const response = await service.getById(id);
//       return {
//         props: {
//           isnew: false,
//           // eslint-disable-next-line camelcase
//           data: response?.data,
//         },
//       };
//     } catch (e: any) {
//       console.log(e);
//       if (e?.response?.status === 404) {
//         return {
//           notFound: true,
//         };
//       }
//     }
//   }

//   return {
//     props: {
//       isnew: true,
//       // eslint-disable-next-line camelcase
//       data: {},
//     },
//   };
// }

export default SocioEditPage;
