import React from 'react';
import type { SelectChangeEvent } from '@mui/material';
import { Box, Grid, Typography } from '@mui/material';
import { AppButton, AppMenuItem, AppSelect, LabeledInfoItem } from 'components/shared';
import type { DataQualityTestExpectation } from 'generated-sources';
import { DataQualityTestSeverity, Permission } from 'generated-sources';
import {
  getDatasetTestListFetchingStatuses,
  getQualityTestByTestId,
} from 'redux/selectors';
import { setDataQATestSeverity } from 'redux/thunks';
import { useAppDateTime, useAppParams } from 'lib/hooks';
import { ORDERED_SEVERITY } from 'lib/constants';
import { hasDataQualityTestExpectations } from 'lib/helpers';
import { useAppDispatch, useAppSelector } from 'redux/lib/hooks';
import { WithPermissions } from 'components/shared/contexts';
import TestReportDetailsOverviewSkeleton from './TestReportDetailsOverviewSkeleton/TestReportDetailsOverviewSkeleton';
import TestReportDetailsOverviewExpectationsModal from './TestReportDetailsOverviewParametersModal/TestReportDetailsOverviewParametersModal';
import * as S from './TestReportDetailsOverviewStyles';

const TestReportDetailsOverview: React.FC = () => {
  const dispatch = useAppDispatch();
  const { dataEntityId, dataQATestId } = useAppParams();
  const { qualityTestRunFormattedDateTime, formatDistanceStrict } = useAppDateTime();

  const qualityTest = useAppSelector(getQualityTestByTestId(dataQATestId));

  const { isLoading: isDatasetTestListFetching } = useAppSelector(
    getDatasetTestListFetchingStatuses
  );

  const handleSeverityChange = (e: SelectChangeEvent<unknown>) => {
    const severity = e.target.value as DataQualityTestSeverity;

    dispatch(
      setDataQATestSeverity({
        dataEntityId,
        dataqaTestId: dataQATestId,
        dataQualityTestSeverityForm: { severity },
      })
    );
  };

  const stringifyParams = JSON.stringify(qualityTest?.expectation, null, 2);
  const [showSeeMore, setShowSeeMore] = React.useState(false);
  const paramsRef = React.useRef<HTMLParagraphElement>(null);

  React.useEffect(() => {
    if (paramsRef.current) {
      const { clientHeight, scrollHeight } = paramsRef.current;
      setShowSeeMore(scrollHeight > clientHeight);
    }
  }, [isDatasetTestListFetching, paramsRef.current]);

  return (
    <Grid container direction='column' wrap='nowrap'>
      {isDatasetTestListFetching ? (
        <TestReportDetailsOverviewSkeleton length={1} />
      ) : (
        <>
          <Grid item sx={{ mt: 2 }} xs={12}>
            <LabeledInfoItem label='Date' inline labelWidth={2.4}>
              {qualityTest?.latestRun?.startTime &&
                qualityTestRunFormattedDateTime(
                  qualityTest?.latestRun?.startTime.getTime()
                )}
            </LabeledInfoItem>
            <LabeledInfoItem label='Duration' inline labelWidth={2.4}>
              {qualityTest?.latestRun?.startTime &&
                qualityTest?.latestRun.endTime &&
                formatDistanceStrict(
                  qualityTest?.latestRun.endTime,
                  qualityTest?.latestRun.startTime,
                  { addSuffix: false }
                )}
            </LabeledInfoItem>
            <LabeledInfoItem
              label='Severity'
              inline
              labelWidth={2.4}
              valueComponent='div'
            >
              <WithPermissions
                permissionTo={Permission.DATASET_TEST_RUN_SET_SEVERITY}
                renderContent={({ isAllowedTo }) => (
                  <AppSelect
                    disabled={!isAllowedTo}
                    size='small'
                    sx={{ width: 'fit-content' }}
                    defaultValue={qualityTest?.severity || DataQualityTestSeverity.MAJOR}
                    onChange={handleSeverityChange}
                  >
                    {ORDERED_SEVERITY.map(severity => (
                      <AppMenuItem key={severity} value={severity}>
                        {severity}
                      </AppMenuItem>
                    ))}
                  </AppSelect>
                )}
              />
            </LabeledInfoItem>
          </Grid>

          {hasDataQualityTestExpectations(qualityTest?.expectation) && (
            <Grid container sx={{ mt: 2 }} flexDirection='column'>
              <Typography variant='h4'>Parameters</Typography>
              <S.Params $isExpandable={showSeeMore} ref={paramsRef} variant='body1'>
                {stringifyParams}
              </S.Params>
              {showSeeMore && (
                <Box sx={{ px: 1.5, py: 0.25 }}>
                  <TestReportDetailsOverviewExpectationsModal
                    openBtnEl={
                      <AppButton size='medium' color='tertiary'>
                        See more
                      </AppButton>
                    }
                    expectations={qualityTest?.expectation as DataQualityTestExpectation}
                  />
                </Box>
              )}
            </Grid>
          )}

          {!!qualityTest?.linkedUrlList?.length && (
            <Grid item sx={{ mt: 2.25 }} xs={12}>
              <Typography variant='h4'>Links</Typography>
              <Grid container sx={{ mt: 1 }}>
                {qualityTest.linkedUrlList.map(({ name, url }) => (
                  <AppButton
                    to={{ pathname: url }}
                    key={url}
                    sx={{ py: 0.25 }}
                    size='medium'
                    color='tertiary'
                    linkTarget='_blank'
                    truncate
                  >
                    {name}
                  </AppButton>
                ))}
              </Grid>
            </Grid>
          )}
        </>
      )}
    </Grid>
  );
};

export default TestReportDetailsOverview;
