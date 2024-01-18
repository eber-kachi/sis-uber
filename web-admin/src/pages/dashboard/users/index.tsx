
import React, { Suspense } from 'react';

import dynamic from 'next/dynamic';

const ListUsers = dynamic(() => import("../../../components/ListUsers"), {
  // suspense: true,
  ssr: false
});

const UserListPage = () => {

  return (
    <>
      {/* <Suspense fallback={<div>Loading...</div>}> */}
      <ListUsers />
      {/* </Suspense> */}
    </>
  );
};

// export async function getServerSideProps(context) {
//   const service = new UserService();
//   const responce = await service.getAll();
//   // console.log(responce);
//   return {
//     props: {
//       dataResponce: responce.data,
//     },
//   };
// }

export default UserListPage;
