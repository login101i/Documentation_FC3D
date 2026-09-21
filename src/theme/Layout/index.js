import DocSearch from '@components/DocSearch';
import Layout from '@theme-original/Layout';
import React from 'react';

export default function LayoutWrapper(props) {
  const {children, ...layoutProps} = props;

  return (
    <Layout {...layoutProps}>
      <div className="doc-search-sticky">
        <div className="doc-search-sticky__inner">
          <DocSearch size="hero" />
        </div>
      </div>
      {children}
    </Layout>
  );
}
