import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/user/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/user/register',
      name: 'register',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/main',
      name: 'main',
      component: () => import('../views/MainView.vue'),
      redirect: '/attendance',
      children: [
        {
          name:'attendance',
          path: '/attendance',
          component: () => import('../views/AttendanceView.vue')
        },
        {
          name:'homework',
          path: '/homework',
          component: () => import('../views/HomeworkView.vue')
        },
        {
          name:'grade-list',
          path: '/import/grade-list',
          component: () => import('../views/ImportGradeView.vue')
        },
        {
          name:'student-list',
          path: '/import/student-list',
          component: () => import('../views/ImportStudentView.vue')
        }
      ]

    }
  ]
})

export default router
