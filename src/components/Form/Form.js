import { useContext, useState } from "react";
import {ProcessContext} from "../../context/Process";


function Form() {
    const {
        processes, addProcess, simulate,initiallizateManager,simulation,finish,restart,
        initializated, setInitializated
    } = useContext(ProcessContext);
    
    const [memory, setMemory] = useState(0);

    const [name, setName] = useState("");
    const [size, setSize] = useState(1);
    const [time, setTime] = useState(1);
    const [priority, setPriority] = useState(0);

    const restartForm=()=>{
        setName("");
        setSize(1);
        setTime(1);
        setPriority(0);
    }

    const handleMemory=()=>{
        if(memory>0){
            initiallizateManager(memory);
            setInitializated(true);
        }
    }
    const handleAdd=()=>{
        if (name&&time>0&&priority>=0&&parseInt(size)<=memory&&size>=0) {
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

    const handleRestart=()=>{
        setMemory(0);
        restartForm();
        restart()
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

                {((!!initializated)&&(!simulation))&&
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
                                    { ((parseInt(size)>memory)||(size<0))&&
                                        <div className="alert alert-danger mt-2" role="alert">
                                            Ingrese un número entre 0 y {memory} para el tamaño
                                        </div>
                                    }
                                </div>
                                <div className="col mb-3">
                                    <label className="form-label">Tiempo (ms):</label>
                                    <input type="number" className="form-control" value={time} onChange={e=>setTime(e.target.value)} placeholder="Ingrese un tiempo para el proceso"/>
                                    { ((time<=0)||(time===null))&&
                                        <div className="alert alert-danger mt-2" role="alert">
                                            Ingrese un tiempo mayor a 0
                                        </div>
                                    }
                                </div>
                                <div className="col mb-3">
                                    <label className="form-label">Prioridad:</label>
                                    <input type="number" className="form-control" min={0} value={priority} onChange={e=>setPriority(e.target.value)} placeholder="Ingrese una prioridad"/>
                                    { ((priority<0)||(priority===null))&&
                                        <div className="alert alert-danger mt-2" role="alert">
                                            Ingrese una prioridad positiva
                                        </div>
                                    }
                                </div>

                            </div>
                            <div className="d-grid gap-2">
                                <button type="button" className="btn btn-primary" onClick={handleAdd}> Agregar Proceso</button>
                            </div>
                        </div>
                        
                    </div>
                    
                </div>
                }
                {( (!!initializated)|| (!!simulation))&&
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
                                    {(e.status==='wait')&&
                                        <span className="badge text-bg-secondary">{e.status}</span>
                                    }
                                    {(e.status==='active')&&
                                        <span className="badge text-bg-primary">{e.status}</span>
                                    }
                                    {(e.status==='finish')&&
                                        <span className="badge text-bg-success">{e.status}</span>
                                    }
                                    
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                }
                { ((!!initializated)&&(!simulation))&&<div className="d-grid gap-2">
                    <button type="button" className="btn btn-success" onClick={handleSimulate}>Simular</button>
                </div>}
                { (!!finish)&&
                    <div className="d-grid gap-2">
                        <button type="button" className="btn btn-primary" onClick={handleRestart}>Reiniciar</button>
                    </div>
                }
            
            </div>
        </div>
    );
}

export {Form};