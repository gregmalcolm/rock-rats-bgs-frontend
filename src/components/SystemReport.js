import React from 'react';
import SystemReportRow from './SystemReportRow'

const SystemReport = ({factions}) => {
  return (
    <table className="system-report-table">
      <thead>
        <tr>
          <th rowSpan="2"></th>
          <th colSpan="2">State</th>
          <th colSpan="4">Influence</th>
        </tr>
        <tr>
          <th>Current</th>
          <th>Days in State</th>
          <th>Current</th>
          <th>1 Day Diff</th>
          <th>2 Day Diff</th>
          <th>7 Day Diff</th>
        </tr>
      </thead>
      <tbody>
        {factions.map(faction =>
          <SystemReportRow key={faction.factionName}
                           faction={faction}/>
        )}
      </tbody>
    </table>
  );
};

export default SystemReport;
