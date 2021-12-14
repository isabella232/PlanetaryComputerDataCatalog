import atlas from "azure-maps-control";
import bboxToPolygon from "@turf/bbox-polygon";
import { BBox } from "geojson";

import { IStacFilterCollection, IStacFilterGeom } from "types/stac";
const seasons = ['Spring', 'Summer', 'Fall', 'Winter']

export const collectionFilter = (
  collectionId: string | undefined
): IStacFilterCollection | null => {
  if (!collectionId) return null;

  return {
    eq: [{ property: "collection" }, collectionId],
  };
};

export const geomFilter = (
  bbox: atlas.data.BoundingBox | null
): IStacFilterGeom | null => {
  if (!bbox) return null;

  return {
    intersects: [
      {
        property: "geometry",
      },
      bboxToPolygon(bbox as BBox).geometry,
    ],
  };
};

export const getAlternativeNameForMosaic =  function (mosaic: any) {
  const seasonName = seasons.filter(e => mosaic.name.includes(e))
  // If there is no season name in mosaic name, just return the name
  if (seasonName.length === 0) return mosaic.name
  else {
    const cql = mosaic.cql
    const anyInteracts = 'anyinteracts'
    const dateTime = cql.map((element: any) => {
      if (Object.keys(element).includes(anyInteracts)) {
        return element[anyInteracts][1]
      } else return false
    }).filter((e:any) => e)
    const month = dateTime.map((dateElements: any) => {
      const eachMonth = dateElements.map((dateString:string) => {
        const yyyymmdd = dateString.split('-')
        const date = new Date(parseInt(yyyymmdd[0]), parseInt(yyyymmdd[1]), parseInt(yyyymmdd[2]));
        const monthName = date.toLocaleString('default', { month: 'short' });
        return monthName
      })
      return eachMonth.join(' - ')
    })
    return mosaic.name.replace(seasonName[0], month)
  }
}