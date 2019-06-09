import React from 'react';
import 'antd/dist/antd.css';
import { Slider } from 'antd';

const marks = {
    0: "Open",
    20: "Verified",
    40: "Issued",
    60: "Proposed",
    80: "Locked",
    100: "Completed"
};

const StatusFlowDisplayWrapper = () => {
  return (
    <div>
        <Slider marks={marks} defaultValue={40} disabled={true} />
    </div>
  );
};

export default StatusFlowDisplayWrapper;