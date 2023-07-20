import Login from './pages/Login.vue'
import Contacts from './pages/Contacts.vue'
import ContactDetails from './pages/ContactDetails.vue'

export default [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login,
    },
    {
        path: '/contacts',
        component: Contacts,
    },
    {
        path: '/contacts/details/:id',
        component: ContactDetails,
    }
]