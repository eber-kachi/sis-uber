import { AdminLayout } from '@layout/index';
import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { IUser } from 'src/services/models/user.model';
import { AxiosError } from 'axios';
import Link from 'next/link';
import { Card } from 'react-bootstrap';
import UserService from 'src/services/api/User.service';

const ListUsers = () => {

    const clienteService = new UserService();
    const [modalShow, setModalShow] = useState(false);
    const [objects, setObjects] = useState<IUser[]>([]);

    const getData = async () => {
        const responce: any = await clienteService.getAll();
        // filtamos solo para editar usuarios que acceden al web-admin
        console.log({ responce });

        const usersfinaly = responce.data.data.reduce((users: any[], user: any) => {
            // if (['USER', 'ADMIN'].includes(user.role)) {
            return [...users, user];
            // }
            // return users;
        }, []);
        setObjects(usersfinaly);
    };

    const onClickDelete = (id: string) => {
        clienteService
            .delete(id)
            .then((res) => {
                // console.log(res)
                toast('Eliminado con exito.');
                getData();
            })
            .catch((error) => {
                // console.log(error)
            });
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <AdminLayout>
            <div className='row'>
                <div className='p-2 d-flex flex flex-row justify-content-between'>
                    <div>
                        <h3 className='text-title'>Lista de usuarios</h3>
                    </div>
                    <div>
                        <Link
                            className='btn btn-success'
                            href={{
                                pathname: '/dashboard/users/[id]',
                                query: { id: 'new' },
                            }}
                        >
                            Crear nuevo
                        </Link>
                    </div>
                </div>
                <Card>
                    <Card.Body>
                        <Table striped responsive size='sm'>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Correo electrónico</th>
                                    <th>Rol</th>
                                    {/* <th>Licencia</th> */}
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {objects.length > 0 &&
                                    objects.map((object, index) => (
                                        <tr key={object.id}>
                                            <td>{++index}</td>
                                            <td>{object.email}</td>

                                            <td>{object.role}</td>
                                            <td>
                                                <div className='gap'>
                                                    <Link
                                                        title='Editar'
                                                        className='btn btn-warning text-white mx-2'
                                                        href={{
                                                            pathname: '/dashboard/users/[id]',
                                                            query: { id: object.id },
                                                        }}
                                                    >
                                                        Editar
                                                    </Link>
                                                    <Button
                                                        title='Eliminar'
                                                        variant='danger'
                                                        onClick={() => onClickDelete(object.id)}
                                                    >
                                                        Eliminar
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </div>

            {/* onSave={()=> {}} */}
            {/* <CustomModal */}
            {/*  show={modalShow} */}
            {/*  onHide={() => setModalShow(false)} */}

            {/*  title={"Alerta"} */}
            {/*  size="sm" */}
            {/* > */}
            {/*  <h1>Hola como estas desde la lista </h1> */}
            {/* </CustomModal> */}
        </AdminLayout>
    );
}

export default ListUsers