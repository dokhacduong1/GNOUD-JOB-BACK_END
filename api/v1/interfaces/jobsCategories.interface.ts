
export interface Find {
    _id?:string,
    occupationName?: RegExp,
    title?:String,
    slug?:string,
    parent_id?:String,
    description?:string,
    deleted? :boolean,
    postion?:Number,
    thumbnail?:String,
    status?:string,
    $or?:Array<{title : RegExp} | {keyword : RegExp}>
 
}
