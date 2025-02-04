import React from 'react';
import {
  ActivityCreatedIcon,
  ActivityDeletedIcon,
  ActivityUpdatedIcon,
} from 'components/shared/Icons';
import { type EventType } from 'lib/interfaces';

const useActivityHeaderIcon = (eventType: EventType): JSX.Element =>
  React.useMemo(() => {
    if (eventType === 'created' || eventType === 'added') return <ActivityCreatedIcon />;
    if (eventType === 'updated') return <ActivityUpdatedIcon />;
    return <ActivityDeletedIcon />;
  }, [eventType]);

export default useActivityHeaderIcon;
