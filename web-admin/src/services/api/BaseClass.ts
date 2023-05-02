import axios from "@lib/axios"


export abstract class BaseAPIClass {
   baseUrl: string;

  constructor() {
    this.baseUrl = '';
  }

  getAll(filterObject) {
    let queryString = '';
    if (filterObject) {
      const fitlerKeys = Object.keys(filterObject);
      if (fitlerKeys.length > 0) {
        queryString = '?';
      }
      fitlerKeys.forEach((key, index) => {
        if (filterObject[key] !== undefined && filterObject[key] !== null) {
          if (filterObject[key].toString().length) {
            queryString += `${key}=${filterObject[key]}&`;
          }
        }
      });
      if (fitlerKeys.length > 0 && queryString[queryString.length - 1] === '&') {
        queryString = queryString.slice(0, -1);
      }
    }

    return new Promise((resolve, reject) => {
      axios
        .get(`${this.baseUrl}${queryString}`)
        .then(response => {
          console.log(response);
          // if (response.statusText === 'OK') {
          resolve(response.data);
          // } else {
          // 	reject(response.data);
          // }
        })
        .catch(error => {
          console.error('Promise', error);
          console.info('Promise', error.message);
          // todo mostrar al usuario que paso  un error
          reject(error);
        });
    });
    // }catch (e) {
    //   console.log(e);
    //   return new Promise((resolve, reject) => {
    //     resolve([])
    //   })
    // }

    // return await fetch(`${serverBaseUrl}${this.baseUrl}`).then((resp) => resp.json())
  }

  getAllNext(url) {
    return new Promise((resolve, reject) => {
      axios
        .get(url)
        .then(response => {
          // console.log(response);
          // if (response.statusText === 'OK') {
          resolve(response.data);
          // } else {
          // 	reject(response.data);
          // }
        })
        .catch(error => {
          console.error('Promise', error);
          console.info('Promise', error.message);
          reject(error);
        });
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${this.baseUrl}/${id}`)
        .then(response => {
          // console.log(response);
          // if (response.statusText === 'OK') {
          resolve(response.data);
          // } else {
          // 	reject(response.data);
          // }
        })
        .catch(error => {
          console.error('Promise', error);
          console.info('Promise', error.message);
          // todo mostrar al usuario que paso  un error
          reject(error);
        });
    });
    // return await fetch(`${serverBaseUrl}${this.baseUrl}/${id}`).then((resp) => resp.json())
  }

  async create(data) {
    return new Promise((resolve, reject) => {
      axios
        .post(`${this.baseUrl}`, data)
        .then(response => {
          // console.log(response);
          // if (response.statusText === 'OK') {
          resolve(response.data);
          // } else {
          // 	reject(response.data);
          // }
        })
        .catch(error => {
          console.error('Promise', error);
          console.info('Promise', error.message);
          // todo mostrar al usuario que paso  un error
          reject(error);
        });
    });
  }

  async update(data, id) {
    return new Promise((resolve, reject) => {
      axios
        .put(`${this.baseUrl}/${id}`, data)
        .then(response => {
          // console.log(response);
          // if (response.statusText === 'OK') {
          resolve(response.data);
          // } else {
          // 	reject(response.data);
          // }
        })
        .catch(error => {
          console.error('Promise', error);
          console.info('Promise', error.message);
          // todo mostrar al usuario que paso  un error
          reject(error);
        });
    });
    // return axios.put(`${this.baseUrl}/${id}`, data);
    // return await fetch(
    //   new Request(
    //     `${serverBaseUrl}${this.baseUrl}/${id}`,
    //     {
    //       method: 'PUT',
    //       body: JSON.stringify(data),
    //       headers: new Headers(
    //         {
    //           "Content-type": "application/json; charset=UTF-8"
    //         }
    //       )
    //     }
    //   )
    // )
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      axios
        .delete(`${this.baseUrl}/${id}`)
        .then(response => {
          // console.log(response);
          // if (response.statusText === 'OK') {
          resolve(response.data);
          // } else {
          // 	reject(response.data);
          // }
        })
        .catch(error => {
          console.error('Promise', error);
          console.info('Promise', error.message);
          // todo mostrar al usuario que paso  un error
          reject(error);
        });
    });
    // return axios.delete(`${this.baseUrl}/${id}`);
    //   return await fetch(
    //     new Request(
    //       `${serverBaseUrl}${this.baseUrl}/${id}`,
    //       {
    //         method: 'DELETE',
    //         headers: new Headers(
    //           {
    //             "Content-type": "application/json; charset=UTF-8"
    //           }
    //         )
    //       }
    //     )
    //   )
  }

  async enabled(id) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${this.baseUrl}/enabled/${id}`)
        .then(response => {
          // if (response.statusText === 'OK') {
          resolve(response.data);
          // } else {
          // 	reject(response.data);
          // }
        })
        .catch(error => {
          console.error('Promise', error);
          console.info('Promise', error.message);
          reject(error);
        });
    });
  }

  async getBySlug(id) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${this.baseUrl}/slug/${id}`)
        .then(response => {
          // console.log(response);
          // if (response.statusText) {
          resolve(response.data);
          // } else {
          // reject(response.data);
          // }
        })
        .catch(error => {
          console.error('Promise', error);
          console.info('Promise', error.message);
          // todo mostrar al usuario que paso  un error
          reject(error);
        });
    });
    // return await fetch(`${serverBaseUrl}${this.baseUrl}/${id}`).then((resp) => resp.json())
  }

  getAllByDestiny(id) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${this.baseUrl}/destination/${id}`)
        .then(response => {
          // if (response.statusText) {
          resolve(response.data);
          // } else {
          // 	reject(response.data);
          // }
        })
        .catch(error => {
          console.error('Promise', error);
          console.info('Promise', error.message);
          reject(error);
        });
    });
  }
}


