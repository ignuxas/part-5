const DepartmentsAPI = store => {
    store.createDepartment = async function (data){
        const response = await store.http.post('/collections/departments/records', data)
        return { status: response.status, data: response.data }
    }
}

export default DepartmentsAPI;