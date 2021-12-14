import { IDropdownOption } from "@fluentui/react";
import { getAlternativeNameForMosaic } from "../../../utils/stac";
import { useExploreSelector } from "../../../state/hooks";
import { setMosaicToCompareQuery } from "../../../state/mosaicSlice";
import StateSelector from "./StateSelector";

const MosaicPresetToCompareSelector = () => {
  const { queryToCompare, mosaicOption, compareMode } = useExploreSelector(state => state.mosaic);
  const mosaics = mosaicOption

  const mosaicOptions =
    mosaics.length
      ? mosaics.map((mosaic): IDropdownOption => {
          return { key: mosaic.name || "", text: getAlternativeNameForMosaic(mosaic) || "" };
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
      disabled={!compareMode}
      cyId="mosaic-selector"
    />
  );
};

export default MosaicPresetToCompareSelector;
