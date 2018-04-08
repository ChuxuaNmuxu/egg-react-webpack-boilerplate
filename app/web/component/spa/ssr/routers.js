// // 业务模块
// import Login from 'view/account/client/login';
// import Logout from 'view/account/client/logout';
// import Play from 'view/courseware/play';
// import Editor from 'view/courseware/editor';
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
    path: '*',
    component: NotFound
  }
];

export default routes;
