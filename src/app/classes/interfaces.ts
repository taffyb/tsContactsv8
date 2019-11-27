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
    icon:string;
    props:IProp[];
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
    fromEntity:IEntity;
    toEntity:IEntity;
    label:string;
}
