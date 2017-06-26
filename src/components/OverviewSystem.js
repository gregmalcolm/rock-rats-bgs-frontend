import React from 'react';
import SystemReport from './SystemReport'

const OverviewSystem = ({system}) => {
  return (
    <div className={system.systemClassName}>
      <h2>{system.systemName}</h2>
      <div className="reported-by">Report for {system.date} collected by CMDR {system.collector} via {system.collectionMethod}</div>
      <SystemReport factions={system.factions}/>
    </div>
  );
};

export default OverviewSystem;
