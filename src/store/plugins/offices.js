const officesAPI = store => {
    store.createOffice = async function (data){
        const response = await store.http.post('/collections/offices/records', data)
        return { status: response.status, data: response.data }
    }
}

export default officesAPI;