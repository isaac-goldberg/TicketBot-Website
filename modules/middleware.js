const sessions = require('../modules/sessions')

module.exports.updateGuilds = async (req, res, next) => {
    try {
        const key = res.cookies.get('key');
        if (key) {
            const { guilds } = await sessions.get(key);
            res.locals.guilds = guilds;
        }
    } catch (e) {
        console.error(e);
    } finally {
        return next();
    }
};

module.exports.updateUser = async (req, res, next) => {
    try {
        const key = res.cookies.get('key');
        if (key) {
            const data = await sessions.get(key);
            if (data && data.authUser) {
                res.locals.user = data.authUser;
            } else {
                res.cookies.set("key", "");
            }
        }
    } catch(e) {
        console.error(e);
    } finally {
        return next();
    }
};

module.exports.validateGuild = async (req, res, next) => {
    res.locals.guild = res.locals.guilds.find(g => g.id === req.params.id);
    return (res.locals.guild)
        ? next()
        : res.render('errors/404');
};

module.exports.validateUser = async (req, res, next) => {
    return (res.locals.user)
        ? next()
        : res.render('errors/401');
};