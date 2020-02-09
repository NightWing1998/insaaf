module.exports = {
	requestLogger: (req, res, next) => {
		console.log(`Host: ${req.headers["x-forwarded-host"] || req.hostname}\tRemote Address: ${req.headers["x-forwarded-for"] || req.connection.remoteAddress}\tMethod: ${req.method}\tPath: ${req.path}\tBody: ${JSON.stringify(req.body)}\tQuery-Params: ${JSON.stringify(req.query)}`);
		next();
	},
	MongooseErrorHandler : (error, request, response, next) => {
		// console.error("@@@", error);

		if (error.name === "CastError" && error.kind === "ObjectId") {
			return response.status(400).send({
				error: "malformatted id"
			});
		} else if (error.name === "ValidationError") {
			return response.status(400).json({
				error: error._message || error.message
			});
		} else if (error.name === "MongoError") {
			return response.status(500).json({
				error: error._message || error.message
			})
		} else if (error.name === "UnknownError") {
			return response.status(error.statusCode).json({
				error: error._message || error.message
			});
		}

		next(error);
	},
	unknownEndpoint : (request, response) => {
		response.status(404).json({
			error: `unknown endpoint ${request.path}`
		});
	}
}