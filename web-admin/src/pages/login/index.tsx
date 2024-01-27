import { NextPage } from 'next';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { Button, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';
import Link from 'next/link';
import { SyntheticEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { deleteCookie, getCookie } from 'cookies-next';
import { SubmitHandler, useForm } from 'react-hook-form';
import TokenStorageService from '@lib/tokenStoraje';
import { AuthService } from '../../services/api/Auth.service';
import { useAuth } from 'src/context/AuthContext';

type Inputs = {
  email: string;
  password: string;
};

const img = import('public/assets/brand/team_up.svg');

const Index: NextPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const [submitting, setSubmitting] = useState(false);
  const [tokenValue, setTokenValue] = useState('');

  const authService = new AuthService();
  const token = new TokenStorageService();
  const { login } = useAuth()

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    login(data)
  };

  const getRedirect = () => {
    const redirect = getCookie('redirect');
    if (redirect) {
      deleteCookie('redirect');
      return redirect.toString();
    }

    return '/';
  };
  useEffect(() => {
    const a = token.getToken();
    if (a && a.length > 0) {
      router.push('/dashboard');
    }
  }, []);

  // useEffect(() => {
  //   try {
  //     // const valueToStore = value instanceof Function ? value(storedValue) : value;
  //     // setStoredValue(valueToStore);
  //     if (typeof window !== 'undefined') {
  //       // window.localStorage.setItem(key, JSON.stringify(storedValue));
  //       token.saveToken(tokenValue);
  //       // window.localStorage.setItem('tokensss', tokenValue);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }, [tokenValue]);

  console.log('error', errors);

  // const login = async (e: SyntheticEvent) => {
  //   e.stopPropagation();
  //   e.preventDefault();

  //   setSubmitting(true);

  //   const res = await axios.post('api/mock/login');
  //   if (res.status === 200) {
  //     router.push(getRedirect());
  //   }
  //   setSubmitting(false);
  // };

  return (
    <div className='bg-light min-vh-100 d-flex flex-row align-items-center dark:bg-transparent'>
      <Container>
        <Row className='justify-content-center align-items-center px-3'>
          <Col lg={8}>
            <Row>
              <Col md={7} className='bg-white border p-5'>
                <div className=''>
                  <h1>Inicio de sesión</h1>
                  <p className='text-black-50'>Inicie sesión en su cuenta</p>

                  <form onSubmit={handleSubmit(onSubmit)}>
                    <InputGroup className='mb-3 '>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faUser} fixedWidth />
                      </InputGroup.Text>
                      <Form.Control
                        type='text'
                        disabled={submitting}
                        placeholder='Usuario'
                        aria-label='Username'
                        {...register('email', { required: 'true' })}
                      />
                      {errors.email?.type === 'required' && (
                        <span>{errors.email?.message} </span>
                      )}
                    </InputGroup>

                    <InputGroup className='mb-3'>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faLock} fixedWidth />
                      </InputGroup.Text>
                      <Form.Control
                        type='password'
                        required
                        disabled={submitting}
                        placeholder='Contraseña'
                        aria-label='Password'
                        {...register('password', { required: 'true' })}
                      />
                      {errors.password?.type === 'required' && (
                        <span>{errors.password?.message} </span>
                      )}
                    </InputGroup>

                    <Row>
                      <Col xs={6}>
                        <Button
                          className='px-4'
                          variant='success'
                          type='submit'
                          disabled={submitting}
                        >
                          Iniciar sessión
                        </Button>
                      </Col>
                      {/* <Col xs={6} className='text-end'>
                        <Button className='px-0' variant='link' type='submit'>
                          Forgot password?
                        </Button>
                      </Col> */}
                    </Row>
                  </form>
                </div>
              </Col>
              <Col
                md={5}
                style={{ backgroundColor: '#41476e ' }}
                className=' text-white d-flex align-items-center justify-content-center p-5'
              >
                <Image
                  src='assets/brand/team_up.svg'
                  alt='login'
                  height={200}
                  width={200}
                />
                {/* <img src={img} /> */}
                {/* <div className='text-center'> */}
                {/* <h2>Sign up</h2>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p> */}
                {/* <Link href='/register'>
                    <button
                      className='btn btn-lg btn-outline-light mt-3'
                      type='button'
                    >
                      Register Now!
                    </button>
                  </Link> */}
                {/* </div> */}
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Index;
