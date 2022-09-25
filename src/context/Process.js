import { createContext, useState } from "react";

const ProcessContext=createContext();

function ProcessProvider({children}) {
    const [memory, setMemory] = useState(0);
    
    const [initializated, setInitializated] = useState(false);
    const [processes, setProcesses] = useState([]);
    const [cont, setCont] = useState(0);


    const [manager, setManager] = useState([]);

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
            temp[si].status='active';
            setProcesses(temp);
        }
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
                            let processesD= processes.filter(e=>e.status!== 'active' &&e.status!=='finish' );
                            if (processesD.length>0) {
                                initialProcess();
                            }
                        }
                    }, e.time);
                    break;
                }
            }
        }
        
    }

    const simulate= async ()=>{
        initialProcess();
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
                initializated, setInitializated
            }}
        >
            {children}
        </ProcessContext.Provider>
    );
}

export {ProcessProvider, ProcessContext};