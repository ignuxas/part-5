const divisionsAPI = store => {
    store.createDivision = async function (data){
        const response = await store.http.post('/collections/divisions/records', data)
        return { status: response.status, data: response.data }
    }
}

export default divisionsAPI;