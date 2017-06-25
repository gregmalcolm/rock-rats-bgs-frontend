import React from 'react';
import OverviewSystem from './OverviewSystem'

const OverviewList = ({overview}) => {
  return (
    <div className="overview-list">
      {Object.keys(overview.systems).map(systemName =>
        <OverviewSystem key={systemName}
                        system={overview.systems[systemName]}/>
      )}
    </div>
  );
};

export default OverviewList;
