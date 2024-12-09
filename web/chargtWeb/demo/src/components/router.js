import { createMemoryHistory, createRouter } from 'vue-router'

const routes = [
    { path: '/home', component: ()=> import('./home.vue') },
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

export default router
