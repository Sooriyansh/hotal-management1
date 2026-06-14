const mongoose = require("mongoose");
const { MODULES } = require("../config/workflow");

const setupChangeStreams = (io) => {
  if (mongoose.connection.readyState !== 1) return [];

  return Object.entries(MODULES)
    .filter(([, config]) => config.model?.watch)
    .map(([moduleSlug, config]) => {
      try {
        const stream = config.model.watch([], { fullDocument: "updateLookup" });
        stream.on("change", (change) => {
          io.emit("workflow:database-change", {
            module: moduleSlug,
            operation: change.operationType,
            documentKey: change.documentKey,
            at: new Date().toISOString()
          });
        });
        stream.on("error", (error) => {
          console.warn(`Change stream disabled for ${moduleSlug}: ${error.message}`);
        });
        return stream;
      } catch (error) {
        console.warn(`Change stream unavailable for ${moduleSlug}: ${error.message}`);
        return null;
      }
    })
    .filter(Boolean);
};

module.exports = { setupChangeStreams };
