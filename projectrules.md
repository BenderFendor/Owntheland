# File Structure Layout 

In the markdown folder the folder should have the following structure

```
markdown/
├── header.md
├── main_page.md
├── Subpages/
│   ├── about_us.md
│   ├── lots_available.md
│   ├── states/
│   │   ├── pennsylvania/
│   │   │   ├── counties/
│   │   │   │   ├── lackawanna-county/
│   │   │   │   │   ├── lyman-ln-gouldsboro/
│   │   │   │   │   │   ├── images/
│   │   │   │   │   │   └── lyman-ln-gouldsboro.md
│   │   │   │   │   ├── hilldell-rd-moscow/
│   │   │   │   │   │   ├── images/
│   │   │   │   │   │   └── hilldell-rd-moscow.md
│   │   │   │   │   ├── 9605-e-independence-ave/
│   │   │   │   │   │   ├── images/
│   │   │   │   │   │   └── 9605-e-independence-ave.md
│   │   │   │   │   └── lackawanna-county.md
│   │   │   │   ├── luzerne-county/
│   │   │   │   │   ├── mink-springs-ct/
│   │   │   │   │   │   ├── images/
│   │   │   │   │   │   └── mink-springs-ct.md
│   │   │   │   │   ├── locust-st-hazleton-city/
│   │   │   │   │   │   ├── images/
│   │   │   │   │   │   └── locust-st-hazleton-city.md
│   │   │   │   │   └── luzerne-county.md
│   │   │   │   ├── pike-county/
│   │   │   │   │   ├── bartlett-drive-dingmans-ferry/
│   │   │   │   │   │   ├── images/
│   │   │   │   │   │   └── bartlett-drive-dingmans-ferry.md
│   │   │   │   │   ├── cowan-rd-milford/
│   │   │   │   │   │   ├── images/
│   │   │   │   │   │   └── cowan-rd-milford.md
│   │   │   │   │    └── pike-county.md
│   │   │   │   ├── wayne-county/
│   │   │   │   │   ├── brandywine-drive-honesdale/
│   │   │   │   │   │   ├── images/
│   │   │   │   │   │   └── brandywine-drive-honesdale.md
│   │   │   │   │   └── wayne-county.md
│   │   │   │   └── ...
│   │   │   └── pennsylvania.md
│   │   ├── missouri/
│   │   │   ├── counties/
│   │   │   │   ├── franklin-county/
│   │   │   │   │   ├── meadowview-dr-new-haven/
│   │   │   │   │   │   ├── images/
│   │   │   │   │   │   └── meadowview-dr-new-haven.md
│   │   │   │   │   ├── wheel-est-villa-ridge/
│   │   │   │   │   │   ├── images/
│   │   │   │   │   │   └── wheel-est-villa-ridge.md
│   │   │   │   │   ├── 344-wheel-est-villa-ridge/
│   │   │   │   │   │   ├── images/
│   │   │   │   │   │   └── 344-wheel-est-villa-ridge.md
│   │   │   │   │   ├── 1412-deer-run-dr-st-clair/
│   │   │   │   │   │   ├── images/
│   │   │   │   │   │   └── 1412-deer-run-dr-st-clair.md
│   │   │   │   │   ├── lakeview-drive-villa-ridge/
│   │   │   │   │   │   ├── images/
│   │   │   │   │   │   └── lakeview-drive-villa-ridge.md
│   │   │   │   │   ├── lavonna-dr-villa-ridge/
│   │   │   │   │   │   ├── images/
│   │   │   │   │   │   └── lavonna-dr-villa-ridge.md
│   │   │   │   │   └── franklin-county.md
│   │   │   │  ├── st-louis-county/
│   │   │   │   │   ├── 8001-gardner-lane/
│   │   │   │   │   │   ├── images/
│   │   │   │   │   │   └── 8001-gardner-lane.md
|   │   │   │   │    └── st-louis-county.md
│   │   │   │   └── ...
│   │   │   └── missouri.md
│   │   ├── mississippi/
│   │   │   ├── counties/
│   │   │   │   ├── madison-county/
│   │   │   │   │   ├── al-caldwell-rd-canton/
│   │   │   │   │   │   ├── images/
│   │   │   │   │   │   └── al-caldwell-rd-canton.md
│   │   │   │   │   ├── west-dinkins-st-canton/
│   │   │   │   │   │   ├── images/
│   │   │   │   │   │   └── west-dinkins-st-canton.md
|   │   │   │   │   └── madison-county.md
│   │   │   │   └── ...
│   │   │   └── mississippi.md
│   │   ├── tennessee/
│   │   │   ├── counties/
│   │   │   │   ├── shelby-county/
│   │   │   │   │   ├── 0-chandler-st-memphis/
│   │   │   │   │   │   ├── images/
│   │   │   │   │   │   └── 0-chandler-st-memphis.md
|   │   │   │   │    └── shelby-county.md
│   │   │   │   └── ...
│   │   │   └── tennessee.md
│   │   └── ...
│   ├── financing.md
│   └── contacts.md
```

# Custom Rules
To add a background add it to the section where you have the slug

```
---
slug: "/lots"
title: "My Page Title"
date: "2024-01-01"
background: "../images/lotbackground.png"
---
```

# Syntax 
**markdown extend**

To start a section you do this
[Section[PENNSYLVANIA]]

To end a section you do this

[End[[[PENNSYLVANIA]]]]

You need like [Section[X]] to start and [End[X]] to end and that is the only way for that to be parse as a section other then that like [God] isn't a section / like div thing