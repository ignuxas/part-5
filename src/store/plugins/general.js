import axios from 'axios';

const generalAPI = store => {
    store.http = axios.create({
        baseURL: BASE_URL,
    });

    store.http.interceptors.request.use(
        config => {
            const token = store.getters['user/getToken'];
            if (token) {
                config.headers['Authorization'] = 'Bearer ' + token;
            }
            return config;
        }
    );

    store.unPlurafy = (string) => {
        if(string.endsWith('ies')) return string.slice(0, -3) + 'y'
        else if(string.endsWith('s')) return string.slice(0, -1)
        else return string
    }

    store.reqDelete = async (id, type) => {
        const response = await store.http.delete(`/collections/${type}/records/${id}`)
        return { status: response.status, data: response.data }
    }
    
    store.updateStructure = async function (id, type, data){
        const response = await store.http.patch(`/collections/${type}/records/${id}`, data)
        return { status: response.status, data: response.data }
    }

    store.reqCreateRelation = async function (relation, id, relationName, type){
        const response = await store.http.post(`/collections/${relationName}_${type}/records`, {
            [`${this.unPlurafy(relationName)}_id`]: relation,
            [`${this.unPlurafy(type)}_id`]: id,
        })
        return { status: response.status, data: response.data }
    }

    store.reqGetRelations = async function (id, type, relationName, reverse){
        let response;
        if(!reverse) response = await store.http.get(`/collections/${type}/records/${id}?expand=${relationName}_${type}(${this.unPlurafy(type)}_id).${this.unPlurafy(relationName)}_id`)
        else response = await store.http.get(`/collections/${type}/records/${id}?expand=${type}_${relationName}(${this.unPlurafy(type)}_id).${this.unPlurafy(relationName)}_id`)
        return { status: response.status, data: response.data }
    }

    store.reqGet = async function (id, type, params){
        let response;
        if(id) response = await store.http.get(`/collections/${type}/records/${id}`, { params })
        else response = await store.http.get(`/collections/${type}/records`, { params })
        return { status: response.status, data: response.data }
    }
}

export default generalAPI;