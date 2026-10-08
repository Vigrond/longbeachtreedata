# longbeachtreedata

This is a "fixed" mirror of the map site https://longbeachtreedata.org/map

Which has become outdated and broken (mainly due to usage of the deprecated `assert` import method)

The tree data contains 93134 trees in Long Beach.  It is unknown how up to date the data is.  It is NOT the same data as `https://data.longbeach.gov/explore/assets/tree-inventory/view/` (which is only 1728 trees as of 10/08/2026), but rather was a local `.json` file served from `/treedata.trees.json` with no date information.  It may be safe to assume somewhere around 2024, when the `assert` import method was fully removed.

Inspired by a reddit post:  https://old.reddit.com/r/longbeach/comments/1x0erc0/anyone_know_who_made_this_site_i_want_to_help/

## Usage:

Go to https://vigrond.github.io/longbeachtreedata/treeMap/map.html

Select "All Trees" to load tree data onto the map (might take a few seconds)

## Local setup

Map is dependent on 3rd party `jawg.io` service.  Probably should get your own API key there first:  https://app.jawg.io/access-tokens

Then update `map.js` using the access token:

```
  L.tileLayer(
    "https://{s}.tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token={accessToken}",
    {
      attribution:
        '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      accessToken:
        "REPLACE_THIS_WITH_YOUR_NEW_ACCESS_TOKEN",
    }
  ).addTo(map);
```

For simple testing, use python simple http:

`python -m http.server 8888`

and then navigate to `localhost:8888` in your favorite browser