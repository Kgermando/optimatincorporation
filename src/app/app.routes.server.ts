import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'realisations/:slug',
    renderMode: RenderMode.Server
  },
  {
    path: 'blog/:slug',
    renderMode: RenderMode.Server
  },
  {
    path: 'admin/portfolio/:id/edit',
    renderMode: RenderMode.Server
  },
  {
    path: 'admin/services/:id/edit',
    renderMode: RenderMode.Server
  },
  {
    path: 'admin/blog/:id/edit',
    renderMode: RenderMode.Server
  },
  {
    path: 'admin/team/:id/edit',
    renderMode: RenderMode.Server
  },
  {
    path: 'admin/users/:id/edit',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
