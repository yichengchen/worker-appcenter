const htmlparser2 = require("htmlparser2");
export default {
	async fetch(request, env, ctx) {
		try {
			const { pathname } = new URL(request.url);

			if (pathname.startsWith("/api")) {
				const compoments = pathname.split("/");
				if (compoments.length != 4) {
					return new Response("no version founded", { status: 400 })
				}
				const uuid = compoments[2];
				const version = compoments[3];

				if (version.length == 0) {
					return new Response("version is empty", { status: 400 })
				}
				const url = "https://api.appcenter.ms/v0.1/public/sparkle/apps/" + uuid
				const res = await fetch(url)
				const text = await res.text()
				const doc = htmlparser2.parseDocument(text);
				const lists = doc.children[0].children[0].children[3].children
				if (version === "latest") {
					for(const item of lists) {
						if (item.attribs["sparkle:version"] != undefined) {
							return Response.redirect(item.attribs["url"], 301);
						}
					}
				}
				for(const item of lists) {
					if (item.attribs["sparkle:version"] == version) {
						return Response.redirect(item.attribs["url"], 301);
					}
				}
				return new Response("no founed", { status: 400 })
			}
			return new Response("usage : https://appcenter.clashx.workers.dev/api/{uuid}/{version number} \n for example: https://appcenter.clashx.workers.dev/api/1cd052f7-e118-4d13-87fb-35176f9702c1/latest", { status: 200 })
		} catch (e) {
			return new Response(e.stack, { status: 500 })
		}
	}
};
