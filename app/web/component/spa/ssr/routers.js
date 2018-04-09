// // 业务模块
// import Login from 'view/account/client/login';
// import Logout from 'view/account/client/logout';
// import Play from 'view/courseware/play';
import Editor from 'view/courseware/editor';
import CourseEntry from 'view/courseware/courseEntry';
import Hamster from 'view/hamster';

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
    component: Hamster,
    exact: true,
    fetch: () => Promise.resolve({
      hamster: {
        blocks: [],
        current: {
            blocks: []
        }
      }
    })
  },
  {
    path: '/editor/:id',
    component: Editor,
    // fetch: () => Promise.resolve({
    //   courseware: {
    //   }
    // })
  },
  {
    path: '/courseEntry',
    component: CourseEntry,
    // fetch: () => Promise.resolve({
    //   courseware: {
    //   }
    // })
  },
  {
    path: '*',
    component: NotFound
  }
];

export default routes;
