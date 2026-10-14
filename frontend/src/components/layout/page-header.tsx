import Link from "next/link";
import type { ReactNode } from "react";

export interface PageBreadcrumb {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: PageBreadcrumb[];
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <div className="page-heading">
      <div className="page-heading-copy">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="page-breadcrumbs" aria-label="Breadcrumb">
            <ol>
              {breadcrumbs.map((breadcrumb, index) => {
                const current = index === breadcrumbs.length - 1;
                return (
                  <li key={`${breadcrumb.label}-${index}`}>
                    {breadcrumb.href && !current ? (
                      <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
                    ) : (
                      <span aria-current={current ? "page" : undefined}>{breadcrumb.label}</span>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        )}
        <h1>{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="page-heading-actions">{actions}</div>}
    </div>
  );
}
