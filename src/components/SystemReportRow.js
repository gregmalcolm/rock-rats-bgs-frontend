import React from 'react';

const SystemReportRow = ({faction}) => {
  return (
    <tr>
      <th className="faction-name">{faction.factionName}</th>
      <td className="faction-state">{faction.state}</td>
      <td className="faction-state-days">{faction.daysInState}</td>
      <td className="faction-influence">{faction.influence}%</td>
      <td className="faction-influence-1-day">{faction.influenceDiffs.oneDay}</td>
      <td className="faction-influence-2-days">{faction.influenceDiffs.twoDays}</td>
      <td className="faction-influence-7-days">{faction.influenceDiffs.week}</td>
    </tr>
  );
};

export default SystemReportRow;
