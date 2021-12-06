import { IDropdownOption } from "@fluentui/react";
import { useEffect } from "react";
import { useCollectionMosaicInfo } from "../../../utils/hooks";
import { useExploreDispatch, useExploreSelector } from "../../../state/hooks";
import { setMosaicToCompareQuery, setMosaicOption } from "../../../state/mosaicSlice";
import StateSelector from "./StateSelector";
import { useMosaicUrlState } from "./hooks/useUrlState";

const MosaicPresetToCompareSelector = () => {
  const { collection, query, queryToCompare, mosaicOption } = useExploreSelector(state => state.mosaic);
  const dispatch = useExploreDispatch();

  const mosaics = mosaicOption
  
  useEffect(() => {
    if (query.name === null) {
      // dispatch<any>(setMosaicQuery(mosaicInfo.mosaics[0]));
      // dispatch<any>(setMosaicOption(mosaicInfo.mosaics));
    }
  }, [dispatch, query.name]);

  // useMosaicUrlState(mosaics);

  const mosaicOptions =
    mosaics.length
      ? mosaics.map((mosaic): IDropdownOption => {
          return { key: mosaic.name || "", text: mosaic.name || "" };
        })
      : [];

  const getQueryPresetByName = (key: string | number) => {
    return mosaics.find(mosaic => mosaic.name === key);
  };

  return (
    <StateSelector
      title="Select a preset query to find data"
      icon="PageListFilter"
      action={setMosaicToCompareQuery}
      options={mosaicOptions}
      selectedKey={queryToCompare.name}
      getStateValFn={getQueryPresetByName}
      disabled={!collection?.id}
      cyId="mosaic-selector"
    />
  );
};

export default MosaicPresetToCompareSelector;
