import React from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {isActiveSidebarItem} from '@docusaurus/plugin-content-docs/client';
import Link from '@docusaurus/Link';
import isInternalUrl from '@docusaurus/isInternalUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import IconExternalLink from '@theme/Icon/ExternalLink';

import {isSidebarItemNew} from '@site/src/constants/newSidebarDocs';
import styles from './styles.module.css';

function LinkLabel({label, isNew}) {
  return (
    <span className={styles.linkLabelWrap}>
      <span className={styles.linkLabel}>{label}</span>
      {isNew ? (
        <span className={styles.newBadge} title="Nowa strona (do 3 tygodni)" aria-label="New">
          <span className={styles.newStar} aria-hidden="true">
            ★
          </span>
          <span className={styles.newText}>new</span>
        </span>
      ) : null}
    </span>
  );
}

export default function DocSidebarItemLink({
  item,
  onItemClick,
  activePath,
  level,
  index,
  ...props
}) {
  const {siteConfig} = useDocusaurusContext();
  const {href, label, className, autoAddBaseUrl, customProps} = item;
  const docId = item.docId || item.id;
  const isActive = isActiveSidebarItem(item, activePath);
  const isInternalLink = isInternalUrl(href);
  const isNew = isSidebarItemNew(href, customProps, siteConfig.baseUrl, docId);

  return (
    <li
      className={clsx(
        ThemeClassNames.docs.docSidebarItemLink,
        ThemeClassNames.docs.docSidebarItemLinkLevel(level),
        'menu__list-item',
        isNew && styles.menuItemNew,
        className,
      )}
      key={label}
    >
      <Link
        className={clsx(
          'menu__link',
          !isInternalLink && styles.menuExternalLink,
          {
            'menu__link--active': isActive,
          },
        )}
        autoAddBaseUrl={autoAddBaseUrl}
        aria-current={isActive ? 'page' : undefined}
        to={href}
        {...(isInternalLink && {
          onClick: onItemClick ? () => onItemClick(item) : undefined,
        })}
        {...props}
      >
        <LinkLabel label={label} isNew={isNew} />
        {!isInternalLink && <IconExternalLink />}
      </Link>
    </li>
  );
}
