// local
// module.exports.HOST_AUTHENTICATION = 'http://localhost:8040';
// module.exports.HOST_AUTHORIZATION = 'http://localhost:8040';
// module.exports.HOST_FOUNDATION = 'http://localhost:8040';
// module.exports.HOST_SOLUTION = 'http://localhost:8050';
// module.exports.HOST_STORE = 'http://localhost:8060';
// module.exports.HOST_STUDIO_ENGINE = 'http://localhost:8070';
// module.exports.HOST_PROCESS_ENGINE = "http://localhost:8080/engine-rest";

// api
module.exports.HOST_AUTHENTICATION = window?._env_?.HOST_AUTHENTICATION || 'https://api.digitaldots.io';
module.exports.HOST_AUTHORIZATION = window?._env_?.HOST_AUTHORIZATION || 'https://api.digitaldots.io';
module.exports.HOST_FOUNDATION = window?._env_?.HOST_FOUNDATION || 'https://api.digitaldots.io';
module.exports.HOST_SOLUTION = window?._env_?.HOST_SOLUTION || 'http://solution-api.enterprise.digitaldots.ai';
module.exports.HOST_STORE = window?._env_?.HOST_STORE || 'http://store-api.enterprise.digitaldots.ai';
module.exports.HOST_STUDIO_ENGINE = window?._env_?.HOST_STUDIO_ENGINE || 'http://process-engine.enterprise.digitaldots.ai';
module.exports.HOST_PROCESS_ENGINE = window?._env_?.HOST_PROCESS_ENGINE || "http://camunda.digitaldots.io:8080/engine-rest";

module.exports.HOST_CODE_EDITOR = window?._env_?.HOST_CODE_EDITOR || "https://dd-theia.herokuapp.com";

//toggle to use window.fetch OR axios
module.exports.USE_AXIOS = true;
