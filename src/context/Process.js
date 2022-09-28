import { createContext, useState } from "react";

const ProcessContext=createContext();

function ProcessProvider({children}) {
    const [memory, setMemory] = useState(0);
    
    const [initializated, setInitializated] = useState(false);
    const [simulation, setSimulation] = useState(false);
    const [finish, setFinish] = useState(false);
    const [processes, setProcesses] = useState([]);
    const [cont, setCont] = useState(0);

    const [logs, setLogs] = useState([]);


    const [manager, setManager] = useState([]);

    let stacked=0;
    const getFreeSpace=()=>{
        let temp=[...manager]
        return temp.filter((e, index)=>{
            if (e.id===-1) {
                e.manindex=index;
                return e;
            }
            else return false;
        });
    };

    const writeLog=(text)=>{
        logs.push(`${text}`)
        setLogs([...logs]);
    }

    const addProcess=(process)=>{
        process.id= cont;
        process.status='wait';
        setCont(cont+1)
        let temp= [...processes, process]
        temp.sort((a,b)=>{ return a.priority-b.priority});
        setProcesses([...temp])
    }

    const restartProcess=()=>{
        setProcesses([]);
        setCont(0);
    }

    const initiallizateManager=async (mem)=>{
        setMemory(mem);
        setManager([{id:-1, name:'libre', initial: 0, size:mem, final:mem}]);
    }

    const activeStatus=(idProcess)=>{
        let si=processes.findIndex(prd=>prd.id===idProcess);
        if (si>=0) {
            let temp=[...processes];
            temp[si].finalization=Date.now();
            temp[si].status='active';
            setProcesses(temp);
        }
    }
    
    const finalizeStatus=(idProcess)=>{
        let si=processes.findIndex(prd=>prd.id===idProcess);
        if (si>=0) {
            let temp=[...processes];
            temp[si].status='finish';
            setProcesses(temp);
            return si;
        }
        return null;
    }
    const initialProcess=async ()=>{
        let processesD=await processes.filter(e=>e.status!== 'active' &&e.status!=='finish' );
        for (let ind = 0; ind< processesD.length; ind++){
            let e=processesD[ind];
            let freeSpace=await getFreeSpace();
            for (let i = 0; i < freeSpace.length; i++) {
                const f={...freeSpace[i]};
                const diff= parseInt(f.size) - parseInt(e.size)
                if (diff>=0) {
                    activeStatus(e.id);
                    writeLog(`El proceso: (id: ${e.id}, nombre: ${e.name},prioridad: ${e.priority}) ha ingresado a la cola`);
                    manager[f.manindex]={
                        id:e.id,
                        name: e.name,
                        initial: f.initial,
                        final: (parseInt(f.initial) + parseInt(e.size)),
                        size:e.size
                    };
                    if (diff>0) {
                        manager.push({
                            id:-1,
                            name: 'libre',
                            initial: ( parseInt(f.initial)+ parseInt(e.size)),
                            final: ( parseInt(f.final)),
                            size: diff
                        });
                        setManager([...manager])
                    }
                    setTimeout(() => {
                        let a=manager.findIndex(p=>p.id===e.id);
                        if (a>=0) {
                            let proc=manager[a];
                            let ip=finalizeStatus(proc?.id);
                            if (ip>=0) {
                                writeLog(`El proceso: (id: ${proc.id}, nombre: ${proc.name}) ha finalizado su ejecución, en cola: ${processes[ip]?.finalization - stacked } ms, total: ${processes[ip]?.finalization - stacked +parseInt(processes[ip]?.time)} ms`);
                            }else{
                                writeLog(`El proceso: (id: ${proc.id}, nombre: ${proc.name}) ha finalizado su ejecución`);
                            }
                            manager[a]={
                                ...manager[a],
                                id:-1,
                                name: 'libre',
                            }
                            let indF=0;
                            let indI=0;
                            while(manager[(a-indI-1)]?.id===-1){
                                indI++;
                            }
                            while(manager[(a+indF+1)]?.id===-1){
                                indF++;
                            }
                            if (indF!==0 || indI!==0) {
                                let newFreeSpace={
                                    id:-1,
                                    name: 'libre',
                                    initial:manager[(a-indI)].initial,
                                    final: manager[(a+indF)].final ,
                                    size: manager[(a+indF)].final - manager[(a-indI)].initial
                                }
                                manager.splice((a-indI), (indF+indI+1));
                                manager.push(newFreeSpace);
                                setManager(manager.sort((a,b)=>{ return a.initial-b.initial}));
                            }else {
                                setManager([...manager])
                            }
                            let processesD= processes.filter(e=>e.status=== 'wait');
                            if (processesD.length>0) {
                                initialProcess();
                            }else{
                                setFinish(true);
                                setManager([{id:-1, name:'libre', initial: 0, size:memory, final:memory}]);
                            }
                        }
                    }, e.time);
                    break;
                }
            }
        }
        
    }

    const simulate= async ()=>{

        setSimulation(true);
        stacked=Date.now();
        initialProcess();
    }

    const restart= async ()=>{
        setFinish(false);
        stacked=0;
        setInitializated(false);
        setMemory(0);
        setProcesses([]);
        setManager([]);
        setSimulation(false);
        setLogs([]);
    }

    return(
        <ProcessContext.Provider
            value={{
                restartProcess,
                addProcess,
                simulate,
                initiallizateManager,
                manager,
                processes,
                memory,
                simulation,
                finish,
                logs,
                restart,
                initializated, setInitializated
            }}
        >
            {children}
        </ProcessContext.Provider>
    );
}

export {ProcessProvider, ProcessContext};