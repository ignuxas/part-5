const userAPI = store => {
    store.reqLogin = async function (identity, password, params){
        const response = await store.http.post('/collections/users/auth-with-password', {identity, password}, { params })
        return { status: response.status, data: response.data }
    }

    store.reqCreateUser = async function (user){
        const response = await store.http.post('/collections/users/records', user)
        return { status: response.status, data: response.data }
    }

    store.reqUpdateUser = async function (user, params = {}){
        const response = await store.http.patch(`/collections/users/records/${user.id}`, user, { params })
        return { status: response.status, data: response.data }
    }


    store.reqCreatePermission = async function (permission){
        const response = await store.http.post('/collections/user_permissions/records', permission)
        return { status: response.status, data: response.data }
    }

    store.reqUpdatePermission = async function (permission){
        const response = await store.http.patch(`/collections/user_permissions/records/${permission.id}`, permission)
        return { status: response.status, data: response.data }
    }
}

export default userAPI;