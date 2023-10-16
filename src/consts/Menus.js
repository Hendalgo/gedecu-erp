import { REPORTS_DUPLICATE_ROUTE, DASHBOARD_INDEX_ROUTE, REPORTS_MISS_ROUTE } from "./Routes"

export const AdminMenus = [
  {
    title: 'Escritorio',
    src: 'home-blue-icon',
    link: DASHBOARD_INDEX_ROUTE
  },
  {
    title: 'Reportes',
    src: 'document-white-icon',
    link: 'reports',
    others: [
      {
        name: 'Duplicados',
        link: 'reports/' + REPORTS_DUPLICATE_ROUTE
      },
      {
        name: 'Inconsistencias',
        link: 'reports/' + REPORTS_MISS_ROUTE
      }
    ]
  },
  {
    title: 'Locales',
    src: 'map-marker-home',
    link: 'stores'
  },
  {
    title: 'Bancos ',
    src: 'bank',
    link: 'banks'
  },
  {
    title: 'Usuarios',
    src: 'user',
    link: 'users'
  }
]

export  const NormalUserMenu = [
  {
    title: 'Escritorio',
    src: 'home-blue-icon',
    link: DASHBOARD_INDEX_ROUTE
  },
  {
    title: 'Reportes',
    src: 'document-white-icon',
    link: 'reports',
    others: [
      {
        name: 'Duplicados',
        link: 'reports/' + REPORTS_DUPLICATE_ROUTE
      }
    ]
  },
  {
    title: 'Locales',
    src: 'map-marker-home',
    link: 'stores'
  },
]