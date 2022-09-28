import './logs.css';
import {ProcessContext} from '../../context/Process';
import { useContext } from 'react';

function Logs() {
const {logs} = useContext(ProcessContext);

    return (
        <div className="card col  mt-4">
            <div className="card-header">
                Logs
            </div>
            <div className="card-body">
                {
                    logs.map((e,i)=>(
                        <p key={`logs-${i}`}>{e}</p>
                    ))
                }
            </div>
        </div>
    );
}

export {Logs};