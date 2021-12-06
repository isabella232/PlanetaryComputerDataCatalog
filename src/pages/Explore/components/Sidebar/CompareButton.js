import React from 'react'
import {setCompareMode} from '../../state/mapSlice'
import { useExploreSelector, useExploreDispatch } from "../../state/hooks";

const CompareButton = () => {
  const dispatch = useExploreDispatch();
  const { compareMode } = useExploreSelector(s => s.map);
  return <button onClick={()=> {dispatch(setCompareMode())}}> Compare {compareMode? 'on': 'off'} </button>
}

export default CompareButton