import {
  REPORTS_DUPLICATE_ROUTE,
  DASHBOARD_INDEX_ROUTE,
  REPORTS_MISS_ROUTE,
  BANK_ACCOUNTS_ROUTE,
  CURRENCIES_ROUTE,
} from "./Routes";

export const AdminMenus = [
  {
    title: "Escritorio",
    src: "home-blue-icon",
    link: DASHBOARD_INDEX_ROUTE,
    isActive: false,
  },
  {
    title: "Reportes",
    src: "document-white-icon",
    link: "reports",
    others: [
      {
        name: "Duplicados",
        link: "reports/" + REPORTS_DUPLICATE_ROUTE,
      },
      {
        name: "Inconsistencias",
        link: "reports/" + REPORTS_MISS_ROUTE,
      },
    ],
    isActive: false,
  },
  {
    title: "Locales",
    src: "map-marker-home",
    link: "stores",
    isActive: false,
  },
  {
    title: "Bancos ",
    src: "bank",
    link: "banks",
    others: [
      {
        name: "Cuentas de banco",
        link: "banks/" + BANK_ACCOUNTS_ROUTE,
      },
    ],
    isActive: false,
  },
  {
    title: "Usuarios",
    src: "user",
    link: "users",
    others: [
      {
        name: "Saldos",
        link: "users/balance",
      },
    ],
    isActive: false,
  },
  {
    title: "Países",
    src: "world",
    link: "countries",
    others: [
      {
        name: "Monedas",
        link: "countries/" + CURRENCIES_ROUTE,
      },
    ],
    isActive: false,
  },
];

export function NormalUserMenu(session = null) {
  const menu = [
    {
      title: "Escritorio",
      src: "home-blue-icon",
      link: DASHBOARD_INDEX_ROUTE,
      isActive: false,
    },
    {
      title: "Reportes",
      src: "document-white-icon",
      link: `users/${session.id}/reports`,
      isActive: false,
    },
  ];

  if (session.role_id === 3 && session.store) {
    menu.push({
      title: "Local",
      src: "map-marker-home",
      link: `stores/${session.store.id}`,
      isActive: false,
    });
  }

  if ([2].includes(session.role_id)) {
    menu.push({
      title: "Cuentas de banco",
      src: "bank",
      link: "banks/" + BANK_ACCOUNTS_ROUTE,
      isActive: false,
    });
  }

  return menu;
}
