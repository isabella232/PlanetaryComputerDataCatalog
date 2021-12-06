import React, {useEffect, useRef, useState} from 'react'
import { DEFAULT_MAP_STYLE } from "pages/Explore/utils/constants";
import * as atlas from "azure-maps-control";
import { makeTileJsonUrl } from "utils";
import { useExploreSelector } from "../../../state/hooks";
import SwipeMap from './Slider.ts'
import { itemOutlineLayerName } from "pages/Explore/utils/layers";

const DARK_MAP_STYLE = 'grayscale_dark'

const map1Id = 'map-to-compare-1'
const map2Id = 'map-to-compare-2'
export const mosaicLayerName = "stac-mosaic-1";
export const mosaicLayerName2 = "stac-mosaic-2";

const CompareMap = () => {

  const map1Ref = useRef(null)
  const map2Ref = useRef(null)
  const [mapReady, setMapReady] = useState(false)
  const { center, zoom, compareMode} = useExploreSelector(s => s.map);
  const { mosaic, detail, map } = useExploreSelector(s => s);
  const { collection, query, queryToCompare, renderOption } = mosaic;
  const stacItemForMosaic = detail.showAsLayer ? detail.selectedItem : null;
  const { useHighDef } = map;

  useEffect(() => {
    if (!queryToCompare.hash || !mapReady) return
    const map = map2Ref.current;
    const mosaicLayer = map.layers.getLayerById(mosaicLayerName2);
    const isItemLayerValid = stacItemForMosaic && collection;
    const isMosaicLayerValid = query.hash;


    if ((isMosaicLayerValid || isItemLayerValid) && renderOption) {
      const tileLayerOpts  = {
        tileUrl: makeTileJsonUrl(
          queryToCompare,
          renderOption,
          collection,
          stacItemForMosaic,
          useHighDef
        ),
        visible: true,
      };
      if (mosaicLayer) {
        (mosaicLayer).setOptions(tileLayerOpts);
      } else {
        const layer = new atlas.layer.TileLayer(tileLayerOpts, mosaicLayerName);
        map.layers.add(layer, itemOutlineLayerName);
      }
    } else {
      if (mosaicLayer) {
        // Remove visibility of the mosaic layer, rather than remove it from the map. As a result,
        // the opacity settings will be retained
        (mosaicLayer).setOptions({ visible: false });
      }
    }
  },[queryToCompare.hash, mapReady])

  useEffect(()=> {
    if(!mapReady) return
    const map = map1Ref.current;
    const mosaicLayer = map.layers.getLayerById("stac-mosaic");
    const isItemLayerValid = stacItemForMosaic && collection;
    const isMosaicLayerValid = query.hash;

    if ((isMosaicLayerValid || isItemLayerValid) && renderOption) {
      const tileLayerOpts  = {
        tileUrl: makeTileJsonUrl(
          query,
          renderOption,
          collection,
          stacItemForMosaic,
          useHighDef
        ),
        visible: true,
      };

      if (mosaicLayer) {
        (mosaicLayer).setOptions(tileLayerOpts);
      } else {
        const layer = new atlas.layer.TileLayer(tileLayerOpts, mosaicLayerName);
        map.layers.add(layer, itemOutlineLayerName);
      }
    } else {
      if (mosaicLayer) {
        // Remove visibility of the mosaic layer, rather than remove it from the map. As a result,
        // the opacity settings will be retained
        (mosaicLayer).setOptions({ visible: false });
      }
    }
  }, [mapReady])

  useEffect(() => {
    if(!map1Ref.current) {
      const map1 = new atlas.Map(map1Id, {
        view: "Auto",
        center: center,
        zoom: zoom,
        language: "en-US",
        showFeedbackLink: false,
        showLogo: false,
        style: DEFAULT_MAP_STYLE,
        renderWorldCopies: true,
        authOptions: {
          authType: atlas.AuthenticationType.subscriptionKey,
          subscriptionKey: process.env.REACT_APP_AZMAPS_KEY,
        },
      });
      
      const map2 = new atlas.Map(map2Id, {
        view: "Auto",
        center: center,
        zoom: zoom,
        language: "en-US",
        showFeedbackLink: false,
        showLogo: false,
        style: DARK_MAP_STYLE,
        renderWorldCopies: true,
        authOptions: {
          authType: atlas.AuthenticationType.subscriptionKey,
          subscriptionKey: process.env.REACT_APP_AZMAPS_KEY,
        },
      });

      map1.events.add("ready", () => {setMapReady(true)});
      // map1Ref.events.add("moveend", mapHandlers.onMapMove);
      // map1Ref.events.add("styledata", mapHandlers.onStyleDataLoaded);
      // map1Ref.events.add("data", mapHandlers.onDataEvent);

      map1Ref.current = map1;
      map2Ref.current = map2;
      new SwipeMap(map1, map2);

    }
    
  },[])
  return <div  style={{ width: "100%", height: "100%"}} >
    <div id={map1Id} style={{ width: "100%", height: "100%"}} />
    <div id={map2Id} style={{ width: "100%", height: "100%", position: 'absolute', top: 0 }} />

  </div>
}

export default CompareMap