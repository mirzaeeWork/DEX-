import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './App.css'
import Layout from './component/layout';
import { BrowserRouter } from 'react-router-dom'
import ContextProvider from './component/context';
import Pages from './component/pages';


function App() {


  return (
    <ContextProvider>
      <BrowserRouter>
        <Layout>
          <Pages/>
        </Layout>
      </BrowserRouter>
    </ContextProvider>
  );
}

export default App;


















