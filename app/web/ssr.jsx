import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import {match, RouterContext} from 'react-router'
import { BrowserRouter, StaticRouter } from 'react-router-dom';
import { matchRoutes, renderRoutes } from 'react-router-config';
import { AppContainer } from 'react-hot-loader';
import Layout from 'framework/layout/layout.jsx';
import Header from 'component/header/header';
import SSR from 'component/spa/ssr/ssr';
// import { create } from 'component/spa/ssr/store';
// import Root from './containers/Root';
import create from './core/configureStore';
import routes from 'component/spa/ssr/routers';

const clientRender = () => {
  const store = create(window.__INITIAL_STATE__);
  const url = store.getState().url;
  const Entry = () => (<div>
    <Provider store={ store }>
      <BrowserRouter>
        <SSR url={ url }/>
      </BrowserRouter>
    </Provider>
  </div>
  );
  const render = (App)=>{
    ReactDOM.hydrate(EASY_ENV_IS_DEV ? <AppContainer><App /></AppContainer> : <App />, document.getElementById('app'));
  };
  if (EASY_ENV_IS_DEV && module.hot) {
    module.hot.accept();
  }
  render(Entry);
};

const serverRender = (context, options)=> {
  // 来自controller
  const url = context.state.url;
  // 匹配路由
  const branch = matchRoutes(routes, url);
  // 在渲染之前获取数据
  const promises = branch.map(({route}) => {
    const fetch = route.fetch;
    return fetch instanceof Function ? fetch() : Promise.resolve(null)
  });
  return Promise.all(promises).then(data => {
    const initState = context.state;
    data.forEach(item => {
      Object.assign(initState, item);
    });
    // context.state传递渲染之前服务端请求到的数据
    context.state = Object.assign({}, context.state, initState);
    const store = create(initState);
    return () =>(
      <Layout>
        <div>
          <Provider store={store}>
            <StaticRouter location={url} context={{}}>
              <SSR url={url}/>
            </StaticRouter>
          </Provider>
        </div>
      </Layout>
    )
  });
};

export default EASY_ENV_IS_NODE ?  serverRender : clientRender();



