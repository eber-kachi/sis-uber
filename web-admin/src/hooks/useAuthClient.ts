import { useRouter } from 'next/router'
import TokenStorageService from '@lib/tokenStoraje'
import { useEffect, useState } from 'react'
import axios from '@lib/axios'
import { object } from 'prop-types'

export function useAuthClient() {
  const router = useRouter()
  const token = new TokenStorageService()

  const [tokenValue, setTokenValue] = useState(() => {
    if (typeof window === 'undefined') {
      return null
    }
    try {
      const item = token.getToken()
      // return item ? JSON.parse(item) : initialValue;
      console.log(item)
      return item == 'null' ? null : item
    } catch (error) {
      console.error(error)
      return null
    }
  })

  const [userValue, setUserValue] = useState(() => {
    if (typeof window === 'undefined') {
      return null
    }
    try {
      const item = token.getUser()
      // return item ? JSON.parse(item) : initialValue;
      return item
    } catch (error) {
      console.error(error)
      return null
    }
  })

  const me = () => {
    axios
      .get('/api/auth/me')
      .then((res) => {
        console.log(res.data)
        token.saveUser(res.data)
        setUserValue(res.data)
      })
      .catch((error) => {
        if (error.response.status == 401) {
          token.signOut()
          router.push('/login')
        }
        if (error.response.status !== 409) throw error
      })
  }

  useEffect(() => {
    try {
      // const valueToStore = value instanceof Function ? value(storedValue) : value;
      // setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        // window.localStorage.setItem(key, JSON.stringify(storedValue));
        token.saveToken(tokenValue)
      }
    } catch (error) {
      console.error(error)
    }
  }, [tokenValue])

  const logout = async () => {
    // if (!error) {
    // await axios.post('/logout').then(() => mutate());
    // }
    setTokenValue(null)

    window.location.pathname = '/login'
  }

  useEffect(() => {
    // debugger;
    const condition = tokenValue == null || JSON.stringify(userValue) === '{}'
    console.log('===============>', condition)
    if (condition) {
      me()
    }
    // if (middleware === 'auth' && error) logout();
  }, [userValue, tokenValue])

  return { userValue, tokenValue, logout }
}
