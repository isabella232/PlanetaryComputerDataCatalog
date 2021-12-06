import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { hashQueryKeyByOptions } from "react-query/types/core/utils";

import { IStacCollection } from "types/stac";
import { createMosaicQueryHashkey } from "utils/requests";
import { IMosaic, IMosaicRenderOption } from "../types";
import { resetMosaicQueryStringState } from "../utils";
import { DEFAULT_MIN_ZOOM } from "../utils/constants";
import { AppThunk, ExploreState } from "./store";

export interface MosaicState {
  collection: IStacCollection | null;
  query: IMosaic;
  queryToCompare: IMosaic;
  renderOption: IMosaicRenderOption | null;
  mosaicOption: Array<any>;
  layer: {
    minZoom: number;
    maxExtent: number[];
  };
  options: {
    showEdit: boolean;
    showResults: boolean;
  };
}

const initialMosaicState = {
  name: null,
  description: null,
  cql: null,
  mosaicOption: null,
  sortby: null,
  hash: null,
  renderOptions: null,
};

const initialState: MosaicState = {
  collection: null,
  query: initialMosaicState,
  queryToCompare: initialMosaicState,
  renderOption: null,
  mosaicOption: [],
  layer: {
    minZoom: DEFAULT_MIN_ZOOM,
    maxExtent: [],
  },
  options: {
    showResults: true,
    showEdit: false,
  },
};

export const setMosaicQuery = createAsyncThunk<string, IMosaic>(
  "cql-api/createQueryHashkey",
  async (queryInfo: IMosaic, { getState, dispatch }) => {
    dispatch(setQuery(queryInfo));

    const state = getState() as ExploreState;
    const collectionId = state.mosaic.collection?.id;
    const hashkey = await createMosaicQueryHashkey(queryInfo, collectionId);
    return hashkey;
  }
);

export const setMosaicToCompareQuery = createAsyncThunk<string, IMosaic>(
  "cql-api/createQueryToCompareHashkey",
  async (queryInfo: IMosaic, { getState, dispatch }) => {
    dispatch(setQueryToCompare(queryInfo));
    const state = getState() as ExploreState;
    const collectionId = state.mosaic.collection?.id;
    const hashkey = await createMosaicQueryHashkey(queryInfo, collectionId);
    return hashkey;
  }
);

export const resetMosaicState = (): AppThunk => dispatch => {
  resetMosaicQueryStringState();
  dispatch(resetMosiac());
};

export const mosaicSlice = createSlice({
  name: "mosaic",
  initialState,
  reducers: {
    setCollection: (state, action: PayloadAction<IStacCollection | null>) => {
      state.collection = action.payload;
      state.query = initialMosaicState;
      state.renderOption = null;
    },
    setQuery: (state, action: PayloadAction<IMosaic>) => {
      state.query = { ...action.payload, hash: null };
    },
    setQueryToCompare: (state, action: PayloadAction<IMosaic>) => {
      state.queryToCompare = { ...action.payload, hash: null };
    },
    setMosaicOption: (state, action: PayloadAction<any>) => {
      state.mosaicOption = action.payload
    }, 
    setRenderOption: (state, action: PayloadAction<IMosaicRenderOption>) => {
      state.renderOption = action.payload;
      if (!action.payload.minZoom) {
        state.renderOption.minZoom = DEFAULT_MIN_ZOOM;
      }
    },
    setShowResults: (state, action: PayloadAction<boolean>) => {
      state.options.showResults = action.payload;
    },
    setShowEdit: (state, action: PayloadAction<boolean>) => {
      state.options.showEdit = action.payload;
    },
    setLayerMinZoom: (state, action: PayloadAction<number>) => {
      state.layer.minZoom = action.payload;
    },
    resetMosiac: () => {
      return initialState;
    },
  },
  extraReducers: builder => {
    builder.addCase(
      setMosaicQuery.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.query.hash = action.payload;
      }
    ).addCase(
      setMosaicToCompareQuery.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.queryToCompare.hash = action.payload;
      }
    );
  },
});

export const {
  resetMosiac,
  setCollection,
  setQuery,
  setQueryToCompare,
  setMosaicOption,
  setRenderOption,
  setShowEdit,
  setShowResults,
  setLayerMinZoom,
} = mosaicSlice.actions;

export default mosaicSlice.reducer;
