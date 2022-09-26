import {Graph} from './graph/Graph';
import {Logs} from './LogComponent/Logs';
function Representation() {
    return (
        <div className="col">
            <Graph/>
            <Logs/>
        </div>
    );
}

export {Representation};