import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { SubmitHandler, useForm } from 'react-hook-form'
import { AdminLayout } from '@layout/index'
import {
  Button, Col, Form, InputGroup, Row,
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import Modal from 'react-bootstrap/Modal'
import { toast } from 'react-toastify'
import { AuthService } from '../../../../services/api/Auth.service'
import SocioService from '../../../../services/api/Socio.service'
import VeiculoService from '../../../../services/api/Veiculo.service'

const categorias = [
  'Particular (P)',
  'Profesional (A)',
  'Profesional (B)',
  'Profesional (C)',
  'Motorista (T)',
]

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
}

const VeiculoEditPage = ({ isnew, data }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const socioService = new SocioService()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
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
      user_id: data?.user_id ? data.user_id : '',
      username: data?.username ? data.username : '',
      // resetPassword: false,
      // veiculo_id: data?.veiculo_id ? data.veiculo_id : "",
    },
  })

  const onSubmit: SubmitHandler<Inputs> = (formData) => {
    // console.log(formData)

    if (isnew) {
      socioService.create(formData)
        .then((res) => {
          toast('Creado con exito.')
          // console.log()
          // console.log(res)
        })
        .catch((error) => {
          // console.log(error)
          toast('Error al crear.', {})
        })
    } else {
      socioService.update(formData, data.id)
        .then((res) => {
          // toastSuccess(res.message);
          toast('Creado con exito.')
          router.back()
        })
        .catch((error) => {
          // console.log(error)
          toast('Error al actualizar.', {})
        })
    }
  }

  return (
    <AdminLayout>
      <div className="row">
        <div className="col">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Nombres</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    {...register('nombres', { required: 'Es requerido' })}
                  />
                  {errors.nombres?.type === 'required'
                  && (
                  <span className="text-danger">
                    {errors.nombres?.message}
                    {' '}
                  </span>
                  )}
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Apellidos</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    {...register('apellidos', { required: 'Es requerido' })}
                  />
                  {errors.apellidos?.type === 'required'
                  && (
                  <span className="text-danger">
                    {errors.apellidos?.message}
                    {' '}
                  </span>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Cedula Identidad</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    {...register('ci', { required: 'C.I es requerido' })}
                  />
                  {errors.ci?.type === 'required' && (
                  <span className="text-danger">
                    {errors.ci?.message}
                    {' '}
                  </span>
                  )}
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Nacionanlidad</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    {...register('nacionalidad', { required: 'Nacionalidad es requerido' })}
                  />
                  {errors.nacionalidad?.type === 'required'
                  && (
                  <span className="text-danger">
                    {errors.nacionalidad?.message}
                    {' '}
                  </span>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Row>

              <Col xs={6} md={4}>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Fecha emision</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder=""
                    {...register('emision', { required: 'Es requerido' })}
                  />
                  {errors.emision?.type === 'required'
                  && (
                  <span className="text-danger">
                    {errors.emision?.message}
                    {' '}
                  </span>
                  )}
                </Form.Group>
              </Col>
              <Col xs={6} md={4}>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Fecha Vencimiento</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder=""
                    {...register('vencimiento', { required: 'Es requerido' })}
                  />
                  {errors.vencimiento?.type === 'required'
                  && (
                  <span className="text-danger">
                    {errors.vencimiento?.message}
                    {' '}
                  </span>
                  )}
                </Form.Group>
              </Col>
              <Col xs={12} md={4}>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Categoria</Form.Label>
                  <Form.Select
                    {...register('categoria', { required: 'Es requerido' })}
                  >
                    {categorias.map((c, index) => <option key={index} value={c}>{c}</option>)}
                  </Form.Select>
                  {errors.categoria?.type === 'required'
                  && (
                  <span className="text-danger">
                    {errors.categoria?.message}
                    {' '}
                  </span>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Row>

              <Col xs={12} md={6} className="d-flex">
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Foto</Form.Label>
                  <Form.Control
                    type="file"
                    placeholder=""
                    {...register('foto')}
                  />
                  {errors.foto?.type === 'required' && (
                  <span className="text-danger">
                    {errors.foto?.message}
                    {' '}
                  </span>
                  )}
                </Form.Group>
                <img
                  className="m-1"
                  style={{ width: '100px' }}
                  src="https://eggerslab.com/wp-content/uploads/2016/02/foto-user.png"
                />
              </Col>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>N° Licencia</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    {...register('nro_licencia', { required: 'Es requerido' })}
                  />
                  {errors.nro_licencia?.type === 'required'
                  && (
                  <span className="text-danger">
                    {errors.nro_licencia?.message}
                    {' '}
                  </span>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Row>

              <Col xs={6} md={4}>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Nombre Usuario</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    {...register('username', { required: true })}
                  />
                  {errors.username?.type === 'required' && (
                  <span>
                    {errors.username?.message}
                    {' '}
                  </span>
                  )}
                </Form.Group>
              </Col>
              {/* <Col xs={6} md={4}> */}
              {/*  <Form.Group className="mb-3" controlId="formBasicPassword"> */}
              {/*    <Form.Label>Fecha Vencimiento</Form.Label> */}
              {/*    <Form.Control */}
              {/*      type="date" */}
              {/*      placeholder="" */}
              {/*      {...register("vencimiento", { required: "true" })} /> */}
              {/*    {errors.vencimiento?.type === "required" && <span>{errors.vencimiento?.message} </span>} */}
              {/*  </Form.Group> */}
              {/* </Col> */}
              {/* <Col xs={12} md={4}> */}
              {/*  <Form.Group className="mb-3" controlId="formBasicPassword"> */}
              {/*    <Form.Label>Categoria</Form.Label> */}
              {/*    <Form.Select */}
              {/*      {...register("categoria", { required: "true" })}> */}
              {/*      {categorias.map((c, index)=>{ */}
              {/*        return <option key={index} value={c}>{c}</option> */}
              {/*      })} */}
              {/*    </Form.Select> */}
              {/*    {errors.categoria?.type === "required" && <span>{errors.categoria?.message} </span>} */}
              {/*  </Form.Group> */}
              {/* </Col> */}
            </Row>

            <div className="d-flex justify-content-center">
              {/* <div className="d-flex g-2"> */}
              <Button className="w-25 m-4" type="submit" variant="outline-success">Guardar</Button>
              <Button
                className="m-4"
                variant="outline-danger"
                type="button"
                onClick={() => {
                  router.back()
                }}
              >
                Cerrar

              </Button>
              {/* </div> */}
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}

export async function getServerSideProps(context) {
  const { id } = context.params

  // console.log(context.params)

  if (id !== 'new') {
    try {
      const service = new SocioService()
      const response = await service.getById(id)
      return {
        props: {
          isnew: false,
          // eslint-disable-next-line camelcase
          data: response,
        },
      }
    } catch (e) {
      // console.log(e);
      if (e.response.status === 404) {
        return {
          notFound: true,
        }
      }
    }
  }

  return {
    props: {
      isnew: true,
      // eslint-disable-next-line camelcase
      data: {},
    },
  }
}

export default VeiculoEditPage
