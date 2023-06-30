
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import React, { PropsWithChildren } from 'react'

type Props = {
  // currentPage: number;
  // lastPage: number;
  // setPage?: (page: number) => void;
  title:string | '';
  onHide?:()=>void;
} & PropsWithChildren

export default function CustomModal(props: any) {


  return (
  <Modal
    {...props}
    size="sm"
    aria-labelledby="contained-modal-title-vcenter"
    centered
    scrollable
  >
    <Modal.Header closeButton>
      <Modal.Title id="contained-modal-title-vcenter">
        {props.title}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body style={{
      maxHeight: 'calc(100vh - 210px)',
      overflowY: 'auto',
    }}>
      {props.children}
    </Modal.Body>
    <Modal.Footer>
      {/* <Button variant="outline-warning" >Editar</Button> */}
      {/* <Button variant="outline-danger">Eliminar</Button> */}
      <Button className="w-25" variant="outline-success" onClick={props.onSave}>Guardar</Button>
      <Button variant="outline-danger" onClick={props.onHide}>Cerrar</Button>
    </Modal.Footer>
  </Modal>)
}
