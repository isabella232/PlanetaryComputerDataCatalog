import React from 'react'
import { setCompareMode, resetQueryToCompare } from '../../state/mosaicSlice'
import { useExploreSelector, useExploreDispatch } from "../../state/hooks";

const CompareButton = () => {
  const dispatch = useExploreDispatch();
  const { compareMode } = useExploreSelector(s => s.mosaic);
  function toggleCompare() {
    if (compareMode) {
      dispatch(resetQueryToCompare())
      dispatch(setCompareMode(false))
    } else {
      dispatch(setCompareMode(true))
    }
    
  }
  return <button onClick={() => {toggleCompare()}} > Compare {compareMode? 'on': 'off'} </button>
}

export default CompareButton