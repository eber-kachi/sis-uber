import { useRouter } from "next/router"
import React, { useState } from "react"
import SocioService from "../../../../../services/api/Socio.service"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { AdminLayout } from "@layout/index"
import { Button, Col, Form, Row } from "react-bootstrap"
import VeiculoService from "../../../../../services/api/Veiculo.service"

type Inputs = {
  placa: string,
  modelo: string,
  marca:string,
  color:string,
  foto: string,
  capacidad: string,
  caracteristicas: string,
  anio: string,
}


const veiculoEditPage = ({ isnew, data }) => {
  const router = useRouter();
  const socioService = new SocioService();
  console.log('Veiculo=> ',data)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<Inputs>({
    defaultValues: {
      placa: data?.placa ? data.placa : "",
      modelo: data?.modelo ? data.modelo : "",
      marca: data?.marca ? data.marca : "",
      color: data?.color ? data.color : "",
      foto: data?.foto ? data.foto : "",
      capacidad: data?.capacidad ? data.capacidad : "",
      caracteristicas: data?.caracteristicas ? data.caracteristicas : "",
      anio: data?.anio ? data.anio : "",
      // categoria: data?.categoria ? data.categoria : "Profesional (B)",
      // user_id: data?.user_id ? data.user_id : "",
      // username: data?.username ? data.username : "",
      // resetPassword: false,
      // veiculo_id: data?.veiculo_id ? data.veiculo_id : "",
    },
  })

  const onSubmit: SubmitHandler<Inputs> = (formData) => {
    console.log(formData)

    if (isnew) {
      socioService.create(formData)
        .then(res => {
          toast("Creado con exito.");
          router.back();
          console.log(res);
        })
        .catch(error => {
          console.log(error);
          toast("Error al crear.",{});
        });
    } else {
      socioService.update(formData, data.id)
        .then(res => {
          // toastSuccess(res.message);
          toast("Creado con exito.");
          router.back();
        })
        .catch(error => {
          console.log(error);
          toast("Error al actualizar.",{});
        });
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
                  <Form.Label>N° Placa</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    {...register("placa", { required: "Es requerido" })}
                  />
                  {errors.placa?.type === "required" &&
                  <span className="text-danger">{errors.placa?.message} </span>}
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Modelo</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    {...register("modelo", { required: "Es requerido" })} />
                  {errors.modelo?.type === "required" &&
                  <span className="text-danger">{errors.modelo?.message} </span>}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Marca</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    {...register("marca", { required: "Es requerido" })} />
                  {errors.marca?.type === "required" && <span className="text-danger">{errors.marca?.message} </span>}
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Color</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    {...register("color", { required: "color es requerido" })} />
                  {errors.color?.type === "required" &&
                  <span className="text-danger">{errors.color?.message} </span>}
                </Form.Group>
              </Col>
            </Row>
            <Row>

              <Col xs={6} md={4}>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Capacidad</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder=""
                    {...register("capacidad", { required: "Es requerido" })} />
                  {errors.capacidad?.type === "required" &&
                  <span className="text-danger">{errors.capacidad?.message} </span>}
                </Form.Group>
              </Col>
              <Col xs={6} md={4}>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label> Caracteristicas</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    {...register("caracteristicas", { required: "Es requerido" })} />
                  {errors.caracteristicas?.type === "required" &&
                  <span className="text-danger">{errors.caracteristicas?.message} </span>}
                </Form.Group>
              </Col>
              <Col xs={6} md={4}>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Año</Form.Label>
                  <Form.Control
                    type="year"
                    placeholder=""
                    {...register("anio", { required: "true" })} />
                  {errors.anio?.type === "required" && <span>{errors.anio?.message} </span>}
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
                    {...register("foto")} />
                  {errors.foto?.type === "required" && <span className="text-danger">{errors.foto?.message} </span>}
                </Form.Group>
                <img className="m-1" style={{ width: "100px" }}
                     src="https://eggerslab.com/wp-content/uploads/2016/02/foto-user.png"/>
              </Col>
              {/*<Col xs={12} md={6}>*/}
              {/*  <Form.Group className="mb-3" controlId="formBasicPassword">*/}
              {/*    <Form.Label>N° Licencia</Form.Label>*/}
              {/*    <Form.Control*/}
              {/*      type="text"*/}
              {/*      placeholder=""*/}
              {/*      {...register("nro_licencia", { required: "Es requerido" })} />*/}
              {/*    {errors.nro_licencia?.type === "required" &&*/}
              {/*    <span className="text-danger">{errors.nro_licencia?.message} </span>}*/}
              {/*  </Form.Group>*/}
              {/*</Col>*/}
            </Row>
            {/*<Row>*/}

            {/*  <Col xs={6} md={4}>*/}
            {/*    <Form.Group className="mb-3" controlId="formBasicPassword">*/}
            {/*      <Form.Label>Nombre Usuario</Form.Label>*/}
            {/*      <Form.Control*/}
            {/*        type="text"*/}
            {/*        placeholder=""*/}
            {/*        {...register("username", { required: true })} />*/}
            {/*      {errors.username?.type === "required" && <span>{errors.username?.message} </span>}*/}
            {/*    </Form.Group>*/}
            {/*  </Col>*/}
            {/*  <Col xs={6} md={4}>*/}
            {/*    <Form.Group className="mb-3" controlId="formBasicPassword">*/}
            {/*      <Form.Label>Año</Form.Label>*/}
            {/*      <Form.Control*/}
            {/*        type="year"*/}
            {/*        placeholder=""*/}
            {/*        {...register("anio", { required: "true" })} />*/}
            {/*      {errors.anio?.type === "required" && <span>{errors.anio?.message} </span>}*/}
            {/*    </Form.Group>*/}
            {/*  </Col>*/}
            {/*  /!*<Col xs={12} md={4}>*!/*/}
            {/*  /!*  <Form.Group className="mb-3" controlId="formBasicPassword">*!/*/}
            {/*  /!*    <Form.Label>Categoria</Form.Label>*!/*/}
            {/*  /!*    <Form.Select*!/*/}
            {/*  /!*      {...register("categoria", { required: "true" })}>*!/*/}
            {/*  /!*      {categorias.map((c, index)=>{*!/*/}
            {/*  /!*        return <option key={index} value={c}>{c}</option>*!/*/}
            {/*  /!*      })}*!/*/}
            {/*  /!*    </Form.Select>*!/*/}
            {/*  /!*    {errors.categoria?.type === "required" && <span>{errors.categoria?.message} </span>}*!/*/}
            {/*  /!*  </Form.Group>*!/*/}
            {/*  /!*</Col>*!/*/}
            {/*</Row>*/}

            <div className="d-flex justify-content-center">
              {/*<div className="d-flex g-2">*/}
              <Button className="w-25 m-4" type="submit" variant="outline-success">Guardar</Button>
              <Button className="m-4" variant="outline-danger" type="button" onClick={() => {
                router.back()
              }}>Cerrar</Button>
              {/*</div>*/}
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}

export async function getServerSideProps(context) {
  const { veiculo_id } = context.params
  console.log(context.params.id)
  if (veiculo_id !== "new") {
    try {
      const service = new VeiculoService()
      const response = await service.getById(veiculo_id)

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


export default veiculoEditPage
