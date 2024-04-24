import { toast } from "sonner";
import { adminApi } from "./api";

export const apiCall = async(method:string,url:string,data:any)=>{
    try {
        let response;

        switch(method){
            case "post":
                response = await adminApi.post(url,data);
                break;
            case "get":
                response = await adminApi.get(url,data);
                break;
            case "put":
                response = await adminApi.put(url,data);
                break;
            case "patch":
                response = await adminApi.patch(url,data);
                break;
            case "delete":
                response = await adminApi.delete(url,data);
                break;
            default:
                throw new Error("Invalid HTTP method");
        }
        return response;
    } catch (error:any) {
        if (error.response) {
            if (error.response.status === 401) {
              toast.error("User is blocked");
              
            } else {
              toast.error(error.response.data.message); 
            }
          } else {
            toast.error("An error occurred"); 
          }
          throw error; 
        }
    
}