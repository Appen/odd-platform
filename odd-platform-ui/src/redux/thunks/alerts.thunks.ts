import {
  AlertApi,
  type AlertApiChangeAlertStatusRequest,
  type AlertApiGetAllAlertsRequest,
  type AlertApiGetAssociatedUserAlertsRequest,
  type AlertApiGetDependentEntitiesAlertsRequest,
  type AlertTotals,
  Configuration,
  type DataEntityAlertConfig,
  DataEntityApi,
  type DataEntityApiGetAlertConfigRequest,
  type DataEntityApiGetDataEntityAlertsCountsRequest,
  type DataEntityApiGetDataEntityAlertsRequest,
  type DataEntityApiUpdateAlertConfigRequest,
} from 'generated-sources';
import * as actions from 'redux/actions';
import { BASE_PARAMS } from 'lib/constants';
import type {
  Alert,
  AlertsConfig,
  DataEntityId,
  PaginatedResponse,
  RelatedToEntityId,
  SerializeDateToNumber,
} from 'redux/interfaces';
import { castDatesToTimestamp } from 'redux/lib/helpers';
import { handleResponseAsyncThunk } from 'redux/lib/handleResponseThunk';
import { toDate } from 'lib/helpers';

const apiClientConf = new Configuration(BASE_PARAMS);
const alertApi = new AlertApi(apiClientConf);
const dataEntityApi = new DataEntityApi(apiClientConf);

export const fetchAlertsTotals = handleResponseAsyncThunk<AlertTotals>(
  actions.fetchAlertsTotalsActionType,
  async () => await alertApi.getAlertTotals(),
  {}
);

export const fetchAllAlertList = handleResponseAsyncThunk<
  PaginatedResponse<Alert[]>,
  AlertApiGetAllAlertsRequest
>(
  actions.fetchAlertListActionType,
  async ({ page, size }) => {
    const { items, pageInfo } = await alertApi.getAllAlerts({ page, size });

    return { items: castDatesToTimestamp(items), pageInfo: { ...pageInfo, page } };
  },
  {}
);

export const fetchMyAlertList = handleResponseAsyncThunk<
  PaginatedResponse<Alert[]>,
  AlertApiGetAssociatedUserAlertsRequest
>(
  actions.fetchMyAlertListActionType,
  async ({ page, size }) => {
    const { items, pageInfo } = await alertApi.getAssociatedUserAlerts({ page, size });

    return { items: castDatesToTimestamp(items), pageInfo: { ...pageInfo, page } };
  },
  {}
);

export const fetchMyDependentsAlertList = handleResponseAsyncThunk<
  PaginatedResponse<Alert[]>,
  AlertApiGetDependentEntitiesAlertsRequest
>(
  actions.fetchMyDependentsAlertListActionType,
  async ({ page, size }) => {
    const { items, pageInfo } = await alertApi.getDependentEntitiesAlerts({ page, size });

    return { items: castDatesToTimestamp(items), pageInfo: { ...pageInfo, page } };
  },
  {}
);

export const updateAlertStatus = handleResponseAsyncThunk<
  { alert: Alert } & Partial<DataEntityId>,
  AlertApiChangeAlertStatusRequest & Partial<DataEntityId>
>(
  actions.updateAlertStatusActionType,
  async params => {
    const alert = await alertApi.changeAlertStatus(params);

    return { alert: castDatesToTimestamp(alert), dataEntityId: params.dataEntityId };
  },
  {
    setSuccessOptions: ({ alertStatusFormData, alertId }) => ({
      id: `Alert-updating-${alertId}`,
      message: `Alert successfully ${alertStatusFormData.status?.toLowerCase()}.`,
    }),
  }
);

export const fetchDataEntityAlerts = handleResponseAsyncThunk<
  RelatedToEntityId<PaginatedResponse<Alert[]>>,
  DataEntityApiGetDataEntityAlertsRequest
>(
  actions.fetchDataEntityAlertsActionType,
  async params => {
    const { page, dataEntityId } = params;
    const { items, pageInfo } = await dataEntityApi.getDataEntityAlerts(params);

    return {
      items: castDatesToTimestamp(items),
      pageInfo: { ...pageInfo, page },
      dataEntityId,
    };
  },
  { switchOffErrorMessage: true }
);

export const fetchDataEntityAlertsCounts = handleResponseAsyncThunk<
  RelatedToEntityId<{ count: number }>,
  DataEntityApiGetDataEntityAlertsCountsRequest
>(
  actions.fetchDataEntityAlertsCountActionType,
  async params => {
    const { dataEntityId } = params;
    const count = await dataEntityApi.getDataEntityAlertsCounts(params);

    return { count, dataEntityId };
  },
  {}
);

export const fetchDataEntityAlertsConfig = handleResponseAsyncThunk<
  AlertsConfig,
  DataEntityApiGetAlertConfigRequest
>(
  actions.fetchDataEntityAlertsConfig,
  async ({ dataEntityId }) => {
    const config = await dataEntityApi.getAlertConfig({ dataEntityId });

    return { dataEntityId, config: castDatesToTimestamp(config) };
  },
  {}
);

export const updateDataEntityAlertsConfig = handleResponseAsyncThunk<
  AlertsConfig,
  SerializeDateToNumber<DataEntityApiUpdateAlertConfigRequest>
>(
  actions.updateDataEntityAlertsConfig,
  async ({ dataEntityId, dataEntityAlertConfig }) => {
    const entries = Object.entries(dataEntityAlertConfig).map(
      ([alertType, timeStamp]) => [alertType, timeStamp ? toDate(timeStamp) : undefined]
    );

    const parsedConfig: DataEntityAlertConfig = Object.fromEntries(entries);
    const config = await dataEntityApi.updateAlertConfig({
      dataEntityId,
      dataEntityAlertConfig: parsedConfig,
    });

    return { dataEntityId, config: castDatesToTimestamp(config) };
  },
  {
    setSuccessOptions: ({ dataEntityId }) => ({
      id: `Alert-config-updating-${dataEntityId}`,
      message: `Alert config successfully updated.`,
    }),
  }
);
