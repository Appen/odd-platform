import React from 'react';
import { Grid, Typography } from '@mui/material';
import {
  AppButton,
  AppIconButton,
  AppMenuItem,
  AppPopover,
  ConfirmationDialog,
  EntityTypeItem,
} from 'components/shared';
import { WithPermissions } from 'components/shared/contexts';
import { Permission, TermDetails } from 'generated-sources';
import TermsForm from 'components/Terms/TermSearch/TermForm/TermsForm';
import { EditIcon, KebabIcon, TimeGapIcon } from 'components/shared/Icons';
import { useAppDateTime } from 'lib/hooks';

interface TermDetailsHeaderProps {
  name: TermDetails['name'];
  updatedAt: TermDetails['updatedAt'];
  termId: TermDetails['id'];
  handleTermDelete: (id: number) => () => Promise<void>;
}
const TermDetailsHeader: React.FC<TermDetailsHeaderProps> = ({
  name,
  termId,
  updatedAt,
  handleTermDelete,
}) => {
  const { formatDistanceToNowStrict } = useAppDateTime();

  const termUpdatedAt = React.useMemo(
    () => (
      <>
        <TimeGapIcon />
        <Typography variant='body1' sx={{ ml: 1 }}>
          {formatDistanceToNowStrict(updatedAt, { addSuffix: true })}
        </Typography>
      </>
    ),
    [updatedAt]
  );

  return (
    <Grid container alignItems='center' flexWrap='nowrap'>
      <Grid container alignItems='center'>
        <Typography variant='h1' noWrap sx={{ mr: 1 }}>
          {name}
        </Typography>
        <EntityTypeItem entityTypeName='DCT' />
      </Grid>
      <Grid container justifyContent='flex-end'>
        {termUpdatedAt}
        <WithPermissions permissionTo={Permission.TERM_UPDATE}>
          <TermsForm
            btnCreateEl={
              <AppButton
                size='medium'
                color='primaryLight'
                startIcon={<EditIcon />}
                sx={{ ml: 1 }}
              >
                Edit
              </AppButton>
            }
          />
        </WithPermissions>
        <WithPermissions permissionTo={Permission.TERM_DELETE}>
          <AppPopover
            renderOpenBtn={({ onClick, ariaDescribedBy }) => (
              <AppIconButton
                ariaDescribedBy={ariaDescribedBy}
                size='medium'
                color='primaryLight'
                icon={<KebabIcon />}
                onClick={onClick}
                sx={{ ml: 1 }}
              />
            )}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: -5, horizontal: 67 }}
          >
            <ConfirmationDialog
              actionTitle='Are you sure you want to delete this term?'
              actionName='Delete term'
              actionText={<>&quot;{name}&quot; will be deleted permanently.</>}
              onConfirm={handleTermDelete(termId)}
              actionBtn={<AppMenuItem>Delete</AppMenuItem>}
            />
          </AppPopover>
        </WithPermissions>
      </Grid>
    </Grid>
  );
};

export default TermDetailsHeader;
