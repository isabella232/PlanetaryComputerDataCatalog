import { useEffect, useState, useRef } from "react";
import { useWindowSize } from "react-use";
import * as atlas from "azure-maps-control";

import { makeTileJsonUrl } from "utils";
import { useExploreSelector } from "pages/Explore/state/hooks";
import SwipeMap from '../components/Slider'
import { itemOutlineLayerName } from "pages/Explore/utils/layers";

import {sliderMapContainerId} from '../'

const SIDEBAR_DURATION = 350;
const DARK_MAP_STYLE = 'grayscale_dark'
const sliderMosaicLayerName = "stac-mosaic-slider";

const useSlider = (
  mapRef
) => {
  const {
    map,
    detail,
    mosaic
  } = useExploreSelector(s => s);

  const sliderMapRef = useRef(null);
  const sliderRef = useRef(null)
  const [sliderMapReady, setSliderMapReady] = useState(false)

  const { width, height } = useWindowSize()
  const { collection, query, queryToCompare, renderOption, compareMode } = mosaic;

  const stacItemForMosaic = detail.showAsLayer ? detail.selectedItem : null;
  const { useHighDef, center, zoom, showSidebar } = map;

  // resize map as window size changes
  useEffect(() => {
    setTimeout(() => {
      sliderMapRef.current?.resize();
    }, 100);
  }, [height, width, sliderMapRef]);

  // resize map as sidebar toggles
  useEffect(() => {
    if (!sliderMapRef.current) return;
    setTimeout(() => {
      sliderMapRef.current.resize();
    }, SIDEBAR_DURATION);
  }, [sliderMapRef, showSidebar]);

  useEffect(() => {
    if (!mapRef.current || !queryToCompare.hash || !sliderMapReady) return
    const map = sliderMapRef.current;
    const mosaicLayer = map.layers.getLayerById(sliderMosaicLayerName);
    const isItemLayerValid = stacItemForMosaic && collection;
    const isMosaicLayerValid = queryToCompare.hash;

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
        const layer = new atlas.layer.TileLayer(tileLayerOpts, sliderMosaicLayerName);
        map.layers.add(layer, itemOutlineLayerName);
      }
    } else {
      if (mosaicLayer) {
        // Remove visibility of the mosaic layer, rather than remove it from the map. As a result,
        // the opacity settings will be retained
        (mosaicLayer).setOptions({ visible: false });
      }
    }



  }, [mapRef, sliderMapReady, queryToCompare, collection, query, renderOption, stacItemForMosaic,useHighDef])
  useEffect(() => {
    const onReady = () => setSliderMapReady(true);

    // if compare mode is off, discard slider
    if (!compareMode) {
      if (sliderRef.current) {
        sliderRef.current.dispose()
        sliderRef.current = null
      }
      return;
    }
    // if slider map is not initiated yet, initiate it
    if (!sliderMapRef.current) {
      const map2 = new atlas.Map(sliderMapContainerId, {
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
      sliderMapRef.current = map2
      const swipe = new SwipeMap(mapRef.current, map2);
      sliderRef.current = swipe

      map2.events.add("ready", onReady);
    }

  }, [compareMode, center, zoom, mapRef])

};

export default useSlider;
