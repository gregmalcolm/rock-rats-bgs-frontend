import React from 'react';
import SystemReportRow from './SystemReportRow'

const SystemReport = ({factions}) => {
  return (
    <table className="system-report-table">
      <thead>
        <tr>
          <th rowSpan="2"></th>
          <th colSpan="2">State</th>
          <th colSpan="6">Influence</th>
        </tr>
        <tr>
          <th>Current</th>
          <th>Days in State</th>
          <th>Current</th>
          <th>-1 Days</th>
          <th>-2 Days</th>
          <th>-3 Days</th>
          <th>-4 Days</th>
          <th>-7 Days</th>
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
