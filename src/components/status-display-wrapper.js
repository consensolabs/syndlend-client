import React from 'react';
import 'antd/dist/antd.css';
import { Tag, Timeline, Icon } from 'antd';

const statusTimeline = ["OPEN", "VERIFIED", "ISSUED", "PROPOSED", "COMPLETED"];


const StatusFlowDisplayWrapper = (props) => {
  return (
    <div style={{padding:10}}>
        <Timeline mode="alternate">
            { statusTimeline.slice(0, statusTimeline.indexOf(props.status)+1).
            map((status) => {return(<Timeline.Item color="green"><Tag style={{fontWeight: '500', cursor: 'pointer' }} color={"blue"}>
                {status.toUpperCase()}
            </Tag> 2015-09-01</Timeline.Item>)})
            }
            <Timeline.Item dot={<Icon type="clock-circle-o" style={{ fontSize: '16px' }} />}>
            </Timeline.Item>
        </Timeline>,
    </div>
  );
};

export default StatusFlowDisplayWrapper;
