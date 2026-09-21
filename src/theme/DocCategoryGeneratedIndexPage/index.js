/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 * Swizzled: scroll jak w książce + pierwszy subtemat.
 */

import React from 'react';
import {PageMetadata} from '@docusaurus/theme-common';
import {useCurrentSidebarCategory} from '@docusaurus/plugin-content-docs/client';
import useBaseUrl from '@docusaurus/useBaseUrl';
import DocCardList from '@theme/DocCardList';
import DocPaginator from '@theme/DocPaginator';
import DocVersionBanner from '@theme/DocVersionBanner';
import DocVersionBadge from '@theme/DocVersionBadge';
import DocBreadcrumbs from '@theme/DocBreadcrumbs';
import Heading from '@theme/Heading';

import CategoryScrollNav from '@components/ScrollPageNav/CategoryScrollNav';
import styles from './styles.module.css';

function DocCategoryGeneratedIndexPageMetadata({categoryGeneratedIndex}) {
  return (
    <PageMetadata
      title={categoryGeneratedIndex.title}
      description={categoryGeneratedIndex.description}
      keywords={categoryGeneratedIndex.keywords}
      image={useBaseUrl(categoryGeneratedIndex.image)}
    />
  );
}

function firstDocPermalink(items) {
  if (!items?.length) {
    return null;
  }
  for (const item of items) {
    if (item.type === 'link' && item.href) {
      return {permalink: item.href, title: item.label};
    }
    if (item.type === 'category' && item.items?.length) {
      const nested = firstDocPermalink(item.items);
      if (nested) {
        return nested;
      }
    }
  }
  return null;
}

function DocCategoryGeneratedIndexPageContent({categoryGeneratedIndex}) {
  const category = useCurrentSidebarCategory();
  const firstChild = firstDocPermalink(category.items);
  const next =
    categoryGeneratedIndex.navigation?.next ||
    (firstChild
      ? {permalink: firstChild.permalink, title: firstChild.title}
      : undefined);
  const previous = categoryGeneratedIndex.navigation?.previous;

  return (
    <div className={styles.generatedIndexPage}>
      <DocVersionBanner />
      <DocBreadcrumbs />
      <DocVersionBadge />
      <header>
        <Heading as="h1" className={styles.title}>
          {categoryGeneratedIndex.title}
        </Heading>
        {categoryGeneratedIndex.description ? (
          <p>{categoryGeneratedIndex.description}</p>
        ) : null}
      </header>
      <article className="margin-top--lg">
        <DocCardList items={category.items} className={styles.list} />
      </article>
      <CategoryScrollNav previous={previous} next={next} isMainTopic />
      <footer className="margin-top--md">
        <DocPaginator previous={previous} next={next} />
      </footer>
    </div>
  );
}

export default function DocCategoryGeneratedIndexPage(props) {
  return (
    <>
      <DocCategoryGeneratedIndexPageMetadata {...props} />
      <DocCategoryGeneratedIndexPageContent {...props} />
    </>
  );
}
