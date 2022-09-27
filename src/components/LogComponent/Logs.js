import './logs.css';
import {ProcessContext} from '../../context/Process';
import { useContext } from 'react';

function Logs() {
const {logs} = useContext(ProcessContext);

    return (
        <div class="card col  mt-4">
            <div class="card-header">
                Logs
            </div>
            <div class="card-body">
                {
                    logs.map(e=>(
                        <p>{e}</p>
                    ))
                }
            </div>
        </div>
    );
}

export {Logs};