"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import { AdminLayout } from "@layout/index";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { AuthService } from "../../../../services/api/Auth.service";
import SocioService from "../../../../services/api/Socio.service";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import VeiculoService from "../../../../services/api/Veiculo.service";
import { Console, log } from "console";
import { NextPage } from "next";
import UserService from "src/services/api/User.service";
import RolService from "src/services/api/Rol.service";
import useSWR from "swr";
import axios from "@lib/axios";

type Inputs = {
  email: string;
  role: string;
  password: string;
};

// const VeiculoEditPage = ({ isnew, data }) => {
export default function VeiculoEditPage({ isnew, data }) {
  // let data: any;
  // let isnew: boolean = false;
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [passwordDefauld, setPasswordDefauld] = useState(true);
  const socioService = new UserService();
  const rolService = new RolService();
  const [rols, setRols] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    getValues,
    getFieldState,
  } = useForm<Inputs>({
    defaultValues: {
      email: data?.email ? data.email : "",
      role: data?.role ? data.role : "",
      password: data?.password ? "" : "contraseña",
    },
  });

  const [email, role] = watch(["email", "role"]);
  console.log({ email, role });

  useEffect(() => {
    console.log("render efect ");
    function getrols() {
      rolService.getAll().then((res: any) => {
        console.log(res);
        console.log(getFieldState);

        setRols(res.data);
      });
    }

    getrols();
  }, []);

  const onSubmit: SubmitHandler<Inputs> = (formData) => {
    console.log(formData);

    if (isnew) {
      socioService
        .userRegister(formData)
        .then((res) => {
          toast("Creado con exito.");
          router.back();
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
          toast("Error al crear.", {});
        });
    } else {
      socioService
        .update(formData, data.id)
        .then((res) => {
          // toastSuccess(res.message);
          toast("Creado con exito.");
          router.back();
        })
        .catch((error) => {
          console.log(error);
          toast("Error al actualizar.", {});
        });
    }
  };

  return (
    <AdminLayout>
      <div className="row">
        <div className="col">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Correo </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    {...register("email", { required: "Es requerido" })}
                  />
                  {errors.email?.type === "required" && (
                    <span className="text-danger">
                      {errors.email?.message}{" "}
                    </span>
                  )}
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3" controlId="rol">
                  <Form.Label>Rol</Form.Label>
                  <Form.Select
                    defaultValue={data?.role ? data.role : ""}
                    {...register("role", { required: "Es requerido" })}
                  >
                    <option value="" disabled>
                      Selecione un rol
                    </option>
                    {rols &&
                      rols.map((c, index) => {
                        return (
                          <option key={index} value={c}>
                            {c}
                          </option>
                        );
                      })}
                  </Form.Select>
                  {errors.role?.type === "required" && (
                    <span className="text-danger">{errors.role?.message} </span>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6}>
                {/* // defaul passwors for checked or input  */}
                <Form.Check
                  checked={passwordDefauld}
                  type={"checkbox"}
                  id={`default`}
                  label={`contraseña por defecto. {contraseña}`}
                  onChange={(val) => setPasswordDefauld(!passwordDefauld)}
                />
                {passwordDefauld ? null : (
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder=""
                      {...register("password", { required: "Es requerido" })}
                    />
                  </Form.Group>
                )}
              </Col>
            </Row>
            <div className="d-flex justify-content-center">
              {/*<div className="d-flex g-2">*/}
              <Button
                className="w-25 m-4"
                type="submit"
                variant="outline-success"
              >
                Guardar
              </Button>
              <Button
                className="m-4"
                variant="outline-danger"
                type="button"
                onClick={() => {
                  router.back();
                }}
              >
                Cerrar
              </Button>
              {/*</div>*/}
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;

  console.log(context.params);

  if (id !== "new") {
    try {
      const service = new UserService();
      const response = await service.getById(id);
      return {
        props: {
          isnew: false,
          // eslint-disable-next-line camelcase
          data: response.data,
        },
      };
    } catch (e) {
      // console.log(e);
      if (e.response.status === 404) {
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

// export default VeiculoEditPage;
