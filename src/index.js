import data from "./data.json"

function superlist_step(input, request_host, path_prestart = "", tabbing = "") {
	let r = ""
	input.forEach(element => {
		let name = element[0].reduce((acc, v) => acc = `${tabbing}${acc}${request_host}${path_prestart}/${v}\n`, "")
		let data = element[1]
		r += `${name}${tabbing}--->\t${data.url}\n\t${tabbing}${data.note}\n\n`

		if (data.sub !== undefined) {
			r += superlist_step(data.sub, request_host, `/${element[0][0]}`, "")
		}
	})
	return r
}

export default {
	async fetch(request, env) {
		const requestURL = new URL(request.url)
		const path = requestURL.pathname
		const redirect_map = JSON.parse(data)

		if (path.startsWith("/superlist")) {
			return new Response(superlist_step(redirect_map, requestURL.host))
		}

		const tokens = path.split("/").slice(1)
		let founditem = undefined
		let searchin = redirect_map

		for (let i = 0; i < tokens.length; i++) {
			if (searchin == undefined) {
				continue
			}

			founditem = searchin.find((data) => data[0].includes(tokens[i]))
			
			if (founditem !== undefined && Object.hasOwn(founditem[1], "sub")) {
				searchin = founditem[1].sub
			}
		}

		if (founditem !== undefined) {
			return Response.redirect(founditem[1].url, 308)
		}

		return new Response("redirect does not exist", { status: 400, statusText: "bad request; redirect doesn't exist" })
	}
}