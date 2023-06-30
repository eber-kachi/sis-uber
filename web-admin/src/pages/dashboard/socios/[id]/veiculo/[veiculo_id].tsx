import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { AdminLayout } from '@layout/index';
import { Button, Col, Form, Row } from 'react-bootstrap';
import SocioService from '../../../../../services/api/Socio.service';
import VeiculoService from '../../../../../services/api/Veiculo.service';

type Inputs = {
  placa: string;
  modelo: string;
  marca: string;
  color: string;
  foto: string;
  capacidad: string;
  caracteristicas: string;
  anio: string;
  n_movil: string;
};

const veiculoEditPage = ({ isnew, data }: { isnew: boolean; data: any }) => {
  const router = useRouter();
  const socioService = new VeiculoService();
  const socio = new SocioService();

  const [foto, setFoto] = useState<any>(null);

  console.log('Veiculo=> ', data);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<Inputs>({
    defaultValues: {
      placa: data?.placa ? data.placa : '',
      modelo: data?.modelo ? data.modelo : '',
      marca: data?.marca ? data.marca : '',
      color: data?.color ? data.color : '',
      foto: data?.foto ? data.foto : '',
      capacidad: data?.capacidad ? data.capacidad : '',
      caracteristicas: data?.caracteristicas ? data.caracteristicas : '',
      anio: data?.anio ? data.anio : '',
      n_movil: data?.n_movil ? data.n_movil : '',
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (formData) => {
    console.log(formData);

    const newForm = new FormData();
    newForm.append('placa', formData.placa);
    newForm.append('modelo', formData.modelo);
    newForm.append('marca', formData.marca);
    newForm.append('color', formData.color);
    newForm.append('capacidad', formData.capacidad);
    if (foto) {
      newForm.append('foto', foto, foto.name);
    }
    // newForm.append("foto", foto || "");
    newForm.append('caracteristicas', formData.caracteristicas);
    newForm.append('anio', formData.anio);
    newForm.append('n_movil', formData.n_movil);

    if (isnew) {
      socioService
        .create(newForm)
        .then(async (res: any) => {
          //  despues de  crear el veiculo debemos agregarle al socio
          await socio.addCar({
            socio_id: data.socio_id,
            veiculo_id: res.data.id,
          });
          toast('Creado con exito.');
          router.back();
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
          toast('Error al crear.', {});
        });
    } else {
      socioService
        .updateFormData(newForm, data.id)
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col xs={12} md={6}>
                <Form.Group className='mb-3'>
                  <Form.Label>N° Placa</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder=''
                    {...register('placa', { required: 'Es requerido' })}
                  />
                  {errors.placa?.type === 'required' && (
                    <span className='text-danger'>
                      {errors.placa?.message}{' '}
                    </span>
                  )}
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group className='mb-3'>
                  <Form.Label>Modelo</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder=''
                    {...register('modelo', { required: 'Es requerido' })}
                  />
                  {errors.modelo?.type === 'required' && (
                    <span className='text-danger'>
                      {errors.modelo?.message}{' '}
                    </span>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6}>
                <Form.Group className='mb-3'>
                  <Form.Label>Marca</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder=''
                    {...register('marca', { required: 'Es requerido' })}
                  />
                  {errors.marca?.type === 'required' && (
                    <span className='text-danger'>
                      {errors.marca?.message}{' '}
                    </span>
                  )}
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group className='mb-3'>
                  <Form.Label>Color</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder=''
                    {...register('color', { required: 'color es requerido' })}
                  />
                  {errors.color?.type === 'required' && (
                    <span className='text-danger'>
                      {errors.color?.message}{' '}
                    </span>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={6} md={4}>
                <Form.Group className='mb-3'>
                  <Form.Label>Capacidad</Form.Label>
                  <Form.Control
                    type='number'
                    placeholder=''
                    {...register('capacidad', { required: 'Es requerido' })}
                  />
                  {errors.capacidad?.type === 'required' && (
                    <span className='text-danger'>
                      {errors.capacidad?.message}{' '}
                    </span>
                  )}
                </Form.Group>
              </Col>
              <Col xs={6} md={4}>
                <Form.Group className='mb-3'>
                  <Form.Label> Caracteristicas</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder=''
                    {...register('caracteristicas', {
                      required: 'Es requerido',
                    })}
                  />
                  {errors.caracteristicas?.type === 'required' && (
                    <span className='text-danger'>
                      {errors.caracteristicas?.message}{' '}
                    </span>
                  )}
                </Form.Group>
              </Col>
              <Col xs={6} md={4}>
                <Form.Group className='mb-3'>
                  <Form.Label>Año</Form.Label>
                  <Form.Control
                    type='year'
                    placeholder=''
                    {...register('anio', { required: 'true' })}
                  />
                  {errors.anio?.type === 'required' && (
                    <span>{errors.anio?.message} </span>
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
                      // console.log(e.target?.files[0]);
                      setFoto(e.target.files && e.target?.files[0]);
                    }}
                  />
                  {/* {errors.foto?.type === "required" && (
                    <span className="text-danger">{errors.foto?.message} </span>
                  )} */}
                </Form.Group>
                {/* <Image
                  alt={object.nombres}
                  src={
                    process.env.NEXT_PUBLIC_BACKEND_URL +
                    "/public/socios-files/" +
                    object.foto
                  }
                  width={50}
                  height={50}
                  objectFit="cover"
                /> */}
                <img
                  alt='hola'
                  className='m-1'
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'contain',
                  }}
                  src={
                    data?.foto
                      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/public/socios-files/${data?.foto}`
                      : 'https://eggerslab.com/wp-content/uploads/2016/02/foto-user.png'
                  }
                />
              </Col>
              <Col xs={12} md={6}>
                <Form.Group className='mb-3'>
                  <Form.Label>N° Movil</Form.Label>
                  <Form.Control
                    type='number'
                    placeholder=''
                    {...register('n_movil', { required: 'Es requerido' })}
                  />
                  {errors.n_movil?.type === 'required' && (
                    <span className='text-danger'>
                      {errors.n_movil?.message}{' '}
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
        </div>
      </div>
    </AdminLayout>
  );
};

export async function getServerSideProps(context: any) {
  const { veiculo_id } = context.params;
  console.log(context.params.id);
  if (veiculo_id !== 'new') {
    try {
      const service = new VeiculoService();
      const response = await service.getById(veiculo_id);

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
      data: { socio_id: context.params.id },
    },
  };
}

export default veiculoEditPage;
