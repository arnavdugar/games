import type { ComponentChildren } from "preact";
import { useEffect } from "preact/hooks";
import { Link } from "wouter-preact";
import { useInstallApp } from "../hooks/useInstallApp";

import * as styles from "./PageLayout.css";

type LeadingAction =
  | {
      ariaLabel: string;
      href: string;
    }
  | {
      ariaLabel: string;
      onClick: () => void;
    };

interface PageLayoutProps {
  children: ComponentChildren;
  documentTitle?: string;
  leadingAction?: LeadingAction;
  title: string;
}

export function PageLayout({
  children,
  leadingAction,
  title,
  documentTitle = title,
}: PageLayoutProps) {
  const { canInstall, installApp } = useInstallApp();

  useEffect(() => {
    document.title = documentTitle;
  }, [documentTitle]);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          {leadingAction ? (
            "href" in leadingAction ? (
              <Link
                aria-label={leadingAction.ariaLabel}
                className={styles.leadingAction}
                href={leadingAction.href}
              >
                <span aria-hidden="true" className="material-symbols-outlined">
                  arrow_back
                </span>
              </Link>
            ) : (
              <button
                aria-label={leadingAction.ariaLabel}
                className={styles.leadingAction}
                onClick={leadingAction.onClick}
                type="button"
              >
                <span aria-hidden="true" className="material-symbols-outlined">
                  arrow_back
                </span>
              </button>
            )
          ) : null}
          <h1 className={styles.title}>{title}</h1>
          {canInstall ? (
            <button
              aria-label="Install app"
              className={styles.installButton}
              onClick={installApp}
              type="button"
            >
              <span aria-hidden="true" className="material-symbols-outlined">
                download
              </span>
            </button>
          ) : null}
        </div>
      </header>
      <main>{children}</main>
    </>
  );
}
