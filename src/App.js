import {Form} from './components/Form/Form';
import {Representation} from './components/Representation/Representation';
import { ProcessProvider } from './context/Process';


function App() {
  return (
    <div className="container mt-3">
      <div className='text-cente'>
        <h1> Simulador de gestión de procesos</h1>
      </div>
      <div className="row mt-4">
        <ProcessProvider>
          <Form/>
          <Representation/>
        </ProcessProvider>
      </div>
    </div>
  );
}

export default App;
