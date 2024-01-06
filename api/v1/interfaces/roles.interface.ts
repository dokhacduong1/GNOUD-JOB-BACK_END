
export interface Find {
    _id?:string,
    title?:String,
    slug?:string,
    deleted? :boolean,
    description?:string,
    permissions?:Array<string>,
    $or?:Array<{title : RegExp} | {keyword : RegExp}>
 
}
