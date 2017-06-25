import React from 'react';

const OverviewList = ({overview}) => {
  return (
    <div>
      {overview.systems.map(system =>
        <h2 key={system}>{system}</h2>
      )}
    </div>
  );
};

export default OverviewList;
