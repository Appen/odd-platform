import React, { HTMLAttributes } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Theme,
  Typography,
} from '@mui/material';
import { OwnerFormData, Role } from 'generated-sources';
import {
  AutocompleteInputChangeReason,
  createFilterOptions,
  FilterOptionsState,
} from '@mui/material/useAutocomplete';
import { AppInput } from 'components/shared';
import { ClearIcon } from 'components/shared/Icons';
import { useAppDispatch } from 'redux/lib/hooks';
import { fetchRolesList } from 'redux/thunks';
import { UseFieldArrayAppend } from 'react-hook-form/dist/types/fieldArray';
import { SxProps } from '@mui/system';

interface RoleAutocompleteProps {
  append: UseFieldArrayAppend<OwnerFormData, 'roles'>;
  sx?: SxProps<Theme>;
}

const RoleAutocomplete: React.FC<RoleAutocompleteProps> = ({ append, sx }) => {
  const dispatch = useAppDispatch();
  const searchRoles = fetchRolesList;

  type RoleFilterOption = Omit<Role, 'id' | 'policies'> &
    Partial<Pick<Role, 'id' | 'policies'>>;
  const [roleOptions, setRoleOptions] = React.useState<RoleFilterOption[]>([]);
  const [autocompleteOpen, setAutocompleteOpen] = React.useState(false);
  const [rolesLoading, setRolesLoading] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const rolesFilter = createFilterOptions<RoleFilterOption>();

  const handleRolesSearch = React.useCallback(
    useDebouncedCallback(() => {
      setRolesLoading(true);
      dispatch(searchRoles({ page: 1, size: 30, query }))
        .unwrap()
        .then(({ items }) => {
          setRolesLoading(false);
          setRoleOptions(items);
        });
    }, 500),
    [searchRoles, setRolesLoading, setRoleOptions, query]
  );

  const onRolesSearchInputChange = React.useCallback(
    (
      _: React.ChangeEvent<unknown>,
      inputQuery: string,
      reason: AutocompleteInputChangeReason
    ) => {
      if (reason === 'input') setQuery(inputQuery);
      else setQuery('');
    },
    [setQuery]
  );

  const getRoleFilterOptions = (
    filterOptions: RoleFilterOption[],
    params: FilterOptionsState<RoleFilterOption>
  ) => rolesFilter(filterOptions, params);

  React.useEffect(() => {
    setRolesLoading(autocompleteOpen);
    if (autocompleteOpen) handleRolesSearch();
  }, [autocompleteOpen, handleRolesSearch]);

  const getOptionLabel = React.useCallback((option: RoleFilterOption | string) => {
    if (typeof option === 'string') return option;
    if ('name' in option && option.name) return option.name;
    return '';
  }, []);

  const onAutocompleteChange = (
    _: React.SyntheticEvent,
    value: null | string | RoleFilterOption
  ): void => {
    if (value === null) return;
    if (typeof value === 'string') return;

    const isRole = (role: Role | RoleFilterOption): role is Role => 'id' in role;

    if (isRole(value)) {
      setQuery('');
      append(value);
    }
  };

  const handleOpen = () => setAutocompleteOpen(true);
  const handleClose = () => setAutocompleteOpen(false);

  const isOptionEqualToValue = (option: RoleFilterOption, value: RoleFilterOption) =>
    option.name === value.name;

  const renderInput = (params: AutocompleteRenderInputParams) => (
    <AppInput
      {...params}
      ref={params.InputProps.ref}
      label='Role'
      placeholder='Search by name'
      customEndAdornment={{
        variant: 'loader',
        showAdornment: rolesLoading,
        position: { mr: 4 },
      }}
    />
  );

  const renderOption = (
    props: HTMLAttributes<HTMLLIElement>,
    option: RoleFilterOption
  ) => (
    <li {...props}>
      <Typography variant='body2'>{option.name}</Typography>
    </li>
  );

  return (
    <Autocomplete
      sx={sx}
      fullWidth
      value={{ name: query }}
      open={autocompleteOpen}
      onOpen={handleOpen}
      onClose={handleClose}
      onChange={onAutocompleteChange}
      onInputChange={onRolesSearchInputChange}
      getOptionLabel={getOptionLabel}
      options={roleOptions}
      filterOptions={getRoleFilterOptions}
      loading={rolesLoading}
      isOptionEqualToValue={isOptionEqualToValue}
      handleHomeEndKeys
      selectOnFocus
      blurOnSelect
      freeSolo
      clearIcon={<ClearIcon />}
      renderInput={renderInput}
      renderOption={renderOption}
    />
  );
};

export default RoleAutocomplete;
