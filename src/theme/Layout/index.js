import OriginalLayout from '@theme-original/Layout';
import DocumentScrollbar from '@site/src/components/DocumentScrollbar';
import React from 'react';

export default function Layout(props) {
  return (
    <>
      <OriginalLayout {...props} />
      <DocumentScrollbar />
    </>
  );
}
