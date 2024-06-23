import moment from 'moment';
import { Tag } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

import { deviceTypes } from '@/utils/type_icons';
import { TypeComponent, SignalComponent } from '@/components/Tables/Tables';

export const getColumns = () => {
  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 50,
      render: (text) => <TypeComponent type={text} />,
    },
    {
      title: 'Name',
      dataIndex: 'labels',
      key: 'name',
      flex: 1,
      render: (labels, record) => (labels && labels.name ? labels.name : record.cloudpopId),
      sorter: (a, b) =>
        (a.labels && a.labels.name ? a.labels.name : a.cloudpopId).length -
        (b.labels && b.labels.name ? b.labels.name : b.cloudpopId).length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'State',
      key: 'state',
      dataIndex: 'state',
      width: 60,
      render: (_, record) => {
        return stateHandler(record);
      },
      align: 'right',
    },
    {
      title: 'Last Seen',
      key: 'lastSeen',
      dataIndex: 'lastSeen',
      width: 150,
      render: (text, record) => {
        const { type } = record;
        if (type === deviceTypes.CCON) {
          return '';
        }
        return text ? moment(text).fromNow() : '---';
      },
      align: 'right',
    },
    {
      title: 'Signal',
      key: 'signal',
      dataIndex: 'reported',
      width: 60,
      render: (_, record) => {
        return signalHandler(record);
      },
      align: 'right',
    },
  ];

  return columns;
};

export const getSensorColumns = () => {
  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 50,
      render: (text) => <TypeComponent type={text} />,
    },
    {
      title: 'Name',
      dataIndex: 'labels',
      key: 'name',
      flex: 1,
      render: (labels, record) => (labels && labels.name ? labels.name : record.cloudpopId),
      sorter: (a, b) =>
        (a.labels && a.labels.name ? a.labels.name : a.cloudpopId).length -
        (b.labels && b.labels.name ? b.labels.name : b.cloudpopId).length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Last Seen',
      key: 'lastSeen',
      dataIndex: 'lastSeen',
      width: 150,
      render: (text, record) => {
        const { type } = record;
        if (type === deviceTypes.CCON) {
          return '';
        }
        return text ? moment(text).fromNow() : '---';
      },
      align: 'right',
    },
    {
      title: 'Signal',
      key: 'signal',
      dataIndex: 'reported',
      width: 60,
      render: (_, record) => {
        return signalHandler(record);
      },
      align: 'right',
    },
  ];

  return columns;
};

export const stateHandler = (record) => {
  const { type, reported } = record;
  switch (type) {
    case deviceTypes.TEMPERATURE:
      return reported && reported.temperature ? `${parseFloat(reported?.temperature?.value).toFixed(2)}°C` : '';
    case deviceTypes.TOUCH:
      return reported && reported.touch && reported.touch.updateTime ? moment(reported?.touch?.updateTime).fromNow() : '';
    default:
      return '';
  }
};

export const signalHandler = (record) => {
  const { type, reported } = record;

  if (type === deviceTypes.CCON) {
    const { connectionStatus } = reported;
    const text = connectionStatus ? connectionStatus.connection : '';
    const isOffline = text === 'OFFLINE';
    return (
      <Tag color={isOffline ? 'red' : 'green'} className="p-2">
        <FontAwesomeIcon
          icon={isOffline ? faTimesCircle : faCheckCircle}
          className={isOffline ? 'danger-icon mr-1' : 'success-icon mr-1'}
        />
        {isOffline || !text ? 'Offline' : 'Good Cellular'}
      </Tag>
    );
  } else {
    const networkStatus = reported?.networkStatus;
    const signalStrength = networkStatus && networkStatus.signalStrength;
    return <SignalComponent signal={signalStrength || 0} />;
  }
};

export const menuColumns = [
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    width: 60,
    render: (text) => <TypeComponent type={text} />,
  },
  {
    title: 'Name',
    dataIndex: 'labels',
    key: 'name',
    render: (labels, record) => (labels && labels.name ? labels.name : record.cloudpopId),
    sorter: (a, b) =>
      (a.labels && a.labels.name ? a.labels.name : a.cloudpopId).length -
      (b.labels && b.labels.name ? b.labels.name : b.cloudpopId).length,
    sortDirections: ['descend', 'ascend'],
    ellipsis: true,
  },
];

export const keyColumns = [
  {
    title: 'Label Key',
    key: 'labelKey',
    dataIndex: 'labelKey',
    render: (text) => text,
  },
  {
    title: 'Value',
    key: 'value',
    dataIndex: 'value',
    render: (text) => text,
  },
];
