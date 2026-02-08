
export type Response<T> = {
    status:Number,
    data:T,
    success:Boolean,
    message:string,
    errors:Array<any>|null

}