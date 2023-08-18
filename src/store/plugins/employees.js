const employeesAPI = store => {
    store.reqCreateEmployee = async function (employee){
        const response = await store.http.post('/collections/employees/records', employee)
        return { status: response.status, data: response.data }
    }

    store.reqUpdateEmployee = async function (employee, params = {}){
        const response = await store.http.patch(`/collections/employees/records/${employee.id}`, employee, { params })
        return { status: response.status, data: response.data }
    }
}

export default employeesAPI;