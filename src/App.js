import {Form} from './components/Form/Form';
import {Graph} from './components/Graph/Graph';
import {Logs} from './components/LogComponent/Logs';

import { ProcessProvider } from './context/Process';


function App() {
  return (
    <div className="container mt-3">
      <div className='text-cente'>
        <h1> Simulador de gestión de procesos</h1>
      </div>
      <div className="row mt-4">
        <ProcessProvider>
          <div className='row'>
            <Form/>
            <Graph/>
          </div>
          <div className='row'>
            <Logs/>
          </div>
        </ProcessProvider>
      </div>
    </div>
  );
}

export default App;
