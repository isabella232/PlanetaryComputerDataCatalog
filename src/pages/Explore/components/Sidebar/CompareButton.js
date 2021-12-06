import React from 'react'
import {setCompareMode} from '../../state/mapSlice'
import { useExploreDispatch } from "../../state/hooks";

const CompareButton = () => {
  const dispatch = useExploreDispatch();
  return <button onClick={()=> {dispatch(setCompareMode())}}> Compare</button>
}

export default CompareButton