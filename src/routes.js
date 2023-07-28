import Login from './pages/Login.vue'
import Contacts from './pages/Contacts.vue'
import ContactDetails from './pages/ContactDetails.vue'
import Companies from './pages/Companies.vue'
import Structure from './pages/Structure.vue'
import Users from './pages/Users.vue'

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
    },
    {
        path: '/structure',
        component: Structure,
    },
    {
        path: '/users',
        component: Users,
    },
    {
        path: '/companies',
        component: Companies,
    },
]