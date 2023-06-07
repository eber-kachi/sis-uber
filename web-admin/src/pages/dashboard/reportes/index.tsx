import { NextPage } from "next";
import { AdminLayout } from "@layout/index";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import ClienteService from "../../../services/api/Cliente.service";
import { Card } from "react-bootstrap";

const ReporteListPage: NextPage = (a) => {
  const clienteService = new ClienteService();
  const handlerClient = () => {
    console.log("asasdasdasd");
    clienteService.getReport().then((resp: any) => {
      const a = document.createElement("a");
      a.href = "data:" + resp.mimeType + ";base64," + resp.content;
      a.target = "_blank";
      a.download = `${"assas"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      console.log(resp);
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
        {/* d-flex flex-row justify-content-center */}
        <div className="row ">
          <div className="col-4">
            <Card style={{ width: "18rem" }}>
              {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
              <Card.Body>
                <Card.Title>Reporte de clientes viajes</Card.Title>
                <Card.Text>
                  Este reporte es para ver, a los clientes cuanto viajes tuvo.
                </Card.Text>
                <Button variant="primary" onClick={() => handlerClient()}>
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
