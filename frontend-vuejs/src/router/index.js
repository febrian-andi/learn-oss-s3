import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AddEmployeeView from '../views/AddEmployeeView.vue'
import UpdateEmployeeView from '../views/UpdateEmployeeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/addEmployee',
      name: 'AddEmployee',
      component: AddEmployeeView
    },
    {
      path: '/updateEmployee/:id',
      name: 'UpdateEmployee',
      component: UpdateEmployeeView
    },
  ]
})


export default router
