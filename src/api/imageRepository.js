import Repository from "./repository";

const resource = "/image-upload";
export default {
    uploadImage(data) {
        return Repository.repo.post(
            `${resource}`, 
            data,{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
}