import { NextPage } from "next";
import { useAuthClient } from "@hooks/useAuthClient";
import { AdminLayout } from "@layout/index";
import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import SocioService from "../../../services/api/Socio.service";
import { object } from "prop-types";
// import { Button } from "react-bootstrap"
import Button from "react-bootstrap/Button";
import CustomModal from "@components/Modal/CustomModal";
import Link from "next/link";
import { toast } from "react-toastify";
import ClienteService from "../../../services/api/Cliente.service";
import CustomSwitch from "../../../components/ui/CustomSwitch";

const ReporteListPage: NextPage = (a) => {
  // const { userValue } = useAuthClient({ redirectIfAuthenticated: "/" })
  // console.log("user value=>", userValue)
  console.log("list=>", a);
  const clienteService = new ClienteService();
  const [modalShow, setModalShow] = useState(false);
  const [objects, setObjects] = useState([]);

  const getData = async () => {
    const responce: any[] = (await clienteService.getAll()) as any[];
    // getLinks(responce.links);
    setObjects(responce);
  };

  const onClickDelete = (id: string) => {
    clienteService
      .delete(id)
      .then((res) => {
        console.log(res);
        toast("Eliminado con exito.");
        getData();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {}, []);

  return (
    <AdminLayout>
      <div className="row">
        <div className="m-2 d-flex flex flex-row justify-content-between">
          <div>
            <h3>Reportes</h3>
          </div>
        </div>
        <div className="d-flex flex-row justify-content-center">
          <div>Body</div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ReporteListPage;
