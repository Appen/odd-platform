import React from 'react';
import {
  getIdentity,
  getIsOwnerEntitiesFetching,
  getMyDataEntitiesFetchingStatuses,
  getMyDownstreamFetchingStatuses,
  getMyEntities,
  getMyEntitiesDownstream,
  getMyEntitiesUpstream,
  getMyUpstreamDataEntitiesFetchingStatuses,
  getPopularDataEntitiesFetchingStatuses,
  getPopularEntities,
} from 'redux/selectors';
import {
  fetchMyDataEntitiesList,
  fetchMyDownstreamDataEntitiesList,
  fetchMyUpstreamDataEntitiesList,
  fetchPopularDataEntitiesList,
} from 'redux/thunks';
import {
  CatalogIcon,
  DownstreamIcon,
  StarIcon,
  UpstreamIcon,
} from 'components/shared/Icons';
import { SkeletonWrapper } from 'components/shared';
import { useAppDispatch, useAppSelector } from 'redux/lib/hooks';
import OwnerEntitiesListSkeleton from './OwnerEntitiesListSkeleton/OwnerEntitiesListSkeleton';
import * as S from './OwnerEntitiesListStyles';
import DataEntityList from './DataEntityList/DataEntityList';

const OwnerEntitiesList: React.FC = () => {
  const dispatch = useAppDispatch();

  const identity = useAppSelector(getIdentity);
  const myEntities = useAppSelector(getMyEntities);
  const myEntitiesDownstream = useAppSelector(getMyEntitiesDownstream);
  const myEntitiesUpstream = useAppSelector(getMyEntitiesUpstream);
  const popularEntities = useAppSelector(getPopularEntities);

  const { isLoading: isMyDataEntitiesFetching, isNotLoaded: isMyDataEntitiesNotFetched } =
    useAppSelector(getMyDataEntitiesFetchingStatuses);
  const {
    isLoading: isUpstreamDataEntitiesFetching,
    isNotLoaded: isUpstreamDataEntitiesNotFetched,
  } = useAppSelector(getMyUpstreamDataEntitiesFetchingStatuses);
  const {
    isLoading: isDownstreamDataEntitiesFetching,
    isNotLoaded: isDownstreamDataEntitiesNotFetched,
  } = useAppSelector(getMyDownstreamFetchingStatuses);
  const {
    isLoading: isPopularDataEntitiesFetching,
    isNotLoaded: isPopularDataEntitiesNotFetched,
  } = useAppSelector(getPopularDataEntitiesFetchingStatuses);
  const isOwnerEntitiesListFetching = useAppSelector(getIsOwnerEntitiesFetching);

  React.useEffect(() => {
    if (!identity) return;
    const params = { page: 1, size: 5 };
    dispatch(fetchMyDataEntitiesList(params));
    dispatch(fetchMyUpstreamDataEntitiesList(params));
    dispatch(fetchMyDownstreamDataEntitiesList(params));
    dispatch(fetchPopularDataEntitiesList(params));
  }, [identity]);

  return (
    <>
      {isOwnerEntitiesListFetching ? (
        <SkeletonWrapper
          renderContent={({ randWidth }) => (
            <OwnerEntitiesListSkeleton width={randWidth()} />
          )}
        />
      ) : (
        <S.DataEntityContainer container>
          <DataEntityList
            dataEntitiesList={myEntities}
            entityListName='My Objects'
            entityListIcon={<CatalogIcon />}
            isFetching={isMyDataEntitiesFetching}
            isNotFetched={isMyDataEntitiesNotFetched}
          />
          <DataEntityList
            dataEntitiesList={myEntitiesUpstream}
            entityListName='Upstream dependents'
            entityListIcon={<UpstreamIcon />}
            isFetching={isUpstreamDataEntitiesFetching}
            isNotFetched={isUpstreamDataEntitiesNotFetched}
          />
          <DataEntityList
            dataEntitiesList={myEntitiesDownstream}
            entityListName='Downstream dependents'
            entityListIcon={<DownstreamIcon />}
            isFetching={isDownstreamDataEntitiesFetching}
            isNotFetched={isDownstreamDataEntitiesNotFetched}
          />
          <DataEntityList
            dataEntitiesList={popularEntities}
            entityListName='Popular'
            entityListIcon={<StarIcon />}
            isFetching={isPopularDataEntitiesFetching}
            isNotFetched={isPopularDataEntitiesNotFetched}
          />
        </S.DataEntityContainer>
      )}
    </>
  );
};

export default OwnerEntitiesList;
