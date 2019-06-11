import Repository from "./repository";

const resource = "/images";
export default {
    uploadImage(data) {
        return Repository.repo.post(
            `${resource}`, 
            data,{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    removeImage({type, parent_id}) {
        return Repository.repo.delete(
            `${resource}`,
            {
                data: {
                    type: type,
                    parent_id: parent_id
                }
            }
        );
    }
}