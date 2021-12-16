## How to add DEP data layer

Copy `/public/data/dep-data.json` and edit the attributes as needed. Put this edited json in the same directory but with the different name. Let's say we named json file as `another-data.json`, and this json has attributes as below.

```
{
  "id": "example-sentinel",
  "type": "Collection",
  "links": [],
  "title": "Example Sentinel",
  "assets": { },
  "extent": {
      "spatial": {
          "bbox": [
            ...
          ]
      },
      "temporal": {
          "interval": [
              [...
              ]
          ]
      }
  ...
}
```

Make a directory in `/public/stac/${id}` named as id in the json and make `mosaicinfo.json` in that directory. So in this case, the directory will be named as `/public/stac/example-sentinel`. Copy one of mosaicjson from another folder (`public/stac/sentinel-2-cloudless/mosaicinfo.json` is a good chocie since it is already edited to support DEP data) and paste it into the directory you just made. (so it will be `/public/stac/example-sentinel/mosaicinfo.json`) Edit `mosaicinfo.json` as needed. (Read the section below if you need more information about each attribute in `mosaicinfo.json`).

To see the new layer from Viewer, you need to add the code to fetch this new data. Edit [this part](https://github.com/developmentseed/PlanetaryComputerDataCatalog/blob/develop/src/utils/requests.js#L61-L66) of the code in `/src/utils/requests.js` like below.

```
  const depResp = await axios.get(`/data/dep-data.json`);
  const anotherDepResp = await axios.get(`/data/another-data.json`);
  const mergedData = {
    ...resp.data,
    collections: [...resp.data.collections, depResp.data, ...anotherDepResp.data]
  }
  return mergedData;
```
This should make the viewer to display your new data layer as one of collection options.

## How to add more dates for the layer

`/public/stac/sentinel-2-cloudless/mosaicinfo.json` is the [file](https://github.com/developmentseed/PlanetaryComputerDataCatalog/blob/develop/public/stac/sentinel-2-cloudless/mosaicInfo.json) that holds the information about Digital Earth Pacific's Sentinel 2 Cloudless data. If you want to add a different date for this dataset, copy one of already existing mosaic, edit the name(this name will show up in the dropdown), format(`cog` or `mosaicjson`), url (url where your cog, or mosaicjson is hosted) as needed and add as one of mosaics. Once this file edited and committed to `develop` branch, the change will show up to viewer automatically.