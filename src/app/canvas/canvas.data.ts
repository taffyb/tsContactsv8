
import { DataModel,Node, Link } from '../classes/data.model';

let _nodeMap={};
let _data:DataModel={nodes:[],links:[]};
function _setData(data:DataModel):Promise<boolean>{
    return new Promise((resolve,reject)=>{
        _data=data;
        console.log(`canvas.data _setData:
                     data=${JSON.stringify(_data)}
                     nodes=${JSON.stringify(_data.nodes)}
                     `);
        resolve(true);
    });
}
export  const setData=_setData;
export  const data=_data;
export  const nodes=_data.nodes;
export  const links=_data.links;
