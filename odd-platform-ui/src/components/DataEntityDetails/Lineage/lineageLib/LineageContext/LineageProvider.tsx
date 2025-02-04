import React from 'react';
import { type TreeNodeDatum } from 'redux/interfaces';
import { HierarchyPointLink, type HierarchyPointNode } from 'd3-hierarchy';
import { useQueryParams } from 'lib/hooks';
import type { LineageQueryParams } from '../interfaces';
import { getMaxODDRNHeight, getMaxTitleHeight } from '../helpers';
import { generateNodeSize } from '../generateNodeSize';
import LineageContext, { type LineageContextProps } from './LineageContext';
import { defaultLineageQuery } from '../constants';

type LineageProviderProps = Omit<
  LineageContextProps,
  | 'nodeSize'
  | 'setRenderedNodes'
  | 'setRenderedLinks'
  | 'getHighLightedLinks'
  | 'highLightedLinks'
  | 'setHighLightedLinks'
  | 'renderedLinks'
>;

const LineageProvider: React.FC<LineageProviderProps> = ({ children }) => {
  const {
    queryParams: { full, fn },
  } = useQueryParams<LineageQueryParams>(defaultLineageQuery);

  const [renderedNodes, setRenderedNodes] = React.useState<
    HierarchyPointNode<TreeNodeDatum>[]
  >([]);
  const [renderedLinks, setRenderedLinks] = React.useState<
    HierarchyPointLink<TreeNodeDatum>[]
  >([]);
  const [highLightedLinks, setHighLightedLinks] = React.useState<
    HierarchyPointLink<TreeNodeDatum>[]
  >([]);

  const titleHeight = React.useMemo(
    () => getMaxTitleHeight(renderedNodes, fn),
    [fn, renderedNodes]
  );

  const oddrnHeight = React.useMemo(
    () => getMaxODDRNHeight(renderedNodes),
    [renderedNodes]
  );

  const nodeSize = React.useMemo(
    () => generateNodeSize({ full, titleHeight, oddrnHeight }),
    [full, titleHeight, oddrnHeight]
  );

  const providerValue = React.useMemo<LineageContextProps>(
    () => ({
      nodeSize,
      setRenderedNodes,
      renderedLinks,
      setRenderedLinks,
      highLightedLinks,
      setHighLightedLinks,
    }),
    [full, fn, renderedLinks, highLightedLinks]
  );

  return (
    <LineageContext.Provider value={providerValue}>{children}</LineageContext.Provider>
  );
};

export default LineageProvider;
