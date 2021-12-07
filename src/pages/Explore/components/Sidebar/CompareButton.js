import React from 'react'
import {setCompareMode} from '../../state/mapSlice'
import {resetQueryToCompare} from '../../state/mosaicSlice'
import { useExploreSelector, useExploreDispatch } from "../../state/hooks";

const CompareButton = () => {
  const dispatch = useExploreDispatch();
  const { compareMode } = useExploreSelector(s => s.map);
  function toggleCompare() {
    if (compareMode) {
      dispatch(resetQueryToCompare())
    }
    dispatch(setCompareMode())
  }
  return <button onClick={() => {toggleCompare()}} > Compare {compareMode? 'on': 'off'} </button>
}

export default CompareButton