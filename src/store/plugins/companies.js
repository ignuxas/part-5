const companiesAPI = store => {
    store.createCompany = async function (data){
        const response = await store.http.post('/collections/companies/records', data)
        return { status: response.status, data: response.data }
    }
    
    store.updateCompany = async function (id, data){
        const response = await store.http.patch(`/collections/companies/records/${id}`, data)
        return { status: response.status, data: response.data }
    }
}
    
export default companiesAPI;