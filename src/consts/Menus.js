import { REPORTS_DUPLICATE_ROUTE, DASHBOARD_INDEX_ROUTE, REPORTS_MISS_ROUTE, BANK_ACCOUNTS_ROUTE, REPORTS_TYPE_ROUTE, CURRENCIES_ROUTE } from "./Routes"

export const AdminMenus = [
  {
    title: 'Escritorio',
    src: 'home-blue-icon',
    link: DASHBOARD_INDEX_ROUTE,
    isActive: false
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
      },
      {
        name: 'Tipos de reportes',
        link: 'reports/' + REPORTS_TYPE_ROUTE
      }
    ],
    isActive: false
  },
  {
    title: 'Locales',
    src: 'map-marker-home',
    link: 'stores',
    isActive: false
  },
  {
    title: 'Bancos ',
    src: 'bank',
    link: 'banks',
    others: [
      {
        name: 'Cuentas de banco',
        link: 'banks/'+ BANK_ACCOUNTS_ROUTE
      }
    ],
    isActive: false
  },
  {
    title: 'Usuarios',
    src: 'user',
    link: 'users',
    isActive: false
  },
  {
    title: 'Países',
    src: 'world',
    link: 'countries',
    others: [
      {
        name: 'Monedas',
        link: 'countries/'+ CURRENCIES_ROUTE
      }
    ],
    isActive: false
  }
]

export function NormalUserMenu(session = null) {
  return [
    {
      title: 'Escritorio',
      src: 'home-blue-icon',
      link: DASHBOARD_INDEX_ROUTE,
      isActive: false
    },
    {
      title: 'Reportes',
      src: 'document-white-icon',
      link: `users/${session.id}/reports`,
      others: [
        {
          name: 'Duplicados',
          link: 'reports/' + REPORTS_DUPLICATE_ROUTE
        }
      ],
      isActive: false
    },
    {
      title: 'Cuentas de banco',
      src: 'bank',
      link: 'banks/' + BANK_ACCOUNTS_ROUTE,
      isActive: false
    },
    ];
}