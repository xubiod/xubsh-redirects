# xubsh-redirects

The redirector used by xub.sh.

## Route structure

The only hardcoded route is `superlist/` which generates a list of all the routes
the redirector uses in a semi-human readable list as plaintext.

Routes are in [the data.json](src/data.json) file in `src/`, and below is an entry
for xub.sh's root, which is the first entry in this repo:

```json
[["", "home", "net"], {
  "url": "https://xubiod.net/",
  "note": "Standard homepage",
  "sub": []
}]
```

Each entry is an array of two items:

1. An array of route names (`["", "home", "net"]`)
2. An object containing the URL, a note, and any subroutes (`sub` can be omitted)

Subroutes contain the *same entry structure*.

If a valid route can be found, and all subroutes have been accounted for, it will
respond with a `308 Permanent Redirect` towards the URL.

If no redirect is found, it will give a `400 Bad Request` and a plaintext response.

> [!IMPORTANT]  
> `superlist/` is checked for before processing any redirects. As such, if their
> is a route entry with `superlist` as its root/top level it will **never be
> checked**.

> [!CAUTION]
> `superlist/` generates the list of routes with **recursive calls**! While it
> realistically should not be an issue, if it becomes one you should really
> invest in making your own redirector.