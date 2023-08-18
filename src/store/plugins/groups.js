const groupsAPI = store => {
    store.createGroup = async function (data){
        const response = await store.http.post('/collections/groups/records', data)
        return { status: response.status, data: response.data }
    }
}

export default groupsAPI;