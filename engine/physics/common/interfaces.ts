
export interface IRigidBody {
    type:string;
    nextTick():void;
}

export interface IPhysicsSystem {
    createRigidBody(...params:any):IRigidBody;
    nextTick():void;
}
