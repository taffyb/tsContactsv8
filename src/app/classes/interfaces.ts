export interface IProp{
    key:string;
    value:any;
}
export interface IPropertyGroup {
    name: string;
    order: number;
    props: IProperty[];
}

export interface IEntity{
    type:string;
    uuid:string;
    display:string;
    icon?:string;
    props:IProp[];
}
export interface IEntityLite{
    type:string;
    uuid:string;
    display:string;
    icon?:string;
}

export interface IEntityDef {
    name: string;
    uuid: string;
    display: string;
    groups: IPropertyGroup[];
}
export interface IProperty{
    name: string;
    type: string;
    label: string;
    required: boolean;
    order: number;
}
export interface IRelationship{
    uuid:string;
    source:IEntity;
    target:IEntity;
    label:string;
}
