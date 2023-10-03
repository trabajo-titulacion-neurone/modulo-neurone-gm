const { normalize } = require('normalize-diacritics');

module.exports = {
//Function to generate a code that serves as a unique identifier for gamification resources (actions, points, levels, etc.)
    async codeGenerator(appCode, name, type) {
        name = name.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
        const app = appCode.split("_");
        const element = name.split(' ').join('').slice(0, 12);
        const normalize_element = await normalize(element);
        return app[0] + '_' + type + '_' + normalize_element;
    }
};
