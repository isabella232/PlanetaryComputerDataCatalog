import React from 'react'
import { Toggle } from '@fluentui/react/lib/Toggle';
import { setCompareMode, resetQueryToCompare } from '../../state/mosaicSlice'
import { useExploreSelector, useExploreDispatch } from "../../state/hooks";
import { headerStyles } from './panes/SearchResultsHeader'
const CompareButton = () => {
  const dispatch = useExploreDispatch();
  const { compareMode, collection } = useExploreSelector(s => s.mosaic);
  function toggleCompare() {
    if (compareMode) {
      dispatch(resetQueryToCompare())
      dispatch(setCompareMode(false))
    } else {
      dispatch(setCompareMode(true))
    }
    
  }
  return ( 
      <Toggle label={<h4 style={headerStyles}>Compare different queries side by side from {collection.title}</h4>} onText="On" offText="Off" onChange={toggleCompare} />
    )
}

export default CompareButton