import { useContext, useState } from "react";
import {ProcessContext} from "../../context/Process";

const priorities=[
    {value: 1, name: "Alta"},
    {value: 2, name: "Media"},
    {value: 3, name: "Baja"},
]

function Form() {
    const {
        processes, addProcess, simulate, manager,initiallizateManager,
        initializated, setInitializated
    } = useContext(ProcessContext);
    
    const [memory, setMemory] = useState(0);

    const [name, setName] = useState("");
    const [size, setSize] = useState(1);
    const [time, setTime] = useState(1);
    const [priority, setPriority] = useState(1);

    const restartForm=()=>{
        setName("");
        setSize(1);
        setTime(1);
        setPriority(1);
    }

    const handleMemory=()=>{
        if(memory>0){
            initiallizateManager(memory);
            setInitializated(true)
        }
    }
    const handleAdd=()=>{
        if (name&&size&&time&&priority) {
            addProcess({name,time,size:parseInt(size),priority});
            restartForm();
        }else{
            alert('error')
        }
    }

    const handleSimulate=()=>{
        if (processes.length>0&&memory>0) {
            simulate(memory);
        }else{
            alert('error')
        }
    }

    return (
        <div className="col">
            <div id="intial-add" >
                {!initializated&&<div className="mb-3">
                    <label className="form-label">Tamaño de la memoria (KiB):</label>
                    <input type="number" min="1" className="form-control" value={memory} onChange={e=>setMemory(e.target.value)} placeholder="Ingrese un tamaño de memoria"/>
                    <div className="d-grid gap-2 mt-3" >
                        <button type="button" className="btn btn-primary" onClick={handleMemory}> Insertar memoria</button>
                    </div>
                </div>}
                {!!initializated&&<div className="mb-3">
                    <label className="form-label">Tamaño de la memoria: {memory} KiB</label>
                </div>}

                {!!initializated&&
                <div className="mb-3">
                    <label className="form-label text-center">Procesos:</label>
                    <hr/>
                    <div>
                        <div >
                            <div className="row row-cols-2 ">
                                <div className="col mb-3">
                                    <label className="form-label">Nombre:</label>
                                    <input type="text" className="form-control"  value={name} onChange={e=>setName(e.target.value)} placeholder="Ingrese un nombre para el proceso"/>
                                </div>
                                <div className="col mb-3">
                                    <label className="form-label">Tamaño (KiB):</label>
                                    <input type="number" className="form-control" value={size} onChange={e=>setSize(e.target.value)} placeholder="Ingrese un tamaño para el proceso"/>
                                </div>
                                <div className="col mb-3">
                                    <label className="form-label">Tiempo (ms):</label>
                                    <input type="number" className="form-control" value={time} onChange={e=>setTime(e.target.value)} placeholder="Ingrese un tiempo para el proceso"/>
                                </div>
                                <div className="col mb-3">
                                    <label className="form-label">Prioridad:</label>
                                    <select className="form-select" value={priority} onChange={e=>setPriority(e.target.value)}>
                                        {
                                            priorities.map(e=>(
                                                <option key={`optprio-${e.value}`} value={e.value}>{e.name}</option>
                                            ))
                                        }
                                    </select>
                                </div>

                            </div>
                            <div className="d-grid gap-2">
                                <button type="button" className="btn btn-primary" onClick={handleAdd}> Agregar Proceso</button>
                            </div>
                        </div>
                        
                    </div>
                    <table className="table mt-3 table-light">
                        <thead className="text-center">
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Tamaño</th>
                                <th scope="col">Tiempo</th>
                                <th scope="col">Prioridad</th>
                                <th scope="col">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                processes.map((e,i)=>(
                                    <tr key={`rowprocess-${i}`}>
                                        <td>{e.id}</td>
                                        <td>{e.name}</td>
                                        <td>{e.size}</td>
                                        <td>{e.time}</td>
                                        <td>{e.priority}</td>
                                        <td>{e.status}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                }

                {!!initializated&&<div className="d-grid gap-2">
                    <button type="button" className="btn btn-success" onClick={handleSimulate}>Simular</button>
                </div>}
            
            </div>
        </div>
    );
}

export {Form};