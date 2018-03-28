// // 业务模块
// import Login from 'view/account/client/login';
// import Logout from 'view/account/client/logout';
// import Play from 'view/courseware/play';
// import Editor from 'view/courseware/editor';
import Hamster from 'view/hamster';
// // import App from './containers/App';
// import CourseEntry from 'view/courseware/courseEntry';
// // import config from '../config';
// // import Helper from '../config/helper';

// const NotFound = () => {
//   return (
//     <Route render={({ staticContext }) => {
//       if (staticContext) {
//         staticContext.status = 404;
//       }
//       return (
//         <div>
//           <h1>404 : Not Found</h1>
//         </div>
//       );
//     }}/>
//   );
// };

// const routes = [
// //   {
// //     path: '/ssr/login',
// //     component: Login
// //   },
// //   {
// //     path: '/ssr/logout',
// //     component: logout
// //   },
// //   {
// //     path: '/ssr/myCourse',
// //     component: CourseEntry
// //   },
// //   {
// //     path: '/ssr/play(/:id)',
// //     component: Play
// //   },
//   {
//     path: '/ssr/ppt(/:id)',
//     component: Editor
//   },
// //   {
// //     path: '/ssr/hamster(/:id)',
// //     component: Hamster
// //   },
//   {
//     path: '*',
//     component: NotFound
//   }
// ];

// export default routes;

import Home from 'component/spa/ssr/components/home';
import About from 'component/spa/ssr/components/about';
const NotFound = () => {
  return (
    <Route render={({ staticContext }) => {
      if (staticContext) {
        staticContext.status = 404;
      }
      return (
        <div>
          <h1>404 : Not Found</h1>
        </div>
      );
    }}/>
  );
};
const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/about',
    component: Hamster
  },
  {
    path: '*',
    component: NotFound
  }
];

export default routes;
